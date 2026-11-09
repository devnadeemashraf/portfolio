import { getLogs, getProfile } from '@/lib/content';

const SITE = 'https://nadeemashraf.cyou';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const dynamic = 'force-static';

export async function GET() {
  const [logs, p] = await Promise.all([getLogs(), getProfile()]);
  const items = logs
    .map(
      (l) => `<item>
<title>${esc(l.title)}</title>
<link>${SITE}/logs/${l.slug}</link>
<guid isPermaLink="true">${SITE}/logs/${l.slug}</guid>
<pubDate>${new Date(`${l.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${esc(l.summary)}</description>
${l.tags.map((t) => `<category>${esc(t)}</category>`).join('')}
</item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(p.name)}: build logs</title>
<link>${SITE}/logs</link>
<atom:link href="${SITE}/logs/rss.xml" rel="self" type="application/rss+xml" />
<description>Long-form stories of how I built things.</description>
<language>en</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
