# PLAN — nadeemashraf.cyou

Status: **awaiting approval**. Nothing scaffolded yet.

## 0. Findings that need your call

1. **`.gitignore` ignores `design/`, `public/resume/`, `public/screens/`, `content-drafts/`.** Résumé PDFs would never reach Vercel, so `/resume` would 404 in production. Proposal: un-ignore `public/resume/` (PDFs contain your phone number; I'd ship only the variants you want public, see Q3) and `public/screens/`. Keep `design/` and `content-drafts/` ignored.
2. **pnpm isn't installed** (Node 26, npm available). I'll run `npm i -g pnpm` unless you object.
3. **Role title conflict.** notes.md says "Senior Forward Deployed Engineer"; résumés say "Client Solutions Engineer (Forward Deployed)" (2024–now) and "Forward Deployed Engineer" (2021–24). I'll use the résumé titles and a hero role of "Full-stack / Forward Deployed Engineer". No "Senior" claim unless you confirm.
4. **Public email** = `official.nadeemashraf@gmail.com` (notes + résumés). Phone is NOT shown on the site.
5. Notes.md projects/experience are empty; I'll seed from the résumés. Only one project exists (H&H, pre-launch). The design wants 3: Projects 2 and 3 will be Cachet and Generations UI (AVRL work, résumé numbers only, no URLs; confirm you may name them publicly), plus open-source (schemafied, depman) as links on About. Anything unprovable stays `[placeholder]`.
6. **Audience adaptation (SDE + FDE):** hero switches on a role toggle? No, too gimmicky. Instead: hero headline covers both; Work leads with FDE-flavoured impact (1M+ calls/day, 30+ customers, 9s→350ms); the recruiter sheet has a "Looking for" list of both tracks; two résumé downloads (SDE / FDE) in the résumé menu; relocation chip ("Open to relocate: UAE · Saudi · Singapore · Malaysia · US · UK · Canada").

## 1. Open questions (defaults in bold; I proceed with defaults if you say "OK")

- Q1 Analytics (all free): **Vercel Web Analytics + Speed Insights** (visitors, countries, pages, Core Web Vitals; as requested) **+ PostHog Cloud free tier** (1M events/mo: section views, click autocapture, custom events like `book_click`, `resume_download`, scroll depth, heatmaps, optional session replay). SEO: **Google Search Console + Bing Webmaster** (manual setup, covered in README). Alternative to PostHog: Umami Cloud free (simpler, fewer features). Needs new dep `posthog-js`.
- Q2 New deps beyond your list: `@keystatic/core`, `@keystatic/next` (implied), `next-mdx-remote` (render Keystatic MDX with custom blocks), `posthog-js`, `@vercel/analytics`, `@vercel/speed-insights`. No animation libs, no highlighter (plain styled code). OK?
- Q3 Which résumé PDFs to publish? **Public: `SDE_Master` and `FDE_Master`** (named `Nadeem_Ashraf_SDE.pdf`/`_FDE.pdf` is not needed; keep filenames). Gulf/India/Remote variants stay local unless you say so.
- Q4 Cal.com: five links, shown as a **picker** (dropdown/popover on the primary CTA: title, duration, one-line purpose). Primary "Book a 15-min intro" goes straight to quick-introduction; a "More ways to meet" chooser lists all five. Purposes are inferred from slugs: confirm wording.
- Q5 Rumi's name and the Siamese pixel art: drawn by me as inline SVG pixel art (no image assets, no license issues). Photo of the real Rumi can be added later in `public/`.

## 2. Stack

Next.js (latest, App Router, TS strict), pnpm, CSS custom properties (no Tailwind), Geist + Geist Mono via `next/font`, Keystatic (local in dev, GitHub in prod) at `/keystatic`, MDX via `next-mdx-remote/rsc`. Motion: CSS scroll-driven animations in `@supports`, ~1KB IntersectionObserver fallback (dynamic import only when unsupported), cross-document View Transitions (`@view-transition`). Deploy: Vercel.

## 3. File tree

```
app/
  layout.tsx                 fonts, theme init script, skip link, header/footer, analytics
  page.tsx                   Home
  not-found.tsx
  globals.css                imports styles/*
  sitemap.ts  robots.ts
  opengraph-image.tsx        Home OG (frame 16)
  work/[slug]/page.tsx  + opengraph-image.tsx
  logs/page.tsx
  logs/[slug]/page.tsx  + opengraph-image.tsx (frame 17)
  logs/rss.xml/route.ts
  resume/route.ts            redirect → PDF
  keystatic/[[...params]]/page.tsx   keystatic/layout.tsx
  api/keystatic/[...params]/route.ts
styles/ tokens.css base.css story.css components.css transitions.css
components/
  Header, MobileMenu, ThemeToggle, Footer, SkipLink
  Statement, Story (section wrapper), Chapter bar, Morph (card wrapper)
  Hero, WorkCard, LogCard, PathBlock (principles+experience), StackGroups, ContactBlock
  RecruiterSheet, Dialog (shared focus trap), BookingPicker, AvailabilityPill
  CopyButton (email/code), FilterChips, TOC, ReadingProgress, PrevNext
  mdx/ Decision, Code, Figure, mdx-components
  easter/ RumiCat (pixel SVG), CatEasterEggs (client), Paw cursor trail? (no: guide bans cursor followers)
  analytics/ Providers (PostHog), Track (data-track click + section view)
lib/ content.ts (reader), seo.ts, jsonld.ts, reading-time.ts, fallback-observer.ts
keystatic.config.ts
content/ profile, recruiter, home, socials, about (.yaml); projects/*.mdx, logs/*.mdx, experience/*.yaml
public/ resume/, screens/, rumi/
```

## 4. Content schema (Keystatic)

Per the guide, plus:
- **profile**: name, role, city, relocation (toggle + target countries list), heroHeadline, lead, available (checkbox) + availableLabel, startDate, email, resume (SDE, FDE files), `bookingLinks[]` {title, purpose, minutes, url, primary}.
- **recruiter**: lookingFor[], experience, coreStack[], noticePeriod, workPreference, relocation, visaNote.
- **home**: statements {work, logs, path, stack}, contactHeadline, plus section labels/CTA strings so every visible string is content.
- **socials**: list {label, handle, url}: GitHub, LinkedIn, LeetCode.
- **about**: principles[{title,text}], stackGroups[{name,tools[]}], openSource[].
- **projects** (mdx): per guide. **logs** (mdx): per guide, reading time computed. **experience** (yaml): role, company, start, end, impact.
- Availability off → pill, recruiter card, pulse and relocation chip all hidden via one helper.
- UI strings (button labels, aria text) live in a `strings` singleton so nothing is hard-coded.

## 5. Cat easter eggs (restrained, all disabled under reduced motion except static ones)

Rumi, vocal and clingy, so he shows up uninvited:
- Footer: pixel Rumi peeks from the corner; click → "Mrrrow!" bubble (rotating lines: "He has opinions about your scroll speed").
- Random (once per session, ~20% chance, after ≥40% scroll): Rumi walks across the bottom of the viewport.
- Konami code / typing "rumi" → cat rain of pixel paws.
- Clinging: after 20s idle, Rumi sits on the header, and "meows" (text only) if you click it. No audio by default.
- 404 page: Rumi sitting on the "404".
- Tab title swaps to "Rumi misses you" when the tab is hidden.
All pure SVG/CSS, <2KB each, lazy client component, no layout shift, `aria-hidden` except the interactive bits.

## 6. Analytics events (PostHog + Vercel)

Autocapture clicks; custom: `section_view` (IntersectionObserver per chapter), `book_click{link}`, `resume_download{variant}`, `email_copy`, `theme_toggle`, `recruiter_sheet_open`, `log_filter`, `outbound{url}`, `easter_egg{name}`. Respect Do-Not-Track; cookieless PostHog mode (`persistence: memory`) so no consent banner is needed. Keys via `NEXT_PUBLIC_POSTHOG_KEY`; absent key → no-op.

## 7. Build order (one conventional commit each; handoff updated after each)

1. `chore: scaffold` Next + pnpm + TS strict + lint, .gitignore fix
2. `feat: tokens and fonts` tokens.css (dark/light, motion), Geist, no-flash theme script
3. `feat: keystatic config and seed content` (résumé-derived, placeholders marked)
4. `feat: layout, header, menu shell, footer, theme toggle, skip link`
5. `feat: home static` (all sections, frames 03–04)
6. `feat: scroll story` (Statement, split/sticky, mobile chapter bar, morph, fallback) frames 01–02
7. `feat: case study page` (08–09, MDX blocks)
8. `feat: logs index` (10–11, filters, RSS later)
9. `feat: log post` (12–13, TOC, progress, prev/next, sample log)
10. `feat: sheets and interactions` (dialog, recruiter, menu, booking picker, copy, chips) frames 06–07
11. `feat: view transitions`
12. `feat: seo, og, rss, sitemap, jsonld`
13. `feat: analytics`
14. `feat: rumi easter eggs`
15. `chore: polish, a11y pass, perf`; testing pass; `docs: README`

Handoff: `HANDOFF.md` (done / next / decisions / how to run) and `ROADMAP.md` (checklist above), updated and committed with every step so a fresh chat can resume.

## 8. Verification

Per UI step: run dev, screenshot via browser tooling if available, compare with frames. Final: reduced-motion, Firefox fallback, keyboard-only, 4× CPU, Lighthouse (A11y 100, Perf ≥95, CLS 0) reported honestly. Note: Firefox/Lighthouse runs depend on tools installed locally; I'll report what I could not run.

## 9. Risks

- Keystatic MDX custom blocks (Decision/Code/Figure) need `fields.mdx` component blocks; round-tripping must stay valid MDX.
- Cross-document View Transitions + `view-transition-name` per slug: Chromium only; others just navigate.
- Mobile `display: contents` sticky bar needs the chapter bar to be a direct grid item: verified in build step 6.
- GitHub mode needs a GitHub App and env vars set by you (README documents it); I can't do that for you.
