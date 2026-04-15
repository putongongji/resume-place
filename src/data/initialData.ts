import type { ResumeData } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const initialResumeData: ResumeData = {
  id: 'default',
  versionTitle: '示例简历',
  personalInfo: {
    name: '张三',
    gender: '男',
    age: '28',
    experience: '3年',
    title: '产品经理',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    location: '杭州',
    website: '',
  },
  sections: [
    {
      id: uuidv4(),
      type: 'custom',
      title: '个人优势',
      items: [
        {
          id: uuidv4(),
          title: '核心竞争优势',
          subtitle: '',
          date: '',
          location: '',
          description: `- **产品规划能力**：具备从 0 到 1 搭建产品的完整经验，擅长需求分析、竞品调研与用户画像构建\n- **数据驱动思维**：熟练运用数据分析工具，通过数据洞察驱动产品迭代和业务增长\n- **跨团队协作**：出色的沟通协调能力，能够有效推动研发、设计、运营等多团队高效协作\n- **AI 技术理解**：对大模型、RAG、Prompt 工程等 AI 技术有实操经验，能将技术能力转化为产品价值`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'custom',
      title: '技能',
      items: [
        {
          id: uuidv4(),
          title: '专业技能',
          subtitle: '',
          date: '',
          location: '',
          description: `- **产品设计**：Axure、Figma、墨刀等原型工具，PRD 撰写\n- **数据分析**：SQL、Python 数据处理、Google Analytics、神策\n- **项目管理**：Jira、飞书项目、敏捷开发流程\n- **AI 工具**：ChatGPT、Claude、Midjourney 等 AI 工具的产品化应用`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'experience',
      title: '工作经验',
      items: [
        {
          id: uuidv4(),
          title: '高级产品经理',
          subtitle: '某科技有限公司',
          date: '2022.06 - 至今',
          location: '',
          description: `- 主导公司核心 SaaS 产品的规划与迭代，用户数从 5 万增长至 **20 万+**\n- 搭建数据埋点体系，建立产品健康度指标看板，驱动关键转化率提升 **35%**\n- 引入 AI 能力优化客服系统，工单处理效率提升 **60%**，人力成本降低 30%`,
        },
        {
          id: uuidv4(),
          title: '产品经理',
          subtitle: '某互联网公司',
          date: '2020.07 - 2022.05',
          location: '',
          description: `- 负责移动端 App 的产品设计与迭代优化，DAU 从 1 万提升至 **5 万**\n- 策划并落地用户增长体系，新用户次日留存提升 **15%**\n- 协调 5 人研发团队完成 3 个大版本的按时交付`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'projects',
      title: '项目经历',
      items: [
        {
          id: uuidv4(),
          title: '智能客服系统',
          subtitle: '',
          date: '',
          location: '',
          description: `**背景**：为提升客户服务效率，主导搭建基于大模型的智能客服系统。\n\n**核心策略**：\n- 设计意图识别 + 知识库检索的双通道架构\n- 引入人机协作模式，复杂问题自动转人工\n\n**成果**：工单首次解决率提升至 **85%**，平均响应时间从 5 分钟缩短至 **30 秒**。`,
        },
        {
          id: uuidv4(),
          title: '用户增长体系搭建',
          subtitle: '',
          date: '',
          location: '',
          description: `**背景**：面对获客成本持续上升，设计并落地精细化用户增长策略。\n\n**核心策略**：\n- 构建用户分层模型，设计差异化运营策略\n- 搭建 A/B 测试平台，系统化验证增长假设\n\n**成果**：月活跃用户增长 **40%**，获客成本下降 **25%**。`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'education',
      title: '教育背景',
      items: [
        {
          id: uuidv4(),
          title: '计算机科学与技术（本科）',
          subtitle: '浙江大学',
          date: '2016.09 - 2020.06',
          location: '',
          description: `GPA 3.6/4.0 | 核心课程：数据结构、人机交互、软件工程`,
        },
      ],
    },
  ],
};
