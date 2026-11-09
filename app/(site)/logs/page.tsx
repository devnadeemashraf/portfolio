import type { Metadata } from 'next';
import { ClosingCta } from '@/components/ClosingCta';
import { LogsIndex } from '@/components/LogsIndex';
import { Rss } from '@/components/Icons';
import Link from 'next/link';
import { getHome, getLogs, getProfile, getUi } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Build logs',
  description: 'Long-form stories of how I built things, narrated start to finish: the decisions, the dead ends and the trade-offs.',
  alternates: { canonical: '/logs', types: { 'application/rss+xml': '/logs/rss.xml' } },
};

export default async function LogsPage() {
  const [logs, ui, home, profile] = await Promise.all([getLogs(), getUi(), getHome(), getProfile()]);
  const tags = [...new Set(logs.flatMap((l) => l.tags))];

  return (
    <>
      <div className="container page-head">
        <p className="label">{home.logs.label}</p>
        <h1 className="display page-title">{ui.logsTitle}</h1>
        <div className="logs-lead-row">
          <p className="lead page-lead">{ui.logsLead}</p>
          <Link href="/logs/rss.xml" className="btn btn-ghost"><Rss /> Subscribe via RSS</Link>
        </div>
        <LogsIndex
          tags={tags}
          logs={logs.map((l) => ({
            slug: l.slug, title: l.title, summary: l.summary, tags: [...l.tags], date: l.date, minutes: l.minutes,
          }))}
        />
      </div>
      <ClosingCta
        headline={home.closingHeadline}
        lead={home.closingLead}
        bookUrl={profile.booking?.url ?? '#'}
        bookLabel={ui.bookCta}
        bookTitle={profile.booking?.title}
      />
    </>
  );
}
