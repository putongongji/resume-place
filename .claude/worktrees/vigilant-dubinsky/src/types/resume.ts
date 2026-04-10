export interface PersonalInfo {
  name: string;
  gender: string;
  age: string;
  experience: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface SectionItem {
  id: string; // Unique identifier (e.g., UUID)
  title: string; // e.g., "Software Engineer", "Bachelor of Science"
  subtitle: string; // e.g., "Google", "University of California"
  date: string; // e.g., "2020 - Present"
  location: string; // e.g., "Mountain View, CA"
  description: string; // Markdown supported description
}

export type SectionType = 'experience' | 'education' | 'projects' | 'custom';

export interface Section {
  id: string; // Unique identifier for drag-and-drop
  type: SectionType;
  title: string; // Displayed title (e.g., "Experience", "Education")
  items: SectionItem[];
}

export interface ResumeData {
  id: string;
  versionTitle: string;
  personalInfo: PersonalInfo;
  sections: Section[];
}
