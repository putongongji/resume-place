import type { ResumeData } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const initialResumeData: ResumeData = {
  id: 'default',
  versionTitle: '我的简历',
  personalInfo: {
    name: '张三',
    gender: '男',
    age: '28',
    experience: '5年',
    title: '期望职位：高级前端开发工程师',
    email: 'zhangsan@example.com',
    phone: '138-0013-8000',
    location: '中国，北京',
    website: 'github.com/zhangsan',
  },
  sections: [
    {
      id: uuidv4(),
      type: 'experience',
      title: '工作经验',
      items: [
        {
          id: uuidv4(),
          title: '高级前端开发工程师',
          subtitle: '字节跳动',
          date: '2021.01 - 至今',
          location: '中国，北京',
          description: `- 主导高并发微服务基础架构的前端开发，承载日均百万级 PV。
- 指导 5 名初级工程师，并制定前端代码规范和最佳实践方案。
- 通过优化 Webpack 构建和 CI/CD 流程，将项目部署时间缩短了 40%。`,
        },
        {
          id: uuidv4(),
          title: '前端开发工程师',
          subtitle: '阿里巴巴',
          date: '2018.06 - 2021.01',
          location: '中国，杭州',
          description: `- 参与淘宝核心交易链路的 React 改造，极大提高了页面的渲染速度和用户体验。
- 开发和维护了一套基于 Ant Design 的内部业务组件库，服务于 10+ 业务线。`,
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
          title: '计算机科学与技术 本科',
          subtitle: '清华大学',
          date: '2014.09 - 2018.06',
          location: '中国，北京',
          description: `- GPA: 3.9/4.0 (专业前 5%)，获得国家奖学金。
- 核心课程：数据结构、操作系统、计算机网络、人工智能导论。`,
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
          title: '编程语言与框架',
          subtitle: '',
          date: '',
          location: '',
          description: `- 熟练掌握 HTML/CSS/JavaScript 以及 TypeScript。
- 精通 React 全家桶 (Next.js, Redux, TailwindCSS)，了解 Vue 生态。
- 熟悉 Node.js 及其常用服务器框架 (Express, NestJS)。`,
        },
      ],
    },
  ],
};
