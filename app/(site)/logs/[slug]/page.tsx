import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowRight, Calendar } from '@/components/Icons';
import { ClosingCta } from '@/components/ClosingCta';
import { Toc } from '@/components/Toc';
import { ReadingProgress } from '@/components/ReadingProgress';
import { mdxComponents } from '@/components/mdx/Blocks';
import { formatDate, getHome, getLog, getLogs, getProfile, getUi, headingsOf } from '@/lib/content';
import { blogPostingJsonLd } from '@/lib/jsonld';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getLogs()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await getLog(slug);
  if (!r) return {};
  const { log } = r;
  return {
    title: log.title,
    description: log.summary,
    alternates: { canonical: `/logs/${slug}` },
    openGraph: { title: log.title, description: log.summary, type: 'article', publishedTime: log.date ?? undefined, url: `/logs/${slug}` },
  };
}

export default async function LogPost({ params }: Props) {
  const { slug } = await params;
  const [r, home, profile, ui] = await Promise.all([getLog(slug), getHome(), getProfile(), getUi()]);
  if (!r) notFound();
  const { log, newer, older } = r;
  const headings = headingsOf(log.source);

  return (
    <article>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd({ ...log, slug }, profile.name)) }}
      />
      <div className="container post-head">
        <Link href="/logs" className="link back"><ArrowLeft size={15} /> Build logs</Link>
        <ul className="chips center">{log.tags.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>
        <h1 className="display post-title">{log.title}</h1>
        <p className="lead post-lead">{log.summary}</p>
        <p className="byline">
          <span className="brand-mark" aria-hidden="true">{profile.monogram}</span>
          <span>{profile.name}</span>
          <span className="mono muted">{formatDate(log.date)}</span>
          <span className="mono muted">{log.minutes} min read</span>
        </p>
        <div className="post-cover" style={{ viewTransitionName: `post-${slug}` }} aria-hidden="true">
          <span className="mono">{log.tags[0] ?? 'build log'}</span>
          <strong>{log.title}</strong>
        </div>
      </div>

      <div className="container doc">
        <aside className="doc-side"><Toc headings={headings} /></aside>
        <div className="prose">
          <MDXRemote source={log.source} components={mdxComponents} options={{ blockJS: false }} />

          <div className="card author-card">
            <span className="brand-mark" aria-hidden="true">{profile.monogram}</span>
            <span>
              <strong>Written by {profile.name}</strong>
              <span className="muted"> {profile.role}, open to new roles.</span>
            </span>
            <a className="btn btn-primary btn-sm" href={profile.booking?.url ?? '#'} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={profile.booking?.title}>
              <Calendar size={16} /> {ui.bookCta}
            </a>
          </div>
        </div>
      </div>

      <nav className="container prevnext" aria-label="More build logs">
        {older ? (
          <Link href={`/logs/${older.slug}`} className="card"><span className="label">← Previous</span><strong>{older.title}</strong></Link>
        ) : <span />}
        {newer ? (
          <Link href={`/logs/${newer.slug}`} className="card right"><span className="label">Next →</span><strong>{newer.title}</strong></Link>
        ) : <span />}
      </nav>

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
