# HANDOFF

Read this first in a fresh chat, then `ROADMAP.md`, then `design/guide/motion-interaction-content-guide.md.md` if touching motion. Writing any content: read `docs/WRITING-GUIDE.md`.

## State (2026-11-09)

Site is feature-complete and intended to go live now; content is updated as it grows. `pnpm build` passes.

Routes: `/` (hero + four short previews + contact), `/work` (experience + tooling built at work), `/projects` (side projects + open source), `/projects/[slug]` (case study), `/open-source/[slug]`, `/about`, `/logs`, `/logs/[slug]`, `/logs/rss.xml`, `/resume` (redirect), `/work/:slug` (redirect to `/projects/:slug`), `/keystatic`, 404, sitemap, robots, OG images.

## Decisions (do not re-litigate)

- Positioning: Senior, flipping between Forward deployed / Full-stack / Software. Only the FDE variant mentions customer calls. Experience entries keep the real titles from the résumés.
- Current employer's projects are not shown. Work page lists experience plus tooling built at work and open-sourced (schemafied, depman). H&H, slayply and the shadcn/ui theme editor are side projects.
- Stealth and personal details stay out of every file (see `docs/WRITING-GUIDE.md` rules 5 and 6).
- Work preference: remote with flexible shifts (up to 1 AM IST); on-site or hybrid in morning shifts only. India cities listed above abroad. "Visa Sponsorship Required" (Indian citizen with a passport).
- Recruiter sheet: email (hover "Click to copy"), looking for, stack, notice, work, relocation, visa, three selling qualities. No buttons, no résumé repeats.
- Five Cal.com links; Technical discussion is 45 min. Only the two master résumés are public.
- Cards stack on scroll (sticky) on inner pages; the first card never blurs in. Landing page uses quiet preview rows.
- Analytics: Vercel Analytics + Speed Insights + PostHog (cookieless). Keystatic storage is `local` unless `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`.
- Rumi is the one coloured thing on the site; WebAudio-synthesized meows.

## Please verify

- Numbers on tool pages come from the repos (test counts are grepped, line counts approximate). Re-check if repos change.
- slayply never fills or submits forms (its README says so); the site says the same. The "one hour" origin is not claimed, since the repo shows 11 days and 150+ commits.
- "What I'd change" sections on schemafied, depman and the theme editor are my suggestions; edit to your real view.
- AI-workflow post: tool one-liners (Cursor, Antigravity) are generic; Graphify is described from public docs, not hands-on use.
- Shadcn theme editor live URL (`shadcnui-theme-editor.nadeemashraf.dev`) did not respond, so it is not linked.
- `[48 hours]` promise removed from the contact lead.

## Not yet tested

Real Firefox fallback, Safari, real devices, keyboard-only pass by a human, DevTools 4x CPU profile.
