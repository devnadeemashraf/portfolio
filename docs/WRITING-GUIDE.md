# Writing guide for AI assistants

Read this whenever Nadeem asks you to write or edit content for this site: a **project case study**, a **build log (blog post)**, an **open-source tool page**, or any copy on the pages. Follow it exactly. If anything here conflicts with a request, say so and ask.

## 0. Hard rules

1. **Facts only.** Use only facts Nadeem gives you or that are already in the repo (`content/`, the résumés in his messages). Never invent employers, numbers, dates, dependencies, users, outcomes or opinions. Missing fact → prefer leaving the sentence out. If it is genuinely needed, write `[placeholder: what is needed]` and list every placeholder at the end of your reply. The site is live, so placeholders must never ship: resolve them before publishing.
2. **Numbers need a source.** Every metric carries what it measures and how (e.g. "in a local load test"). Never round up. Never present a test result as production traffic.
3. **Privacy.** Do not name customers or clients. Do not describe a company's internal systems beyond what Nadeem has said is public. Anything he has marked private stays out of every file, including docs and commit messages. When unsure, ask.
4. **Honest scope.** State project status plainly (pre-launch, in progress, shipped, experiment). Do not oversell prototypes.
5. **Technical and impersonal.** Never mention family, relationships, follower counts of someone else's account, or any personal life detail in site content, docs or commit messages. Write for a technical reviewer: the problem, the decisions, the evidence. This applies to every project, always.
6. **Employer and stealth work stays out.** Do not write about a current employer's projects or internal systems, or about any project Nadeem hasn't said is public. If he mentions a project as private or in stealth, it appears in no file in the repo, including docs, handoff notes and commit messages. Side projects and open-source tooling are fine; label each honestly as "built at work" or "side project".
7. **Grayscale site.** Never add colour, emoji or decorative symbols to content. (Rumi the cat is the only coloured thing, and he lives in code, not content.)

## 1. Voice (and what to leave out) (the whole site must sound like one person)

Nadeem **speaking**, first person, to a smart colleague over coffee.

- "I", "my", contractions (I'm, I've, it's, didn't, won't). Never "the author" or "we" unless a team did the work.
- Short sentences. One idea each. Concrete nouns and verbs. Read it aloud: if he would not say it, rewrite it.
- Past tense for what was built; present tense for what is true now.
- Warm and plain. A little dry humour is fine; jokes must never cost clarity.
- Tell it as a story: **a stake, a constraint, a twist, a resolution.**
- No hype ("revolutionary", "seamless", "cutting-edge", "game-changing", "passionate", "leverage", "unlock"). No filler openers ("In today's fast-paced world"). No sign-offs.
- Do not use em dashes. Use a colon, a comma or a full stop.
- Spell in British or Indian-English-neutral style consistently with existing content (e.g. "catalogue", "personalise"). When unsure, copy the nearest existing sentence.

Sample lines in the right voice:

> "Payment providers don't promise to tell you something once. They promise to tell you at least once, and they retry when they think you didn't hear."
>
> "I built it in about an hour of monitored vibe-coding, to solve my own lazy need."

## 2. Where files go (Keystatic schema is in `keystatic.config.ts`)

| Content | File | Page |
| --- | --- | --- |
| Side-project case study | `content/projects/<slug>.mdx` | `/projects/<slug>` |
| Build log / blog post | `content/logs/<slug>.mdx` | `/logs/<slug>` |
| Open-source tool page (`origin: work` or `side`) | `content/tools/<slug>.mdx` | `/open-source/<slug>`, listed on `/work` or `/projects` |
| Profile, home sentences, recruiter sheet, UI strings | `content/*.yaml` | everywhere |

Slugs are kebab-case and match the title. Dates are `YYYY-MM-DD`. YAML values containing `: ` must be quoted. Never edit `keystatic.config.ts` or components to add content; if the schema lacks a field, tell Nadeem.

## 3. Case study (project)

Frontmatter: `title, oneLiner, role, year, timeline, team, status, stack[], liveUrl, codeUrl, coverArt (blueprint | storefront), coverNodes[], coverStats[{value,label}], featured, order`. `cover` (an image) is optional.

**No screenshot?** Do not leave a gap. Set `coverArt` and fill `coverNodes` (4 to 6 architecture nodes in flow order) and `coverStats` (up to 3 headline numbers). The site draws the cover.

Body structure (each `##` becomes a numbered chapter and a TOC entry):

1. **The stake**: who is affected, what breaks if it goes wrong, why it is harder than it looks. Say the status honestly.
2. **The rules I set before writing code**: 2 to 4 promises as plain sentences.
3. A `<Flow>` diagram of the path of one request or unit of work, with the node where the hardest promise is kept highlighted.
4. **One chapter per hard problem** (3 to 5): the failure in plain words → what I built → the test or measurement that proves it → a `<Decision>` block.
5. A `<Metrics>` block: 3 numbers he can back up.
6. **What I'd change**: one honest paragraph. If Nadeem says he would change nothing, write what held up and name the trade-offs already admitted, never invent regrets.

## 4. Build log (blog post)

Frontmatter: `title, date, summary (one sentence, used for SEO and the card), tags[] (1 to 3, reuse existing tags), cover optional`.

- 600 to 1,500 words. Open with the problem or the habit, not with background.
- Chapters (`##`) of 80 to 250 words. A `<Decision>`, `<Code>` or `<Figure>` roughly every two chapters.
- Teach something transferable: what the reader can do differently on Monday.
- Always end with **What I'd change**, honest and short.
- Posts about tools or AI workflow: say what he actually uses and what each is for, and separate **"what I use"** from **"what I'm still learning"**. Never claim experience he hasn't described.

## 5. Open-source tool page (short)

Frontmatter: `title, tagline, kind, origin (work | side), status, stack[], repoUrl, siteUrl, install, order`. Body (under 250 words): **What it is** → **Why I built it** → **Use it** (install command and a 5-line example). Placeholders for anything unknown, especially repo URLs and usage examples.

## 6. MDX blocks (use exactly this syntax)

```mdx
<Decision
  chose="What he picked."
  because="The constraint or evidence."
  tradeoff="What he gave up."
/>

<Metrics items={[{ value: "0 oversells", label: "across 25 rounds of 50 parallel buyers" }]} />

<Flow
  caption="…"
  nodes={[{ title: "Storefront", note: "Next.js", highlight: false }]}
/>

<Code filename="x.ts" code={`…`} />

<Figure src="/figures/x.png" alt="…" caption="…" />
```

Plain Markdown otherwise: `##` headings only (no `#`, no `###` unless essential), `-` lists, **bold** for the one key phrase per paragraph.

## 7. Checklist before you reply

- [ ] Every fact traceable to Nadeem or the repo; no invented names or numbers.
- [ ] Sounds spoken, first person, no hype, no em dashes.
- [ ] Frontmatter complete; YAML quoted where needed; MDX blocks valid.
- [ ] Cover handled (image, or `coverArt` + nodes + stats).
- [ ] "What I'd change" present and honest.
- [ ] Nothing private or customer-identifying.
- [ ] A final list of every `[placeholder]` and every assumption you made.
- [ ] `pnpm typecheck` and `pnpm build` pass if you changed anything under `content/`.

## 8. Prompt to paste

> Read `docs/WRITING-GUIDE.md`. Write a **{case study | build log | tool page}** about **{topic}** and save it to the right path. Facts: {paste}. Mark anything you don't know as `[placeholder: …]` and list them at the end.
