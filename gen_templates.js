const fs = require('fs');
const path = require('path');

const templates = [
  { name: 'TemplateMeridian', type: 'ATS (Single Col, Serif)' },
  { name: 'TemplateClassic', type: 'ATS (Single Col, Sans)' },
  { name: 'TemplateCorporate', type: 'ATS (Single Col, Compact)' },
  { name: 'TemplateApex', type: 'Modern (Bold Header)' },
  { name: 'TemplateNova', type: 'Modern (Teal Accent)' },
  { name: 'TemplateSlate', type: 'Modern (Editorial)' },
  { name: 'TemplateCarbon', type: 'Hybrid (Monochrome)' },
  { name: 'TemplatePrism', type: 'Hybrid (Gradient)' },
];

const generateContent = (name, type) => `import { ResumeData } from "../../utils/types";
import EditableText from "../EditableText";

export default function ${name}({ data }: { data: ResumeData }) {
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
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
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={\`experience.\${i}.role\`} value={exp.role} />
                      <span className="font-normal mx-1">–</span>
                      <EditableText path={\`experience.\${i}.company\`} value={exp.company} />
                    </h3>
                    <span className="text-[9.5px] text-gray-800">
                      <EditableText path={\`experience.\${i}.startDate\`} value={exp.startDate} />
                      {' – '}
                      <EditableText path={\`experience.\${i}.endDate\`} value={exp.isCurrent ? 'Present' : exp.endDate} />
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[9.5px] text-gray-600 mb-1">
                      <EditableText path={\`experience.\${i}.location\`} value={exp.location} />
                    </div>
                  )}
                  <div className="text-[10px] text-gray-800 leading-snug pl-3 relative whitespace-pre-wrap">
                    <EditableText path={\`experience.\${i}.responsibilities\`} value={exp.responsibilities} multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education.length) return null;
        return (
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={\`education.\${i}.degree\`} value={edu.degree} />
                      {' in '}
                      <EditableText path={\`education.\${i}.field\`} value={edu.field} />
                    </h3>
                    <div className="text-[9.5px] text-gray-800">
                      <EditableText path={\`education.\${i}.institution\`} value={edu.institution} />
                      {edu.gpa && <span className="ml-2">| CGPA: <EditableText path={\`education.\${i}.gpa\`} value={edu.gpa} /></span>}
                    </div>
                  </div>
                  <span className="text-[9.5px] text-gray-800">
                    <EditableText path={\`education.\${i}.startDate\`} value={edu.startDate} />
                    {' – '}
                    <EditableText path={\`education.\${i}.endDate\`} value={edu.isCurrent ? 'Present' : edu.endDate} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects.length) return null;
        return (
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={\`projects.\${i}.name\`} value={proj.name} />
                      {proj.techStack && (
                        <span className="font-normal text-gray-600 ml-1">
                          – <EditableText path={\`projects.\${i}.techStack\`} value={proj.techStack} />
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="text-[10px] text-gray-800 leading-snug pl-3 relative whitespace-pre-wrap">
                    <EditableText path={\`projects.\${i}.description\`} value={proj.description} multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills.length) return null;
        return (
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
              Technical Skills
            </h2>
            <div className="text-[10px] text-gray-800 leading-snug flex flex-wrap gap-x-1.5 gap-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center">
                  <EditableText path={\`skills.\${i}\`} value={skill} />
                  {i < data.skills.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications.length) return null;
        return (
          <div key={id} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-black mb-2 pb-0.5">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[10.5px] font-bold text-black">
                      <EditableText path={\`certifications.\${i}.name\`} value={cert.name} />
                    </h3>
                    <div className="text-[9.5px] text-gray-800">
                      <EditableText path={\`certifications.\${i}.issuer\`} value={cert.issuer} />
                    </div>
                  </div>
                  <span className="text-[9.5px] text-gray-800">
                    <EditableText path={\`certifications.\${i}.issueDate\`} value={cert.issueDate} />
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
    <div className="p-8 bg-white text-black ${type.includes('Serif') ? 'font-serif' : 'font-sans'}" style={{ width: "100%", minHeight: "100%" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-[22px] font-bold uppercase tracking-wider mb-1.5">
          <EditableText path="personal.fullName" value={data.personal.fullName} />
        </h1>
        <div className="text-[10px] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {data.personal.email && <span><EditableText path="personal.email" value={data.personal.email} /></span>}
          {data.personal.phone && <><span className="text-gray-400">|</span> <span><EditableText path="personal.phone" value={data.personal.phone} /></span></>}
          {data.personal.location && <><span className="text-gray-400">|</span> <span><EditableText path="personal.location" value={data.personal.location} /></span></>}
          {data.personal.linkedin && <><span className="text-gray-400">|</span> <span><EditableText path="personal.linkedin" value={data.personal.linkedin} /></span></>}
          {data.personal.github && <><span className="text-gray-400">|</span> <span><EditableText path="personal.github" value={data.personal.github} /></span></>}
        </div>
      </div>
      
      {/* Sections */}
      {data.sectionOrder.map(renderSection)}
    </div>
  );
}
`;

templates.forEach(t => {
  let content = generateContent(t.name, t.type);
  
  if (t.type.includes('Modern')) {
    content = content.replace(/border-b border-black/g, 'text-indigo-600 mb-3 tracking-[0.2em] font-semibold text-[10px]');
    content = content.replace(/font-serif\|font-sans/g, 'font-sans');
    if (t.name === 'TemplateApex') {
       content = content.replace(/<div className="text-center mb-5">/g, '<div className="text-center mb-6 pb-5 border-b-2 border-indigo-500">');
       content = content.replace(/text-\\[22px\\]/g, 'text-[28px] text-indigo-900 tracking-tight normal-case');
    }
  } else if (t.type.includes('Hybrid')) {
    content = content.replace(/font-serif\|font-sans/g, 'font-sans');
    if (t.name === 'TemplatePrism') {
       content = content.replace(/<div className="text-center mb-5">/g, '<div className="mb-6 p-6 rounded-2xl text-white" style={{background: "linear-gradient(135deg, #3b82f6, #8b5cf6)"}}>\n        <h1 className="text-[26px] font-bold mb-2 text-white normal-case">\n          <EditableText path="personal.fullName" value={data.personal.fullName} />\n        </h1>\n        <div className="text-[11px] text-white/90 flex flex-wrap gap-x-3 gap-y-1">');
       content = content.replace(/border-b border-black/g, 'border-b-2 border-blue-500/20 text-blue-600 normal-case tracking-wider');
       content = content.split('<span className="text-gray-400">|</span>').join('<span className="text-white/40">•</span>');
       content = content.replace(/text-gray-800/g, 'text-gray-600');
    }
    if (t.name === 'TemplateCarbon') {
       content = content.replace(/<div className="text-center mb-5">/g, '<div className="mb-8 border-l-4 border-gray-900 pl-4 text-left">');
       content = content.replace(/justify-center/g, 'justify-start');
       content = content.replace(/border-b border-black/g, 'border-b border-gray-200 text-gray-900 normal-case tracking-wide font-semibold mb-3');
       content = content.replace(/text-\\[22px\\]/g, 'text-[24px] normal-case text-gray-900');
    }
  }
  fs.writeFileSync(path.join(__dirname, 'components', 'templates', t.name + '.tsx'), content);
});
console.log("Created 8 templates");
