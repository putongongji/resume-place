import { Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  streamedText: string;
}

const STEPS = [
  { key: 'overall_score', label: '解析候选人核心竞争力' },
  { key: 'jd_decode', label: '深度解码岗位核心诉求' },
  { key: 'dimensions', label: '多维人岗匹配度评估' },
  { key: 'fatal_flaws', label: '诊断潜在风险与优化空间' },
  { key: 'rewrites', label: '生成专属重构建议' },
];

export function AnalysisProgress({ streamedText }: Props) {
  // Determine current step index based on keys present in the JSON stream
  let currentIndex = 0;
  for (let i = STEPS.length - 1; i >= 0; i--) {
    if (streamedText.includes(`"${STEPS[i].key}"`)) {
      currentIndex = i;
      break;
    }
  }

  // If we haven't matched the first step but have *some* text, we are on step 0
  if (currentIndex === 0 && streamedText.length === 0) {
    currentIndex = -1; // Not started
  }

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#fafafa] border border-[#f0f0f0] rounded-lg">
      <h3 className="text-[13px] font-semibold mb-2">正在分析简历与岗位的匹配度...</h3>
      
      <div className="flex flex-col gap-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          let Icon = () => <div className="w-4 h-4 rounded-full border border-[#ddd]" />;
          let textClass = 'text-[#999]';

          if (isCompleted) {
            Icon = () => <CheckCircle2 size={16} className="text-[#22c55e]" />;
            textClass = 'text-[#333]';
          } else if (isActive) {
            Icon = () => <Loader2 size={16} className="text-[#000] animate-spin" />;
            textClass = 'text-[#000] font-medium';
          }

          return (
            <div key={step.key} className="flex items-center gap-3 transition-opacity duration-300" style={{ opacity: isPending ? 0.4 : 1 }}>
              <Icon />
              <span className={`text-[12px] ${textClass}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
