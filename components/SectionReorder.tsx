import { useState } from 'react';
import { DragHandle } from './EditableText';

const SECTION_LABELS: Record<string, string> = {
  summary: '📄 Summary',
  experience: '💼 Experience',
  education: '🎓 Education',
  projects: '🗂 Projects',
  skills: '🔧 Skills',
  certifications: '🏆 Certifications',
};

interface Props {
  order: string[];
  onChange: (order: string[]) => void;
}

export default function SectionReorder({ order, onChange }: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...order];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-1">
      {order.map((section, idx) => (
        <div
          key={section}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-grab active:cursor-grabbing select-none"
          style={{
            background: overIdx === idx && dragIdx !== idx
              ? 'rgba(99,102,241,0.12)'
              : 'var(--bg-elevated)',
            borderColor: overIdx === idx && dragIdx !== idx
              ? '#6366f1'
              : 'var(--border)',
            color: 'var(--text-primary)',
            opacity: dragIdx === idx ? 0.4 : 1,
            transform: dragIdx === idx ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          <DragHandle color="var(--text-muted)" />
          {SECTION_LABELS[section] || section}
          <span className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {idx + 1}
          </span>
        </div>
      ))}
      <p className="text-[10px] pt-1 text-center" style={{ color: 'var(--text-muted)' }}>
        Drag to reorder resume sections
      </p>
    </div>
  );
}
