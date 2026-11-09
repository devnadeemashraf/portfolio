import type { Metadata } from 'next';
import { ClosingCta } from '@/components/ClosingCta';
import { PageHead } from '@/components/PageHead';
import { ToolCard } from '@/components/ToolCard';
import { getExperience, getHome, getProfile, getTools, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Where I have worked as a forward deployed and software engineer, and the tooling I built there and open-sourced.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const [experience, tools, home, profile, ui] = await Promise.all([getExperience(), getTools(), getHome(), getProfile(), getUi()]);
  const atWork = tools.filter((t) => t.origin === 'work');

  return (
    <>
      <PageHead
        label={home.work.label}
        title="Work"
        lead="Client projects are confidential, so I can't show them. What I can show is how I work, and the tooling I built along the way and open-sourced."
      />
      <div className="container page-body">
        <div className="flow">
          <p className="label">Experience</p>
          <ol className="exp" role="list">
            {experience.map((e, i) => (
              <li className={`card sticky-card${i > 0 ? ' morph' : ''}`} style={{ '--i': i } as React.CSSProperties} key={e.slug}>
                <p className="label">{e.start} — {e.end}</p>
                <h2 className="h3 sm">{e.role} <span className="muted at">at {e.company}</span></h2>
                <p className="muted">{e.impact}</p>
              </li>
            ))}
          </ol>
          {atWork.length > 0 && (
            <>
              <p className="label flow-label">Tooling I built at work, and open-sourced</p>
              <div className="oss">
                {atWork.map((t, i) => <ToolCard key={t.slug} t={t} index={i + experience.length} />)}
              </div>
            </>
          )}
        </div>
      </div>
      <ClosingCta headline={home.closingHeadline} lead={home.closingLead} bookUrl={profile.booking?.url ?? '#'} bookLabel={ui.bookCta} bookTitle={profile.booking?.title ?? undefined} />
    </>
  );
}
