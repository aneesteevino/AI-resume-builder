import { createContext, useContext, useEffect, useRef } from 'react';

// ── Context shared by all templates ───────────────────────────────────────
export const ResumeEditContext = createContext<
  ((path: string, value: string) => void) | undefined
>(undefined);

// ── DragHandle SVG (no library dependency) ────────────────────────────────
export function DragHandle({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill={color} style={{ flexShrink: 0 }}>
      <circle cx="3.5" cy="3" r="1.2" />
      <circle cx="8.5" cy="3" r="1.2" />
      <circle cx="3.5" cy="6" r="1.2" />
      <circle cx="8.5" cy="6" r="1.2" />
      <circle cx="3.5" cy="9" r="1.2" />
      <circle cx="8.5" cy="9" r="1.2" />
    </svg>
  );
}

// ── EditableText ───────────────────────────────────────────────────────────
interface EditableTextProps {
  path: string;
  value: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

export default function EditableText({
  path,
  value,
  as: Tag = 'span',
  className,
  style,
  multiline = false,
}: EditableTextProps) {
  const onEdit = useContext(ResumeEditContext);
  const ref = useRef<HTMLElement | null>(null);
  const isEditing = useRef(false);

  // Sync external value changes (AI regen, form update)
  useEffect(() => {
    if (ref.current && !isEditing.current) {
      if (multiline) {
        ref.current.innerHTML = (value || '').replace(/\n/g, '<br>');
      } else {
        ref.current.innerText = value || '';
      }
    }
  }, [value, multiline]);

  // ── Print / non-edit mode ───────────────────────────────────────────────
  if (!onEdit) {
    const PrintTag = Tag as keyof JSX.IntrinsicElements;
    const El = PrintTag as React.ElementType;
    return <El className={className} style={style}>{value}</El>;
  }

  // ── Editable mode — use a span/div with a properly typed ref ────────────
  // We use span for inline and div for multiline to avoid dynamic tag + ref
  // TypeScript incompatibility. Display is controlled via style.
  const EditEl = multiline ? 'div' : 'span';

  return (
    <EditEl
      ref={(el: HTMLSpanElement | HTMLDivElement | null) => {
        ref.current = el;
        if (el) {
          if (multiline) {
            el.innerHTML = (value || '').replace(/\n/g, '<br>');
          } else {
            el.innerText = value || '';
          }
        }
      }}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={{
        ...style,
        outline: 'none',
        cursor: 'text',
        borderRadius: '2px',
        transition: 'background 0.15s, box-shadow 0.15s',
        display: multiline ? 'block' : 'inline',
        wordBreak: 'break-word',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        if (!isEditing.current) {
          e.currentTarget.style.background = 'rgba(99,102,241,0.07)';
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        if (!isEditing.current) {
          e.currentTarget.style.background = '';
        }
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        isEditing.current = true;
        e.currentTarget.style.background = 'rgba(99,102,241,0.09)';
        e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(99,102,241,0.45)';
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isEditing.current = false;
        const el = e.currentTarget;
        el.style.background = '';
        el.style.boxShadow = 'none';
        const newVal = multiline
          ? el.innerText
          : el.innerText.replace(/\n/g, ' ').trim();
        if (newVal !== value) onEdit(path, newVal);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === 'Escape') e.currentTarget.blur();
      }}
    />
  );
}
