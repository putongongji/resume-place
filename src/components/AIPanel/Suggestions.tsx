import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import type { RewriteSuggestion } from '../../types/analysis';

interface Props {
  rewrites: RewriteSuggestion[];
}

export function Suggestions({ rewrites }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (rewrites.length === 0) return null;

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div>
      <h4 className="heading-2 mb-4">重构建议</h4>
      <div className="flex flex-col gap-4">
        {rewrites.map((r, i) => (
          <div key={i} className="border border-[#f0f0f0] rounded-lg p-4 relative group">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold">{r.section}</span>
              <button
                className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopy(r.rewrite, i)}
                title="复制重写内容"
              >
                {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Problem */}
            <div className="mb-3">
              <span className="text-[11px] font-medium text-[#ef4444] uppercase tracking-wider">问题</span>
              <p className="text-[12px] text-[#888] leading-relaxed mt-1">{r.problem}</p>
            </div>

            {/* Kill list */}
            {r.kill_list && r.kill_list.length > 0 && (
              <div className="mb-3">
                <span className="text-[11px] font-medium text-[#999] uppercase tracking-wider flex items-center gap-1">
                  <Trash2 size={10} /> 应删除
                </span>
                <div className="flex flex-col gap-1 mt-1.5">
                  {r.kill_list.map((item, j) => (
                    <p key={j} className="text-[12px] text-[#999] line-through leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Rewrite */}
            <div>
              <span className="text-[11px] font-medium text-[#22c55e] uppercase tracking-wider">重写</span>
              <div className="mt-1.5 p-3 bg-[#fafafa] rounded-md">
                <p className="text-[12px] text-[#333] leading-relaxed whitespace-pre-wrap">
                  {r.rewrite}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
