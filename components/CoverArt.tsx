/**
 * Screenshot-free cover illustrations (pure SVG, grayscale, theme-aware).
 * Placeholders that say something true about the project until real screenshots exist.
 */
const mono = 'var(--font-mono), ui-monospace, monospace';

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg className="cover-art" viewBox="0 0 640 400" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="hatch" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="11" stroke="var(--ink)" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="400" fill="var(--bg)" />
      <rect width="640" height="400" fill="url(#hatch)" />
      {children}
    </svg>
  );
}

export function StorefrontArt({ title }: { title: string }) {
  const tiles = [
    { code: 'HL-2041', x: 40 },
    { code: 'HL-2042', x: 232 },
    { code: 'HL-2043', x: 424 },
  ];
  return (
    <Frame label={`${title}: storefront wireframe`}>
      {/* window chrome */}
      <rect x="24" y="24" width="592" height="352" rx="14" fill="var(--surface)" stroke="var(--line)" />
      <circle cx="46" cy="46" r="4" fill="var(--line)" /><circle cx="60" cy="46" r="4" fill="var(--line)" /><circle cx="74" cy="46" r="4" fill="var(--line)" />
      {/* search by code */}
      <rect x="400" y="36" width="196" height="22" rx="11" fill="var(--bg)" stroke="var(--line)" />
      <text x="416" y="51" fontFamily={mono} fontSize="11" fill="var(--muted)">find by code: HL-2041</text>
      {/* hype banner */}
      <rect x="40" y="76" width="560" height="84" rx="10" fill="var(--bg)" stroke="var(--ink)" strokeOpacity="0.5" />
      <text x="60" y="104" fontFamily={mono} fontSize="11" fill="var(--muted)" letterSpacing="1.5">DROP 01 · COMING SOON</text>
      <text x="60" y="136" fontFamily="var(--font-geist), sans-serif" fontSize="26" fontWeight="600" fill="var(--ink)" letterSpacing="-1">The first collection, soon.</text>
      <rect x="500" y="100" width="80" height="34" rx="17" fill="var(--accent)" />
      <text x="540" y="121" textAnchor="middle" fontFamily="var(--font-geist), sans-serif" fontSize="12" fontWeight="500" fill="var(--on-accent)">Notify me</text>
      {/* product tiles */}
      {tiles.map((t) => (
        <g key={t.code}>
          <rect x={t.x} y="176" width="176" height="150" rx="10" fill="var(--bg)" stroke="var(--line)" />
          <path d={`M${t.x + 20} 300 q 28 -80 68 -80 q 40 0 68 80`} fill="none" stroke="var(--muted)" strokeOpacity="0.5" strokeWidth="1.5" />
          <rect x={t.x + 12} y="190" width="64" height="18" rx="9" fill="none" stroke="var(--ink)" strokeOpacity="0.6" />
          <text x={t.x + 44} y="203" textAnchor="middle" fontFamily={mono} fontSize="10" fill="var(--ink)">{t.code}</text>
          <rect x={t.x + 12} y="312" width="80" height="6" rx="3" fill="var(--line)" />
        </g>
      ))}
      {/* theme chips + flags */}
      <g fontFamily={mono} fontSize="10.5" fill="var(--muted)">
        <rect x="40" y="340" width="86" height="24" rx="12" fill="none" stroke="var(--line)" /><text x="83" y="356" textAnchor="middle">theme: eid</text>
        <rect x="136" y="340" width="96" height="24" rx="12" fill="none" stroke="var(--line)" /><text x="184" y="356" textAnchor="middle">flag: drop-01</text>
        <rect x="242" y="340" width="104" height="24" rx="12" fill="none" stroke="var(--line)" /><text x="294" y="356" textAnchor="middle">embroidery: on</text>
      </g>
    </Frame>
  );
}
