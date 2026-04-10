import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AnalysisResult, AnalysisStatus, AnalysisHistory } from '../types/analysis';
import type { ResumeData } from '../types/resume';

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState('');
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
    setStreamedText('');
  }, []);

  const fetchJD = async (url: string, signal: AbortSignal): Promise<string> => {
    const res = await fetch('/api/fetch-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || '获取岗位信息失败');
    }
    return data.text;
  };

  const analyze = useCallback(async (
    resumeData: ResumeData,
    jdInput: string,
    isUrl: boolean,
    customResumeText?: string
  ) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResult(null);
    setError(null);
    setStreamedText('');

    try {
      // Step 1: Resolve JD text
      let jdText = jdInput;
      if (isUrl) {
        setStatus('fetching-jd');
        jdText = await fetchJD(jdInput, controller.signal);
      }

      // Step 2: Stream analysis
      setStatus('analyzing');
      const bodyPayload = customResumeText 
        ? { customResumeText, jobDescription: jdText }
        : { resume: resumeData, jobDescription: jdText };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `分析请求失败 (${res.status})`);
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6);
            if (payload === '[DONE]') continue;

            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamedText(accumulated);
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }

      // Parse final JSON
      // The LLM might wrap JSON in markdown code fences
      let jsonStr = accumulated.trim();
      // Strip markdown code fences
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      }
      // If still not valid JSON, try extracting from first { to last }
      if (!jsonStr.startsWith('{')) {
        const startIdx = jsonStr.indexOf('{');
        const endIdx = jsonStr.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          jsonStr = jsonStr.slice(startIdx, endIdx + 1);
        }
      }

      const parsed = JSON.parse(jsonStr) as AnalysisResult;
      setResult(parsed);
      setStatus('complete');

      // Save to history
      const newHistoryItem: AnalysisHistory = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        isUrl,
        jdInput,
        resumeSource: customResumeText ? 'pdf' : 'builder',
        result: parsed,
      };
      
      setHistory(prev => {
        const next = [newHistoryItem, ...prev].slice(0, 30); // Keep last 30 items
        localStorage.setItem('ai-analysis-history', JSON.stringify(next));
        return next;
      });

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const message = err instanceof Error ? err.message : '分析过程中出错';
      setError(message);
      setStatus('error');
    }
  }, []);

  return { 
    status, result, error, streamedText, 
    analyze, reset, setResult, setStatus,
    history, deleteHistory 
  };
}
