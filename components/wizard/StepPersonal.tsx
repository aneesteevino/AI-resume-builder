import { ResumeData } from "../../utils/types";

const ic =
  "w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1.5";

interface Field {
  key: keyof ResumeData["personal"];
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  full?: boolean;
}

const FIELDS: Field[] = [
  { key: "fullName", label: "Full Name", placeholder: "John Doe", type: "text", required: true, full: true },
  { key: "title", label: "Professional Title", placeholder: "Senior Software Engineer", type: "text", required: true, full: true },
  { key: "email", label: "Email Address", placeholder: "john@example.com", type: "email", required: true },
  { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel", required: true },
  { key: "location", label: "Location", placeholder: "San Francisco, CA", type: "text", required: true },
  { key: "linkedin", label: "LinkedIn Profile", placeholder: "linkedin.com/in/johndoe", type: "text", required: false },
  { key: "github", label: "GitHub Profile", placeholder: "github.com/johndoe", type: "text", required: false },
  { key: "portfolio", label: "Portfolio Website", placeholder: "johndoe.dev (Optional)", type: "text", required: false },
];

export default function StepPersonal({
  data,
  onChange,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
}) {
  const p = data.personal;
  const set = (key: keyof typeof p, val: string) =>
    onChange({ ...data, personal: { ...p, [key]: val } });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {FIELDS.map((f) => (
        <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
          <label className={lc} style={{ color: "var(--text-muted)" }}>
            {f.label}{" "}
            {f.required && <span className="text-indigo-400">*</span>}
          </label>
          <input
            type={f.type}
            value={p[f.key]}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={ic}
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
