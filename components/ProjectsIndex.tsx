import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from './Icons';
import { ProjectCover } from './ProjectCard';
import type { Project, Tool } from '@/lib/content';

/** Projects in the same layout as the build logs: one featured card, then quiet rows. */
export function ProjectsIndex({ projects, tools, readLabel }: { projects: Project[]; tools: Tool[]; readLabel: string }) {
  const [featured, ...moreProjects] = projects;
  const rows = [
    ...moreProjects.map((p) => ({ href: `/projects/${p.slug}`, kind: p.status || 'Project', title: p.title, text: p.oneLiner, chip: p.stack[0] })),
    ...tools.map((t) => ({ href: `/open-source/${t.slug}`, kind: t.kind, title: t.title, text: t.tagline, chip: t.stack[0] })),
  ];

  return (
    <div>
      {featured && (
        <article className="card featured-log">
          <ProjectCover p={featured} priority />
          <div className="featured-body">
            <p className="label"><span className="chip inline">Featured</span> {[featured.status, featured.year].filter(Boolean).join(' · ')}</p>
            <h2 className="h2 sm-h2">
              <Link href={`/projects/${featured.slug}`} className="stretch">{featured.title}</Link>
            </h2>
            <p className="lead">{featured.oneLiner}</p>
            <span className="link">{readLabel} <ArrowRight size={16} /></span>
          </div>
        </article>
      )}

      {rows.length > 0 && (
        <>
          <p className="label earlier">Open source</p>
          <ul className="log-rows">
            {rows.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="log-row">
                  <span className="mono muted when">{r.kind}</span>
                  <span className="log-row-main">
                    <strong>{r.title}</strong>
                    <span className="muted">{r.text}</span>
                  </span>
                  <span />
                  <span className="chips">{r.chip && <span className="chip">{r.chip}</span>}</span>
                  <ArrowUpRight size={16} className="muted" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
