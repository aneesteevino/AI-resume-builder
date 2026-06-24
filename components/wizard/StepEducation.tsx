import { Plus, Trash2 } from "lucide-react";
import { Education, ResumeData } from "../../utils/types";

const ic =
  "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1";

const newEdu = (): Education => ({
  id: `${Date.now()}-${Math.random()}`,
  degree: "",
  field: "",
  institution: "",
  gpa: "",
  startDate: "",
  endDate: "",
  currentSemester: "",
  isCurrent: false,
});

const IS = { background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" };

export default function StepEducation({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const edu = data.education;
  const set = (id: string, key: string, val: unknown) =>
    onChange({ ...data, education: edu.map((e) => (e.id === id ? { ...e, [key]: val } : e)) });
  const add = () => onChange({ ...data, education: [...edu, newEdu()] });
  const remove = (id: string) => onChange({ ...data, education: edu.filter((e) => e.id !== id) });

  return (
    <div className="space-y-4">
      {edu.length === 0 && (
        <div
          className="text-center py-12 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            No education entries yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Click &ldquo;Add Education&rdquo; below to get started
          </p>
        </div>
      )}

      {edu.map((e, idx) => (
        <div
          key={e.id}
          className="rounded-2xl p-4 border space-y-3"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Education #{idx + 1}
            </span>
            <button
              onClick={() => remove(e.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Degree</label>
              <input value={e.degree} onChange={(ev) => set(e.id, "degree", ev.target.value)} placeholder="Bachelor of Science" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Field of Study</label>
              <input value={e.field} onChange={(ev) => set(e.id, "field", ev.target.value)} placeholder="Computer Science" className={ic} style={IS} />
            </div>
            <div className="sm:col-span-2">
              <label className={lc} style={{ color: "var(--text-muted)" }}>University / Institution</label>
              <input value={e.institution} onChange={(ev) => set(e.id, "institution", ev.target.value)} placeholder="Massachusetts Institute of Technology" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>CGPA / GPA</label>
              <input value={e.gpa} onChange={(ev) => set(e.id, "gpa", ev.target.value)} placeholder="3.8 / 4.0" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Current Semester (Optional)</label>
              <input value={e.currentSemester} onChange={(ev) => set(e.id, "currentSemester", ev.target.value)} placeholder="6th Semester" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Start Date</label>
              <input value={e.startDate} onChange={(ev) => set(e.id, "startDate", ev.target.value)} placeholder="Sep 2020" className={ic} style={IS} />
            </div>
            {!e.isCurrent && (
              <div>
                <label className={lc} style={{ color: "var(--text-muted)" }}>End Date</label>
                <input value={e.endDate} onChange={(ev) => set(e.id, "endDate", ev.target.value)} placeholder="May 2024" className={ic} style={IS} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={e.isCurrent}
              onChange={(ev) => set(e.id, "isCurrent", ev.target.checked)}
              className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              style={{ accentColor: "#6366f1" }}
            />
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>Currently Studying</span>
          </label>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-400"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <Plus size={15} /> Add Education
      </button>
    </div>
  );
}
