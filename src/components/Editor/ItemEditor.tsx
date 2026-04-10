import { useEffect, useRef } from 'react';
import type { SectionItem } from '../../types/resume';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  item: SectionItem;
  onChange: (id: string, item: SectionItem) => void;
  onDelete: (id: string) => void;
}

function autoResize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

export function ItemEditor({ item, onChange, onDelete }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    opacity: isDragging ? 0.4 : 1,
  };

  const handleChange = (field: keyof SectionItem, value: string) => {
    onChange(item.id, { ...item, [field]: value });
  };

  // Auto-resize textarea on mount and when content changes
  useEffect(() => {
    autoResize(textareaRef.current);
  }, [item.description]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="item-editor-container relative flex gap-3 py-4 border-b border-[#f5f5f5] last:border-b-0"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="drag-handle flex items-start pt-3 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>

      <div className="flex-1 flex flex-col gap-0.5" style={{ minWidth: 0 }}>
        {/* Title row */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input-field font-medium flex-1"
            value={item.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="标题"
          />
          <button
            className="btn-icon delete-btn hover:!text-red-500 hover:!bg-red-50"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input-field flex-[2] min-w-0 text-[13px]"
            value={item.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="副标题"
          />
          <input
            type="text"
            className="input-field flex-[1.5] min-w-0 text-[13px]"
            value={item.date}
            onChange={(e) => handleChange('date', e.target.value)}
            placeholder="时间"
          />
          <input
            type="text"
            className="input-field flex-1 min-w-0 text-[13px]"
            value={item.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="地点"
          />
        </div>

        {/* Description */}
        <textarea
          ref={textareaRef}
          className="input-field w-full text-[13px] overflow-hidden resize-none mt-1"
          style={{ lineHeight: '1.6', minHeight: '40px' }}
          value={item.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="详细描述，支持 Markdown..."
          rows={2}
          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
        />
      </div>
    </div>
  );
}
