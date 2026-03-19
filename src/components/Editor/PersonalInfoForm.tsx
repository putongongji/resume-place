import type { PersonalInfo } from '../../types/resume';

interface Props {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export function PersonalInfoForm({ data, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/50 pb-3">
        <h2 className="heading-2 text-[#1C1917]">基本信息</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="input-group">
          <label className="input-label" htmlFor="name">姓名</label>
          <input
            id="name"
            name="name"
            type="text"
            className="input-field"
            value={data.name}
            onChange={handleChange}
            placeholder="如：张三"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="title">期望职位</label>
          <input
            id="title"
            name="title"
            type="text"
            className="input-field"
            value={data.title || ''}
            onChange={handleChange}
            placeholder="如：高级前端开发工程师"
          />
        </div>

        <div className="flex gap-4">
          <div className="input-group w-1/3">
            <label className="input-label" htmlFor="gender">性别</label>
            <input
              id="gender"
              name="gender"
              type="text"
              className="input-field"
              value={data.gender || ''}
              onChange={handleChange}
              placeholder="如：男"
            />
          </div>
          <div className="input-group w-1/3">
            <label className="input-label" htmlFor="age">年龄</label>
            <input
              id="age"
              name="age"
              type="text"
              className="input-field"
              value={data.age || ''}
              onChange={handleChange}
              placeholder="如：28"
            />
          </div>
          <div className="input-group w-1/3">
            <label className="input-label" htmlFor="experience">工作经验</label>
            <input
              id="experience"
              name="experience"
              type="text"
              className="input-field"
              value={data.experience || ''}
              onChange={handleChange}
              placeholder="如：5年"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="input-group w-full">
            <label className="input-label" htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              value={data.email || ''}
              onChange={handleChange}
              placeholder="如：zhangsan@example.com"
            />
          </div>
          <div className="input-group w-full">
            <label className="input-label" htmlFor="phone">电话</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input-field"
              value={data.phone || ''}
              onChange={handleChange}
              placeholder="如：138-0013-8000"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="input-group w-full">
            <label className="input-label" htmlFor="location">所在城市</label>
            <input
              id="location"
              name="location"
              type="text"
              className="input-field"
              value={data.location || ''}
              onChange={handleChange}
              placeholder="如：北京，朝阳区"
            />
          </div>
          <div className="input-group w-full">
            <label className="input-label" htmlFor="website">个人主页 / 博客</label>
            <input
              id="website"
              name="website"
              type="text"
              className="input-field"
              value={data.website || ''}
              onChange={handleChange}
              placeholder="如：github.com/zhangsan"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
