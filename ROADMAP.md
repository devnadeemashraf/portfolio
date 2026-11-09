# ROADMAP

## Done (first draft)

- [x] Scaffold (Next 16, pnpm, TS strict)
- [x] Tokens, fonts (Geist, Geist Mono), no-flash theme
- [x] Keystatic schema + seed content from résumés
- [x] Layout, header, footer, theme toggle (circle reveal), skip link
- [x] Home: hero, Work / Build logs / Path / Stack story sections, contact
- [x] Scroll story: `<Statement>`, sticky split, mobile chapter bar, card morph, IO fallback
- [x] Case study page, logs index (filters), log post (TOC, progress, prev/next)
- [x] Sheets: recruiter, booking chooser (6 links), mobile menu (native `<dialog>`)
- [x] SEO: metadata, canonical, sitemap, robots, Person + BlogPosting JSON-LD, OG images, RSS
- [x] Analytics wiring (Vercel + PostHog, event tracking)
- [x] Rumi easter eggs
- [x] README

## Next

1. User: fill placeholders listed in `HANDOFF.md`; add real project case studies (use `docs/CASE-STUDY-STYLE.md`).
2. Real Firefox + Safari check of the fallback; DevTools 4x CPU scroll profile on a phone profile.
3. Visual diff pass against frames 05–07, 09, 11, 13 (light theme, menu, recruiter sheet, mobile case study/logs/post): only Home desktop/mobile dark, case study, logs and post desktop were compared by eye.
4. Screenshots or screen recordings for projects (Figure block) once available.
5. Geist font in OG images (needs bundling the font file).
6. Rumi polish: nicer sprite frames, optional photo of the real Rumi.
7. Connect domain, enable Vercel Analytics/Speed Insights, set PostHog key, Search Console.
