import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return res.status(500).json({ error: '未配置 GEMINI_API_KEY' });
  }

  const { resume, jobDescription, customResumeText } = req.body;
  if (!jobDescription || (!resume && !customResumeText)) {
    return res.status(400).json({ error: '请提供简历数据和岗位描述' });
  }

  const finalResumeContent = customResumeText || serializeResume(resume);
  const userMessage = `## 候选人简历

${finalResumeContent}

## 目标岗位 JD

${jobDescription}

请按照你的分析流程，严格执行五步分析，返回 JSON 结果。`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        maxOutputTokens: 16384,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: unknown) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: '分析过程中出错' })}\n\n`);
      res.end();
    } else {
      const message = err instanceof Error ? err.message : '未知错误';
      res.status(500).json({ error: `AI 分析失败: ${message}` });
    }
  }
}
