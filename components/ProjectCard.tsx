import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from './Icons';
import { Blueprint } from './Blueprint';
import { StorefrontArt } from './CoverArt';
import type { Project } from '@/lib/content';

export function ProjectCover({ p, priority = false }: { p: Project; priority?: boolean }) {
  return (
    <div className="cover" style={{ viewTransitionName: `project-${p.slug}` }}>
      {p.cover ? (
        <Image src={p.cover} alt="" width={1280} height={800} priority={priority} sizes="(min-width: 760px) 50vw, 100vw" />
      ) : p.coverArt === 'storefront' ? (
        <StorefrontArt title={p.title} />
      ) : (
        <Blueprint title={p.title} nodes={p.coverNodes} stats={p.coverStats} />
      )}
    </div>
  );
}

export function ProjectCard({
  p,
  index,
  readLabel,
  liveLabel,
  codeLabel,
}: {
  p: Project;
  index: number;
  readLabel: string;
  liveLabel: string;
  codeLabel: string;
}) {
  return (
    <article className={`card project-card sticky-card${index > 0 ? ' morph' : ''}`} style={{ '--i': index } as React.CSSProperties}>
      <ProjectCover p={p} priority={index === 0} />
      <p className="label meta">
        {[p.status || null, p.role, p.year].filter(Boolean).join(' · ')}
      </p>
      <h3 className="h3">{p.title}</h3>
      <p className="muted">{p.oneLiner}</p>
      <ul className="chips">
        {p.stack.map((s) => <li className="chip" key={s}>{s}</li>)}
      </ul>
      <div className="card-actions">
        <Link href={`/projects/${p.slug}`} className="btn btn-primary btn-sm">
          {readLabel} <ArrowRight className="nudge" size={16} />
        </Link>
        {p.liveUrl && (
          <a className="link" href={p.liveUrl} target="_blank" rel="noopener noreferrer">{liveLabel} <ArrowUpRight size={14} /></a>
        )}
        {p.codeUrl && (
          <a className="link" href={p.codeUrl} target="_blank" rel="noopener noreferrer">{codeLabel} <ArrowUpRight size={14} /></a>
        )}
      </div>
    </article>
  );
}
