import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData } from '../types/resume';
import { initialResumeData } from '../data/initialData';
import { adminResumeData } from '../data/adminData';

const GUEST_STORAGE_KEY = 'resume-builder-data-v2';
const ADMIN_STORAGE_KEY = 'resume-builder-data-v2-admin';
const OLD_LOCAL_STORAGE_KEY = 'resume-builder-data';

interface ResumeStorage {
  activeResumeId: string;
  resumes: ResumeData[];
}

function loadStorage(storageKey: string, defaultData: ResumeData): ResumeStorage {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }

    // Only try V1 migration for guest mode
    if (storageKey === GUEST_STORAGE_KEY) {
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
    }
  } catch (e) {
    console.error('Failed to load resume data:', e);
  }

  return {
    activeResumeId: defaultData.id,
    resumes: [defaultData],
  };
}

export function useResume(isAdmin: boolean = false) {
  const storageKey = isAdmin ? ADMIN_STORAGE_KEY : GUEST_STORAGE_KEY;
  const defaultData = isAdmin ? adminResumeData : initialResumeData;

  const [storage, setStorage] = useState<ResumeStorage>(() =>
    loadStorage(storageKey, defaultData)
  );

  // Reload storage when admin mode changes
  useEffect(() => {
    setStorage(loadStorage(storageKey, defaultData));
  }, [isAdmin, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storage));
  }, [storage, storageKey]);

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

  const createResume = useCallback((title: string = '新简历') => {
    const newId = uuidv4();
    const newResume: ResumeData = {
      ...defaultData,
      id: newId,
      versionTitle: title,
    };
    setStorage(prev => ({
      activeResumeId: newId,
      resumes: [...prev.resumes, newResume]
    }));
  }, [defaultData]);

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
        r.id === prev.activeResumeId ? { ...defaultData, id: r.id, versionTitle: r.versionTitle } : r
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
