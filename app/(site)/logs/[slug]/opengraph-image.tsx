import { getLog, getLogs, getProfile } from '@/lib/content';
import { OG_SIZE, ogCard, splitTitle } from '@/lib/og';

export const alt = 'Build log';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return (await getLogs()).map((l) => ({ slug: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [r, p] = await Promise.all([getLog(slug), getProfile()]);
  const title = r?.log.title ?? 'Build log';
  const { bright, dim } = splitTitle(title);
  return ogCard({
    eyebrow: `Build log · ${r?.log.minutes ?? 5} min read`,
    bright,
    dim,
    name: p.name,
    monogram: p.monogram,
    right: 'nadeemashraf.cyou/logs',
    fontSize: title.length > 60 ? 62 : 72,
  });
}
