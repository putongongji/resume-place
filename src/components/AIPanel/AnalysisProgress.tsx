import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { key: 'overall_score', label: '解析候选人核心竞争力' },
  { key: 'jd_decode', label: '深度解码岗位核心诉求' },
  { key: 'dimensions', label: '多维人岗匹配度评估' },
  { key: 'fatal_flaws', label: '诊断潜在风险与优化空间' },
  { key: 'rewrites', label: '生成专属重构建议' },
];

export function AnalysisProgress() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allDone, setAllDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Advance through steps on a timer to show progress while waiting
  useEffect(() => {
    const initial = setTimeout(() => setCurrentIndex(0), 600);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (currentIndex < 0) return;
    if (currentIndex >= STEPS.length - 1) {
      // Mark the last step as done after a short delay, then show waiting state
      const finish = setTimeout(() => {
        setCurrentIndex(STEPS.length); // all steps visually completed
        setAllDone(true);
      }, 3000 + Math.random() * 2000);
      return () => clearTimeout(finish);
    }
    const delay = 3000 + Math.random() * 3000; // 3-6s per step
    const timer = setTimeout(() => setCurrentIndex(prev => prev + 1), delay);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Elapsed timer once all visual steps are done
  useEffect(() => {
    if (!allDone) return;
    const interval = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [allDone]);

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

      {/* Waiting state after all steps complete */}
      {allDone && (
        <div className="flex items-center gap-3 pt-2 border-t border-[#eee] mt-1">
          <Loader2 size={14} className="text-[#666] animate-spin" />
          <span className="text-[12px] text-[#666] animate-pulse">
            AI 正在整合分析结果，请稍候{elapsed > 0 ? `（已等待 ${elapsed}s）` : '...'}
          </span>
        </div>
      )}
    </div>
  );
}
