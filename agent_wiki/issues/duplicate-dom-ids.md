---
type: Issue
title: Duplicate DOM ids throughout the app
description: 35 modal titles share one id and aria-labelledby points at an id that does not exist, so screen readers announce nothing.
tags: [a11y, html, p1, live-bug, resolved]
resource: /src/app
status: deprecated
priority: P1
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
  - id: live
    resource: /references/live-site.md
    title: Live site checks, 2026-08-26
---

**Resolved across sessions 2 and 4.** As of session 4, extracting every
static `id="..."` literal from the templates and running `sort | uniq -d`
returns nothing — the only ids left are `@for`-generated per-item slugs.

* Session 2 removed `youtube-iframe` ×10 and `popup-container` ×5 with the dead
  popup markup ([dead inline script](/issues/dead-inline-script-audiovisuel.md)).
* Session 4:
  * `exampleModalLongTitle` ×35 → `modalPhotoTitle-<slug>`, unique;
    `aria-labelledby` now resolves.
  * `id="education"` ×2 → `id="experiences"` / `id="formations"`.
  * The `SVGRepo_*` boilerplate ids (16 each, app-wide) were dropped when the
    two project SVGs moved into the template once instead of being copied per
    project.

Specs on both pages assert id uniqueness. See
[content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

# Symptom

Invalid HTML, `getElementById` always returning the first match, and screen
readers announcing nothing for the photo gallery.

# Evidence

Counted across `src/app` on 2026-08-26:

| id | occurrences | file |
|---|---|---|
| `exampleModalLongTitle` | **35** | `photo.component.html` |
| `SVGRepo_bgCarrier` / `iconCarrier` / `tracerCarrier` | **16 each** | copied icon markup, app-wide |
| `youtube-iframe` | **10** | `audiovisuel.component.html` |
| `popup-container` | **5** | `audiovisuel.component.html` |
| `education` | **2** | `accueil.component.html`, lines 200 and 324 |

The accessibility failure is worse than duplication alone: every modal carries
`aria-labelledby="modalPhotoTitle"`, and **no element anywhere has that id** —
the real title id is `exampleModalLongTitle`. So the label resolves to nothing
for all 35 modals.

# Root cause

Not 35 separate mistakes. One mistake, copy-pasted 35 times. This is what
[the content update workflow](/specs/content-update-workflow.md) produces by
construction.

# Fix

Two layers:

1. **Immediate:** fix `aria-labelledby` to point at a real id, and rename the
   two `education` sections.
2. **Structural:** template the repeated blocks so ids are generated per item —
   `[id]="'modal-' + photo.id"`. Then this class of bug becomes impossible. See
   [content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

Doing only (1) means it recurs on the next photo added.

# Related

* [PhotoComponent](/components/photo-page.md)
* [missing alt text](/issues/missing-alt-text.md)
