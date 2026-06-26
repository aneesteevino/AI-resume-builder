import { ResumeData } from "../../utils/types";
import EditableText from "../EditableText";
import ResumeBranding from "../ResumeBranding";

function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </a>
  );
}

export default function TemplateClassic({ data }: { data: ResumeData }) {
  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#1e40af',
    headingColor: '#1e3a5f',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Professional Summary
            </h2>
            <div className="text-[10px] leading-relaxed">
              <EditableText path="summary" value={data.summary} multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold resume-h3">
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                    </h3>
                    <span className="text-[9px] font-medium resume-muted">
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  <div className="text-[9.5px] font-medium mb-1 resume-company">
                    <EditableText path={`experience.${i}.company`} value={exp.company} />
                    {exp.location && <span className="font-normal resume-muted ml-2">• <EditableText path={`experience.${i}.location`} value={exp.location} /></span>}
                  </div>
                  <div className="text-[10px] leading-snug whitespace-pre-wrap">
                    <EditableText path={`experience.${i}.responsibilities`} value={exp.responsibilities} multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-start resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold resume-h3">
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                    </h3>
                    <div className="text-[9.5px] resume-company">
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />
                      {' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                      {edu.gpa && <span className="resume-muted ml-2">| GPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span className="text-[9px] resume-muted">
                    <EditableText path={`education.${i}.startDate`} value={edu.startDate} />
                    {' – '}
                    <EditableText path={`education.${i}.endDate`} value={edu.isCurrent ? 'Present' : edu.endDate} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold resume-h3">
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                    </h3>
                    <div className="flex gap-2 text-[9px]">
                      {proj.githubUrl && <ContactLink href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}><span className="resume-link">GitHub ↗</span></ContactLink>}
                      {proj.liveUrl && <ContactLink href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}><span className="resume-link">Live ↗</span></ContactLink>}
                    </div>
                  </div>
                  {proj.techStack && <div className="text-[9px] mb-1 resume-muted italic"><EditableText path={`projects.${i}.techStack`} value={proj.techStack} /></div>}
                  <div className="text-[10px] leading-snug whitespace-pre-wrap">
                    <EditableText path={`projects.${i}.description`} value={proj.description} multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Skills
            </h2>
            <div className="text-[10px] leading-snug flex flex-wrap gap-x-1.5 gap-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center">
                  <EditableText path={`skills.${i}`} value={skill} />
                  {i < data.skills.length - 1 && <span className="resume-muted">,</span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-heading text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold resume-h3">
                      {cert.credentialUrl ? (
                        <ContactLink href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`}>
                          <EditableText path={`certifications.${i}.name`} value={cert.name} />
                        </ContactLink>
                      ) : <EditableText path={`certifications.${i}.name`} value={cert.name} />}
                    </h3>
                    <div className="text-[9px] resume-muted"><EditableText path={`certifications.${i}.issuer`} value={cert.issuer} /></div>
                  </div>
                  <span className="text-[9px] resume-muted"><EditableText path={`certifications.${i}.issueDate`} value={cert.issueDate} /></span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="resume-classic-container" style={{ width: "100%", minHeight: "100%", backgroundColor: custom.bgColor || "#ffffff", fontFamily: `${custom.fontFamily || 'Inter'}, sans-serif`, color: custom.textColor || '#1f2937', position: 'relative' }}>
      <style>{`
        .resume-classic-container .resume-heading {
          color: ${custom.headingColor || '#1e3a5f'} !important;
          border-bottom: 2px solid ${custom.primaryColor || '#1e40af'} !important;
          padding-bottom: 3px;
          margin-bottom: 8px;
        }
        .resume-classic-container .resume-h3 {
          color: ${custom.headingColor || '#1e3a5f'} !important;
        }
        .resume-classic-container .resume-company {
          color: ${custom.primaryColor || '#1e40af'} !important;
        }
        .resume-classic-container .resume-muted {
          color: ${custom.textColor || '#6b7280'} !important;
          opacity: 0.7;
        }
        .resume-classic-container .resume-link {
          color: ${custom.primaryColor || '#1e40af'} !important;
          text-decoration: underline;
        }
        .resume-classic-container a {
          color: ${custom.primaryColor || '#1e40af'} !important;
        }
        .resume-classic-container .header-bar {
          background-color: ${custom.primaryColor || '#1e40af'} !important;
        }
      `}</style>

      {/* Classic header: colored top bar + left-aligned name block */}
      <div className="header-bar mb-0" style={{ height: '6px', width: '100%' }} />
      <div className="px-8 pt-5 pb-4" style={{ borderBottom: `1px solid ${custom.primaryColor || '#1e40af'}30` }}>
        <h1 className="text-[24px] font-extrabold tracking-wide mb-0.5" style={{ color: custom.headingColor || '#1e3a5f' }}>
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        {data.personal.title && (
          <p className="text-[11px] font-semibold mb-2" style={{ color: custom.primaryColor || '#1e40af' }}>
            <EditableText path="personal.title" value={data.personal.title} />
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px]" style={{ color: custom.textColor || '#374151' }}>
          {data.personal.email && <ContactLink href={`mailto:${data.personal.email}`}><EditableText path="personal.email" value={data.personal.email} /></ContactLink>}
          {data.personal.phone && <span><EditableText path="personal.phone" value={data.personal.phone} /></span>}
          {data.personal.location && <span><EditableText path="personal.location" value={data.personal.location} /></span>}
          {data.personal.linkedin && <ContactLink href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`}><EditableText path="personal.linkedin" value={data.personal.linkedin} /></ContactLink>}
          {data.personal.github && <ContactLink href={data.personal.github.startsWith('http') ? data.personal.github : `https://${data.personal.github}`}><EditableText path="personal.github" value={data.personal.github} /></ContactLink>}
          {data.personal.portfolio && <ContactLink href={data.personal.portfolio.startsWith('http') ? data.personal.portfolio : `https://${data.personal.portfolio}`}><EditableText path="personal.portfolio" value={data.personal.portfolio} /></ContactLink>}
        </div>
      </div>

      <div className="px-8 py-5">
        {data.sectionOrder.map(renderSection)}
      </div>
      <ResumeBranding />
    </div>
  );
}
