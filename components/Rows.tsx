import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight } from './Icons';

/** The shared index layout (build logs, projects, work, about): one featured card, then quiet rows. */

export function FeaturedCard({
  cover,
  coverLabel,
  coverTitle,
  chip,
  meta,
  title,
  href,
  text,
  children,
}: {
  cover?: ReactNode;
  coverLabel?: string;
  coverTitle?: string;
  chip?: string;
  meta?: string;
  title: string;
  href?: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <article className="card featured-log">
      {cover ?? (
        <div className="featured-cover" aria-hidden="true">
          <span className="mono">{coverLabel}</span>
          <strong>{coverTitle}</strong>
        </div>
      )}
      <div className="featured-body">
        <p className="label">{chip && <span className="chip inline">{chip}</span>} {meta}</p>
        <h2 className="h2 sm-h2">{href ? <Link href={href} className="stretch">{title}</Link> : title}</h2>
        <p className="lead">{text}</p>
        {children}
      </div>
    </article>
  );
}

export type RowItem = { key: string; href?: string; kind: string; title: string; text: string; chip?: string };

export function Rows({ label, items }: { label: string; items: RowItem[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <p className="label earlier">{label}</p>
      <ul className="log-rows">
        {items.map((r) => {
          const inner = (
            <>
              <span className="mono muted when">{r.kind}</span>
              <span className="log-row-main">
                <strong>{r.title}</strong>
                <span className="muted">{r.text}</span>
              </span>
              <span />
              <span className="chips">{r.chip && <span className="chip">{r.chip}</span>}</span>
              {r.href ? <ArrowUpRight size={16} className="muted" /> : <span />}
            </>
          );
          return (
            <li key={r.key}>
              {r.href ? <Link href={r.href} className="log-row">{inner}</Link> : <div className="log-row">{inner}</div>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
