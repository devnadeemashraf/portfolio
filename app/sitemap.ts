import type { MetadataRoute } from 'next';
import { getLogs, getProjects, getTools } from '@/lib/content';

const SITE = 'https://nadeemashraf.cyou';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, logs, tools] = await Promise.all([getProjects(), getLogs(), getTools()]);
  return [
    { url: SITE, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/logs`, changeFrequency: 'weekly', priority: 0.8 },
    ...projects.map((p) => ({ url: `${SITE}/work/${p.slug}`, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${SITE}/open-source/${t.slug}`, priority: 0.6 })),
    ...logs.map((l) => ({ url: `${SITE}/logs/${l.slug}`, lastModified: l.date ?? undefined, priority: 0.7 })),
  ];
}
