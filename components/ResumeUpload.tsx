import { useState } from 'react';
import { X, Upload, Wand2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { DEFAULT_SECTION_ORDER, ResumeData } from '../utils/types';

interface Props {
  onSuccess: (data: ResumeData) => void;
  onClose: () => void;
}

const PLACEHOLDER = `Paste the text from your resume here...

Example:
John Doe
john@example.com | +1 (555) 000-0000 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience...

EXPERIENCE
Senior Developer – Acme Corp  |  Jan 2022 – Present
• Led a team of 5 engineers to deliver a microservices architecture
• Reduced API response time by 40% through caching strategies

EDUCATION
B.S. Computer Science – MIT  |  2017 – 2021

SKILLS
React, Node.js, Python, AWS, Docker, PostgreSQL`;

export default function ResumeUpload({ onSuccess, onClose }: Props) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text first.');
      return;
    }
    setError('');
    setLoading(true);
    setProgress(5);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenFromUpload',
          data: {
            resumeText: resumeText.slice(0, 4000),
            jobDescription: jobDescription.slice(0, 1500),
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error(res.statusText);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = '';
      let tick = 5;

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        raw += decoder.decode(value);
        tick = Math.min(90, tick + 3);
        setProgress(tick);
      }

      setProgress(95);

      // Extract JSON by finding the first '{' and last '}'
      let jsonStr = raw.trim();
      
      // If AI dropped the outer braces and started straight with keys, wrap it
      if (jsonStr.startsWith('"')) {
        jsonStr = '{' + jsonStr;
        if (!jsonStr.endsWith('}')) jsonStr += '}';
      }

      const jsonStart = jsonStr.indexOf('{');
      const jsonEnd = jsonStr.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(jsonStr) as Partial<ResumeData>;

      // Merge with defaults
      const result: ResumeData = {
        personal: {
          fullName: '', title: '', email: '', phone: '',
          location: '', linkedin: '', github: '', portfolio: '',
          ...parsed.personal,
        },
        summary: parsed.summary ?? '',
        experience: (parsed.experience ?? []).map((e, i) => ({ ...e, id: e.id || `exp-${i}` })),
        education: (parsed.education ?? []).map((e, i) => ({ ...e, id: e.id || `edu-${i}` })),
        projects: (parsed.projects ?? []).map((p, i) => ({ ...p, id: p.id || `proj-${i}` })),
        skills: parsed.skills ?? [],
        certifications: (parsed.certifications ?? []).map((c, i) => ({ ...c, id: c.id || `cert-${i}` })),
        targetJob: { jobDescription, role: parsed.personal?.title ?? '', ...parsed.targetJob },
        sectionOrder: parsed.sectionOrder ?? [...DEFAULT_SECTION_ORDER],
      };

      setProgress(100);
      toast.success('Resume imported and optimized!');
      onSuccess(result);
    } catch (err) {
      console.error(err);
      setError('Failed to parse AI response. Please check your API key or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl border overflow-hidden shadow-2xl flex flex-col"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', height: '90vh', maxHeight: '800px' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}
            >
              <Upload size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Import &amp; AI-Regenerate Resume
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Paste your existing resume + a job description → AI builds a tailored version
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[400px] md:min-h-0">
            {/* Resume Text */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                Your Resume Text <span className="text-red-400">*</span>
              </label>
              <p className="text-xs mb-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                Open your PDF resume → Select All → Copy → Paste here
              </p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={PLACEHOLDER}
                className="flex-1 rounded-xl border text-xs p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                }}
              />
              <p className="text-[10px] mt-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                {resumeText.length} characters
              </p>
            </div>

            {/* Job Description */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                Target Job Description <span className="text-xs font-normal">(Optional — for AI tailoring)</span>
              </label>
              <p className="text-xs mb-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                Paste the job description to get a role-optimized resume
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...

The AI will:
• Rewrite your summary to match this role
• Reorder and emphasize relevant skills  
• Optimize bullet points for this job's keywords
• Boost your ATS match score"
                className="flex-1 rounded-xl border text-xs p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                }}
              />
              <p className="text-[10px] mt-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                {jobDescription.length} characters
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
            >
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Progress */}
          {loading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Analyzing &amp; regenerating resume…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ✦ AI will extract, structure, and optimize your resume content
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:border-indigo-500/50"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
            >
              Cancel
            </button>
            <button
              onClick={generate}
              disabled={loading || !resumeText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}
            >
              <Wand2 size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Generating…' : 'Generate Optimized Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
