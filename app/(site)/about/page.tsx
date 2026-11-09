import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download } from '@/components/Icons';
import { ClosingCta } from '@/components/ClosingCta';
import { FeaturedCard, Rows } from '@/components/Rows';
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
      <div className="container page-head">
        <p className="label">{home.about.label}</p>
        <h1 className="display page-title">About</h1>
        <p className="lead page-lead">{home.about.statement}</p>
        <FeaturedCard
          coverLabel="About"
          coverTitle={profile.role}
          chip={profile.availableLabel}
          title={profile.name}
          text={profile.lead}
        >
          <div className="about-links">
            <a className="btn btn-ghost" href={profile.resumeFde} download data-track="resume_download" data-label="fde"><Download /> {ui.resumeLabel}</a>
            <Link className="link" href="/logs/how-i-use-ai-in-my-production-workflow">How I use AI day to day <ArrowRight size={15} /></Link>
          </div>
        </FeaturedCard>
        <Rows
          label="How I work"
          items={about.principles.map((pr, i) => ({ key: pr.title, kind: String(i + 1).padStart(2, '0'), title: pr.title, text: pr.text }))}
        />
        <Rows
          label="What I reach for"
          items={about.stackGroups.map((g, i) => ({ key: g.name, kind: String(i + 1).padStart(2, '0'), title: g.name, text: g.tools.join(' · ') }))}
        />
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
