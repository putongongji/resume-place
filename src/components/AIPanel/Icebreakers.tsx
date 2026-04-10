import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { IcebreakerMessage } from '../../types/analysis';

interface Props {
  icebreakers: IcebreakerMessage[];
}

export function Icebreakers({ icebreakers }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (icebreakers.length === 0) return null;

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div>
      <h4 className="heading-2 mb-3">破冰话术</h4>
      <div className="flex flex-col gap-3">
        {icebreakers.map((ib, i) => (
          <div
            key={i}
            className="text-[13px] border border-[#f0f0f0] rounded-lg p-4 relative group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-[#999] uppercase tracking-wider">
                {ib.channel}
              </span>
              <button
                className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopy(ib.message, i)}
                title="复制"
              >
                {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[#333] leading-relaxed whitespace-pre-wrap">{ib.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
