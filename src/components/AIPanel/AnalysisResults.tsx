import { ScoreRing } from './ScoreRing';
import type { AnalysisResult } from '../../types/analysis';

interface Props {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getRatingStyle = (rating: string) => {
    if (rating.includes('完全匹配')) return { color: '#22c55e', bg: '#f0fdf4' };
    if (rating.includes('基本匹配')) return { color: '#84cc16', bg: '#f7fee7' };
    if (rating.includes('勉强')) return { color: '#f59e0b', bg: '#fffbeb' };
    return { color: '#ef4444', bg: '#fef2f2' };
  };

  const getProbabilityStyle = (p: string) => {
    if (p.includes('面试') || p.includes('通过')) return { color: '#22c55e', bg: '#f0fdf4' };
    if (p.includes('补充亮点') || p.includes('五五')) return { color: '#f59e0b', bg: '#fffbeb' };
    return { color: '#ef4444', bg: '#fef2f2' };
  };

  const probStyle = getProbabilityStyle(result.pass_probability);

  return (
    <div className="flex flex-col gap-8">
      {/* ── 宏观评估 ── */}
      <div className="flex flex-col items-center gap-4 py-4">
        <ScoreRing score={result.overall_score} />
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ color: probStyle.color, background: probStyle.bg }}
        >
          {result.pass_probability}
        </span>
        <p className="text-[13px] text-[#555] text-justify leading-relaxed max-w-[380px]">
          {result.overall_verdict}
        </p>
      </div>

      {/* ── JD 解码 ── */}
      <div>
        <h4 className="heading-2 mb-4">JD 解码</h4>
        <div className="flex flex-col gap-3 text-[13px]">
          <div className="flex gap-2">
            <span className="text-[#999] shrink-0 w-16">岗位本质</span>
            <span className="font-medium">{result.jd_decode.role_type}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#999] shrink-0 w-16">核心问题</span>
            <span>{result.jd_decode.core_problem}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#999] shrink-0 w-16">成本信号</span>
            <span>{result.jd_decode.budget_signal}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#999] shrink-0 w-16">隐性需求</span>
            <span>{result.jd_decode.hidden_needs}</span>
          </div>

          {/* Tags — compact layout */}
          <div className="mt-2 flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <span className="text-[11px] text-[#999] font-medium shrink-0 mt-0.5 w-16">关键词</span>
              <div className="flex flex-wrap gap-1.5">
                {result.jd_decode.keywords.map((k, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#f5f5f5] text-[#555] font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[11px] text-[#999] font-medium shrink-0 mt-0.5 w-16">硬门槛</span>
              <div className="flex flex-wrap gap-1.5">
                {result.jd_decode.hard_requirements.map((h, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#000] text-white font-medium">
                    {h}
                  </span>
                ))}
              </div>
            </div>
            {result.jd_decode.bonus_items.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-[11px] text-[#999] font-medium shrink-0 mt-0.5 w-16">加分项</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.jd_decode.bonus_items.map((b, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded border border-[#e0e0e0] text-[#666]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 多维匹配 ── */}
      <div>
        <h4 className="heading-2 mb-4">多维匹配</h4>

        {/* 优势与匹配 */}
        {result.dimensions.filter(d => d.score >= 70).length > 0 && (
          <div className="mb-6">
            <h5 className="text-[12px] font-semibold text-[#666] mb-3 flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-3 before:bg-[#22c55e] before:rounded-full">
              优势与匹配
            </h5>
            <div className="flex flex-col gap-3">
              {result.dimensions.filter(d => d.score >= 70).map((d, i) => {
                const ratingStyle = getRatingStyle(d.rating || '');
                return (
                  <div key={`good-${i}`} className="border border-[#f0f0f0] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">{d.dimension}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ color: ratingStyle.color, background: ratingStyle.bg }}
                        >
                          {d.rating}
                        </span>
                      </div>
                      <span
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ color: getScoreColor(d.score) }}
                      >
                        {d.score}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${d.score}%`,
                          background: getScoreColor(d.score),
                        }}
                      />
                    </div>
                    <p className="text-[12px] font-medium text-[#333] mb-0.5">{d.verdict}</p>
                    <p className="text-[12px] text-[#888] leading-relaxed">{d.details}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 需补足与缺失 */}
        {result.dimensions.filter(d => d.score < 70).length > 0 && (
          <div>
            <h5 className="text-[12px] font-semibold text-[#666] mb-3 flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-3 before:bg-[#f59e0b] before:rounded-full">
              需补足与缺失
            </h5>
            <div className="flex flex-col gap-3">
              {result.dimensions.filter(d => d.score < 70).map((d, i) => {
                const ratingStyle = getRatingStyle(d.rating || '');
                return (
                  <div key={`bad-${i}`} className="border border-[#f0f0f0] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">{d.dimension}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ color: ratingStyle.color, background: ratingStyle.bg }}
                        >
                          {d.rating}
                        </span>
                      </div>
                      <span
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ color: getScoreColor(d.score) }}
                      >
                        {d.score}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${d.score}%`,
                          background: getScoreColor(d.score),
                        }}
                      />
                    </div>
                    <p className="text-[12px] font-medium text-[#333] mb-0.5">{d.verdict}</p>
                    <p className="text-[12px] text-[#888] leading-relaxed">{d.details}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 致命伤诊断 ── */}
      <div>
        <h4 className="heading-2 mb-4">致命伤诊断</h4>

        {/* 3-second pass */}
        <div className="mb-4 p-4 bg-[#fafafa] rounded-lg border border-[#f0f0f0]">
          <p className="text-[11px] font-semibold text-[#ef4444] uppercase tracking-wider mb-1.5">
            ⚡ 3 秒 PASS 风险
          </p>
          <p className="text-[13px] text-[#333] leading-relaxed">
            {result.three_second_pass_reason}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {result.fatal_flaws.map((f, i) => (
            <div key={i} className="border border-[#f0f0f0] rounded-lg p-4">
              <span className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">
                {f.perspective}
              </span>
              <p className="text-[13px] font-medium text-[#000] mt-1.5 mb-1">{f.flaw}</p>
              <p className="text-[12px] text-[#888] leading-relaxed">{f.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
