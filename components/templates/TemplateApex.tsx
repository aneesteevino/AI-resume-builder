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

export default function TemplateApex({ data }: { data: ResumeData }) {
  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#7c3aed',
    headingColor: '#4c1d95',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Professional Summary
              </h2>
            </div>
            <div style={{ fontSize: '10px', lineHeight: 1.65, paddingLeft: '20px' }}>
              <EditableText path="summary" value={data.summary} multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Work Experience
              </h2>
            </div>
            <div className="space-y-3" style={{ paddingLeft: '20px' }}>
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry" style={{ borderLeft: `2px solid ${custom.primaryColor || '#7c3aed'}30`, paddingLeft: '10px' }}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#4c1d95' }}>
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                    </h3>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: custom.primaryColor || '#7c3aed' }}>
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  <div style={{ fontSize: '9.5px', fontWeight: 600, color: custom.primaryColor || '#7c3aed', marginBottom: '3px' }}>
                    <EditableText path={`experience.${i}.company`} value={exp.company} />
                    {exp.location && <span style={{ fontWeight: 400, color: custom.textColor || '#6b7280', opacity: 0.8 }}> · <EditableText path={`experience.${i}.location`} value={exp.location} /></span>}
                  </div>
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
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Education
              </h2>
            </div>
            <div className="space-y-2" style={{ paddingLeft: '20px' }}>
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-start resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#4c1d95' }}>
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />{' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                    </h3>
                    <div style={{ fontSize: '9.5px', color: custom.primaryColor || '#7c3aed', fontWeight: 500 }}>
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                      {edu.gpa && <span style={{ color: custom.textColor, fontWeight: 400, opacity: 0.7 }}> | GPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '9px', color: custom.primaryColor || '#7c3aed', fontWeight: 600 }}>
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
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Projects
              </h2>
            </div>
            <div className="space-y-3" style={{ paddingLeft: '20px' }}>
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry" style={{ borderLeft: `2px solid ${custom.primaryColor || '#7c3aed'}30`, paddingLeft: '10px' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#4c1d95' }}>
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                    </h3>
                    <div style={{ fontSize: '9px' }} className="flex gap-2">
                      {proj.githubUrl && <ContactLink href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>GitHub ↗</span></ContactLink>}
                      {proj.liveUrl && <ContactLink href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>Live ↗</span></ContactLink>}
                    </div>
                  </div>
                  {proj.techStack && <div style={{ fontSize: '9px', color: custom.primaryColor || '#7c3aed', marginBottom: '2px', fontStyle: 'italic' }}><EditableText path={`projects.${i}.techStack`} value={proj.techStack} /></div>}
                  <div style={{ fontSize: '10px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
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
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Skills
              </h2>
            </div>
            <div style={{ paddingLeft: '20px', display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${custom.primaryColor || '#7c3aed'}50`, color: custom.headingColor || '#4c1d95', backgroundColor: `${custom.primaryColor || '#7c3aed'}0D` }}>
                  <EditableText path={`skills.${i}`} value={skill} />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: custom.primaryColor || '#7c3aed', flexShrink: 0 }} />
              <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: custom.headingColor || '#4c1d95' }}>
                Certifications
              </h2>
            </div>
            <div className="space-y-2" style={{ paddingLeft: '20px' }}>
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#4c1d95' }}>
                      {cert.credentialUrl ? (
                        <ContactLink href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`}>
                          <EditableText path={`certifications.${i}.name`} value={cert.name} />
                        </ContactLink>
                      ) : <EditableText path={`certifications.${i}.name`} value={cert.name} />}
                    </h3>
                    <div style={{ fontSize: '9px', opacity: 0.7 }}><EditableText path={`certifications.${i}.issuer`} value={cert.issuer} /></div>
                  </div>
                  <span style={{ fontSize: '9px', color: custom.primaryColor, fontWeight: 600 }}><EditableText path={`certifications.${i}.issueDate`} value={cert.issueDate} /></span>
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
      {/* Apex header: large gradient band with diagonal accent */}
      <div style={{
        background: `linear-gradient(135deg, ${custom.primaryColor || '#7c3aed'} 0%, ${custom.headingColor || '#4c1d95'} 100%)`,
        padding: '24px 32px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 30, bottom: -30, width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
        {data.personal.photo && (
          <img src={data.personal.photo} alt="Profile"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.6)', float: 'right' }} />
        )}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '4px' }}>
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            <EditableText path="personal.title" value={data.personal.title} />
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: '9.5px', color: 'rgba(255,255,255,0.85)' }}>
          {data.personal.email && <ContactLink href={`mailto:${data.personal.email}`}><EditableText path="personal.email" value={data.personal.email} /></ContactLink>}
          {data.personal.phone && <span><EditableText path="personal.phone" value={data.personal.phone} /></span>}
          {data.personal.location && <span><EditableText path="personal.location" value={data.personal.location} /></span>}
          {data.personal.linkedin && <ContactLink href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`}><EditableText path="personal.linkedin" value={data.personal.linkedin} /></ContactLink>}
          {data.personal.github && <ContactLink href={data.personal.github.startsWith('http') ? data.personal.github : `https://${data.personal.github}`}><EditableText path="personal.github" value={data.personal.github} /></ContactLink>}
          {data.personal.portfolio && <ContactLink href={data.personal.portfolio.startsWith('http') ? data.personal.portfolio : `https://${data.personal.portfolio}`}><EditableText path="personal.portfolio" value={data.personal.portfolio} /></ContactLink>}
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        {data.sectionOrder.map(renderSection)}
      </div>
      <ResumeBranding />
    </div>
  );
}
