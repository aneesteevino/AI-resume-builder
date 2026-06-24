import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { Project, ResumeData, streamAI } from "../../utils/types";

const ic =
  "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1";
const IS = { background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" };

const newProj = (): Project => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "", description: "", techStack: "", githubUrl: "", liveUrl: "",
});

export default function StepProjects({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const projects = data.projects;

  const set = (id: string, key: string, val: string) =>
    onChange({ ...data, projects: projects.map((p) => (p.id === id ? { ...p, [key]: val } : p)) });
  const add = () => onChange({ ...data, projects: [...projects, newProj()] });
  const remove = (id: string) => onChange({ ...data, projects: projects.filter((p) => p.id !== id) });

  const enhance = async (proj: Project) => {
    if (!proj.description.trim()) { toast.error("Add a description first"); return; }
    setEnhancing(proj.id);
    let result = "";
    try {
      await streamAI(
        "enhance",
        { text: `Project: ${proj.name}\nTech Stack: ${proj.techStack}\nDescription: ${proj.description}` },
        (chunk) => { result += chunk; }
      );
      set(proj.id, "description", result.trim());
      toast.success("Description enhanced!");
    } catch {
      toast.error("Enhancement failed");
    }
    setEnhancing(null);
  };

  return (
    <div className="space-y-4">
      {projects.length === 0 && (
        <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Showcase your best work</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Add projects to stand out to recruiters</p>
        </div>
      )}

      {projects.map((p, idx) => (
        <div key={p.id} className="rounded-2xl p-4 border space-y-3" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Project #{idx + 1}
            </span>
            <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={lc} style={{ color: "var(--text-muted)" }}>Project Name</label>
              <input value={p.name} onChange={(e) => set(p.id, "name", e.target.value)} placeholder="AI Resume Builder" className={ic} style={IS} />
            </div>
            <div className="sm:col-span-2">
              <label className={lc} style={{ color: "var(--text-muted)" }}>Tech Stack</label>
              <input value={p.techStack} onChange={(e) => set(p.id, "techStack", e.target.value)} placeholder="React, Next.js, OpenAI, TailwindCSS, PostgreSQL" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>GitHub URL</label>
              <input value={p.githubUrl} onChange={(e) => set(p.id, "githubUrl", e.target.value)} placeholder="github.com/user/project" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Live URL</label>
              <input value={p.liveUrl} onChange={(e) => set(p.id, "liveUrl", e.target.value)} placeholder="project.vercel.app" className={ic} style={IS} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={lc} style={{ color: "var(--text-muted)" }}>Description</label>
              <button
                onClick={() => enhance(p)}
                disabled={enhancing === p.id}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
              >
                <Wand2 size={11} />
                {enhancing === p.id ? "Enhancing…" : "AI Enhance"}
              </button>
            </div>
            <textarea
              value={p.description}
              onChange={(e) => set(p.id, "description", e.target.value)}
              placeholder="What did you build? What problem did it solve? What was the impact?"
              rows={3}
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
        <Plus size={15} /> Add Project
      </button>
    </div>
  );
}
