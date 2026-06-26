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

export default function TemplateMeridian({ data }: { data: ResumeData }) {
  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#6366f1',
    headingColor: '#312e81',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
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
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold resume-accent-text">
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                      <span className="font-normal mx-1 resume-body-text"> – </span>
                      <EditableText path={`experience.${i}.company`} value={exp.company} />
                    </h3>
                    <span className="text-[9px] resume-muted-text font-medium">
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[9px] resume-muted-text mb-1 italic">
                      <EditableText path={`experience.${i}.location`} value={exp.location} />
                    </div>
                  )}
                  <div className="text-[10px] leading-snug pl-2 border-l-2 resume-accent-border whitespace-pre-wrap">
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
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold resume-accent-text">
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />
                      {' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                    </h3>
                    <div className="text-[9px] resume-muted-text">
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                      {edu.gpa && <span className="ml-2">| GPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span className="text-[9px] resume-muted-text">
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
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold resume-accent-text">
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                      {proj.techStack && (
                        <span className="font-normal resume-muted-text ml-1">
                          – <EditableText path={`projects.${i}.techStack`} value={proj.techStack} />
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-2 text-[9px]">
                      {proj.githubUrl && <ContactLink href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}>GitHub</ContactLink>}
                      {proj.liveUrl && <ContactLink href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}>Live</ContactLink>}
                    </div>
                  </div>
                  <div className="text-[10px] leading-snug pl-2 border-l-2 resume-accent-border whitespace-pre-wrap">
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
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
              Skills
            </h2>
            <div className="text-[10px] leading-snug flex flex-wrap gap-x-1.5 gap-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center">
                  <EditableText path={`skills.${i}`} value={skill} />
                  {i < data.skills.length - 1 && <span className="resume-muted-text">,</span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="resume-section-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold resume-accent-text">
                      {cert.credentialUrl ? (
                        <ContactLink href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`}>
                          <EditableText path={`certifications.${i}.name`} value={cert.name} />
                        </ContactLink>
                      ) : (
                        <EditableText path={`certifications.${i}.name`} value={cert.name} />
                      )}
                    </h3>
                    <div className="text-[9px] resume-muted-text">
                      <EditableText path={`certifications.${i}.issuer`} value={cert.issuer} />
                    </div>
                  </div>
                  <span className="text-[9px] resume-muted-text">
                    <EditableText path={`certifications.${i}.issueDate`} value={cert.issueDate} />
                  </span>
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
    <div className="p-8 resume-custom-container" style={{ width: "100%", minHeight: "100%", backgroundColor: custom.bgColor || "#ffffff", position: 'relative' }}>
      <style>{`
        .resume-custom-container {
          font-family: ${custom.fontFamily || 'Inter'}, sans-serif !important;
          color: ${custom.textColor || '#1f2937'} !important;
        }
        .resume-custom-container .resume-section-heading {
          color: ${custom.headingColor || '#000000'} !important;
          border-color: ${custom.primaryColor || '#6366f1'} !important;
        }
        .resume-custom-container .resume-accent-text {
          color: ${custom.headingColor || '#1f2937'} !important;
        }
        .resume-custom-container .resume-accent-border {
          border-color: ${custom.primaryColor || '#6366f1'} !important;
          opacity: 0.6;
        }
        .resume-custom-container .resume-body-text {
          color: ${custom.textColor || '#1f2937'} !important;
        }
        .resume-custom-container .resume-muted-text {
          color: ${custom.textColor || '#6b7280'} !important;
          opacity: 0.7;
        }
        .resume-custom-container a {
          color: ${custom.primaryColor || '#6366f1'} !important;
          text-decoration: underline;
        }
      `}</style>

      {/* Centered Header */}
      <div className="mb-6 text-center">
        {data.personal.photo && (
          <img src={data.personal.photo} alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 mx-auto mb-3"
            style={{ borderColor: custom.primaryColor || "#6366f1" }} />
        )}
        <h1 className="text-[26px] font-extrabold tracking-wide mb-1" style={{ color: custom.headingColor || '#1f2937' }}>
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        {data.personal.title && (
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: custom.primaryColor || '#6366f1' }}>
            <EditableText path="personal.title" value={data.personal.title} />
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9.5px]" style={{ color: custom.textColor || '#374151' }}>
          {data.personal.email && (
            <ContactLink href={`mailto:${data.personal.email}`}>
              <EditableText path="personal.email" value={data.personal.email} />
            </ContactLink>
          )}
          {data.personal.phone && <><span style={{ opacity: 0.4 }}>|</span><span><EditableText path="personal.phone" value={data.personal.phone} /></span></>}
          {data.personal.location && <><span style={{ opacity: 0.4 }}>|</span><span><EditableText path="personal.location" value={data.personal.location} /></span></>}
          {data.personal.linkedin && (
            <><span style={{ opacity: 0.4 }}>|</span>
            <ContactLink href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`}>
              <EditableText path="personal.linkedin" value={data.personal.linkedin} />
            </ContactLink></>
          )}
          {data.personal.github && (
            <><span style={{ opacity: 0.4 }}>|</span>
            <ContactLink href={data.personal.github.startsWith('http') ? data.personal.github : `https://${data.personal.github}`}>
              <EditableText path="personal.github" value={data.personal.github} />
            </ContactLink></>
          )}
          {data.personal.portfolio && (
            <><span style={{ opacity: 0.4 }}>|</span>
            <ContactLink href={data.personal.portfolio.startsWith('http') ? data.personal.portfolio : `https://${data.personal.portfolio}`}>
              <EditableText path="personal.portfolio" value={data.personal.portfolio} />
            </ContactLink></>
          )}
        </div>
        <div className="mt-4 h-0.5 w-full" style={{ background: `linear-gradient(to right, transparent, ${custom.primaryColor || '#6366f1'}, transparent)` }} />
      </div>

      {/* Sections */}
      {data.sectionOrder.map(renderSection)}
      <ResumeBranding />
    </div>
  );
}
