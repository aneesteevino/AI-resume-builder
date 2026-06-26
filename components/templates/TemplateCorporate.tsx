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

export default function TemplateCorporate({ data }: { data: ResumeData }) {
  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#0f4c81',
    headingColor: '#0f4c81',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  const sectionHeading = (label: string) => (
    <h2 style={{
      fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
      color: '#ffffff', backgroundColor: custom.primaryColor || '#0f4c81',
      padding: '3px 8px', marginBottom: '8px'
    }}>
      {label}
    </h2>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            {sectionHeading('Professional Summary')}
            <div style={{ fontSize: '10px', lineHeight: 1.6, paddingLeft: '4px' }}>
              <EditableText path="summary" value={data.summary} multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            {sectionHeading('Work Experience')}
            <div className="space-y-3" style={{ paddingLeft: '4px' }}>
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#0f4c81' }}>
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                    </h3>
                    <span style={{ fontSize: '9px', color: custom.primaryColor || '#0f4c81', fontWeight: 600 }}>
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  <div style={{ fontSize: '9.5px', fontWeight: 600, color: custom.textColor || '#374151', marginBottom: '3px' }}>
                    <EditableText path={`experience.${i}.company`} value={exp.company} />
                    {exp.location && <span style={{ fontWeight: 400, opacity: 0.7 }}> • <EditableText path={`experience.${i}.location`} value={exp.location} /></span>}
                  </div>
                  <div style={{ fontSize: '10px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
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
            {sectionHeading('Education')}
            <div className="space-y-2" style={{ paddingLeft: '4px' }}>
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-start resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#0f4c81' }}>
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                    </h3>
                    <div style={{ fontSize: '9.5px', color: custom.textColor || '#374151' }}>
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />{' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                      {edu.gpa && <span style={{ opacity: 0.7 }}> | GPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '9px', color: custom.primaryColor || '#0f4c81', fontWeight: 600 }}>
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
            {sectionHeading('Projects')}
            <div className="space-y-3" style={{ paddingLeft: '4px' }}>
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry">
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#0f4c81' }}>
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                    </h3>
                    <div style={{ fontSize: '9px' }} className="flex gap-2">
                      {proj.githubUrl && <ContactLink href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>GitHub ↗</span></ContactLink>}
                      {proj.liveUrl && <ContactLink href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`}><span style={{ color: custom.primaryColor, textDecoration: 'underline' }}>Live ↗</span></ContactLink>}
                    </div>
                  </div>
                  {proj.techStack && <div style={{ fontSize: '9px', color: custom.primaryColor || '#0f4c81', marginBottom: '2px' }}><EditableText path={`projects.${i}.techStack`} value={proj.techStack} /></div>}
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
            {sectionHeading('Skills')}
            <div style={{ paddingLeft: '4px', fontSize: '10px', display: 'flex', flexWrap: 'wrap' as const, gap: '4px 8px' }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{ backgroundColor: `${custom.primaryColor}18`, color: custom.headingColor || '#0f4c81', padding: '1px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 500 }}>
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
            {sectionHeading('Certifications')}
            <div className="space-y-2" style={{ paddingLeft: '4px' }}>
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 700, color: custom.headingColor || '#0f4c81' }}>
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
      {/* Corporate header: full-width solid colored band */}
      <div style={{ backgroundColor: custom.primaryColor || '#0f4c81', padding: '20px 32px 16px' }}>
        {data.personal.photo && (
          <img src={data.personal.photo} alt="Profile"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', float: 'right', marginTop: 4 }} />
        )}
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '4px' }}>
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: '10px', letterSpacing: '0.05em' }}>
            <EditableText path="personal.title" value={data.personal.title} />
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 16px', fontSize: '9.5px', color: 'rgba(255,255,255,0.85)' }}>
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
