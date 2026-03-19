import type { SectionItem } from '../../types/resume';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  item: SectionItem;
  onChange: (id: string, item: SectionItem) => void;
  onDelete: (id: string) => void;
}

export function ItemEditor({ item, onChange, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (field: keyof SectionItem, value: any) => {
    onChange(item.id, { ...item, [field]: value });
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="glass-card flex gap-4 p-4 relative item-editor-container mb-3"
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="flex items-start pt-3 cursor-grab active:cursor-grabbing text-gray-300 transition-colors drag-handle"
      >
        <GripVertical size={18} />
      </div>

      <div className="flex-1 flex flex-col gap-3" style={{ minWidth: 0 }}>
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-4 w-full" style={{ flex: 1 }}>
            <div className="input-group w-full">
              <input
                type="text"
                className="input-field font-semibold text-gray-900 border-transparent bg-gray-50 focus:bg-white"
                style={{ padding: '0.25rem 0.5rem', marginLeft: '-0.5rem' }}
                value={item.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="主标题 (如：资深研发工程师 / 北京大学)"
              />
            </div>
          </div>
          <button 
            className="btn-icon delete-btn text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-2" 
            onClick={() => onDelete(item.id)}
            title="删除此项"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex gap-3 w-full">
          <div className="input-group flex-[2] min-w-0">
            <input
              type="text"
              className="input-field text-sm"
              value={item.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="副标题 (如：公司名或专业)"
            />
          </div>
          <div className="input-group flex-[1.5] min-w-0">
            <input
              type="text"
              className="input-field text-sm"
              value={item.date}
              onChange={(e) => handleChange('date', e.target.value)}
              placeholder="时间 (如：2020-至今)"
            />
          </div>
          <div className="input-group flex-[1] min-w-0">
            <input
              type="text"
              className="input-field text-sm"
              value={item.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="地点"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <label className="input-label">详细描述 (支持 Markdown)</label>
          <div className="flex gap-2 items-start w-full">
            <textarea
              className="input-field w-full text-sm overflow-hidden resize-none"
              style={{ minHeight: '80px', padding: '0.5rem 0.6rem', flex: 1, lineHeight: '1.4' }}
              value={item.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="在此描述您的具体工作内容、运用的技术或取得的成果，支持 Markdown 语法..."
              rows={3}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '80px';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
