# S01E03 review

This repository contains the course support-desk export and an added signed review.
The support desk, products, tenants, reports and incident are course scenario material.
The review describes the supplied export, not real production state or a live queue.

## Files

- `src/routes/kb/incidents/4471-review/+page.svx`: new review source.
- `src/lib/kb/ReviewEvidence.svelte`: computed report counts and timing evidence.
- `rendered/kb/incidents/4471-review/index.html`: server-rendered review with desk reference.
- `rendered/assets/kb.js`: browser hydration for the interactive explorer.
- `scripts/analyze.mjs`: reproducible groups and report IDs using the exported cause logic.

Original exported files have been preserved. The export's README describes its conventions.
The new page carries the course-issued signature in its frontmatter. RenderStamp derives its desk reference; neither value is typed into the rendered HTML.

## Reproduce

Use Node.js 22.23 or newer and npm. From this directory:

```sh
npm ci
node scripts/analyze.mjs
npm run render
npm run preview
```

Visit http://127.0.0.1:4833/kb/incidents/4471-review/ for the new page, or
http://127.0.0.1:4833/kb/ for the full exported knowledge base and review.
Ctrl+C stops the local preview. The server binds only to this computer.

The build compiles mdsvex and the actual Svelte components, resolves the `#lib` alias,
and evaluates the tenant glob. It generates HTML for all pages and a browser bundle;
the explorer remains interactive. Opening the HTML as a raw local file is insufficient
for its absolute `/assets` and `/kb` links; serve the `rendered` directory as above.

## Review checks

The original export has 427 rows and 412 distinct report IDs. Classifying with the actual
tenant locale, booking form, and channel gives 379 parser and 33 hint reports. The five
desk-noted one-day moves stay in the parser count and are explicitly unresolved symptoms.
Intake tags disagree with computed causes on 38 reports.

The July 2 merge spike is 184 reports, 183 received before that day. It is a processing
event rather than evidence that all those failures began on July 2.

Browser verification: the review shows both computed groups and the desk reference.
In the explorer, Alder Physio form versus Kettle Books form gives different causes despite
identical subjects. Changing Alder's channel to app gives the same cause. This verifies
that the delivered page runs its components instead of showing a hand-copied mockup.
