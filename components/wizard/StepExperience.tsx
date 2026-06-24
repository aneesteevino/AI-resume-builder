import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { Experience, ResumeData, streamAI } from "../../utils/types";

const ic =
  "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1";
const IS = { background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" };

const newExp = (): Experience => ({
  id: `${Date.now()}-${Math.random()}`,
  company: "", role: "", location: "",
  startDate: "", endDate: "", isCurrent: false, responsibilities: "",
});

export default function StepExperience({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const exp = data.experience;

  const set = (id: string, key: string, val: unknown) =>
    onChange({ ...data, experience: exp.map((e) => (e.id === id ? { ...e, [key]: val } : e)) });
  const add = () => onChange({ ...data, experience: [...exp, newExp()] });
  const remove = (id: string) => onChange({ ...data, experience: exp.filter((e) => e.id !== id) });

  const enhance = async (entry: Experience) => {
    if (!entry.responsibilities.trim()) {
      toast.error("Add responsibilities first");
      return;
    }
    setEnhancing(entry.id);
    let result = "";
    try {
      await streamAI("enhance", { text: entry.responsibilities }, (chunk) => {
        result += chunk;
      });
      set(entry.id, "responsibilities", result.trim());
      toast.success("Bullets enhanced with AI!");
    } catch {
      toast.error("AI enhancement failed");
    }
    setEnhancing(null);
  };

  return (
    <div className="space-y-4">
      {exp.length === 0 && (
        <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No experience entries yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Add your work history below</p>
        </div>
      )}

      {exp.map((e, idx) => (
        <div key={e.id} className="rounded-2xl p-4 border space-y-3" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Experience #{idx + 1}
            </span>
            <button onClick={() => remove(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Company Name</label>
              <input value={e.company} onChange={(ev) => set(e.id, "company", ev.target.value)} placeholder="Google" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Job Title / Role</label>
              <input value={e.role} onChange={(ev) => set(e.id, "role", ev.target.value)} placeholder="Software Engineer" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Location</label>
              <input value={e.location} onChange={(ev) => set(e.id, "location", ev.target.value)} placeholder="Mountain View, CA" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Start Date</label>
              <input value={e.startDate} onChange={(ev) => set(e.id, "startDate", ev.target.value)} placeholder="Jan 2022" className={ic} style={IS} />
            </div>
            {!e.isCurrent && (
              <div>
                <label className={lc} style={{ color: "var(--text-muted)" }}>End Date</label>
                <input value={e.endDate} onChange={(ev) => set(e.id, "endDate", ev.target.value)} placeholder="Dec 2023" className={ic} style={IS} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={e.isCurrent}
              onChange={(ev) => set(e.id, "isCurrent", ev.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: "#6366f1" }}
            />
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>Currently Working Here</span>
          </label>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={lc} style={{ color: "var(--text-muted)" }}>Responsibilities & Achievements</label>
              <button
                onClick={() => enhance(e)}
                disabled={enhancing === e.id}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
              >
                <Wand2 size={11} />
                {enhancing === e.id ? "Enhancing…" : "AI Enhance"}
              </button>
            </div>
            <textarea
              value={e.responsibilities}
              onChange={(ev) => set(e.id, "responsibilities", ev.target.value)}
              placeholder="Describe your key responsibilities and achievements. The AI can convert these into polished ATS-friendly bullet points."
              rows={4}
              className={ic}
              style={{ ...IS, resize: "vertical" }}
            />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-400"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <Plus size={15} /> Add Experience
      </button>
    </div>
  );
}
