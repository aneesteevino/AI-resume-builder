import { useState } from "react";
import { Wand2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { ResumeData, streamAI } from "../../utils/types";

// ── Comprehensive multi-industry role list ─────────────────────────────────
const ROLE_CATEGORIES = [
  {
    category: "Technology",
    roles: [
      "Software Engineer", "Frontend Developer", "Backend Developer",
      "Full Stack Developer", "Mobile Developer", "DevOps Engineer",
      "Data Scientist", "Machine Learning Engineer", "AI Engineer",
      "Cloud Architect", "Cybersecurity Analyst", "QA Engineer",
      "Database Administrator", "Systems Administrator", "IT Support Specialist",
    ],
  },
  {
    category: "Healthcare & Medicine",
    roles: [
      "Registered Nurse", "Physician", "Pharmacist", "Medical Assistant",
      "Physical Therapist", "Dentist", "Radiologist", "Surgeon",
      "Healthcare Administrator", "Clinical Research Associate",
      "Occupational Therapist", "Paramedic", "Nutritionist / Dietitian",
    ],
  },
  {
    category: "Business & Finance",
    roles: [
      "Financial Analyst", "Accountant", "Investment Banker",
      "Business Analyst", "Management Consultant", "Auditor",
      "Financial Planner", "Risk Analyst", "Operations Manager",
      "Supply Chain Manager", "Procurement Specialist", "Actuary",
    ],
  },
  {
    category: "Marketing & Sales",
    roles: [
      "Marketing Manager", "Digital Marketing Specialist", "Content Strategist",
      "SEO / SEM Specialist", "Social Media Manager", "Brand Manager",
      "Sales Manager", "Account Executive", "Sales Representative",
      "Growth Hacker", "Email Marketing Specialist", "Product Marketer",
    ],
  },
  {
    category: "Design & Creative",
    roles: [
      "UX Designer", "UI Designer", "Graphic Designer", "Product Designer",
      "Motion Designer", "Illustrator", "3D Artist", "Art Director",
      "Creative Director", "Video Editor", "Photographer",
      "Interior Designer", "Fashion Designer",
    ],
  },
  {
    category: "Education",
    roles: [
      "Teacher", "University Lecturer", "Academic Researcher",
      "School Principal", "Education Consultant", "Curriculum Developer",
      "Instructional Designer", "School Counselor", "Special Education Teacher",
      "ESL / Language Instructor", "Librarian",
    ],
  },
  {
    category: "Engineering",
    roles: [
      "Mechanical Engineer", "Civil Engineer", "Electrical Engineer",
      "Chemical Engineer", "Aerospace Engineer", "Structural Engineer",
      "Environmental Engineer", "Biomedical Engineer", "Industrial Engineer",
      "Manufacturing Engineer", "Petroleum Engineer", "Robotics Engineer",
    ],
  },
  {
    category: "Law & Legal",
    roles: [
      "Lawyer / Attorney", "Paralegal", "Legal Assistant",
      "Corporate Counsel", "Compliance Officer", "Judge",
      "Legal Researcher", "Contract Manager", "IP Specialist",
    ],
  },
  {
    category: "Human Resources",
    roles: [
      "HR Manager", "Recruiter / Talent Acquisition", "HR Business Partner",
      "Compensation & Benefits Specialist", "Training & Development Manager",
      "HR Generalist", "People Operations Manager", "Labour Relations Specialist",
    ],
  },
  {
    category: "Media & Communication",
    roles: [
      "Journalist", "Content Writer", "Copywriter", "Public Relations Specialist",
      "Editor", "Broadcast Producer", "Podcast Producer",
      "Technical Writer", "Communications Manager",
    ],
  },
];

const ALL_ROLES = ROLE_CATEGORIES.flatMap((c) => c.roles);

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
  const [search, setSearch] = useState("");
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
        onChange({ ...data, summary: result });
      });
      toast.success("Professional summary generated!");
    } catch {
      toast.error("Summary generation failed");
    }
    setGenerating(false);
  };

  // Filter roles by search query
  const query = search.toLowerCase().trim();
  const filteredCategories = query
    ? [{ category: "Search Results", roles: ALL_ROLES.filter((r) => r.toLowerCase().includes(query)) }]
    : ROLE_CATEGORIES;

  // Custom role: if typed text is not in list, offer it as a custom option
  const isCustomRole =
    query &&
    !ALL_ROLES.some((r) => r.toLowerCase() === query) &&
    targetJob.role.toLowerCase() !== query;

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {(["role", "jd"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === m ? "bg-indigo-500 text-white" : "hover:text-indigo-400"
            }`}
            style={
              mode !== m
                ? { background: "var(--bg-elevated)", color: "var(--text-muted)" }
                : {}
            }
          >
            {m === "role" ? "Choose / Enter Role" : "Paste Job Description"}
          </button>
        ))}
      </div>

      {/* ── Option A: Role picker ──────────────────────────────────────────── */}
      {mode === "role" && (
        <div className="space-y-3">
          {/* Search + custom input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  setRole(search.trim());
                  setSearch("");
                }
              }}
              placeholder="Search roles or type a custom role & press Enter…"
              className={ta}
              style={{
                paddingLeft: "2rem",
                background: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Custom role suggestion */}
          {isCustomRole && (
            <button
              onClick={() => { setRole(search.trim()); setSearch(""); }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium border border-dashed border-indigo-500/60 bg-indigo-500/10 text-indigo-400 transition-all hover:bg-indigo-500/20"
            >
              ＋ Use &ldquo;{search.trim()}&rdquo; as custom role
            </button>
          )}

          {/* Selected role badge */}
          {targetJob.role && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Selected:
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {targetJob.role}
              </span>
              <button
                onClick={() => setRole("")}
                className="text-xs ml-auto"
                style={{ color: "var(--text-muted)" }}
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Role categories */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {filteredCategories.map((cat) =>
              cat.roles.length === 0 ? null : (
                <div key={cat.category}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                    {cat.category}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setSearch(""); }}
                        className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all text-left truncate ${
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
                </div>
              )
            )}
            {filteredCategories[0]?.roles.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                No roles match &ldquo;{search}&rdquo; — press Enter to use it as a custom role.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Option B: JD paste ────────────────────────────────────────────── */}
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

      {/* ── Professional Summary ──────────────────────────────────────────── */}
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
