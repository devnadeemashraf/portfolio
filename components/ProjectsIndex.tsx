import { ArrowRight } from './Icons';
import { ProjectCover } from './ProjectCard';
import { FeaturedCard, Rows } from './Rows';
import type { Project, Tool } from '@/lib/content';

/** Projects in the same layout as the build logs: one featured card, then quiet rows. */
export function ProjectsIndex({ projects, tools, readLabel }: { projects: Project[]; tools: Tool[]; readLabel: string }) {
  const [featured, ...more] = projects;
  return (
    <div>
      {featured && (
        <FeaturedCard
          cover={<ProjectCover p={featured} priority />}
          chip="Featured"
          meta={[featured.status, featured.year].filter(Boolean).join(' · ')}
          title={featured.title}
          href={`/projects/${featured.slug}`}
          text={featured.oneLiner}
        >
          <span className="link">{readLabel} <ArrowRight size={16} /></span>
        </FeaturedCard>
      )}
      <Rows
        label="Open source"
        items={[
          ...more.map((p) => ({ key: p.slug, href: `/projects/${p.slug}`, kind: p.status || 'Project', title: p.title, text: p.oneLiner, chip: p.stack[0] })),
          ...tools.map((t) => ({ key: t.slug, href: `/open-source/${t.slug}`, kind: t.kind, title: t.title, text: t.tagline, chip: t.stack[0] })),
        ]}
      />
    </div>
  );
}
