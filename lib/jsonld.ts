const SITE = 'https://nadeemashraf.cyou';

export function personJsonLd(
  p: { name: string; role: string; lead: string; city: string },
  socials: readonly { url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    url: SITE,
    description: p.lead.replace(/\s+/g, ' '),
    address: { '@type': 'PostalAddress', addressLocality: p.city },
    sameAs: socials.map((s) => s.url),
  };
}

export function blogPostingJsonLd(
  post: { title: string; summary: string; date: string | null; slug: string },
  author: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date ?? undefined,
    author: { '@type': 'Person', name: author, url: SITE },
    mainEntityOfPage: `${SITE}/logs/${post.slug}`,
    url: `${SITE}/logs/${post.slug}`,
  };
}
