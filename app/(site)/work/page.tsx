import type { Metadata } from 'next';
import { ClosingCta } from '@/components/ClosingCta';
import { FeaturedCard, Rows } from '@/components/Rows';
import { getExperience, getHome, getProfile, getTools, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Where I have worked as a forward deployed and software engineer, and the tooling I built there and open-sourced.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const [experience, tools, home, profile, ui] = await Promise.all([getExperience(), getTools(), getHome(), getProfile(), getUi()]);
  const [current, ...earlier] = experience;
  const atWork = tools.filter((t) => t.origin === 'work');

  return (
    <>
      <div className="container page-head">
        <p className="label">{home.work.label}</p>
        <h1 className="display page-title">Work</h1>
        <p className="lead page-lead">
          At AVRL I built the company&apos;s own internal products, then used them to work with clients while building more of their solutions.
          Those products are confidential and protected by patents, so I can&apos;t show them. Here&apos;s where I&apos;ve worked, and the tooling I could open-source.
        </p>
        {current && (
          <FeaturedCard
            coverLabel={`${current.start} — ${current.end}`}
            coverTitle={current.role}
            chip="Now"
            meta={current.company}
            title={current.role}
            text={current.impact}
          />
        )}
        <Rows
          label="Earlier"
          items={earlier.map((e) => ({ key: e.slug, kind: `${e.start} — ${e.end}`, title: e.role, text: e.impact, chip: 'AVRL' }))}
        />
        <Rows
          label="Tooling I built at work, and open-sourced"
          items={atWork.map((t) => ({ key: t.slug, href: `/open-source/${t.slug}`, kind: t.kind, title: t.title, text: t.tagline, chip: t.stack[0] }))}
        />
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
