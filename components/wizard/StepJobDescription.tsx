import { ResumeData } from "../../utils/types";

const ta =
  "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

export default function StepJobDescription({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const { targetJob } = data;

  const setJD = (jobDescription: string) =>
    onChange({ ...data, targetJob: { ...targetJob, jobDescription } });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
          Full Job Description (Optional)
        </label>
        <textarea
          value={targetJob.jobDescription}
          onChange={(e) => setJD(e.target.value)}
          placeholder="Paste the target job description here. The ATS scanner panel will score your resume against this job description and provide helpful suggestions to tailor your CV."
          rows={10}
          className={ta}
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)", resize: "vertical" }}
        />
        <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
          {targetJob.jobDescription.length} characters — providing a job description enables live ATS scoring.
        </p>
      </div>
    </div>
  );
}
