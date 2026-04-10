import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData } from '../types/resume';
import { initialResumeData } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'resume-builder-data-v2';
const OLD_LOCAL_STORAGE_KEY = 'resume-builder-data';

interface ResumeStorage {
  activeResumeId: string;
  resumes: ResumeData[];
}

export function useResume() {
  const [storage, setStorage] = useState<ResumeStorage>(() => {
    try {
      // 1. Try to load V2 data
      const savedV2 = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedV2) {
        return JSON.parse(savedV2);
      }

      // 2. Try to migrate from V1 data
      const savedV1 = localStorage.getItem(OLD_LOCAL_STORAGE_KEY);
      if (savedV1) {
        const v1Data = JSON.parse(savedV1);
        const migrated: ResumeData = {
          ...v1Data,
          id: 'v1-migrated',
          versionTitle: '我的简历 (已迁移)',
        };
        return {
          activeResumeId: migrated.id,
          resumes: [migrated],
        };
      }
    } catch (e) {
      console.error('Failed to load resume data:', e);
    }
    
    // 3. Default fallback
    return {
      activeResumeId: initialResumeData.id,
      resumes: [initialResumeData],
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  const activeResume = storage.resumes.find(r => r.id === storage.activeResumeId) || storage.resumes[0];

  const updatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    setStorage(prev => ({
      ...prev,
      resumes: prev.resumes.map(r => 
        r.id === prev.activeResumeId 
          ? { ...r, personalInfo: { ...r.personalInfo, ...info } } 
          : r
      )
    }));
  };

  const updateSections = (sections: ResumeData['sections']) => {
    setStorage(prev => ({
      ...prev,
      resumes: prev.resumes.map(r => 
        r.id === prev.activeResumeId 
          ? { ...r, sections } 
          : r
      )
    }));
  };

  const switchResume = (id: string) => {
    setStorage(prev => ({ ...prev, activeResumeId: id }));
  };

  const createResume = (title: string = '新简历') => {
    const newId = uuidv4();
    const newResume: ResumeData = {
      ...initialResumeData,
      id: newId,
      versionTitle: title,
    };
    setStorage(prev => ({
      activeResumeId: newId,
      resumes: [...prev.resumes, newResume]
    }));
  };

  const duplicateResume = (id: string) => {
    const toDuplicate = storage.resumes.find(r => r.id === id);
    if (!toDuplicate) return;

    const newId = uuidv4();
    const duplicated: ResumeData = {
      ...toDuplicate,
      id: newId,
      versionTitle: `${toDuplicate.versionTitle} (副本)`,
    };

    setStorage(prev => ({
      activeResumeId: newId,
      resumes: [...prev.resumes, duplicated]
    }));
  };

  const deleteResume = (id: string) => {
    setStorage(prev => {
      if (prev.resumes.length <= 1) return prev;
      const newResumes = prev.resumes.filter(r => r.id !== id);
      const newActiveId = id === prev.activeResumeId ? newResumes[0].id : prev.activeResumeId;
      return {
        activeResumeId: newActiveId,
        resumes: newResumes
      };
    });
  };

  const renameResume = (id: string, newTitle: string) => {
    setStorage(prev => ({
      ...prev,
      resumes: prev.resumes.map(r => r.id === id ? { ...r, versionTitle: newTitle } : r)
    }));
  };

  const resetToDefault = () => {
    setStorage(prev => ({
      ...prev,
      resumes: prev.resumes.map(r => 
        r.id === prev.activeResumeId ? { ...initialResumeData, id: r.id, versionTitle: r.versionTitle } : r
      )
    }));
  };

  return {
    resumeData: activeResume,
    allResumes: storage.resumes,
    activeResumeId: storage.activeResumeId,
    updatePersonalInfo,
    updateSections,
    switchResume,
    createResume,
    duplicateResume,
    deleteResume,
    renameResume,
    resetToDefault,
  };
}
