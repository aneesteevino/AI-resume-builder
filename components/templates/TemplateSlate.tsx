import { ResumeData } from "../../utils/types";
import EditableText from "../EditableText";

export default function TemplateSlate({ data }: { data: ResumeData }) {
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Professional Summary
            </h2>
            <div className="text-[10px] text-gray-800 leading-snug">
              <EditableText path="summary" value={data.summary} multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={`experience.${i}.role`} value={exp.role} />
                      <span className="font-normal mx-1">–</span>
                      <EditableText path={`experience.${i}.company`} value={exp.company} />
                    </h3>
                    <span className="text-[9.5px] text-gray-800">
                      <EditableText path={`experience.${i}.startDate`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={`experience.${i}.endDate`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[9.5px] text-gray-600 mb-1">
                      <EditableText path={`experience.${i}.location`} value={exp.location} />
                    </div>
                  )}
                  <div className="text-[10px] text-gray-800 leading-snug pl-3 relative whitespace-pre-wrap">
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
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={`education.${i}.degree`} value={edu.degree} />
                      {' in '}
                      <EditableText path={`education.${i}.field`} value={edu.field} />
                    </h3>
                    <div className="text-[9.5px] text-gray-800">
                      <EditableText path={`education.${i}.institution`} value={edu.institution} />
                      {edu.gpa && <span className="ml-2">| CGPA: <EditableText path={`education.${i}.gpa`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span className="text-[9.5px] text-gray-800">
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
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="resume-entry">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={`projects.${i}.name`} value={proj.name} />
                      {proj.techStack && (
                        <span className="font-normal text-gray-600 ml-1">
                          – <EditableText path={`projects.${i}.techStack`} value={proj.techStack} />
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="text-[10px] text-gray-800 leading-snug pl-3 relative whitespace-pre-wrap">
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
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Skills
            </h2>
            <div className="text-[10px] text-gray-800 leading-snug flex flex-wrap gap-x-1.5 gap-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center">
                  <EditableText path={`skills.${i}`} value={skill} />
                  {i < data.skills.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4 resume-section">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px] mb-2 pb-0.5">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline resume-entry">
                  <div>
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={`certifications.${i}.name`} value={cert.name} />
                    </h3>
                    <div className="text-[9.5px] text-gray-800">
                      <EditableText path={`certifications.${i}.issuer`} value={cert.issuer} />
                    </div>
                  </div>
                  <span className="text-[9.5px] text-gray-800">
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

  const custom = data.customization || {
    fontFamily: 'Inter',
    primaryColor: '#6366f1',
    headingColor: '#312e81',
    textColor: '#1f2937',
    bgColor: '#ffffff',
  };

  return (
    <div className="p-8 bg-white text-black resume-custom-container" style={{ width: "100%", minHeight: "100%" }}>
      <style>{`
        .resume-custom-container {
          font-family: ${custom.fontFamily || 'Inter'}, sans-serif !important;
          background-color: ${custom.bgColor || '#ffffff'} !important;
          color: ${custom.textColor || '#1f2937'} !important;
        }
        .resume-custom-container h1,
        .resume-custom-container h2,
        .resume-custom-container .resume-section-heading {
          color: ${custom.headingColor || '#000000'} !important;
          border-color: ${custom.primaryColor || '#000000'} !important;
        }
        .resume-custom-container h3,
        .resume-custom-container .text-indigo-600,
        .resume-custom-container .text-blue-600 {
          color: ${custom.primaryColor || '#6366f1'} !important;
        }
        .resume-custom-container p,
        .resume-custom-container span,
        .resume-custom-container div,
        .resume-custom-container li {
          color: ${custom.textColor || '#1f2937'} !important;
        }
        .resume-custom-container .text-gray-400 {
          color: ${custom.primaryColor || '#9ca3af'} !important;
          opacity: 0.5;
        }
        .resume-custom-container .border-indigo-500,
        .resume-custom-container .border-blue-500,
        .resume-custom-container .border-black {
          border-color: ${custom.primaryColor || '#6366f1'} !important;
        }
      `}</style>
      {/* Header */}
      <div className={`mb-5 pb-4 border-b ${data.personal.photo ? "flex items-center gap-4 text-left" : "text-center"}`}>
        {data.personal.photo && (
          <img
            src={data.personal.photo}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 flex-shrink-0"
            style={{ borderColor: custom.primaryColor || "#6366f1" }}
          />
        )}
        <div className={data.personal.photo ? "flex-1" : ""}>
          <h1 className="text-[22px] font-bold uppercase tracking-wider mb-1.5">
            <EditableText path="personal.fullName" value={data.personal.fullName} />
          </h1>
          <div className={`text-[10px] text-gray-800 flex flex-wrap gap-x-2 gap-y-1 ${data.personal.photo ? "" : "justify-center"}`}>
            {data.personal.email && <span><EditableText path="personal.email" value={data.personal.email} /></span>}
            {data.personal.phone && <><span className="text-gray-400">|</span> <span><EditableText path="personal.phone" value={data.personal.phone} /></span></>}
            {data.personal.location && <><span className="text-gray-400">|</span> <span><EditableText path="personal.location" value={data.personal.location} /></span></>}
            {data.personal.linkedin && <><span className="text-gray-400">|</span> <span><EditableText path="personal.linkedin" value={data.personal.linkedin} /></span></>}
            {data.personal.github && <><span className="text-gray-400">|</span> <span><EditableText path="personal.github" value={data.personal.github} /></span></>}
          </div>
        </div>
      </div>
      
      {/* Sections */}
      {data.sectionOrder.map(renderSection)}
    </div>
  );
}
