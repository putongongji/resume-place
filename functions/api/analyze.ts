import { Redis } from '@upstash/redis/cloudflare';

interface PersonalInfo {
  name: string;
  gender: string;
  age: string;
  experience: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

interface SectionItem {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
}

interface Section {
  type: string;
  title: string;
  items: SectionItem[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
}

export interface Env {
  MINIMAX_API_KEY: string;
  MINIMAX_MODEL?: string;
  ADMIN_SECRET?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
}

async function verifyTurnstile(token: string, secretKey: string, ip: string) {
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  formData.append('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });
  const outcome = await res.json() as any;
  return outcome.success;
}

async function checkRateLimit(redis: Redis, ip: string): Promise<string | null> {
  const dateStr = new Date().toISOString().split('T')[0];
  const hourStr = new Date().toISOString().slice(0, 13);

  const dayKey = `ratelimit:${ip}:${dateStr}`;
  const hourKey = `ratelimit:${ip}:${hourStr}`;

  const [dayCount, hourCount] = await Promise.all([
     redis.incr(dayKey),
     redis.incr(hourKey)
  ]);

  if (dayCount === 1) await redis.expire(dayKey, 86400);
  if (hourCount === 1) await redis.expire(hourKey, 3600);

  if (dayCount > 30) return '今天的使用次数已达上限 (30次)';
  if (hourCount > 2) return '这小时使用太频繁了，稍微休息一下 (上限2次/小时)';

  return null;
}

function serializeResume(data: ResumeData): string {
  const { personalInfo, sections } = data;
  let text = `【个人信息】\n`;
  text += `姓名：${personalInfo.name}\n`;
  if (personalInfo.title) text += `期望职位：${personalInfo.title}\n`;
  if (personalInfo.gender) text += `性别：${personalInfo.gender}\n`;
  if (personalInfo.age) text += `年龄：${personalInfo.age}\n`;
  if (personalInfo.experience) text += `工作经验：${personalInfo.experience}\n`;
  if (personalInfo.location) text += `所在城市：${personalInfo.location}\n`;
  if (personalInfo.email) text += `邮箱：${personalInfo.email}\n`;
  if (personalInfo.phone) text += `电话：${personalInfo.phone}\n`;
  if (personalInfo.website) text += `个人主页：${personalInfo.website}\n`;

  for (const section of sections) {
    text += `\n【${section.title}】\n`;
    for (const item of section.items) {
      if (item.title) text += `${item.title}`;
      if (item.subtitle) text += ` | ${item.subtitle}`;
      if (item.date) text += ` (${item.date})`;
      if (item.location) text += ` - ${item.location}`;
      text += '\n';
      if (item.description) text += `${item.description}\n`;
    }
  }

  return text;
}

const SYSTEM_PROMPT = `你是一位在猎头行业工作 15 年的资深职业顾问。你看过上万份简历，深谙 HR 筛选逻辑和业务负责人的用人心理。你的分析风格：专业、犀利、直击要害。不提供情绪价值，只提供极高密度的实用策略。全文使用第二人称。

## 你的分析流程

**第一步：解码 JD 真实诉求**
- 判断岗位本质：要的是执行者、管理者还是复合型人才？
- 提炼核心问题：招这个人是为了解决什么业务痛点？
- 提取最核心的关键词（最多 5 个，只保留最重要的能力关键词）
- 提取硬性门槛（学历、年限等不可商量的条件）
- 提取加分项
- 挖掘隐性需求（JD 没有明说但暗示的东西）
- 解读薪资/成本信号

**第二步：评估简历真实含金量**
- 提取简历中的关键词和核心竞争力
- 剥离工作经历和项目经验中的水分：有真正的决策、动作和结果的，是高价值内容；模糊、粗略、没有数据支撑的，是低价值内容
- 识别无效信息和减分项

**第三步：多维度对齐**
针对以下维度逐一评估匹配程度（0-100），每个维度必须带有匹配等级判定：
- 90-100：完全匹配 ✓
- 70-89：基本匹配 △
- 40-69：勉强沾边 ✗
- 0-39：完全不匹配 ✗✗

5 个维度：
1. 基本要求（学历、工作年限、专业、工作地点）
2. 关键词匹配（JD 核心能力关键词 vs 简历关键词的重合度）
3. 岗位职责映射（JD 的痛点 A 是否能被简历里的经历 B 解决？）
4. 硬门槛匹配（硬性要求的满足情况）
5. 加分项匹配（加分项的命中率）

**第四步：毒舌评价**
- 指出 HR 在 3 秒内可能 pass 这份简历的原因
- 致命伤 1（HR 视角）：简历里最欠缺的显性指标
- 致命伤 2（业务负责人视角）：看完这份简历会有什么担忧？能不能解决我的问题？

**第五步：重构建议**
核心原则：绝对不能照搬 JD 关键词堆砌到简历里，HR 一眼就能看出是针对岗位写的，反而减分。
正确做法：
- 挖掘候选人现有经历中与目标岗位相关的潜在价值，用不同的表达方式呈现
- 将技术语言转化为业务成果语言
- 强调可迁移的能力和思维方式，而非照搬职位词汇
- 让重写后的内容读起来像是候选人自然的职业经历描述，而不是为某个岗位量身定做的

**第六步：破冰话术**
只生成招聘平台（BOSS直聘、拉勾、脉脉）的打招呼话术。
核心要求：
- 前 30 个字是生死线，必须直接亮出你最匹配的核心价值，让对方有点开对话框的冲动
- 整体 60 字以内，不要废话
- 不要自我介绍（"您好，我是XXX"是废话），直接说价值
- 不要谄媚（"贵司"、"非常荣幸"都是减分项）

你必须严格返回以下 JSON 格式（不要包含 JSON 之外的任何内容）：

{
  "overall_score": <number 0-100>,
  "overall_verdict": "<2-3句话的总结，点出最核心的优劣势>",
  "pass_probability": "<大概率面试 | 需补充亮点 | 亟需大幅优化>",
  "jd_decode": {
    "role_type": "<执行者 / 管理者 / 复合型>",
    "core_problem": "<一句话说清楚招这个人要解决什么问题>",
    "budget_signal": "<薪资/成本信号解读>",
    "hidden_needs": "<隐性需求>",
    "keywords": ["最多5个核心关键词"],
    "hard_requirements": ["硬性要求1", "硬性要求2"],
    "bonus_items": ["加分项1", "加分项2"]
  },
  "dimensions": [
    {
      "dimension": "<维度名称>",
      "score": <0-100>,
      "rating": "<完全匹配 | 基本匹配 | 勉强沾边 | 完全不匹配>",
      "verdict": "<一句话判定，指出匹配或缺失的核心点>",
      "details": "<详细说明>"
    }
  ],
  "fatal_flaws": [
    {
      "perspective": "HR 视角",
      "flaw": "<致命伤>",
      "reasoning": "<为什么是致命伤>"
    },
    {
      "perspective": "业务负责人视角",
      "flaw": "<致命伤>",
      "reasoning": "<为什么是致命伤>"
    }
  ],
  "three_second_pass_reason": "<HR 3 秒 pass 的原因，一句话>",
  "rewrites": [
    {
      "section": "<简历模块>",
      "problem": "<当前问题>",
      "rewrite": "<重写后的完整内容，不能照搬JD关键词，要自然>",
      "kill_list": ["该删的内容1", "该删的内容2"]
    }
  ],
  "icebreakers": [
    { "channel": "<BOSS直聘 | 拉勾 | 脉脉>", "message": "<60字以内，前30字必须亮价值>" }
  ]
}

要求：
- keywords 最多 5 个，只保留最核心的能力关键词
- dimensions 必须包含 5 个维度，每个维度必须有 rating 字段
- fatal_flaws 必须包含 2 条：HR 视角和业务负责人视角各一条
- rewrites 给出 2-3 个模块的重写建议，严禁照搬 JD 关键词，要用候选人自己的经历重新表达
- icebreakers 只给 2-3 条招聘平台话术，60 字以内，前 30 字直接亮核心价值
- 所有内容使用中文
- 语气犀利直接，不说废话`;

/** Extract valid JSON from model output that may contain <think> blocks and markdown fences. */
function extractJSON(raw: string): string {
  let str = raw.trim();

  // Strategy 1: if there's a </think>, take everything after the LAST one
  const lastThinkEnd = str.lastIndexOf('</think>');
  if (lastThinkEnd !== -1) {
    const afterThink = str.slice(lastThinkEnd + '</think>'.length).trim();
    if (afterThink) {
      str = afterThink;
    } else {
      // JSON might be inside the think block — strip all tags
      str = str.replace(/<\/?think>/g, '').trim();
    }
  } else {
    // No </think> — strip any stray <think> opening
    str = str.replace(/<think>/g, '').trim();
  }

  // Strategy 2: strip markdown code fences
  const fenceMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    str = fenceMatch[1].trim();
  }

  // Strategy 3: extract from first { to last }
  if (!str.startsWith('{')) {
    const startIdx = str.indexOf('{');
    const endIdx = str.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      str = str.slice(startIdx, endIdx + 1);
    }
  }

