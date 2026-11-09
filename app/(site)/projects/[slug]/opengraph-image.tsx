import { getProfile, getProject, getProjects } from '@/lib/content';
import { OG_SIZE, ogCard } from '@/lib/og';

export const alt = 'Case study';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [proj, p] = await Promise.all([getProject(slug), getProfile()]);
  return ogCard({
    eyebrow: `Case study · ${proj?.role ?? ''}`,
    bright: proj?.title ?? 'Case study',
    dim: proj?.oneLiner ?? '',
    name: p.name,
    monogram: p.monogram,
    right: 'nadeemashraf.cyou/projects',
    fontSize: 72,
  });
}
