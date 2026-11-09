import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from './Icons';
import type { Tool } from '@/lib/content';

/** A repo I've published. Reads on-site first, GitHub one click away. */
export function ToolCard({ t, index = 0 }: { t: Tool; index?: number }) {
  return (
    <article className={`card tool-card sticky-card${index > 0 ? ' morph' : ''}`} style={{ '--i': index } as React.CSSProperties}>
      <p className="label">{t.kind} · {t.status}</p>
      <h3 className="h3 mono">{t.title}</h3>
      <p className="muted">{t.tagline}</p>
      <ul className="chips">
        {t.stack.map((s) => <li className="chip" key={s}>{s}</li>)}
      </ul>
      <div className="card-actions">
        <Link href={`/open-source/${t.slug}`} className="btn btn-primary btn-sm">
          Read about {t.title} <ArrowRight className="nudge" size={16} />
        </Link>
        {t.repoUrl && (
          <a className="link" href={t.repoUrl} target="_blank" rel="noopener noreferrer" data-track="outbound" data-label={`repo:${t.slug}`}>
            GitHub <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
