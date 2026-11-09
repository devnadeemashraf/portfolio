import type { ReactNode } from 'react';
import Image from 'next/image';
import { CopyCode } from './CopyCode';
import { slugify } from '@/lib/content';

export function Decision({ chose, because, tradeoff }: { chose: string; because: string; tradeoff: string }) {
  return (
    <aside className="decision" aria-label="Decision">
      <span className="decision-tag">Decision</span>
      <dl>
        <div><dt className="label">Chose</dt><dd className="chose">{chose}</dd></div>
        <div><dt className="label">Because</dt><dd>{because}</dd></div>
        <div><dt className="label">Trade-off</dt><dd>{tradeoff}</dd></div>
      </dl>
    </aside>
  );
}

export function Code({ filename, code }: { filename?: string; code: string }) {
  return (
    <figure className="codeblock">
      <figcaption>
        <span className="mono">{filename || 'code'}</span>
        <CopyCode code={code} />
      </figcaption>
      <pre tabIndex={0}><code>{code}</code></pre>
    </figure>
  );
}

export function Figure({ src, alt, caption }: { src?: string; alt?: string; caption?: string }) {
  return (
    <figure className="figure">
      {src ? (
        <Image src={src} alt={alt ?? ''} width={1600} height={900} sizes="(min-width: 1000px) 720px, 100vw" />
      ) : (
        <div className="figure-ph mono" role="img" aria-label={alt || caption || 'Figure placeholder'}>
          {caption || alt || 'figure'}
        </div>
      )}
      {caption && <figcaption className="mono">{caption}</figcaption>}
    </figure>
  );
}

export function Metrics({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="metrics">
      {items.map((m) => (
        <li key={m.value + m.label}>
          <strong>{m.value}</strong>
          <span>{m.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Flow({ nodes, caption }: { nodes: { title: string; note?: string; highlight?: boolean }[]; caption?: string }) {
  return (
    <figure className="flowfig">
      <ol>
        {nodes.map((n, i) => (
          <li key={n.title} data-hl={n.highlight ? 'true' : undefined}>
            <strong>{n.title}</strong>
            {n.note && <span className="mono">{n.note}</span>}
            {i < nodes.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mono">{caption}</figcaption>}
    </figure>
  );
}

function textOf(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(textOf).join('');
  return '';
}

export const mdxComponents = {
  h2: ({ children }: { children?: ReactNode }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  Decision,
  Code,
  Figure,
  Metrics,
  Flow,
};
