import type { CSSProperties } from 'react';

/**
 * Rumi, the Siamese: cream body, seal-brown points (ears, mask, paws, tail), blue eyes.
 * Pixel art defined as strings and rendered as merged SVG rects, so there are no image assets.
 * Colours come from --rumi-* (he is the one splash of colour on an otherwise grayscale site).
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

// Happy (being petted): eyes closed into little arcs
const HAPPY = SIT.map((r, i) => (i === 3 ? 'BBBHHBBHHBBB' : i === 4 ? 'BBBBBBBBBBBB' : r));

const SLEEP = [
  '..........P.P.',
  '..BBBBBB.PPPPP',
  '.BBBBBBBBBPHPP',
  'BBBBBBBBBBBBPN',
  'PBBBBBBBBBBBBB',
  'PPPBBBBBBBPPPP',
  '.PPPPPP.......',
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
  K: 'var(--rumi-pupil)',
  H: 'var(--rumi-pupil)',
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

export type RumiPose = 'sit' | 'walk' | 'sleep' | 'happy';

export function RumiSprite({
  pose = 'sit',
  px = 4,
  flip = false,
  className = '',
  style,
}: {
  pose?: RumiPose;
  px?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const rows = pose === 'walk' ? WALK_A : pose === 'sleep' ? SLEEP : pose === 'happy' ? HAPPY : SIT;
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
      {pose === 'walk' ? (
        <>
          <g className="f1"><Pixels rows={WALK_A} px={px} /></g>
          <g className="f2"><Pixels rows={WALK_B} px={px} /></g>
        </>
      ) : (
        <Pixels rows={rows} px={px} />
      )}
    </svg>
  );
}

export function Paw({ px = 3 }: { px?: number }) {
  const rows = ['P.P.P', '.PPP.', 'PPPPP', '.PPP.', '.....'];
  return (
    <svg width={5 * px} height={5 * px} viewBox={`0 0 ${5 * px} ${5 * px}`} shapeRendering="crispEdges" aria-hidden="true">
      <Pixels rows={rows} px={px} />
    </svg>
  );
}
