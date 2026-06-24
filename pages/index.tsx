import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  User, GraduationCap, Briefcase, FolderOpen, Wrench,
  Award, Target, ChevronLeft, ChevronRight, Eye, Edit2,
  Download, Printer, Link2, CheckCircle2,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import StepPersonal from "../components/wizard/StepPersonal";
import StepEducation from "../components/wizard/StepEducation";
import StepExperience from "../components/wizard/StepExperience";
import StepProjects from "../components/wizard/StepProjects";
import StepSkills from "../components/wizard/StepSkills";
import StepCertifications from "../components/wizard/StepCertifications";
import StepTargetJob from "../components/wizard/StepTargetJob";
import TemplateMeridian from "../components/templates/TemplateMeridian";
import TemplateClassic from "../components/templates/TemplateClassic";
import TemplateCorporate from "../components/templates/TemplateCorporate";
import TemplateApex from "../components/templates/TemplateApex";
import TemplateNova from "../components/templates/TemplateNova";
import TemplateSlate from "../components/templates/TemplateSlate";
import TemplateCarbon from "../components/templates/TemplateCarbon";
import TemplatePrism from "../components/templates/TemplatePrism";
import ATSPanel from "../components/ATSPanel";
import SectionReorder from "../components/SectionReorder";
import ResumeUpload from "../components/ResumeUpload";
import { ResumeEditContext } from "../components/EditableText";
import { emptyResume, ResumeData, updatePath } from "../utils/types";

// ── Config ─────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Personal Info",    icon: User,         subtitle: "Your contact details and basic information" },
  { label: "Education",        icon: GraduationCap, subtitle: "Academic background and qualifications" },
  { label: "Work Experience",  icon: Briefcase,     subtitle: "Work history with AI-enhanced bullet points" },
  { label: "Projects",         icon: FolderOpen,    subtitle: "Portfolio projects with AI-optimized descriptions" },
  { label: "Skills",           icon: Wrench,        subtitle: "Technical skills with AI suggestions" },
  { label: "Certifications",   icon: Award,         subtitle: "Professional certifications and credentials" },
  { label: "Target Job",       icon: Target,        subtitle: "Job target and AI-generated professional summary" },
];

const TEMPLATES = [
  "Meridian", "Classic", "Corporate", "Apex", "Nova", "Slate", "Carbon", "Prism"
] as const;
type TName = typeof TEMPLATES[number];

const TEMPLATE_MAP: Record<TName, React.ComponentType<{ data: ResumeData }>> = {
  Meridian: TemplateMeridian,
  Classic: TemplateClassic,
  Corporate: TemplateCorporate,
  Apex: TemplateApex,
  Nova: TemplateNova,
  Slate: TemplateSlate,
  Carbon: TemplateCarbon,
  Prism: TemplatePrism,
};

// ── Page ───────────────────────────────────────────────────────────────────

