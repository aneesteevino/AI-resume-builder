import { useState } from "react";
import { Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { ResumeData, streamAI } from "../../utils/types";

const ROLES = [
  "AI Engineer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Full Stack Developer",
  "DevOps Engineer",
  "Machine Learning Engineer",
];

const ta =
  "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

export default function StepTargetJob({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const [mode, setMode] = useState<"role" | "jd">("role");
  const [generating, setGenerating] = useState(false);
  const { targetJob } = data;

  const setRole = (role: string) =>
    onChange({ ...data, targetJob: { ...targetJob, role } });
  const setJD = (jobDescription: string) =>
    onChange({ ...data, targetJob: { ...targetJob, jobDescription } });

  const generateSummary = async () => {
    setGenerating(true);
    let result = "";
    try {
      await streamAI("summary", data, (chunk) => {
        result += chunk;
        // Stream into summary field as it arrives
        onChange({ ...data, summary: result });
      });
      toast.success("Professional summary generated!");
    } catch {
      toast.error("Summary generation failed");
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {(["role", "jd"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-indigo-500 text-white"
                : "hover:text-indigo-400"
            }`}
            style={
              mode !== m
                ? { background: "var(--bg-elevated)", color: "var(--text-muted)" }
                : {}
            }
          >
            {m === "role" ? "Select Role" : "Paste Job Description"}
          </button>
        ))}
      </div>

      {/* Option A: Role grid */}
      {mode === "role" && (
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left ${
                targetJob.role === r
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-400"
                  : "hover:border-indigo-500/50 hover:text-indigo-400"
              }`}
              style={
                targetJob.role !== r
                  ? { borderColor: "var(--border)", color: "var(--text-primary)", background: "var(--bg-elevated)" }
                  : {}
              }
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Option B: JD paste */}
      {mode === "jd" && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
            Full Job Description
          </label>
          <textarea
            value={targetJob.jobDescription}
            onChange={(e) => setJD(e.target.value)}
            placeholder="Paste the full job description here. The AI will generate a tailored summary and the ATS panel will score your resume against this job."
            rows={8}
            className={ta}
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)", resize: "vertical" }}
          />
          <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
            {targetJob.jobDescription.length} characters — longer descriptions yield better ATS scores
          </p>
        </div>
      )}

      {/* Professional Summary */}
      <div className="rounded-2xl border p-4 space-y-3" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Professional Summary
          </label>
          <button
            onClick={generateSummary}
            disabled={generating}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:opacity-60"
          >
            <Wand2 size={11} className={generating ? "animate-spin" : ""} />
            {generating ? "Generating…" : "Generate with AI"}
          </button>
        </div>
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Your professional summary will appear here after generation, or type manually…"
          rows={5}
          className={ta}
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)", resize: "vertical" }}
        />
      </div>
    </div>
  );
}
