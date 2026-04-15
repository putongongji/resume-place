import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AnalysisResult, AnalysisStatus, AnalysisHistory } from '../types/analysis';
import type { ResumeData } from '../types/resume';

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-analysis-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load analysis history', e);
    }
  }, []);

  const deleteHistory = useCallback((id: string) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem('ai-analysis-history', JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  const fetchJD = async (url: string, signal: AbortSignal): Promise<string> => {
    const res = await fetch('/api/fetch-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('获取岗位信息失败');
    }
    if (!res.ok || data.error) {
      throw new Error(data.error || '获取岗位信息失败');
    }
    return data.text;
  };

  const analyze = useCallback(async (
    resumeData: ResumeData,
    jdInput: string,
    isUrl: boolean,
    extra?: { customResumeText?: string; turnstileToken?: string; adminSecret?: string }
  ) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResult(null);
    setError(null);

    try {
      // Step 1: Resolve JD text
      let jdText = jdInput;
      if (isUrl) {
        setStatus('fetching-jd');
        jdText = await fetchJD(jdInput, controller.signal);
      }

      // Step 2: Call analysis API (non-streaming — waits for full response)
      setStatus('analyzing');
      const bodyPayload = extra?.customResumeText
        ? { customResumeText: extra.customResumeText, jobDescription: jdText }
        : { resume: resumeData, jobDescription: jdText };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (extra?.turnstileToken) headers['X-Turnstile-Token'] = extra.turnstileToken;
      if (extra?.adminSecret) headers['Authorization'] = `Bearer ${extra.adminSecret}`;

      // Client-side timeout (150s) as safety net beyond the backend's 120s timeout
      const timeoutId = setTimeout(() => controller.abort(), 150_000);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`分析请求失败 (${res.status})`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || `分析请求失败 (${res.status})`);
      }

      const parsed = data.result as AnalysisResult;
      setResult(parsed);
      setStatus('complete');

      // Save to history
      const newHistoryItem: AnalysisHistory = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        isUrl,
        jdInput,
        resumeSource: extra?.customResumeText ? 'pdf' : 'builder',
        result: parsed,
      };

      setHistory(prev => {
        const next = [newHistoryItem, ...prev].slice(0, 30);
        localStorage.setItem('ai-analysis-history', JSON.stringify(next));
        return next;
      });

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        // Only silence if this was a user-initiated cancel (not a timeout)
        if (status === 'idle') return; // already reset by user
        setError('AI 分析超时，请稍后再试');
        setStatus('error');
        return;
      }
      const message = err instanceof Error ? err.message : '分析过程中出错';
      setError(message);
      setStatus('error');
    }
  }, []);

  return {
    status, result, error,
    analyze, reset, setResult, setStatus,
    history, deleteHistory
  };
}