const Home: NextPage = () => {
  const [step, setStep] = useState(0);          // 0–6 wizard, 7 = preview
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<TName>("Meridian");
  const [showUpload, setShowUpload] = useState(false);

  const isPreview = step === 7;
  const TemplateComponent = TEMPLATE_MAP[template];

  // Load shareable resume data from URL param
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("r");
      if (q) {
        const parsed = JSON.parse(atob(q)) as ResumeData;
        setData(parsed);
        setStep(7);
      }
    } catch {
      // ignore bad param
    }
  }, []);

  const handlePrint = () => window.print();

  const handleShare = () => {
    try {
      const encoded = btoa(JSON.stringify(data));
      const url = `${window.location.origin}${window.location.pathname}?r=${encoded}`;
      navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleEdit = (path: string, value: string) => {
    setData((prev) => updatePath(prev, path, value));
  };

  // ── Header ───────────────────────────────────────────────────────────────

  const Header = (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
          >
            <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "-0.5px" }}>AI</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block" style={{ color: "var(--text-primary)" }}>
            Resume Builder
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {isPreview ? (
            <>
              <button
                onClick={handleShare}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:border-indigo-500/60"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                <Link2 size={12} /> Share
              </button>
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:border-indigo-500/60"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                <Download size={12} /> Export PDF
              </button>
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
              >
                <Edit2 size={12} /> Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowUpload(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:border-indigo-500/60"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                Upload Resume
              </button>
              <button
                onClick={() => setStep(7)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:border-indigo-500/60"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                <Eye size={12} /> Preview
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );

  // ── Wizard View ──────────────────────────────────────────────────────────

  if (!isPreview) {
    const StepIcon = STEPS[step].icon;

    return (
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Head>
          <title>AI Resume Builder — Step {step + 1}: {STEPS[step].label}</title>
          <meta name="description" content="Build ATS-optimized resumes with AI. Structured multi-step wizard with templates, ATS scoring, and PDF export." />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        {/* Hidden print target — always in DOM so visibility:visible works */}
        <div
          id="resume-print-area"
          style={{ position: "fixed", top: "-9999px", left: 0, width: "794px", zIndex: -1 }}
          aria-hidden="true"
        >
          <TemplateComponent data={data} />
        </div>

        {Header}

        {showUpload && (
          <ResumeUpload
            onClose={() => setShowUpload(false)}
            onSuccess={(parsed) => {
              setData(parsed);
              setShowUpload(false);
              setStep(7); // go straight to preview
            }}
          />
        )}

        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const done = idx < step;
              const current = idx === step;
              return (
                <div key={idx} className="flex items-center flex-1 min-w-0">
                  <button
                    onClick={() => setStep(idx)}
                    title={s.label}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      done
                        ? "bg-indigo-500 shadow-lg shadow-indigo-500/25"
                        : current
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : "border hover:border-indigo-500/50"
                    }`}
                    style={
                      (done
                        ? {}
                        : current
                        ? { background: "rgba(99,102,241,0.12)", "--tw-ring-offset-color": "var(--bg-primary)" }
                        : { borderColor: "var(--border)", background: "var(--bg-elevated)" }) as React.CSSProperties
                    }
                  >
                    {done ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : (
                      <Icon size={13} style={{ color: current ? "#6366f1" : "var(--text-muted)" }} />
                    )}
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-1 transition-colors duration-500"
                      style={{ background: idx < step ? "#6366f1" : "var(--border)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step card */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            {/* Step header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.12)" }}
                >
                  <StepIcon size={14} style={{ color: "#6366f1" }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  {STEPS[step].label}
                </h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                  {step + 1}/{STEPS.length}
                </span>
              </div>
              <p className="text-sm pl-9.5" style={{ color: "var(--text-muted)" }}>{STEPS[step].subtitle}</p>
            </div>

            {/* Render step component */}
            {step === 0 && <StepPersonal      data={data} onChange={setData} />}
            {step === 1 && <StepEducation     data={data} onChange={setData} />}
            {step === 2 && <StepExperience    data={data} onChange={setData} />}
            {step === 3 && <StepProjects      data={data} onChange={setData} />}
            {step === 4 && <StepSkills        data={data} onChange={setData} />}
            {step === 5 && <StepCertifications data={data} onChange={setData} />}
            {step === 6 && <StepTargetJob     data={data} onChange={setData} />}

            {/* Navigation */}
            <div
              className="flex justify-between items-center mt-6 pt-5 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border font-medium transition-all disabled:opacity-30 hover:border-indigo-500/60"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                <ChevronLeft size={15} /> Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
                >
                  Continue <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={() => setStep(7)}
                  className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
                >
                  <Eye size={15} /> Preview Resume
                </button>
              )}
            </div>
          </div>

          {/* Quick step labels */}
          <div className="flex justify-between mt-3 px-0.5">
            {STEPS.map((s, idx) => (
              <span
                key={idx}
                className={`text-[9px] font-medium transition-colors hidden sm:block ${idx === step ? "text-indigo-400" : ""}`}
                style={idx !== step ? { color: "var(--text-muted)" } : {}}
              >
                {s.label.split(" ")[0]}
              </span>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Preview / ATS View ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Head>
        <title>AI Resume Builder — Preview &amp; Export</title>
        <meta name="description" content="Preview your ATS-optimized resume. Switch templates, check your ATS score, and export to PDF." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Print area (always in DOM) */}
      <div
        id="resume-print-area"
        style={{ position: "fixed", top: "-9999px", left: 0, width: "794px", zIndex: -1, background: "#fff" }}
        aria-hidden="true"
      >
        <TemplateComponent data={data} />
      </div>

      {Header}

      {showUpload && (
        <ResumeUpload
          onClose={() => setShowUpload(false)}
          onSuccess={(parsed) => {
            setData(parsed);
            setShowUpload(false);
          }}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-5 items-start">

          {/* ── Left panel: controls ──────────────────────────────── */}
          <div className="w-64 flex-shrink-0 space-y-3">

            {/* Template switcher */}
            <div className="rounded-2xl border p-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Template
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                      template === t
                        ? "border-indigo-500 bg-indigo-500/15 text-indigo-400"
                        : "hover:border-indigo-500/40 hover:text-indigo-400"
                    }`}
                    style={
                      template !== t
                        ? { borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }
                        : {}
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Reorder */}
            <div className="rounded-2xl border p-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Sections
              </h3>
              <SectionReorder
                order={data.sectionOrder}
                onChange={(order) => setData(prev => ({ ...prev, sectionOrder: order }))}
              />
            </div>

            {/* Export */}
            <div className="rounded-2xl border p-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Export
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
                >
                  <Download size={13} /> Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-all hover:border-indigo-500/50"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-all hover:border-indigo-500/50"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
                >
                  <Link2 size={13} /> Copy Share Link
                </button>
              </div>
            </div>

            {/* ATS Panel */}
            <ATSPanel data={data} onChange={setData} />
          </div>

          {/* ── Right panel: template preview ────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Paper shadow wrapper */}
            <div
              className="rounded-2xl overflow-hidden relative group"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px var(--border)",
              }}
            >
              <div style={{ background: "#fff", minHeight: "1058px" }}>
                <ResumeEditContext.Provider value={handleEdit}>
                  <TemplateComponent data={data} />
                </ResumeEditContext.Provider>
              </div>
            </div>

            <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              This is a live preview. Click any text to edit inline.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
