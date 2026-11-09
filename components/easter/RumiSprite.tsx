import type { CSSProperties } from 'react';

/**
 * Rumi, the Siamese: cream body, dark points (ears, mask, paws, tail).
 * Pixel art defined as strings and rendered as merged SVG rects, so no image assets.
 * Colours come from --rumi-* so he stays grayscale and readable in both themes.
 */

const SIT = [
  'P..........P',
  'PP........PP',
  'PBPBBBBBBPBP',
  'BBBEEBBEEBBB',
  'BBBEKBBKEBBB',
  'BBBPPNNPPBBB',
  '.BBBPPPPBBB.',
  '..BBBBBBBB..',
  '..BBBBBBBB..',
  '.BBBBBBBBBB.',
  '.BBBBBBBBBB.',
  '.BBPBBBBPBB.',
  '.PPPBBBBPPP.',
  'PPPP........',
];

const WALK_A = [
  '............P...P',
  '............PPPPP',
  'P...BBBBBBB.PBEBP',
  'PP.BBBBBBBBBBBPPP',
  '.PPBBBBBBBBBBBBPN',
  '...BBBBBBBBBBBBB.',
  '...BBBBBBBBBBBB..',
  '...PB.......BP...',
  '...PP.......PP...',
  '...P.........P...',
];

const WALK_B = [
  ...WALK_A.slice(0, 7),
  '..PB.........PB..',
  '..PP.........PP..',
  '.PP...........PP.',
];

const COLORS: Record<string, string> = {
  B: 'var(--rumi-body)',
  P: 'var(--rumi-points)',
  E: 'var(--rumi-eye)',
  K: 'var(--rumi-points)',
  N: 'var(--rumi-nose)',
};

function Pixels({ rows, px }: { rows: string[]; px: number }) {
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x]!;
      if (c === '.') { x++; continue; }
      let w = 1;
      while (row[x + w] === c) w++;
      rects.push(<rect key={`${x}-${y}`} x={x * px} y={y * px} width={w * px} height={px} fill={COLORS[c]} />);
      x += w;
    }
  });
  return <>{rects}</>;
}

export function RumiSprite({
  pose = 'sit',
  px = 4,
  flip = false,
  className = '',
  style,
}: {
  pose?: 'sit' | 'walk';
  px?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const rows = pose === 'sit' ? SIT : WALK_A;
  const w = rows[0]!.length * px;
  const h = rows.length * px;
  return (
    <svg
      className={`rumi-sprite ${className}`.trim()}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
    >
      {pose === 'sit' ? (
        <Pixels rows={SIT} px={px} />
      ) : (
        <>
          <g className="f1"><Pixels rows={WALK_A} px={px} /></g>
          <g className="f2"><Pixels rows={WALK_B} px={px} /></g>
        </>
      )}
    </svg>
  );
}

export function Paw({ px = 3 }: { px?: number }) {
  const rows = ['.P.P.', '.....', 'P.P.P', '.PPP.', '.PPP.'].map((r) => r.replace(/P/g, 'P'));
  return (
    <svg width={5 * px} height={5 * px} viewBox={`0 0 ${5 * px} ${5 * px}`} shapeRendering="crispEdges" aria-hidden="true">
      <Pixels rows={rows} px={px} />
    </svg>
  );
}
