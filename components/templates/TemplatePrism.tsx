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

export default function TemplatePrism({ data }: { data: ResumeData }) {
  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#3b82f6',
    headingColor: '#1e3a8a',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Professional Summary
            </h2>
            <div style={{ fontSize: '10px', lineHeight: 1.65, color: custom.textColor || '#374151' }}>
              <EditableText path="summary" value={data.summary} multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#1e3a8a' }}>
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                      <span style={{ fontWeight: 400, color: custom.textColor, margin: '0 4px' }}>–</span>
                      <EditableText path={`experience.${i}.company`} value={exp.company} />
                    </h3>
                    <span style={{ fontSize: '9.5px', color: custom.textColor || '#6b7280', opacity: 0.7 }}>
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  {exp.location && (
                    <div style={{ fontSize: '9.5px', color: custom.textColor, opacity: 0.65, marginBottom: '3px' }}>
                      <EditableText path={`experience.${i}.location`} value={exp.location} />
                    </div>
                  )}
                  <div style={{ fontSize: '10px', lineHeight: 1.5, color: custom.textColor || '#374151', whiteSpace: 'pre-wrap' }}>
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
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#1e3a8a' }}>
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />{' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                    </h3>
                    <div style={{ fontSize: '9.5px', color: custom.textColor || '#6b7280' }}>
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                      {edu.gpa && <span style={{ opacity: 0.7 }}> | GPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '9.5px', color: custom.textColor, opacity: 0.65 }}>
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
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry">
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#1e3a8a' }}>
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                      {proj.techStack && <span style={{ fontWeight: 400, color: custom.textColor, opacity: 0.7, marginLeft: 6 }}>– <EditableText path={`projects.${i}.techStack`} value={proj.techStack} /></span>}
                    </h3>
                    <div className="flex gap-2" style={{ fontSize: '9px' }}>
                      {proj.githubUrl && <ContactLink href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>GitHub ↗</span></ContactLink>}
                      {proj.liveUrl && <ContactLink href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>Live ↗</span></ContactLink>}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px', lineHeight: 1.5, color: custom.textColor || '#374151', whiteSpace: 'pre-wrap' }}>
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
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Skills
            </h2>
            <div style={{ fontSize: '10px', display: 'flex', flexWrap: 'wrap' as const, gap: '4px 6px', color: custom.textColor || '#374151' }}>
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center">
                  <EditableText path={`skills.${i}`} value={skill} />
                  {i < data.skills.length - 1 && <span style={{ color: custom.primaryColor, marginLeft: 4 }}>·</span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: custom.primaryColor || '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.12em', borderBottom: `2px solid ${custom.primaryColor || '#3b82f6'}30`, paddingBottom: '3px', marginBottom: '7px' }}>
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#1e3a8a' }}>
                      {cert.credentialUrl ? (
                        <ContactLink href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`}>
                          <EditableText path={`certifications.${i}.name`} value={cert.name} />
                        </ContactLink>
                      ) : <EditableText path={`certifications.${i}.name`} value={cert.name} />}
                    </h3>
                    <div style={{ fontSize: '9px', color: custom.textColor, opacity: 0.65 }}><EditableText path={`certifications.${i}.issuer`} value={cert.issuer} /></div>
                  </div>
                  <span style={{ fontSize: '9px', color: custom.textColor, opacity: 0.65 }}><EditableText path={`certifications.${i}.issueDate`} value={cert.issueDate} /></span>
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
    <div style={{ width: "100%", minHeight: "100%", backgroundColor: custom.bgColor || "#ffffff", fontFamily: `${custom.fontFamily || 'Inter'}, sans-serif`, color: custom.textColor || '#1f2937', position: 'relative' }}>
      {/* Prism header: gradient using primaryColor */}
      <div style={{
        background: `linear-gradient(135deg, ${custom.primaryColor || '#3b82f6'} 0%, ${custom.headingColor || '#1e3a8a'} 100%)`,
        padding: '22px 32px 18px',
        borderRadius: '0 0 12px 12px',
        marginBottom: '4px',
      }}>
        {data.personal.photo && (
          <img src={data.personal.photo} alt="Profile"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', float: 'right' }} />
        )}
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: '10px' }}>
            <EditableText path="personal.title" value={data.personal.title} />
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: '9.5px', color: 'rgba(255,255,255,0.85)' }}>
          {data.personal.email && <ContactLink href={`mailto:${data.personal.email}`}><EditableText path="personal.email" value={data.personal.email} /></ContactLink>}
          {data.personal.phone && <><span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span><span><EditableText path="personal.phone" value={data.personal.phone} /></span></>}
          {data.personal.location && <><span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span><span><EditableText path="personal.location" value={data.personal.location} /></span></>}
          {data.personal.linkedin && <><span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <ContactLink href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`}><EditableText path="personal.linkedin" value={data.personal.linkedin} /></ContactLink></>}
          {data.personal.github && <><span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <ContactLink href={data.personal.github.startsWith('http') ? data.personal.github : `https://${data.personal.github}`}><EditableText path="personal.github" value={data.personal.github} /></ContactLink></>}
          {data.personal.portfolio && <><span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <ContactLink href={data.personal.portfolio.startsWith('http') ? data.personal.portfolio : `https://${data.personal.portfolio}`}><EditableText path="personal.portfolio" value={data.personal.portfolio} /></ContactLink></>}
        </div>
      </div>

      <div style={{ padding: '16px 32px 20px' }}>
        {data.sectionOrder.map(renderSection)}
      </div>
      <ResumeBranding />
    </div>
  );
}
