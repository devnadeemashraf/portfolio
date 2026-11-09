import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card (frames 16 and 17): grayscale, bright lead + dim tail, footer row. */
export function ogCard({
  eyebrow,
  bright,
  dim,
  name,
  monogram,
  right,
  rightPill = false,
  fontSize = 84,
}: {
  eyebrow: string;
  bright: string;
  dim: string;
  name: string;
  monogram: string;
  right: string;
  rightPill?: boolean;
  fontSize?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0A0A0A', color: '#F5F5F5',
          padding: '64px 80px', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, color: '#A3A3A3', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 28, fontSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3, flex: 1 }}>
          <span style={{ color: '#F5F5F5', marginRight: 22 }}>{bright}</span>
          <span style={{ color: '#383838' }}>{dim}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #262626', paddingTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: '#F5F5F5', color: '#0A0A0A', fontSize: 20, fontWeight: 700 }}>
              {monogram}
            </div>
            <span>{name}</span>
          </div>
          {rightPill ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 999, background: '#141414', border: '1px solid #262626', fontSize: 24 }}>
              <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 999, background: '#F5F5F5' }} />
              <span>{right}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 24, color: '#A3A3A3', fontFamily: 'monospace' }}>{right}</div>
          )}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** Splits a title so the last ~40% of words render dim, like the unread state. */
export function splitTitle(title: string) {
  const w = title.split(/\s+/);
  const k = Math.max(1, Math.round(w.length * 0.6));
  return { bright: w.slice(0, k).join(' '), dim: w.slice(k).join(' ') };
}
