import { useEffect, useState } from "react";
import { AlertTriangle, Target, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { ResumeData, streamAI } from "../utils/types";

// ── Client-side ATS scoring ────────────────────────────────────────────────

const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","be","been","have","has","had","do","does",
  "did","will","would","could","should","may","might","must","shall","can","it",
  "its","this","that","these","those","i","we","you","they","he","she","who",
  "which","what","our","your","their","my","his","her","not","no","if","then",
  "else","when","while","we","all","also","just","but","into","up","out","so",
  "about","over","after","such","than","more","also","only","each","their",
]);

function tokenize(text: string): string[] {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s/-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    ),
  ];
}

function matchRate(keywords: string[], text: string): number {
  if (!keywords.length) return 0;
  const lower = text.toLowerCase();
  return Math.round(
    (keywords.filter((k) => lower.includes(k)).length / keywords.length) * 100
  );
}

interface ATSResult {
  total: number;
  skillsMatch: number;
  experienceMatch: number;
  keywordsMatch: number;
  educationMatch: number;
  missingSkills: string[];
}

function calcATS(data: ResumeData, jd: string): ATSResult {
  const empty = { total: 0, skillsMatch: 0, experienceMatch: 0, keywordsMatch: 0, educationMatch: 0, missingSkills: [] };
  if (!jd.trim()) return empty;

  const kw = tokenize(jd);
  const skillsText = data.skills.join(" ");
  const expText = data.experience.map((e) => `${e.role} ${e.responsibilities}`).join(" ");
  const projText = data.projects.map((p) => `${p.description} ${p.techStack}`).join(" ");
  const eduText = data.education.map((e) => `${e.degree} ${e.field}`).join(" ");
  const allText = [skillsText, expText, projText, data.personal.title, data.summary].join(" ");

  const sm = matchRate(kw, skillsText);
  const em = matchRate(kw, expText + " " + projText);
  const km = matchRate(kw, allText);
  const edm = matchRate(kw, eduText);

  const missing = kw.filter(
    (k) => k.length > 3 && !skillsText.toLowerCase().includes(k)
  );

  return {
    total: Math.min(100, Math.round(sm * 0.35 + em * 0.25 + km * 0.25 + edm * 0.15)),
    skillsMatch: sm,
    experienceMatch: em,
    keywordsMatch: km,
    educationMatch: edm,
    missingSkills: [...new Set(missing)].slice(0, 14),
  };
}

function scoreColor(s: number) {
  if (s >= 70) return "#22c55e";
  if (s >= 45) return "#f59e0b";
  return "#ef4444";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ATSPanel({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const [result, setResult] = useState<ATSResult>({
    total: 0, skillsMatch: 0, experienceMatch: 0, keywordsMatch: 0, educationMatch: 0, missingSkills: [],
  });
  const [tailoring, setTailoring] = useState(false);

  useEffect(() => {
    setResult(calcATS(data, data.targetJob.jobDescription));
  }, [data]);

  const hasJD = !!data.targetJob.jobDescription.trim();

  const tailor = async () => {
    if (!hasJD) { toast.error("Add a job description in Step 7 first"); return; }
    setTailoring(true);
    let raw = "";
    try {
      await streamAI(
        "tailor",
        { jobDescription: data.targetJob.jobDescription, summary: data.summary, skills: data.skills },
        (chunk) => { raw += chunk; }
      );
      // Parse response sections
      const summaryMatch = raw.match(/SUMMARY:\s*([\s\S]+?)(?=SKILLS ORDER:|$)/i);
      const skillsMatch = raw.match(/SKILLS ORDER:\s*([\s\S]+?)$/i);

      const next = { ...data };
      if (summaryMatch?.[1]?.trim()) next.summary = summaryMatch[1].trim();
      if (skillsMatch?.[1]?.trim()) {
        const ordered = skillsMatch[1].trim().split(",").map((s) => s.trim()).filter(Boolean);
        if (ordered.length) next.skills = ordered;
      }
      onChange(next);
      toast.success("Resume tailored for this job!");
    } catch {
      toast.error("Tailoring failed — check your API key");
    }
    setTailoring(false);
  };

  // SVG circle circumference for r=36: 2π*36 ≈ 226
  const circ = 226;
  const dash = hasJD ? (result.total / 100) * circ : 0;

  return (
    <div className="space-y-3">
      {/* ATS Score card */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>ATS Score</h3>
          <Target size={15} style={{ color: "var(--text-muted)" }} />
        </div>

        {!hasJD ? (
          <div className="text-center py-6">
            <p className="text-xs leading-5" style={{ color: "var(--text-muted)" }}>
              Paste a job description in <strong style={{ color: "var(--text-primary)" }}>Step 7</strong> to see how well your resume matches
            </p>
          </div>
        ) : (
          <>
            {/* Circular score */}
            <div className="flex justify-center mb-4">
              <div style={{ position: "relative", width: 90, height: 90 }}>
                <svg viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)", width: 90, height: 90 }}>
                  <circle cx="45" cy="45" r="36" fill="none" stroke="var(--border)" strokeWidth="7" />
                  <circle
                    cx="45" cy="45" r="36" fill="none"
                    stroke={scoreColor(result.total)}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ transition: "stroke-dasharray 0.7s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: scoreColor(result.total), lineHeight: 1 }}>
                    {result.total}
                  </span>
                  <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>/100</span>
                </div>
              </div>
            </div>

            {/* Breakdown bars */}
            {[
              { label: "Skills Match", val: result.skillsMatch, w: "35%" },
              { label: "Experience", val: result.experienceMatch, w: "25%" },
              { label: "Keywords", val: result.keywordsMatch, w: "25%" },
              { label: "Education", val: result.educationMatch, w: "15%" },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.label} <span className="text-[10px] opacity-60">({item.w})</span>
                  </span>
                  <span className="text-xs font-bold" style={{ color: scoreColor(item.val) }}>
                    {item.val}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${item.val}%`, background: scoreColor(item.val) }}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Missing Skills */}
      {hasJD && result.missingSkills.length > 0 && (
        <div className="rounded-2xl border p-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={13} className="text-amber-400" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Missing Keywords</h3>
          </div>
          <p className="text-xs mb-2.5" style={{ color: "var(--text-muted)" }}>
            Click any keyword to add it to your skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.map((s) => (
              <button
                key={s}
                onClick={() => onChange({ ...data, skills: [...data.skills, s] })}
                className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optimize button */}
      <button
        onClick={tailor}
        disabled={tailoring || !hasJD}
        className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-40 active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}
      >
        <Wand2 size={15} className={tailoring ? "animate-spin" : ""} />
        {tailoring ? "Optimizing resume…" : "Optimize For This Job"}
      </button>

      {!hasJD && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          Add a job description in Step 7 to enable AI tailoring
        </p>
      )}
    </div>
  );
}
