import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowUpRight } from '@/components/Icons';
import { ClosingCta } from '@/components/ClosingCta';
import { mdxComponents } from '@/components/mdx/Blocks';
import { getHome, getProfile, getTool, getTools, getUi } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getTools()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTool(slug);
  if (!t) return {};
  return {
    title: `${t.title}: open source`,
    description: t.tagline,
    alternates: { canonical: `/open-source/${slug}` },
    openGraph: { title: t.title, description: t.tagline, url: `/open-source/${slug}` },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const [tool, home, profile, ui] = await Promise.all([getTool(slug), getHome(), getProfile(), getUi()]);
  if (!tool) notFound();

  return (
    <article>
      <div className="container page-head">
        <Link href={tool.origin === 'work' ? '/work' : '/projects'} className="link back"><ArrowLeft size={15} /> {tool.origin === 'work' ? 'Work' : 'Projects'}</Link>
        <p className="label">{tool.kind}</p>
        <h1 className="display page-title tool-title">{tool.title}</h1>
        <p className="lead page-lead">{tool.tagline}</p>

        <dl className="meta-row">
          <div><dt className="label">Status</dt><dd>{tool.status}</dd></div>
          <div><dt className="label">Stack</dt><dd>{tool.stack.join(' · ')}</dd></div>
          <div>
            <dt className="label">Links</dt>
            <dd className="links">
              {tool.repoUrl && <a className="link" href={tool.repoUrl} target="_blank" rel="noopener noreferrer">{ui.codeLabel} <ArrowUpRight size={14} /></a>}
              {tool.siteUrl && <a className="link" href={tool.siteUrl} target="_blank" rel="noopener noreferrer">Package <ArrowUpRight size={14} /></a>}
            </dd>
          </div>
        </dl>
      </div>

      <div className="container doc doc-single">
        <div className="prose">
          <MDXRemote source={tool.source} components={mdxComponents} options={{ blockJS: false }} />
        </div>
      </div>

      <ClosingCta
        headline={home.closingHeadline}
        lead={home.closingLead}
        bookUrl={profile.booking?.url ?? '#'}
        bookLabel={ui.bookCta}
        bookTitle={profile.booking?.title ?? undefined}
      />
    </article>
  );
}
