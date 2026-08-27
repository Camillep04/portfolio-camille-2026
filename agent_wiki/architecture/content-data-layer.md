---
type: Architecture
title: Content data layer
description: Every repeated page dataset — photos, projects, CV timelines — is a typed array under src/app/data/, rendered with @for.
tags: [content, angular, data, maintainability]
resource: /src/app/data
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-27T00:00:00Z }
sources:
  - id: workflow
    resource: /specs/content-update-workflow.md
    title: Content update workflow
---

# What it is

`src/app/data/` holds the site's editable content as TypeScript, one file per
kind. Each page component imports its array and renders it with Angular's
`@for`. Before session 4 this content was hand-written HTML repeated once per
item; see [content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

| File | Exports | Rendered by | Count |
|---|---|---|---|
| `photos.ts` | `Photo`, `PHOTOS` | [PhotoComponent](/components/photo-page.md) | 35 |
| `projects.ts` | `Project`, `PROJECTS` | [AudiovisuelComponent](/components/audiovisuel-page.md) | 10 |
| `cv.ts` | `TimelineEntry`, `EXPERIENCES`, `EDUCATION` | [AccueilComponent](/components/accueil-page.md) | 5 + 3 |

# The rules that make it work

* **Array order is display order.** No `sort`, no positional CSS. Moving an
  object moves the item on the page. This is what the owner asked for — new
  projects at the top, photo order changeable — and it only holds because
  nothing downstream depends on position:
  * photo thumbnails flow through a CSS-columns masonry, not a hand-packed
    Bootstrap grid;
  * each project carries its own `background` (it used to be a
    `main section:nth-child(N)` rule, the reason reordering scrambled the page).
* **DOM ids are derived per item** (`modalPhoto-<photo.id>` etc.), so the
  duplicate-id class of bug is structurally impossible. See
  [duplicate DOM ids](/issues/duplicate-dom-ids.md).
* **A missing field fails `ng build`**, not renders blank — the interfaces are
  not optional where the template isn't.
* **Specs assert `rendered.length === DATA.length`** for each dataset, so a
  template that silently drops items fails CI.

# What is still markup

The "Compétences" logo marquee and the five polaroid links at the bottom of the
home page were left as hand-written markup. The marquee's animation timing is
width-based on its child count, and neither is named in
[the roadmap](/plans/remediation-roadmap.md).

# Adding HTML inside a field

`Project.description` is rendered with `[innerHTML]`, so it may contain links
(`<a>`, `<u>`, `<br>`); Angular's sanitizer strips scripts and styles. Photo
and CV text is interpolated plain.

# Related

* [Content update workflow](/specs/content-update-workflow.md) — the target this reaches
* [Angular application shell](/architecture/angular-shell.md)
