import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/components.css';
import '../../styles/story.css';
import '../../styles/prose.css';
import '../../styles/transitions.css';
import { getProfile, getRecruiter, getSocials, getUi } from '@/lib/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SheetsProvider } from '@/components/Sheets';
import { Analytics } from '@/components/analytics/Analytics';
import { ScrollFallback } from '@/components/ScrollFallback';
import { Rumi } from '@/components/easter/Rumi';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

const SITE = 'https://nadeemashraf.cyou';

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  return {
    metadataBase: new URL(SITE),
    title: { default: `${p.name} · ${p.role}`, template: `%s · ${p.name}` },
    description: p.lead.replace(/\s+/g, ' '),
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: p.name, locale: 'en_US' },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark light',
};

const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}`;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [p, r, socials, ui] = await Promise.all([getProfile(), getRecruiter(), getSocials(), getUi()]);

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" title={`${p.name} build logs`} href="/logs/rss.xml" />
      </head>
      <body id="top">
        <a href="#main" className="skip-link">Skip to content</a>
        <SheetsProvider
          data={{
            name: p.name,
            available: p.available,
            availableLabel: p.availableLabel,
            email: p.email,
            resumeSde: p.resumeSde,
            resumeFde: p.resumeFde,
            relocation: [...p.relocation],
            booking: p.bookingLinks.map((b) => ({ ...b, minutes: b.minutes ?? 0 })),
            recruiter: {
              ...r,
              lookingFor: [...r.lookingFor],
              coreStack: [...r.coreStack],
              highlights: [...r.highlights],
            },
            ui,
            socials: [...socials],
          }}
        >
          <Header
            name={p.name}
            monogram={p.monogram}
            available={p.available}
            availableLabel={p.availableLabel}
            resumeSde={p.resumeSde}
            resumeFde={p.resumeFde}
            ui={ui}
          />
          <main id="main">{children}</main>
          <Footer name={p.name} tagline={ui.footerTagline} />
        </SheetsProvider>
        <Rumi />
        <ScrollFallback />
        <Analytics />
      </body>
    </html>
  );
}