  return str;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const apiKey = env.MINIMAX_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return Response.json({ error: '未配置 MINIMAX_API_KEY' }, { status: 500 });
  }

  const adminSecretHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const isAdmin = env.ADMIN_SECRET && adminSecretHeader === env.ADMIN_SECRET;
  const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

  if (!isAdmin) {
    const turnstileToken = request.headers.get('X-Turnstile-Token');
    if (!turnstileToken) return Response.json({ error: '请先完成人机验证' }, { status: 403 });
    if (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY !== '1x00000000000000000000AA') {
      const isHuman = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
      if (!isHuman) return Response.json({ error: '人机验证失败' }, { status: 403 });
    }
  }

  if (!isAdmin && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    const limitError = await checkRateLimit(redis, ip);
    if (limitError) return Response.json({ error: limitError }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return Response.json({ error: '无效的 JSON 请求体' }, { status: 400 });
  }

  const { resume, jobDescription, customResumeText } = body as any;
  let jd = jobDescription || '';
  if (jd.length > 3000) jd = jd.slice(0, 3000);

  if (!jd || (!resume && !customResumeText)) {
    return Response.json({ error: '请提供简历数据和岗位描述' }, { status: 400 });
  }

  const finalResumeContent = customResumeText || serializeResume(resume);
  const truncatedResume = finalResumeContent.slice(0, 5000);

  const userMessage = `## 候选人简历\n\n${truncatedResume}\n\n## 目标岗位 JD\n\n${jd}\n\n请按照你的分析流程，严格执行五步分析，如果发现无关的闲聊或翻译请求等，请直接拒绝并随意返回低分。返回 JSON 结果。`;

  const model = env.MINIMAX_MODEL || 'minimax-M2.7';
  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 3s, 6s, 12s, 24s
      await new Promise(r => setTimeout(r, 3000 * Math.pow(2, attempt - 1)));
    }

