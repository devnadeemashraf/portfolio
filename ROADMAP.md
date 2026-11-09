# ROADMAP

## Done (first draft)

- [x] Scaffold (Next 16, pnpm, TS strict)
- [x] Tokens, fonts (Geist, Geist Mono), no-flash theme
- [x] Keystatic schema + seed content from résumés
- [x] Layout, header, footer, theme toggle (circle reveal), skip link
- [x] Home: hero, Work / Build logs / Path / Stack story sections, contact
- [x] Scroll story: `<Statement>`, sticky split, mobile chapter bar, card morph, IO fallback
- [x] Case study page, logs index (filters), log post (TOC, progress, prev/next)
- [x] Sheets: recruiter, booking chooser (5 links), mobile menu (native `<dialog>`)
- [x] SEO: metadata, canonical, sitemap, robots, Person + BlogPosting JSON-LD, OG images, RSS
- [x] Analytics wiring (Vercel + PostHog, event tracking)
- [x] Rumi easter eggs
- [x] README

## Done (round 2, from feedback)

- [x] Hero: role flip (Forward deployed / Full-stack / Software) with matching eyebrow title; availability pill removed from the nav
- [x] Hero card: slides in from the right; book, résumé (two PDFs), more ways to meet, Open to (remote, abroad with visa note, Indian cities), recruiter link, socials
- [x] Sticky stacking cards so fast scrolls cannot skip content
- [x] Voice pass: all copy in Nadeem's spoken first-person voice; "What I'd change" written everywhere
- [x] Rumi: natural Siamese colours, nap near a still cursor, pet-or-flee, cotton-ball play, per-action meow personalities
- [x] `docs/WRITING-GUIDE.md` for AI content writing (+ `CLAUDE.md`, `AGENTS.md` pointers)

## Next

1. User: fill placeholders listed in `HANDOFF.md`; add real project case studies (use `docs/WRITING-GUIDE.md`).
2. Real Firefox + Safari check of the fallback; DevTools 4x CPU scroll profile on a phone profile.
3. Visual diff pass against frames 05–07, 09, 11, 13 (light theme, menu, recruiter sheet, mobile case study/logs/post): only Home desktop/mobile dark, case study, logs and post desktop were compared by eye.
4. Screenshots or screen recordings for projects (Figure block) once available.
5. Geist font in OG images (needs bundling the font file).
6. Rumi polish: nicer sprite frames, optional photo of the real Rumi.
7. Connect domain, enable Vercel Analytics/Speed Insights, set PostHog key, Search Console.
