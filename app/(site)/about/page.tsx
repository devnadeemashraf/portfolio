import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download } from '@/components/Icons';
import { ClosingCta } from '@/components/ClosingCta';
import { PageHead } from '@/components/PageHead';
import { getAbout, getHome, getProfile, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'How I work, the principles I keep, and the tools I reach for.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [about, home, profile, ui] = await Promise.all([getAbout(), getHome(), getProfile(), getUi()]);

  return (
    <>
      <PageHead label={home.about.label} title="About" lead={home.about.statement} />
      <div className="container page-body">
        <div className="flow">
          <p className="label">How I work</p>
          <ol className="stack-list" role="list">
            {about.principles.map((pr, i) => (
              <li className={`card sticky-card${i > 0 ? ' morph' : ''}`} style={{ '--i': i } as React.CSSProperties} key={pr.title}>
                <p className="label">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="h3 sm">{pr.title}</h2>
                <p className="muted">{pr.text}</p>
              </li>
            ))}
          </ol>
          <p className="label flow-label">What I reach for</p>
          <div className="stack-list">
            {about.stackGroups.map((g, i) => (
              <div className={`card stack-group sticky-card${i > 0 ? ' morph' : ''}`} style={{ '--i': i } as React.CSSProperties} key={g.name}>
                <h2 className="h3 sm">{g.name}</h2>
                <ul className="chips">
                  {g.tools.map((t) => <li className="chip" key={t}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="about-links">
            <a className="btn btn-ghost" href={profile.resumeFde} download data-track="resume_download" data-label="fde"><Download /> {ui.resumeLabel}</a>
            <Link className="link" href="/logs/how-i-use-ai-in-my-production-workflow">How I use AI day to day <ArrowRight size={15} /></Link>
          </p>
        </div>
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
