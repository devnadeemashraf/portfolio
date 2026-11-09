import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@/components/Icons';
import { ClosingCta } from '@/components/ClosingCta';
import { Toc } from '@/components/Toc';
import { ProjectCover } from '@/components/ProjectCard';
import { mdxComponents } from '@/components/mdx/Blocks';
import { getHome, getProfile, getProject, getProjects, getUi, headingsOf } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title}: case study`,
    description: p.oneLiner,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: p.title, description: p.oneLiner, type: 'article', url: `/projects/${slug}` },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const [project, projects, home, profile, ui] = await Promise.all([
    getProject(slug), getProjects(), getHome(), getProfile(), getUi(),
  ]);
  if (!project) notFound();

  const list = projects;
  const idx = list.findIndex((p) => p.slug === slug);
  const current = list[idx]!;
  const next = list.length > 1 ? list[(idx + 1) % list.length]! : null;
  const headings = headingsOf(project.source);

  return (
    <article>
      <div className="container page-head">
        <Link href="/projects" className="link back"><ArrowLeft size={15} /> All projects</Link>
        <p className="label">Case study · P{String(idx + 1).padStart(2, '0')}</p>
        <h1 className="display page-title">{project.title}</h1>
        <p className="lead page-lead">{project.oneLiner}</p>

        <dl className="meta-row">
          <div><dt className="label">Role</dt><dd>{project.role}</dd></div>
          <div><dt className="label">Timeline</dt><dd>{project.timeline}</dd></div>
          <div><dt className="label">Team</dt><dd>{project.team}</dd></div>
          <div><dt className="label">Stack</dt><dd>{project.stack.join(' · ')}</dd></div>
          <div>
            <dt className="label">Links</dt>
            <dd className="links">
              {project.liveUrl ? <a className="link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">{ui.liveLabel} <ArrowUpRight size={14} /></a> : <span className="muted">{project.status || 'Private'}</span>}
              {project.codeUrl && <a className="link" href={project.codeUrl} target="_blank" rel="noopener noreferrer">{ui.codeLabel} <ArrowUpRight size={14} /></a>}
            </dd>
          </div>
        </dl>

        <div className="hero-cover"><ProjectCover p={current} priority /></div>
      </div>

      <div className="container doc">
        <aside className="doc-side"><Toc headings={headings} /></aside>
        <div className="prose">
          <MDXRemote source={project.source} components={mdxComponents} options={{ blockJS: false }} />
        </div>
      </div>

      {next && next.slug !== slug && (
        <div className="container next-wrap">
          <Link href={`/projects/${next.slug}`} className="card next-card">
            <span>
              <span className="label">Next case study</span>
              <span className="h3 next-title">{next.title}</span>
            </span>
            <ArrowRight />
          </Link>
        </div>
      )}

      <ClosingCta
        headline={home.closingHeadline}
        lead={home.closingLead}
        bookUrl={profile.booking?.url ?? '#'}
        bookLabel={ui.bookCta}
        bookTitle={profile.booking?.title}
      />
    </article>
  );
}
