import type { ResumeData } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const adminResumeData: ResumeData = {
  id: 'admin-default',
  versionTitle: '李鑫的简历',
  personalInfo: {
    name: '李鑫',
    gender: '男',
    age: '33',
    experience: '5年',
    title: 'B端AI产品经理 | 软硬件一体化 · 智能设备',
    email: 'li-ten@foxmail.com',
    phone: '15068842914',
    location: '杭州',
    website: 'github.com/putongongji',
  },
  sections: [
    {
      id: uuidv4(),
      type: 'custom',
      title: '个人简介',
      items: [
        {
          id: uuidv4(),
          title: '核心简介',
          subtitle: '',
          date: '',
          location: '',
          description: `- 5 年 B 端产品经验，具备软硬件一体化产品落地与 AI 应用实践双重背景\n- 专注于 B/G 端智能硬件产品的全生命周期管理，覆盖从客户需求洞察、产品方案设计、跨部门协作交付到商业化运营的完整链条\n- 善于在复杂业务场景中识别真实用户痛点，设计可落地的产品方案，并通过 AI 技术手段提升业务效率`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'experience',
      title: '工作经历',
      items: [
        {
          id: uuidv4(),
          title: 'B 端 AI 产品经理',
          subtitle: '全民认证科技（杭州）有限公司',
          date: '2021.04 - 2026.02',
          location: '',
          description: `- 独立负责 4 款智能门锁产品线（人脸锁/Cat.1 蓝牙锁），主导从需求调研、方案定制到生产落地的全流程，年累计出货 **10 万+**，直接对接政府住建局及企业客户完成方案沟通与交付验收\n- 深度参与 B 端智能锁月租续费方案设计，探索订阅制商业模式，理解 B/G 端客户的付费逻辑与客户成功路径\n- 从 0 到 1 搭建公司内部 WMS、工单系统、呼叫中心，打通仓储-售后-实施全链路数据，实现"一锁一码"全生命周期追踪，将跨部门协作效率提升 **90%**\n- 主导住建厅保障房 IOT 项目，根据政务内网安全隔离要求设计数据中间件方案，对接客户需求、评估智能锁选型、协调供应链排产，最终 **1400 台设备提前交付完成**\n- 自研企业知识库 Agent，基于 RAG 技术构建硬件知识检索体系，将产研销跨部门业务咨询响应时间从 **2 小时缩短至 5 分钟**，信息准确率 **95%+**\n- 设计售后工单 AI 分析系统，采用"大模型级联漏斗"架构自动识别高价值隐患工单，将固件修复周期从 **1 个月缩短至 1 周**\n- 以上 AI 产品均使用 Claude Code 完成 POC 验证与原型搭建，无需额外研发资源`,
        },
        {
          id: uuidv4(),
          title: 'AI 产品经理',
          subtitle: '杭州方得智能科技有限公司',
          date: '2020.08 - 2021.02',
          location: '',
          description: `- 负责百万用户级 AI 电话助理产品优化，基于超短时挂断数据迭代应答策略，挂断率下降 **5%**，业务收益增长 **20%**，新增注册用户 **17 万**\n- 主导无障碍产品体验升级项目，通过深度用户访谈和交互优化，日活提升 **66%**，次日留存提升 **20%**`,
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
          title: '企业知识库 Agent',
          subtitle: '2024 | 全民认证科技',
          date: '',
          location: '',
          description: `**背景**：针对智能门锁业务多部门协作、高频内部咨询挤占产品精力的痛点，从 0 到 1 构建企业专属知识库 Agent。\n\n**核心策略**：\n- 集成公司硬件手册、产品文档、SOP/FAQ 至飞书知识库，采用 RAG 技术实现向量检索\n- 将 Agent 知识库与固件发版流程绑定，实现文档自动更新\n- 设计固件状态与时间戳双向校验机制防范 AI 幻觉\n\n**成果**：跨部门单次业务咨询从 2 小时降至 5 分钟，信息准确率 95%+，知识库覆盖研发/供应链/售后/实施全业务线。`,
        },
        {
          id: uuidv4(),
          title: '住建厅保障房 IOT 项目',
          subtitle: '2023 | 全民认证科技',
          date: '',
          location: '',
          description: `**背景**：作为智能门锁供应商，为政府住建局提供公租房流动人口管理与转租检测的整体解决方案。\n\n**核心策略**：\n- 通过深度需求对接，识别政府客户真实痛点——不仅是硬件采购，更是"信息采集自动化 + 违规行为可追溯"\n- 根据政务内网安全隔离要求，设计数据中间件架构确保敏感信息不出网\n- 协调研发评估平台协议兼容性、制定设备注册/激活 SOP、制定交付兜底策略\n\n**成果**：1400 台智能锁成功接入 IOT 平台并提前完成交付安装，设备正常运行至今。`,
        },
        {
          id: uuidv4(),
          title: '售后工单 AI 分析',
          subtitle: '2023 | 全民认证科技',
          date: '',
          location: '',
          description: `**背景**：针对海量售后工单人工分析效率低、隐患遗漏率高的问题，构建 AI 驱动的工单分析系统。\n\n**核心策略**：\n- 设计"大模型级联漏斗"架构：第一步自动清洗无效工单（格式错误/重复），降低无效调用；第二步调度大模型进行深度语义提取，精准识别潜在硬件隐患\n- 同时显著降低 API 调用成本\n\n**成果**：精准挖掘人工遗漏的底层硬件问题，固件修复周期从 1 个月缩短至 1 周，客诉响应效率大幅提升。`,
        },
      ],
    },
    {
      id: uuidv4(),
      type: 'custom',
      title: '专业技能',
      items: [
        {
          id: uuidv4(),
          title: '技能清单',
          subtitle: '',
          date: '',
          location: '',
          description: `- **AI 产品**：Prompt 工程、RAG、LangGraph、Claude Code，熟练使用 AI IDE 进行快速 POC 验证与原型搭建\n- **产品方法**：需求分析、PRD 撰写、原型设计、数据分析、用户访谈、A/B 测试\n- **软硬件结合**：熟悉 Cat.1/NB-IoT/Bluetooth/Wi-Fi 等通讯协议差异，具备智能硬件产品层理解与跨部门协作能力\n- **数据分析**：熟悉 AI 模型评估指标，擅长通过数据洞察支撑产品迭代决策`,
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
          description: `GPA 3.8/4.0，专业前 5% | 核心课程：实验设计、数据分析、具身认知、人机交互`,
        },
      ],
    },
  ],
};
