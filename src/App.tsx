import { useState } from 'react';
import { useResume } from './hooks/useResume';
import { useAnalysis } from './hooks/useAnalysis';
import { useAuth } from './hooks/useAuth';
import { PersonalInfoForm } from './components/Editor/PersonalInfoForm';
import { SectionEditor } from './components/Editor/SectionEditor';
import { PreviewPane } from './components/Preview/PreviewPane';
import { ResumeManager } from './components/Editor/ResumeManager';
import { AIPanel } from './components/AIPanel/AIPanel';
import { AdminLoginModal, AdminBadge } from './components/Auth/AdminLoginModal';
import { Plus, Download, RotateCcw, Sparkles, Shield } from 'lucide-react';
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
  const { isAdmin, username, login, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
  } = useResume(isAdmin);

  const { 
    status, result, error, history,
    analyze, reset: resetAnalysis, setStatus, setResult, deleteHistory
  } = useAnalysis();
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const handlePrint = () => {
    const { name } = resumeData.personalInfo;
    const versionTitle = resumeData.versionTitle;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${name || '简历'}-${versionTitle}-${date}`;

    const originalTitle = document.title;
    document.title = filename;
    window.print();
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
      updateSections(arrayMove(resumeData.sections, oldIndex, newIndex));
    }
  };

  const handleSectionChange = (sectionId: string, updatedSection: Section) => {
    updateSections(resumeData.sections.map((s) =>
      s.id === sectionId ? updatedSection : s
    ));
  };

  const handleSectionDelete = (sectionId: string) => {
    updateSections(resumeData.sections.filter((s) => s.id !== sectionId));
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

  const handleAnalyze = (input: string, isUrl: boolean, extra?: { customResumeText?: string; turnstileToken?: string; adminSecret?: string }) => {
    analyze(resumeData, input, isUrl, extra);
  };

  const handleResetAnalysis = () => {
    resetAnalysis();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[#f5f5f5]">

      {/* ─── Editor ─── */}
      <div className="editor-pane w-full lg:w-[520px] lg:max-w-[42vw] h-[50vh] lg:h-screen shrink-0 overflow-y-auto bg-white flex flex-col relative print-hide border-r border-[#eee]">

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-[#f0f0f0]">
          <div className="flex justify-between items-center px-8 py-5">
            <div className="flex items-center gap-3">
              <h1 className="heading-1">简历</h1>
              {isAdmin && (
                <AdminBadge username={username} onLogout={handleLogout} />
              )}
            </div>
            <div className="flex items-center gap-1">
              {!isAdmin && (
                <button
                  className="btn-icon admin-trigger"
                  onClick={() => setLoginModalOpen(true)}
                  title="管理员登录"
                >
                  <Shield size={16} />
                </button>
              )}
              <button
                className="btn-icon"
                onClick={resetToDefault}
                title="重置示例数据"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 flex flex-col gap-8">

          <ResumeManager
            resumes={allResumes}
            activeId={activeResumeId}
            onSwitch={switchResume}
            onCreate={createResume}
            onDelete={deleteResume}
            onDuplicate={duplicateResume}
            onRename={renameResume}
          />

          <div className="divider" />

          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={updatePersonalInfo}
          />

          <div className="divider" />

          <div>
            <h3 className="heading-2 mb-5">模块</h3>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={resumeData.sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-6">
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
              className="btn btn-secondary w-full mt-6 border-dashed"
              style={{ padding: '12px' }}
              onClick={handleAddSection}
            >
              <Plus size={16} /> 添加模块
            </button>
          </div>

          {/* Bottom spacing */}
          <div className="h-12" />
        </div>
      </div>

      {/* ─── Preview ─── */}
      <div className="preview-pane flex-1 overflow-y-auto overflow-x-auto flex justify-center items-start relative z-0">

        {/* FABs */}
        <div className="fixed bottom-8 right-8 z-30 print-hide flex gap-3">
          <button
            className="btn btn-secondary shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] bg-white"
            onClick={() => setAiPanelOpen(true)}
          >
            <Sparkles size={16} />
            AI 分析
          </button>
          <button
            className="btn btn-primary shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
            onClick={handlePrint}
          >
            <Download size={16} />
            导出 PDF
          </button>
        </div>

        {/* A4 Paper */}
        <div className="my-8 lg:my-12 mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] print:shadow-none bg-white min-w-max">
          <PreviewPane data={resumeData} />
        </div>
      </div>

      {/* ─── AI Panel ─── */}
      <AIPanel
        open={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        status={status}
        result={result}
        error={error}
        history={history}
        onAnalyze={handleAnalyze}
        onReset={handleResetAnalysis}
        onLoadHistoryItem={(item) => {
          setResult(item.result);
          setStatus('complete');
        }}
        onDeleteHistoryItem={deleteHistory}
      />

      {/* ─── Admin Login Modal ─── */}
      <AdminLoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={login}
      />
    </div>
  );
}

export default App;
