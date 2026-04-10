import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronRight, 
  FileText, 
  Edit3, 
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-semibold text-[#57534E] uppercase tracking-wider">简历版本管理</h3>
        <button 
          onClick={() => onCreate('新简历')}
          className="flex items-center gap-1 text-[11px] font-medium text-black hover:opacity-70 transition-opacity"
        >
          <Plus size={14} /> 新建版本
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {resumes.map((resume) => {
          const isActive = resume.id === activeId;
          const isEditing = editingId === resume.id;

          return (
            <div 
              key={resume.id}
              onClick={() => !isEditing && onSwitch(resume.id)}
              className={`
                group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                ${isActive 
                  ? 'bg-black border-black text-white shadow-md' 
                  : 'bg-white border-[#e4e4e7] text-[#09090b] hover:border-[#d4d4d8] hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <FileText size={18} className={isActive ? 'text-white/70' : 'text-[#a1a1aa]'} />
                
                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1 px-1">
                    <input
                      autoFocus
                      className={`
                        w-full bg-transparent text-sm border-b border-current outline-none py-0.5
                        ${isActive ? 'text-white' : 'text-black'}
                      `}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(e, resume.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => handleSaveRename(e, resume.id)} className="p-1 hover:opacity-70">
                      <Check size={14} />
                    </button>
                    <button onClick={handleCancelRename} className="p-1 hover:opacity-70">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm font-medium truncate">
                    {resume.versionTitle}
                  </span>
                )}
              </div>

              {!isEditing && (
                <div className={`
                  flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? 'text-white/80' : 'text-[#71717a]'}
                `}>
                  <button 
                    onClick={(e) => handleStartRename(e, resume)}
                    className="p-1.5 rounded-md hover:bg-current/10 transition-colors"
                    title="重命名"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id); }}
                    className="p-1.5 rounded-md hover:bg-current/10 transition-colors"
                    title="复制"
                  >
                    <Copy size={14} />
                  </button>
                  {resumes.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
                      className="p-1.5 rounded-md hover:bg-current/10 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {!isActive && (
                    <div className="ml-1 p-0.5">
                      <ChevronRight size={16} className="opacity-40" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {resumes.length < 3 && (
        <div className="mt-1 p-4 rounded-xl border border-dashed border-[#e4e4e7] bg-[#fafafa] flex flex-col items-center gap-2">
          <p className="text-[11px] text-[#71717a] text-center">
            您可以创建多达 3 个以上的简历版本来应对不同的职位需求。
          </p>
        </div>
      )}
    </div>
  );
}
