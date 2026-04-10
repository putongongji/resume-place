// ── Step 1: JD 解码 ──
export interface JDDecode {
  role_type: string;       // 执行者 / 管理者 / 复合型
  core_problem: string;    // 招这个人要解决什么问题
  budget_signal: string;   // 薪资区间 / 成本信号
  hidden_needs: string;    // 隐性需求（JD 没写但暗示的）
  keywords: string[];      // JD 关键词提取
  hard_requirements: string[];  // 硬性门槛
  bonus_items: string[];   // 加分项
}

// ── Step 2: 多维匹配 ──
export interface DimensionMatch {
  dimension: string;       // 维度名称
  score: number;           // 0-100
  rating: string;          // 完全匹配 | 基本匹配 | 勉强沾边 | 完全不匹配
  verdict: string;         // 一句话判定
  details: string;         // 详细说明
}

// ── Step 3: 毒舌评价 ──
export interface FatalFlaw {
  perspective: string;     // "HR 视角" | "业务负责人视角"
  flaw: string;            // 致命伤描述
  reasoning: string;       // 为什么是致命伤
}

// ── Step 4: 重构建议 ──
export interface RewriteSuggestion {
  section: string;         // 简历中的模块
  problem: string;         // 当前问题
  rewrite: string;         // 重构后的内容（可直接使用）
  kill_list: string[];     // 应删除的无效信息 / 减分项
}

// ── Step 5: 破冰话术 ──
export interface IcebreakerMessage {
  channel: string;
  message: string;
}

// ── 主结果 ──
export interface AnalysisResult {
  // 宏观评估
  overall_score: number;
  overall_verdict: string;     // 2-3 句总体判定
  pass_probability: string;    // "大概率通过" / "五五开" / "大概率被 pass"

  // JD 解码
  jd_decode: JDDecode;

  // 多维匹配
  dimensions: DimensionMatch[];

  // 毒舌评价
  fatal_flaws: FatalFlaw[];
  three_second_pass_reason: string;  // HR 3 秒 pass 的原因

  // 重构建议
  rewrites: RewriteSuggestion[];

  // 破冰话术
  icebreakers: IcebreakerMessage[];
}

export type AnalysisStatus = 'idle' | 'fetching-jd' | 'analyzing' | 'complete' | 'error';

export interface AnalysisHistory {
  id: string;
  timestamp: string;
  isUrl: boolean;
  jdInput: string;
  resumeSource: 'builder' | 'pdf';
  result: AnalysisResult;
}
