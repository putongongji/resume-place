import { useState } from 'react';
import { X, RotateCcw, AlertCircle } from 'lucide-react';
import { JDInput } from './JDInput';
import { AnalysisResults } from './AnalysisResults';
import { Suggestions } from './Suggestions';
import { Icebreakers } from './Icebreakers';
import { AnalysisProgress } from './AnalysisProgress';
import { HistoryList } from './HistoryList';
import type { AnalysisResult, AnalysisStatus, AnalysisHistory } from '../../types/analysis';

interface Props {
  open: boolean;
  onClose: () => void;
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
  history: AnalysisHistory[];
  onAnalyze: (input: string, isUrl: boolean, extra?: { customResumeText?: string; turnstileToken?: string; adminSecret?: string }) => void;
  onReset: () => void;
  onLoadHistoryItem: (item: AnalysisHistory) => void;
  onDeleteHistoryItem: (id: string) => void;
}

const TABS = [
  { key: 'overview', label: '诊断' },
  { key: 'rewrite', label: '重构' },
  { key: 'icebreaker', label: '话术' },
] as const;

type TabKey = typeof TABS[number]['key'];

export function AIPanel({
  open,
  onClose,
  status,
  result,
  error,
  history,
  onAnalyze,
  onReset,
  onLoadHistoryItem,
  onDeleteHistoryItem,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey | 'history'>('overview');

  const showInput = status === 'idle' || status === 'fetching-jd' || status === 'analyzing';
  const showResults = status === 'complete' && result;
  const showStreaming = status === 'analyzing' && !result;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="ai-panel-overlay print-hide"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`ai-panel print-hide ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight">AI 诊断</h2>
            <div className="flex items-center gap-1">
              {(showResults || error) && (
                <button
                  className="btn-icon"
                  onClick={() => { onReset(); setActiveTab('overview'); }}
                  title="重新分析"
                >
                  <RotateCcw size={15} />
                </button>
              )}
              {history.length > 0 && !showResults && (
                <button
                  className="btn text-[12px] text-[#000] px-3 py-1.5 rounded-md hover:bg-[#f5f5f5] bg-white transition-colors border border-[#ddd]"
                  onClick={() => setActiveTab('history')}
                >
                  历史记录
                </button>
              )}
              <button className="btn-icon" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs — only show when results are ready */}
          {showResults && activeTab !== 'history' && (
            <div className="flex px-6 gap-0 border-b border-[#f0f0f0]">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className="ai-tab"
                  data-active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-6">
          {activeTab === 'history' ? (
            <HistoryList
              history={history}
              onSelect={(item) => {
                onLoadHistoryItem(item);
                setActiveTab('overview');
              }}
              onDelete={onDeleteHistoryItem}
            />
          ) : (
            <>
              {/* Input / Loading */}
              {showInput && (
                <JDInput status={status} onAnalyze={onAnalyze} />
              )}

          {/* Streaming preview */}
          {showStreaming && (
            <AnalysisProgress />
          )}

          {/* Error */}
          {status === 'error' && error && (
            <div className="flex gap-3 items-start text-[13px] p-4 bg-[#fafafa] rounded-lg">
              <AlertCircle size={16} className="text-[#999] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">分析失败</p>
                <p className="text-[#888]">{error}</p>
              </div>
            </div>
          )}

          {/* Results — Tab content */}
          {showResults && (
            <>
              {activeTab === 'overview' && <AnalysisResults result={result} />}
              {activeTab === 'rewrite' && <Suggestions rewrites={result.rewrites} />}
              {activeTab === 'icebreaker' && <Icebreakers icebreakers={result.icebreakers} />}
              <div className="h-8" />
            </>
          )}
          </>)}
        </div>
      </div>
    </>
  );
}
