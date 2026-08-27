---
type: Spec
title: Content update workflow
description: What it actually takes to add a project, a photo or an experience today — the workflow every refactor is judged against.
tags: [workflow, content, maintainability]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

**Target reached, 2026-08-27 (session 4).** All four datasets — `PHOTOS`,
`PROJECTS`, `EXPERIENCES`, `EDUCATION` — are typed arrays under
[`src/app/data/`](/architecture/content-data-layer.md), rendered with `@for`.
Adding an item is one object in one `.ts` file; a missing field fails
`ng build`; specs assert rendered count == data length; ids are per-item. The
"workflow today" table below is the *old* state, kept for the record.

# Why this concept exists

This portfolio is maintained by its owner, who codes competently but not
professionally. The thing that matters most about this codebase is not its
architecture in the abstract — it is **how much work and how much risk is
involved in adding one item**. Every proposed change should be evaluated against
this workflow.

# The workflow today

| To add… | You must | Lines touched |
|---|---|---|
| **A project** | Duplicate a `<section id="filmN">` in `audiovisuel.component.html`, increment N by hand, replace title/description/image/link, keep two ~15-line inline SVGs and a dead popup block. Optionally also touch `accueil.component.html`. | ~60, in 1–2 files |
| **A photo** | Duplicate ~25 lines **twice** in `photo.component.html` — once for the thumbnail, once for the modal — and increment `modalPhotoN`. Drop the image into `public/img/galerie/`. | ~50, in a 958-line file |
| **An experience or diploma** | Duplicate ~22 lines of timeline markup in the right one of the two `education` sections in `accueil.component.html`. | ~22 |

Then: build, check locally, and ask the owner to merge. See
[branch workflow](/specs/branch-workflow.md).

# What goes wrong, structurally

The duplication is not a style complaint — it is the direct cause of most of
this wiki's issue list:

* Copying markup copies **ids**, producing 35 `exampleModalLongTitle`, 16
  `SVGRepo_iconCarrier`, 10 `youtube-iframe`, 5 `popup-container` and 2
  `education`. See [duplicate DOM ids](/issues/duplicate-dom-ids.md).
* Copying markup copies **mistakes**, including the dead
  `onclick="closePopup()"` now present five times.
* Nothing is type-checked. A forgotten field renders blank instead of failing
  the build.
* `audiovisuel.component.css` grows with each project, toward a budget with
  [no warning band](/issues/component-style-budget-no-headroom.md).
* No test can meaningfully assert "all ten projects render", because there is
  no source of truth for "ten".

# The target workflow

Adding an item should be **editing one typed object in one `.ts` file**:

```ts
// src/app/data/projects.ts
export const PROJECTS: Project[] = [
  { id: 'athlete-reve', title: '…', year: 2024, image: 'img/portfolio/affiche-stand.png', link: '…' },
  // adding a project = adding an object here
];
```

rendered with Angular control flow:

```html
@for (p of projects; track p.id) {
  <app-project-card [project]="p" />
}
```

Success criteria for the refactor:

1. One file to edit per new item, no markup duplication.
2. A missing or misspelled field **fails `ng build`**, rather than rendering
   blank.
3. A regression test can assert
   `queryAll(By.css('section')).length === PROJECTS.length`.
4. Ids are generated per item, so the duplicate-id class of bug is impossible.

Tracked as [content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
and staged in [the remediation roadmap](/plans/remediation-roadmap.md).

# Related

* [AudiovisuelComponent](/components/audiovisuel-page.md)
* [PhotoComponent](/components/photo-page.md)
* [AccueilComponent](/components/accueil-page.md)
