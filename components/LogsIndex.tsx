'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from './Icons';
import { track } from './analytics/track';

type L = { slug: string; title: string; summary: string; tags: string[]; date: string | null; minutes: number };

function fmt(d: string | null) {
  if (!d) return '';
  return new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function LogsIndex({ logs, tags }: { logs: L[]; tags: string[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? logs.filter((l) => l.tags.includes(tag)) : logs;
  const [latest, ...rest] = shown;
  const choose = (t: string | null) => {
    setTag(t);
    track('log_filter', { tag: t ?? 'all' });
  };

  return (
    <div>
      <div className="filters" role="group" aria-label="Filter by tag">
        <button type="button" className="filter" aria-pressed={tag === null} onClick={() => choose(null)}>All</button>
        {tags.map((t) => (
          <button type="button" key={t} className="filter" aria-pressed={tag === t} onClick={() => choose(t)}>{t}</button>
        ))}
      </div>

      <div className="fade-list" key={tag ?? 'all'}>
        {latest && (
          <article className="card featured-log">
            <div className="featured-cover" aria-hidden="true" style={{ viewTransitionName: `post-${latest.slug}` }}>
              <span className="mono">{latest.tags[0] ?? 'build log'}</span>
              <strong>{latest.title}</strong>
            </div>
            <div className="featured-body">
              <p className="label"><span className="chip inline">Latest</span> {fmt(latest.date)} · {latest.minutes} min read</p>
              <h2 className="h2 sm-h2">
                <Link href={`/logs/${latest.slug}`} className="stretch">{latest.title}</Link>
              </h2>
              <p className="lead">{latest.summary}</p>
              <span className="link">Read the build log <ArrowRight size={16} /></span>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <>
            <p className="label earlier">Earlier</p>
            <ul className="log-rows">
              {rest.map((l) => (
                <li key={l.slug}>
                  <Link href={`/logs/${l.slug}`} className="log-row">
                    <span className="mono muted when">{fmt(l.date)}</span>
                    <span className="log-row-main">
                      <strong>{l.title}</strong>
                      <span className="muted">{l.summary}</span>
                    </span>
                    <span className="mono muted mins">{l.minutes} min</span>
                    <span className="chips">{l.tags.slice(0, 1).map((t) => <span className="chip" key={t}>{t}</span>)}</span>
                    <ArrowUpRight size={16} className="muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {shown.length === 0 && <p className="muted">Nothing here yet.</p>}
      </div>
    </div>
  );
}
