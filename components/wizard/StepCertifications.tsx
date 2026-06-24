import { Plus, Trash2 } from "lucide-react";
import { Certification, ResumeData } from "../../utils/types";

const ic =
  "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1";
const IS = { background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" };

const newCert = (): Certification => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "", issuer: "", issueDate: "", credentialUrl: "", expiryDate: "",
});

export default function StepCertifications({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const certs = data.certifications;
  const set = (id: string, key: string, val: string) =>
    onChange({ ...data, certifications: certs.map((c) => (c.id === id ? { ...c, [key]: val } : c)) });
  const add = () => onChange({ ...data, certifications: [...certs, newCert()] });
  const remove = (id: string) => onChange({ ...data, certifications: certs.filter((c) => c.id !== id) });

  return (
    <div className="space-y-4">
      {certs.length === 0 && (
        <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No certifications yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>This step is optional — skip if not applicable</p>
        </div>
      )}

      {certs.map((c, idx) => (
        <div key={c.id} className="rounded-2xl p-4 border space-y-3" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Certification #{idx + 1}
            </span>
            <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={lc} style={{ color: "var(--text-muted)" }}>Certification Name</label>
              <input value={c.name} onChange={(e) => set(c.id, "name", e.target.value)} placeholder="AWS Certified Solutions Architect" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Issuer</label>
              <input value={c.issuer} onChange={(e) => set(c.id, "issuer", e.target.value)} placeholder="Amazon Web Services" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Issue Date</label>
              <input value={c.issueDate} onChange={(e) => set(c.id, "issueDate", e.target.value)} placeholder="March 2024" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Credential URL (Optional)</label>
              <input value={c.credentialUrl} onChange={(e) => set(c.id, "credentialUrl", e.target.value)} placeholder="credly.com/badges/…" className={ic} style={IS} />
            </div>
            <div>
              <label className={lc} style={{ color: "var(--text-muted)" }}>Expiry Date (Optional)</label>
              <input value={c.expiryDate} onChange={(e) => set(c.id, "expiryDate", e.target.value)} placeholder="March 2027" className={ic} style={IS} />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-400"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <Plus size={15} /> Add Certification
      </button>
    </div>
  );
}
