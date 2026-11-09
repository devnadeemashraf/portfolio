import type { CSSProperties, ElementType } from 'react';

/**
 * Splits a plain sentence into word spans carrying --p0/--p1 (0..1 slice of the fill).
 * Words stay in DOM order and the element is not aria-hidden, so screen readers read a normal sentence.
 */
export function Statement({
  text,
  as: Tag = 'h2',
  className = '',
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const words = text.trim().split(/\s+/);
  const n = words.length;
  return (
    <Tag className={`stmt ${className}`.trim()}>
      {words.map((w, i) => (
        <span
          key={i}
          className="w"
          style={{ '--p0': (i / n).toFixed(4), '--p1': ((i + 1) / n).toFixed(4) } as CSSProperties}
        >
          {w}
          {i < n - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
