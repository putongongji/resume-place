import type { Section, SectionItem } from '../../types/resume';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { ItemEditor } from './ItemEditor';
import { v4 as uuidv4 } from 'uuid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Props {
  section: Section;
  onChange: (id: string, section: Section) => void;
  onDelete: (id: string) => void;
}

export function SectionEditor({ section, onChange, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(section.id, { ...section, title: e.target.value });
  };

  const handleItemChange = (itemId: string, updatedItem: SectionItem) => {
    const updatedItems = section.items.map((item) =>
      item.id === itemId ? updatedItem : item
    );
    onChange(section.id, { ...section, items: updatedItems });
  };

  const handleItemDelete = (itemId: string) => {
    const updatedItems = section.items.filter((item) => item.id !== itemId);
    onChange(section.id, { ...section, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: SectionItem = {
      id: uuidv4(),
      title: '',
      subtitle: '',
      date: '',
      location: '',
      description: '',
    };
    onChange(section.id, { ...section, items: [...section.items, newItem] });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.items.findIndex((i) => i.id === active.id);
      const newIndex = section.items.findIndex((i) => i.id === over.id);
      
      const newItems = arrayMove(section.items, oldIndex, newIndex);
      onChange(section.id, { ...section, items: newItems });
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, position: 'relative' }}
      className="mb-6 glass-card p-5 section-container"
    >
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/50 pb-3">
        <div className="flex items-center gap-3 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-stone-300 transition-colors drag-handle hover:text-stone-500"
          >
            <GripVertical size={20} />
          </div>
          <input
            type="text"
            className="input-field text-xl font-bold bg-transparent border-transparent hover:bg-white/40 focus:bg-white/80"
            style={{ padding: '0.25rem 0.5rem', marginLeft: '-0.5rem', width: '50%', minWidth: '200px' }}
            value={section.title}
            onChange={handleTitleChange}
            placeholder="模块名称 (如：教育经历)"
          />
        </div>
        <button 
          className="btn-icon delete-section-btn text-stone-400 hover:text-red-600 transition-opacity hover:bg-red-50/50 ml-2"
          onClick={() => onDelete(section.id)}
          title="删除整个模块"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={section.items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {section.items.map((item) => (
              <ItemEditor
                key={item.id}
                item={item}
                onChange={handleItemChange}
                onDelete={handleItemDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4">
        <button 
          className="btn btn-secondary w-full border-dashed border-stone-300 bg-white/40 glass-card" 
          style={{ padding: '0.6rem 1rem' }} 
          onClick={handleAddItem}
        >
          <Plus size={16} /> 添加一项 {section.title}
        </button>
      </div>
    </div>
  );
}
