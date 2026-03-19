import { useResume } from './hooks/useResume';
import { PersonalInfoForm } from './components/Editor/PersonalInfoForm';
import { SectionEditor } from './components/Editor/SectionEditor';
import { PreviewPane } from './components/Preview/PreviewPane';
import { ResumeManager } from './components/Editor/ResumeManager';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
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
import type { Section } from './types/resume';

function App() {
  const { 
    resumeData, 
    allResumes,
    activeResumeId,
    updatePersonalInfo, 
    updateSections, 
    switchResume,
    createResume,
    duplicateResume,
    deleteResume,
    renameResume,
    resetToDefault 
  } = useResume();

  const handlePrint = () => {
    // Generate smart filename
    const { name } = resumeData.personalInfo;
    const versionTitle = resumeData.versionTitle;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${name || '简历'}-${versionTitle}-${date}`;
    
    // Save original title and set new one temporarily for printing
    const originalTitle = document.title;
    document.title = filename;
    
    window.print();
    
    // Restore original title
    document.title = originalTitle;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = resumeData.sections.findIndex((s) => s.id === active.id);
      const newIndex = resumeData.sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(resumeData.sections, oldIndex, newIndex);
      updateSections(newSections);
    }
  };

  const handleSectionChange = (sectionId: string, updatedSection: Section) => {
    const newSections = resumeData.sections.map((s) =>
      s.id === sectionId ? updatedSection : s
    );
    updateSections(newSections);
  };

  const handleSectionDelete = (sectionId: string) => {
    const newSections = resumeData.sections.filter((s) => s.id !== sectionId);
    updateSections(newSections);
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      type: 'custom',
      title: '自定义模块',
      items: [],
    };
    updateSections([...resumeData.sections, newSection]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden text-[#09090b] bg-[#f4f4f5]">
      
      {/* Editor Pane - Minimal Flat Panel */}
      <div className="editor-pane w-full lg:w-[600px] lg:max-w-[45vw] h-[50vh] lg:h-[calc(100vh-2rem)] lg:m-4 z-10 shrink-0 overflow-y-auto glass-panel lg:rounded-3xl flex flex-col relative print-hide border-b border-[#e4e4e7] lg:border-none">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#e4e4e7] p-4 lg:p-6 flex justify-between items-center lg:rounded-t-3xl shadow-sm">
          <h1 className="heading-1">简历工作台</h1>
          <button 
            className="btn btn-secondary text-xs"
            onClick={resetToDefault}
          >
            重置示例数据
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6">
          <p className="text-sm text-[#57534E] mb-2 px-1">
            请在下方填写您的简历信息。您可以随时拖拽调整模块的顺序。
          </p>

          <ResumeManager
            resumes={allResumes}
            activeId={activeResumeId}
            onSwitch={switchResume}
            onCreate={createResume}
            onDelete={deleteResume}
            onDuplicate={duplicateResume}
            onRename={renameResume}
          />

          <div className="h-px bg-[#e4e4e7] my-2" />

          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={updatePersonalInfo}
          />

          <div className="mt-8 mb-4 flex items-center justify-between">
            <h3 className="heading-2">所有模块</h3>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={resumeData.sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {resumeData.sections.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onChange={handleSectionChange}
                    onDelete={handleSectionDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button 
            className="btn btn-secondary w-full mt-2 flex justify-center border-dashed border-[#d6d3d1] transition-colors bg-white/40 glass-card"
            style={{ padding: '0.875rem' }}
            onClick={handleAddSection}
          >
            <Plus size={20} /> 添加新模块
          </button>
        </div>
      </div>

      {/* Preview Pane - Floating canvas */}
      <div className="preview-pane flex-1 overflow-y-auto overflow-x-auto flex justify-center items-start p-4 lg:p-8 relative z-0">
        
        {/* Fixed Export Button */}
        <div className="fixed bottom-6 right-6 lg:top-6 lg:bottom-auto lg:right-8 z-30 print-hide">
          <button 
            className="btn btn-primary shadow-xl hover:shadow-2xl hover:-translate-y-1"
            onClick={handlePrint}
          >
            导出 PDF
          </button>
        </div>
        
        {/* Shadow wrapper for A4 visual look on screen */}
        <div className="shadow-[0_4px_24px_rgba(0,0,0,0.06)] print:shadow-none bg-white lg:mt-8 transition-transform duration-300 mx-auto min-w-max">
          <PreviewPane data={resumeData} />
        </div>
      </div>
    </div>
  );
}

export default App;
