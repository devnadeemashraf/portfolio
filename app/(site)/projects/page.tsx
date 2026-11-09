import type { Metadata } from 'next';
import { ClosingCta } from '@/components/ClosingCta';
import { PageHead } from '@/components/PageHead';
import { ProjectCard } from '@/components/ProjectCard';
import { ToolCard } from '@/components/ToolCard';
import { getHome, getProfile, getProjects, getTools, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Side projects I built on my own time: a commerce platform and open-source tools, with the code to read.',
  alternates: { canonical: '/projects' },
};

export default async function ProjectsPage() {
  const [projects, tools, home, profile, ui] = await Promise.all([getProjects(), getTools(), getHome(), getProfile(), getUi()]);
  const side = tools.filter((t) => t.origin === 'side');

  return (
    <>
      <PageHead
        label={home.projects.label}
        title="Projects"
        lead="These are side projects, built on my own time. Each one has a write-up, and the open-source ones link straight to the code."
      />
      <div className="container page-body">
        <div className="flow">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} readLabel={ui.readCaseStudy} liveLabel={ui.liveLabel} codeLabel={ui.codeLabel} />
          ))}
          {side.length > 0 && <p className="label flow-label">Open source</p>}
          <div className="oss">
            {side.map((t, i) => <ToolCard key={t.slug} t={t} index={i + projects.length} />)}
          </div>
        </div>
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
