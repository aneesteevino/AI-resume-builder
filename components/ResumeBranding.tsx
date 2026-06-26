/**
 * ResumeBranding — a small TDC watermark placed in the bottom-right corner of every resume.
 * The branding div uses `position: absolute` so it overlays the content without affecting layout.
 * The parent resume container must have `position: relative` for this to anchor correctly.
 */
export default function ResumeBranding() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        right: 12,
        display: 'flex',
        alignItems: 'center',
        opacity: 0.75,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <img
        src="/tdc-logo.png"
        alt="TDC Logo"
        style={{
          height: '16px',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
