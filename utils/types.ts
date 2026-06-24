// ── Shared resume data types ───────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photo?: string;
}

export interface ResumeCustomization {
  fontFamily: string;
  theme: string;
  primaryColor: string;
  headingColor: string;
  textColor: string;
  bgColor: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  gpa: string;
  startDate: string;
  endDate: string;
  currentSemester: string;
  isCurrent: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  expiryDate: string;
}

export const DEFAULT_SECTION_ORDER = [
  'summary', 'experience', 'projects', 'education', 'skills', 'certifications',
];

export interface ResumeData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  targetJob: { jobDescription: string; role: string };
  summary: string;
  sectionOrder: string[];
  customization?: ResumeCustomization;
}

export const emptyResume: ResumeData = {
  personal: {
    fullName: '', title: '', email: '', phone: '',
    location: '', linkedin: '', github: '', portfolio: '',
    photo: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  targetJob: { jobDescription: '', role: '' },
  summary: '',
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  customization: {
    fontFamily: 'Inter',
    theme: 'indigo',
    primaryColor: '#6366f1',
    headingColor: '#312e81',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  },
};

// ── AI streaming helper ────────────────────────────────────────────────────

export async function streamAI(
  action: string,
  data: unknown,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
  });
  if (!res.ok || !res.body) throw new Error(res.statusText);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}

// ── Inline-edit path updater ───────────────────────────────────────────────

export function updatePath(data: ResumeData, path: string, value: string): ResumeData {
  const parts = path.split('.');
  if (parts.length === 1) return { ...data, [parts[0]]: value };
  if (parts[0] === 'personal') {
    return { ...data, personal: { ...data.personal, [parts[1]]: value } };
  }
  if (['experience', 'education', 'projects', 'certifications'].includes(parts[0])) {
    const section = parts[0] as 'experience' | 'education' | 'projects' | 'certifications';
    const idx = parseInt(parts[1]);
    const field = parts[2];
    const arr = (data[section] as unknown as Record<string, unknown>[]).map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    return { ...data, [section]: arr };
  }
  if (parts[0] === 'skills') {
    const idx = parseInt(parts[1]);
    const newSkills = [...data.skills];
    newSkills[idx] = value;
    return { ...data, skills: newSkills };
  }
  return data;
}
