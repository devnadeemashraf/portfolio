# HANDOFF

Read this first in a fresh chat, then `ROADMAP.md`, then `design/guide/motion-interaction-content-guide.md.md` if touching motion.

## State (2026-11-09)

First draft complete and committed on `main`. `pnpm build` passes. Routes: `/`, `/work/[slug]`, `/logs`, `/logs/[slug]`, `/logs/rss.xml`, `/resume` (redirect), `/keystatic`, 404, sitemap, robots, OG images.

## Decisions made (do not re-litigate)

- Role shown as **Senior Forward Deployed Engineer** (user's call; résumés say Client Solutions Engineer / Forward Deployed Engineer, and the experience entries keep those real titles).
- Only **AVRL projects are excluded**; H&H is the only project. User will write more later; `docs/CASE-STUDY-STYLE.md` is the template.
- Only the two **master résumés** are public (`.gitignore` whitelists them).
- Six Cal.com links, picker sheet; primary CTA is the 15-minute intro. Technical discussion is 30 min (descriptions file, newer than notes.md).
- No-screenshot covers: `Blueprint` component from `coverNodes` / `coverStats`.
- Analytics: Vercel Analytics + Speed Insights + PostHog free (cookieless). Extra deps approved: `@keystatic/core`, `@keystatic/next`, `next-mdx-remote`, `posthog-js`, `@vercel/analytics`, `@vercel/speed-insights`.
- Keystatic storage is `local` unless `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`.
- `next-mdx-remote` is used with `blockJS: false` (repo content is trusted, needed for array props on Metrics/Flow).
- Hero dim tail uses `--muted` (not `--unread`) so resting text passes AA.
- Rumi's meow is WebAudio-synthesized (no audio files).

## Placeholders / things only the user can fill

- `content/profile.yaml`: **Engineering consultation Cal.com URL is a guess** (`/engineering-consultation`); confirm.
- `content/home.yaml`: contact lead has `[48 hours]` reply-time placeholder.
- `content/projects/h-h.mdx`: `timeline`, `liveUrl`/`codeUrl`, retro paragraph (all `[placeholder]`). Check the facts against reality.
- `content/logs/building-nadeemashraf-cyou.mdx`: "What I'd change" chapter.
- LeetCode URL format (`/u/NadeemAshraf`) and the open-source repo URLs (currently the GitHub profile) need checking.
- Open Graph images use the default `next/og` font (not Geist).

## Test results (Edge/Chromium, production build)

Lighthouse mobile (4x CPU, slow 4G): Home perf 100 / a11y 96 / CLS 0; case study, logs, post 100/100/100 with CLS 0. The only failing audit on Home is `color-contrast` on `--unread` words, the guide's intentional transient state. Reduced motion verified (words ink, cards opaque, Rumi and pulse off). Dialog focus trap/Esc/focus return, theme persistence without flash, filters, Rumi appear/dodge/paw trail verified by a CDP script.

**Not yet tested:** real Firefox fallback (no Firefox installed), real 4x CPU scroll profiling in DevTools, real devices, keyboard-only pass by a human, Safari.

## Known gaps / next

See `ROADMAP.md` "Next".
