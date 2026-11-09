# nadeemashraf.cyou

Personal portfolio: Next.js (App Router, TypeScript strict), Keystatic CMS, MDX, CSS scroll-driven animations. No database, no custom backend.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
```

Requires Node 20+ and pnpm (`npm i -g pnpm`).

## Edit content at `/keystatic`

With `pnpm dev` running, open <http://localhost:3000/keystatic>. In development Keystatic writes straight to files in `content/`:

| Admin section | File | Notes |
| --- | --- | --- |
| Profile | `content/profile.yaml` | name, role, hero text, **Open to roles** switch, relocation list, all Cal.com booking links, résumé paths |
| Recruiter summary | `content/recruiter.yaml` | the 30-second sheet |
| Home statements | `content/home.yaml` | one plain sentence per chapter; `<Statement>` splits words for you |
| Socials, Principles and stack, Interface strings | `content/socials.yaml`, `about.yaml`, `ui.yaml` | every visible string comes from content |
| Projects | `content/projects/*.mdx` | side-project case studies at `/projects/<slug>` |
| Build logs | `content/logs/*.mdx` | posts; reading time is computed |
| Open source | `content/tools/*.mdx` | short pages at `/open-source/<slug>`; `origin` decides whether it is listed under Work or Projects |
| Experience | `content/experience/*.yaml` | |

Turning **Open to roles** off in Profile hides the availability pill, recruiter card, pulse and relocation chip everywhere.

In MDX bodies, use the editor's block menu for **Decision** (Chose / Because / Trade-off), **Code** (copy button), **Figure**, **Metrics** and **Flow diagram**. Projects without a screenshot automatically get a "blueprint" cover drawn from their `coverNodes` and `coverStats`. To have an AI draft a case study, build log or tool page in the same voice, point it at `docs/WRITING-GUIDE.md` (also referenced from `CLAUDE.md` and `AGENTS.md`, so Claude Code and similar tools read it automatically).

## Keystatic GitHub mode (edit the live site from `/keystatic`)

1. In `.env.local`, set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` and run `pnpm dev`.
2. Open `/keystatic`. Keystatic shows a setup screen; choose **Create GitHub App** for the repo `devnadeemashraf/portfolio`. GitHub asks you to approve; the app is created for you and Keystatic writes these into `.env.local`:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
3. In GitHub, install that app on the repo (Settings → Developer settings → GitHub Apps → your app → Install App).
4. In the Vercel project (Settings → Environment Variables) add those four plus `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`, for Production and Preview. Redeploy.
5. For the production app, add the callback URL `https://nadeemashraf.cyou/api/keystatic/github/oauth/callback` to the GitHub App (and keep the localhost one for development).
6. Visit `https://nadeemashraf.cyou/keystatic`, sign in with GitHub. Each save commits to the repo and Vercel rebuilds.

Without `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`, production builds use local storage and `/keystatic` will not be able to save, which is fine for a read-only site.

## Deploy to Vercel

1. Push the repo to GitHub (`devnadeemashraf/portfolio`).
2. Vercel → **Add New Project** → import the repo. Framework: Next.js (auto-detected). Package manager: pnpm (auto-detected from the lockfile).
3. Add the Keystatic env vars above, plus analytics vars below. Deploy.

Résumé PDFs live in `public/resume/` and only the two master PDFs are committed (see `.gitignore`). `/resume` redirects to the forward-deployed PDF; the header menu offers both.

## Connect nadeemashraf.cyou

1. Vercel project → **Settings → Domains** → add `nadeemashraf.cyou` and `www.nadeemashraf.cyou` (set one to redirect to the other).
2. At your DNS provider: `A` record for `@` → `76.76.21.21`, and `CNAME` for `www` → `cname.vercel-dns.com`. (Vercel shows the exact values; use those if they differ.)
3. Wait for the certificate to issue (a few minutes). Canonical URLs in the code already point to `https://nadeemashraf.cyou`.

## Analytics (all free)

| What you learn | Tool | Setup |
| --- | --- | --- |
| Visitors, countries, pages, referrers | Vercel Web Analytics | Vercel project → Analytics → Enable |
| Core Web Vitals in production | Vercel Speed Insights | Vercel project → Speed Insights → Enable |
| Clicks, sections reached, booking/résumé/email events, heatmaps | PostHog Cloud (free tier) | Create a project, then set `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST` if you use the EU cloud) in Vercel |
| Search performance, indexing | Google Search Console + Bing Webmaster Tools | Add the domain, verify via DNS, submit `https://nadeemashraf.cyou/sitemap.xml` |

PostHog runs cookieless (memory persistence), skips Do-Not-Track visitors, and is a no-op until the key is set. Custom events: `book_click`, `resume_download`, `email_copy`, `section_view`, `theme_toggle`, `recruiter_sheet_open`, `booking_open`, `log_filter`, `code_copy`, `outbound`, `easter_egg`.

## Rumi

A Siamese cat lives on the site, and everything he does is his idea:

- He walks in at random (or when you press him in the footer), leaves paw trails, and keeps coming back to your cursor on his own schedule (he also rests and wanders off), and calmly moves away if you get close.
- Hold the cursor still and he comes to nap beside it. Move and he wakes and follows.
- Touch him while he sleeps and he decides: a purr and a pet, or a grumpy dash away.
- "Toss a cotton ball" (bottom-right button, or click then click anywhere) and he decides whether it is worth his time. If it is, he wiggles, pounces and bats it around.
- Typing `rumi` or the Konami code makes it rain paws; the 404 page has him sitting on it. He is built from `content-drafts/pixel_cat_character_rumi.md`: voluntary affection, rest, short cat sounds only, a calm retreat when approached, and an age that follows real calendar time (shown in the footer, with a short "how to treat Rumi" guide).
- His meows have personalities (greeting, demanding, annoyed, playful, sleepy, curious, smug, purring) and are synthesized with WebAudio at runtime: no audio files, no licences. Direct interactions play sound after a click; ambient meows need the footer "Rumi's voice" toggle.
- A constant, very soft purr sits under the site (synthesized, fades in on your first tap or key, pauses with the tab). The footer lets you *ask* Rumi to rest; he decides. He often says no, and usually says yes to coming back.
- All of it is skipped under `prefers-reduced-motion`; the footer keeps a static Rumi.

## Project map

See `PLAN.md` (architecture), `ROADMAP.md` (status) and `HANDOFF.md` (where to resume).
