import type { Metadata } from 'next';
import { ClosingCta } from '@/components/ClosingCta';
import { ProjectsIndex } from '@/components/ProjectsIndex';
import { getHome, getProfile, getProjects, getTools, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Side projects I built on my own time: a commerce platform and open-source tools, with the code to read.',
  alternates: { canonical: '/projects' },
};

export default async function ProjectsPage() {
  const [projects, tools, home, profile, ui] = await Promise.all([getProjects(), getTools(), getHome(), getProfile(), getUi()]);

  return (
    <>
      <div className="container page-head">
        <p className="label">{home.projects.label}</p>
        <h1 className="display page-title">Projects</h1>
        <p className="lead page-lead">These are side projects, built on my own time. Each one has a write-up, and the open-source ones link straight to the code.</p>
        <ProjectsIndex projects={projects} tools={tools.filter((t) => t.origin === 'side')} readLabel={ui.readCaseStudy} />
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
