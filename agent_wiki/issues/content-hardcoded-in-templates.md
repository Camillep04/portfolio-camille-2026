---
type: Issue
title: All content is hand-duplicated markup with no data layer
description: Adding one project or photo means copy-pasting 25 to 60 lines of markup; this is the root cause of most other defects.
tags: [maintainability, angular, refactor, p3, root-cause, resolved]
resource: /src/app
status: deprecated
priority: P3
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-27, session 4.** Every content dataset now lives in typed
data under [`src/app/data/`](/architecture/content-data-layer.md) and renders
with `@for`: `photos.ts` (35 photos), `projects.ts` (10 projects), `cv.ts`
(`EXPERIENCES` + `EDUCATION`). The three page templates shrank from
958 / 427 / 501 lines to a loop each. Specs assert rendered count == data
length. Adding an item is one object in one file, type-checked at build.
Downstream issues cleared with it — see
[duplicate DOM ids](/issues/duplicate-dom-ids.md) (photo modal ids + the two
`education` sections) and [missing alt text](/issues/missing-alt-text.md) (the
gallery). The skills marquee and the home-page polaroid strip were left as
markup — not in scope, and touching the marquee risks its width-based
animation.

# Symptom

Routine content work is slow, error-prone, and reliably introduces new defects.

# Evidence

There is no data layer anywhere in the app — no service, no array, no
interface. Every project, photo, experience and diploma is hand-written HTML.

| To add | Work | File |
|---|---|---|
| A project | Duplicate ~60 lines including two ~15-line inline SVGs and a dead popup block, increment `id="filmN"` | `audiovisuel.component.html` (499 lines) |
| A photo | Duplicate ~25 lines **twice** (thumbnail + modal), increment `modalPhotoN` | `photo.component.html` (**958 lines**) |
| An experience | Duplicate ~22 lines of timeline markup | `accueil.component.html` (501 lines) |

# Why this is the root cause

Most of this wiki's issue list is downstream of it:

* [duplicate DOM ids](/issues/duplicate-dom-ids.md) — 35 identical modal title
  ids are one mistake copied 35 times
* [dead inline script](/issues/dead-inline-script-audiovisuel.md) — one broken
  `onclick` copied to five places
* [style budget](/issues/component-style-budget-no-headroom.md) — the CSS grows
  with every duplicated block
* [missing alt text](/issues/missing-alt-text.md) — one placeholder alt copied
  35 times
* [spec files are stubs](/issues/spec-files-are-stubs.md) — no meaningful test
  can be written, because there is no source of truth to assert against

# Fix

Typed data plus Angular control flow:

```ts
export interface Project {
  id: string; title: string; year: number;
  kind: 'video' | 'web' | '3d';
  description: string; image: string; link: string; linkLabel: string;
}
export const PROJECTS: Project[] = [ /* one object per project */ ];
```

```html
@for (p of projects; track p.id; let even = $even) {
  <section [id]="p.id" [class.reversed]="even">
    <app-project-card [project]="p" />
  </section>
}
```

Do the same for `PHOTOS`, `EXPERIENCES` and `EDUCATION`. Extract the repeated
play/heart/social SVGs into a sprite or small icon components.

# Payoff

* Adding a project becomes a nine-line object in one `.ts` file.
* It is **type-checked at build time** — a missing field fails `ng build`
  instead of rendering blank.
* A real regression test becomes possible:
  `expect(queryAll(By.css('section')).length).toBe(PROJECTS.length)`.
* Duplicate ids become structurally impossible.

Stage it one dataset at a time, `PHOTOS` first. See
[the roadmap](/plans/remediation-roadmap.md), session 4.

# Related

* [Content update workflow](/specs/content-update-workflow.md) — the full target spec
