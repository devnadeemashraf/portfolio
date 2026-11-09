# Writing a case study the way `content/projects/h-h.mdx` does

Use this file as a prompt for an AI assistant, with the facts of the new project pasted below it. The rule above all others: **the assistant may only use facts you give it.** Anything unknown becomes `[placeholder: what is needed]`.

## Voice

- First person, past tense for what was built, present tense for what is true now.
- Narrate like a story told to a smart colleague: a stake, a constraint, a twist, a resolution.
- Plain, concrete words. No hype ("revolutionary", "seamless"). No claims without a number or a test behind them.
- Short paragraphs. One idea each. A figure or a decision block every few paragraphs.
- Name a mistake in the retro. Reviewers trust that.

## Structure (each `##` becomes a numbered chapter in the TOC)

1. **What was at stake**: who is affected, what breaks if it goes wrong, why it is harder than it looks. State the project's status honestly (pre-launch, internal, shipped).
2. **The rules I set before writing code**: 2 to 4 promises written as plain sentences (e.g. "A payment creates exactly one order").
3. **A `<Flow>` diagram** of the path of one request or one unit of work. Highlight the node where the hardest promise is kept.
4. **One chapter per hard problem** (3 to 5). Each: the failure in plain words, what you built, the test or measurement that proves it, then a `<Decision>` block.
5. **`<Metrics>`**: 3 numbers you can back up, each with what it measures and how it was measured (e.g. "in a local load test").
6. **What I would change**: one honest paragraph.

## Blocks

```mdx
<Decision
  chose="What you picked."
  because="The constraint or evidence."
  tradeoff="What you gave up."
/>

<Metrics items={[{ value: "0 oversells", label: "across 25 rounds of 50 parallel buyers" }]} />

<Flow caption="…" nodes={[{ title: "Storefront", note: "Next.js", highlight: false }]} />

<Code filename="x.ts" code={`…`} />
```

## Frontmatter

`title, oneLiner, role, year, timeline, team, status, stack[], liveUrl, codeUrl, coverNodes[], coverStats[{value,label}], featured, order`.

No screenshot? Fill `coverNodes` (4 to 6 architecture nodes, in flow order) and `coverStats` (up to 3). The site draws a blueprint cover from them. Never publish private customer details: describe the system, not the client.

## Prompt to paste

> Write a case study in the voice and structure of `docs/CASE-STUDY-STYLE.md`, as MDX with the frontmatter above. Use only the facts below; mark anything missing as `[placeholder: …]`. Facts: …
