import { Calendar, Trash2, ArrowRight } from 'lucide-react';
import type { AnalysisHistory } from '../../types/analysis';

interface Props {
  history: AnalysisHistory[];
  onSelect: (item: AnalysisHistory) => void;
  onDelete: (id: string) => void;
}

export function HistoryList({ history, onSelect, onDelete }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#999]">
        <p className="text-[13px]">暂无分析记录</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((item) => {
        const date = new Date(item.timestamp);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        const score = item.result.overall_score;

        let scoreColor = '#ef4444';
        if (score >= 90) scoreColor = '#22c55e';
        else if (score >= 70) scoreColor = '#84cc16';
        else if (score >= 40) scoreColor = '#f59e0b';

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white border border-[#f0f0f0] rounded-lg hover:border-[#ddd] transition-colors cursor-pointer group"
            onClick={() => onSelect(item)}
          >
            <div className="flex flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#f5f5f5] text-[#666] shrink-0">
                  {item.resumeSource === 'pdf' ? 'PDF简历' : '在线构建'}
                </span>
                <span className="text-[13px] font-medium text-[#333] truncate">
                  {item.jdInput || '未知岗位'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#999]">
                <Calendar size={12} />
                <span>{dateStr}</span>
                <span>•</span>
                <span>匹配度 
                  <span className="font-semibold ml-1" style={{ color: scoreColor }}>
                    {score}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="btn-icon p-1.5 hover:bg-[#ffebee] hover:text-[#ef4444]"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                title="删除记录"
              >
                <Trash2 size={14} />
              </button>
              <button className="btn-icon p-1.5">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
