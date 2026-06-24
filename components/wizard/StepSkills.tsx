import { useState } from "react";
import { Plus, X, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { ResumeData, streamAI } from "../../utils/types";

export default function StepSkills({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const [input, setInput] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || data.skills.includes(trimmed)) return;
    onChange({ ...data, skills: [...data.skills, trimmed] });
  };

  const removeSkill = (skill: string) =>
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    }
  };

  const suggest = async () => {
    setSuggesting(true);
    let result = "";
    try {
      await streamAI(
        "skills",
        {
          role: data.personal.title || "Software Engineer",
          currentSkills: data.skills,
          targetJob: data.targetJob.role || data.targetJob.jobDescription.slice(0, 120),
        },
        (chunk) => { result += chunk; }
      );
      const suggested = result
        .replace(/^[^a-zA-Z0-9]+/, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      let added = 0;
      suggested.forEach((s) => {
        if (!data.skills.includes(s)) { addSkill(s); added++; }
      });
      toast.success(`Added ${added} skill suggestions!`);
    } catch {
      toast.error("Skill suggestion failed");
    }
    setSuggesting(false);
  };

  return (
    <div className="space-y-4">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter or comma…"
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
        <button
          onClick={() => { addSkill(input); setInput(""); }}
          className="px-3 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Tag cloud */}
      <div
        className="min-h-[80px] p-4 rounded-2xl border flex flex-wrap gap-2 content-start"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        {data.skills.length === 0 && (
          <p className="text-sm w-full text-center my-auto" style={{ color: "var(--text-muted)" }}>
            No skills added yet — type above or use AI Suggestions
          </p>
        )}
        {data.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="hover:text-red-400 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* AI suggestions */}
      <button
        onClick={suggest}
        disabled={suggesting}
        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border transition-all hover:border-indigo-500/60 disabled:opacity-50"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", color: "var(--text-muted)" }}
      >
        <Wand2 size={14} className={suggesting ? "animate-spin" : ""} style={{ color: "#6366f1" }} />
        {suggesting ? "Generating AI suggestions…" : "AI Skill Suggestions"}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        💡 Press <kbd className="px-1 py-0.5 rounded text-xs border" style={{ borderColor: "var(--border)" }}>Enter</kbd> or <kbd className="px-1 py-0.5 rounded text-xs border" style={{ borderColor: "var(--border)" }}>,</kbd> to add a skill quickly
      </p>
    </div>
  );
}
