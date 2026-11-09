import type { CSSProperties } from 'react';

/**
 * Screenshot-free cover: a hatched "blueprint" panel that draws the project's architecture
 * nodes as a flow, with headline stats along the bottom. Used when a project has no image.
 */
export function Blueprint({
  title,
  nodes,
  stats,
  className = '',
}: {
  title: string;
  nodes: readonly string[];
  stats: readonly { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`bp ${className}`.trim()} role="img" aria-label={`${title}: ${nodes.join(', ')}`}>
      <p className="bp-tag mono">blueprint · {title}</p>
      <ol className="bp-flow" aria-hidden="true">
        {nodes.map((n, i) => (
          <li key={n} style={{ '--i': i } as CSSProperties}>
            <span>{n}</span>
          </li>
        ))}
      </ol>
      {stats.length > 0 && (
        <ul className="bp-stats" aria-hidden="true">
          {stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span className="mono">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
