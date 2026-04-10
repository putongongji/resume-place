import type { ResumeData } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const initialResumeData: ResumeData = {
  id: 'default',
  versionTitle: '李鑫的简历',
  personalInfo: {
    name: '李鑫',
    gender: '男',
    age: '33',
    experience: '5年',
    title: 'B端AI产品经理',
    email: 'li-ten@foxmail.com',
    phone: '15068842914',
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
          description: `- **AI Agent 实战经验**：近 1 年专注 Agent 落地，可用 LangGraph 构建 Agent，熟悉 RAG、Prompt 工程，上线多个公司内部和个人应用\n- **B 端复杂业务平台经验**：5 年 B 端产品经验，主导 4 款智能设备全生命周期管理和软硬件一体交付，负责 100 万用户售后工单系统及 30 万设备管理系统从 0 到 1\n- **心理学背景**：应用心理学硕士（社会心理学方向），具备使用 Python、R 等工具处理并分析 7000 万 + 数据的能力\n- **技术落地能力**：擅将大模型能力无缝嵌入企业真实业务流，实现从"流程信息化"到"业务智能化"的重构`,
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
          description: `- **AI 产品设计**：Prompt 工程、RAG、LangGraph、AI IDE 快速原型验证，擅长从业务场景反推技术方案\n- **用户认知与 AI 信任**：社会心理学训练，关注用户对 AI 的信任建立与放弃机制，擅长设计"恰到好处"的 AI 交互\n- **数据驱动**：熟悉 AI 模型训练、微调及评估流程，结合用户行为分析支撑产品迭代\n- **B 端产品全链路**：从 0 到 1 构建中后台体系（WMS、呼叫中心、工单系统），跨部门协调硬件、固件、供应链、工厂、实施安装和售后`,
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
          title: 'B 端 AI 产品经理',
          subtitle: '全民认证科技（杭州）有限公司',
          date: '2021.04 - 2026.02',
          location: '',
          description: `- 主导公司多个业务平台的从 0 到 1 搭建和集成，涵盖售后服务工单、供应链及仓库管理和智能锁安装实施模块，打通业务数据孤岛，实现全链路追踪\n- **搭建基于 Agent 的智能锁知识库**，部门沟通成本从 2 小时降低至 5 分钟；应用 RAG 将准确率提升至 95%\n- 负责 4 款智能门锁的交付，涵盖人像锁、蓝牙锁等，从前期产品规划、需求规格书定义、研发跟进、测试，到设备生产、固件发布、设备交付实施的全流程，总出货量达到 **10 万 +**\n- 跨部门沟通，协调硬件、固件、供应链、工厂、实施安装和售后等部门，保证产品的全流程交付`,
        },
        {
          id: uuidv4(),
          title: 'AI 产品经理',
          subtitle: '杭州方得科技有限公司',
          date: '2020.08 - 2021.02',
          location: '',
          description: `- 负责百万用户级 AI 智能接听助理，基于超短时挂断数据迭代应答策略，**挂断率下降 5%，业务收益增长 20%，新增注册用户 17 万**\n- 主导无障碍产品"爱畅聊"App 体验升级，深度访谈 10 + 目标用户，优化后**日活达 300+，次日留存提升 20%**`,
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
          title: '企业端知识库 Agent',
          subtitle: '',
          date: '',
          location: '',
          description: `**背景**：从 0 到 1 部署智能门锁专属知识 Agent，统筹整合跨部门硬件手册与操作指南，解决知识检索难、更新滞后的痛点。\n\n**核心策略**：\n- 创新性将 Agent 知识库与硬件发版流程深度绑定，每次固件更新自动触发 AI 生成说明并同步\n- 建立固件状态与时间戳双向校验机制以防范幻觉（借鉴心理学"过度自信偏差"：人们对流畅回答的信任度远高于准确回答，而 AI 的流畅性会放大这种偏差）\n\n**成果**：实现售后工单 QA 自动反哺与全域知识共享，将产研销跨部门的单次业务沟通成本由 **2 小时骤降至 5 分钟**，信息准确率 95%。`,
        },
        {
          id: uuidv4(),
          title: '售后工单 AI 分析模块',
          subtitle: '',
          date: '',
          location: '',
          description: `**背景**：为解决海量售后工单人工分析效率低、隐患遗漏率高的问题，主导搭建基于大模型的客诉数据挖掘系统。\n\n**核心策略**：\n- 设计"大模型级联漏斗"架构，先自动化清洗无效工单，再调度 AI 进行深度语义提取，大幅降低全量调用的 API 成本\n- 借鉴认知心理学"注意力漏斗"：先粗筛再精选，模拟人类专家的判断流程\n\n**成果**：精准挖掘出人工遗漏的"人脸识别特定报错"等底层硬件隐患，将问题暴露至固件修复的周期由 **1 个月缩短至 1 周**，彻底跑通数据驱动的产品优化飞轮。`,
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
          title: '应用心理学硕士（社会心理学方向）',
          subtitle: '浙江理工大学',
          date: '2017.09 - 2020.06',
          location: '',
          description: `核心课程：社会心理学（群体思维和情绪对股市的影响）、人机交互、数据分析`,
        },
        {
          id: uuidv4(),
          title: '应用心理学（本科）',
          subtitle: '沈阳师范大学',
          date: '2013.09 - 2017.06',
          location: '',
          description: `核心课程：实验心理学、心理咨询 | 学业成绩前 5%`,
        },
      ],
    },
  ],
};
