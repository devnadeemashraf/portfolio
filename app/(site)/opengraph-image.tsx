import { getProfile } from '@/lib/content';
import { OG_SIZE, ogCard } from '@/lib/og';

export const alt = 'Nadeem Ashraf, Senior Forward Deployed Engineer';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  const p = await getProfile();
  return ogCard({
    eyebrow: 'nadeemashraf.cyou',
    bright: p.heroHeadline.replace(/,$/, ''),
    dim: p.heroHeadlineDim,
    name: p.name,
    monogram: p.monogram,
    right: p.available ? p.availableLabel : p.role,
    rightPill: p.available,
    fontSize: 76,
  });
}
