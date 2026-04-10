import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  FileText,
  Check,
  X
} from 'lucide-react';
import type { ResumeData } from '../../types/resume';

interface Props {
  resumes: ResumeData[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: (title: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export function ResumeManager({
  resumes,
  activeId,
  onSwitch,
  onCreate,
  onDelete,
  onDuplicate,
  onRename
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartRename = (e: React.MouseEvent, resume: ResumeData) => {
    e.stopPropagation();
    setEditingId(resume.id);
    setEditValue(resume.versionTitle);
  };

  const handleSaveRename = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">版本</h3>
        <button
          onClick={() => onCreate('新简历')}
          className="btn text-[12px] text-[#999] hover:text-black transition-colors"
        >
          <Plus size={14} /> 新建
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {resumes.map((resume) => {
          const isActive = resume.id === activeId;
          const isEditing = editingId === resume.id;

          return (
            <div
              key={resume.id}
              onClick={() => !isEditing && onSwitch(resume.id)}
              className={`
                group relative flex items-center justify-between py-2.5 px-3 rounded-lg transition-all cursor-pointer
                ${isActive
                  ? 'bg-black text-white'
                  : 'text-[#666] hover:bg-[#f5f5f5] hover:text-black'
                }
              `}
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <FileText size={15} className={isActive ? 'text-white/50' : 'text-[#ccc]'} />

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      autoFocus
                      className="w-full bg-transparent text-sm border-b border-current outline-none py-0.5"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(e, resume.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => handleSaveRename(e, resume.id)} className="p-1 hover:opacity-70">
                      <Check size={13} />
                    </button>
                    <button onClick={handleCancelRename} className="p-1 hover:opacity-70">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-sm font-medium truncate"
                    onDoubleClick={(e) => handleStartRename(e, resume)}
                  >
                    {resume.versionTitle}
                  </span>
                )}
              </div>

              {!isEditing && (
                <div className={`
                  flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? 'text-white/60' : 'text-[#bbb]'}
                `}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id); }}
                    className="p-1 rounded hover:opacity-100 opacity-60 transition-opacity"
                    title="复制"
                  >
                    <Copy size={13} />
                  </button>
                  {resumes.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
                      className="p-1 rounded hover:opacity-100 opacity-60 transition-opacity"
                      title="删除"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