    try {
      // 120s timeout to prevent indefinite hanging
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 120_000);

      const minimaxRes = await fetch('https://api.minimax.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 16384,
        }),
        signal: timeoutController.signal,
      });

      clearTimeout(timeoutId);

      // Retry on 529 (server overloaded)
      if (minimaxRes.status === 529) continue;

      if (!minimaxRes.ok) {
        const errText = await minimaxRes.text();
        return Response.json({ error: `AI 分析失败: ${errText}` }, { status: 500 });
      }

      const data = await minimaxRes.json() as any;
      const content: string = data.choices?.[0]?.message?.content || '';

      if (!content) {
        return Response.json({ error: '未收到 AI 响应，请重试' }, { status: 500 });
      }

      const jsonStr = extractJSON(content);

      try {
        const result = JSON.parse(jsonStr);
        return Response.json({ result });
      } catch {
        return Response.json({ error: 'AI 返回了无效的 JSON 格式，请重试' }, { status: 500 });
      }
    } catch (err: unknown) {
      // Network errors on the last attempt
      if (attempt === MAX_RETRIES - 1) {
        if (err instanceof Error && err.name === 'AbortError') {
          return Response.json({ error: 'AI 分析超时（超过 120 秒），请稍后再试' }, { status: 504 });
        }
        const message = err instanceof Error ? err.message : '未知错误';
        return Response.json({ error: `AI 分析失败: ${message}` }, { status: 500 });
      }
    }
  }

  return Response.json({ error: 'AI 服务繁忙（MiniMax 返回 529），请稍后再试' }, { status: 503 });
}
