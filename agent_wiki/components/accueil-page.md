---
type: Component
title: AccueilComponent (home page)
description: The home page — hero, bio, skills, two timelines, a photo teaser. The timelines are data-driven since session 4; the rest is still hand-written.
tags: [component, page, content]
resource: /src/app/accueil/accueil.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

> Parts of this concept below the section map predate sessions 2–4 and describe
> the original theme wiring (Font Awesome dots, `indexCam.js`). Session 2 moved
> the typewriter into the component and switched the dots to bootstrap-icons;
> session 4 made the timelines data-driven. Treat the "surprises" section as
> historical until re-verified.

# What it is for

Route `''`. The longest-lived page. The "Expériences" and "Formations"
timelines are now [`EXPERIENCES` / `EDUCATION` in `cv.ts`](/architecture/content-data-layer.md);
adding an entry is one object.

~340 lines of template, empty class beyond the typewriter state and the two
data arrays.

# Section map

| Line | `id` | Content |
|---|---|---|
| 1 | `welcome-hero` | Hero. `J'aime m'amuser en :` followed by a typewriter effect |
| 20 | `about` | *Qui est Camille ?* — bio, social SVG links, CV download, an embedded YouTube CV video (line 63) |
| 86 | `clients` | *Compétences* — progress bars |
| ~138 | — | *Plongez dans mon univers* — two "TICKET" cards linking to `/audiovisuel` and `/photo` |
| ~200 | `experiences` | *Expériences* — `@for` over `EXPERIENCES` (5 entries, 2022–2026) |
| ~240 | `formations` | *Formations* — `@for` over `EDUCATION` (3 entries, Bac 2021 → Master 2025-2027) |
| ~270 | — | *PHOTO* — 5 polaroids, each linking to `/photo` |

# The duplicate `id="education"` — fixed

Both sections carried `id="education"` (invalid HTML;
`getElementById('education')` only ever found *Expériences*). Session 4 split
them into `id="experiences"` and `id="formations"` while making them
data-driven. A spec now asserts section ids on the page are unique. See
[duplicate DOM ids](/issues/duplicate-dom-ids.md).

# The typewriter effect

`public/js/indexCam.js` targets `#text` and cycles through
`["vidéo", "photo", "cinéma", "création", "développement", ":)"]`. It guards
with `if (!placeholder) return;`, so it fails silently on other routes — but it
also fails on a **client-side navigation back to `/`**, because it runs once at
`DOMContentLoaded` and never re-runs.

That element is also the page's **only `<h1>`**, and it is nested illegally:

```html
<h2 class="pb-5">J'aime m'amuser en :<span><h1 class="writing" id="text"></h1></span></h2>
```

An `<h1>` inside a `<span>` inside an `<h2>`, whose text content is a JS
animation rather than Camille's name. See
[missing SEO metadata](/issues/missing-seo-metadata.md).

# What surprises you

* **Bootstrap 5 utility classes that do nothing.** `gap-4` on the ticket cards
  (BS5 only) and `row-cols-*` on the polaroid row (BS 4.4+, but the CDN is
  pinned to 4.0.0). Both silently ignored. See
  [Bootstrap version conflict](/issues/bootstrap-version-conflict.md).
* **`<i class="fa fa-circle">` × 8 renders nothing** — Font Awesome's stylesheet
  is not linked. The timeline dots are invisible. See
  [unlinked stylesheets](/issues/unlinked-stylesheets.md).
* **Progress bars never animate.** `custom.js` binds `.progress-bar` via
  `jquery.appear` at `$(document).ready`, before this component renders.
* **Lines 465–500 are commented-out polaroid blocks.** See
  [dead commented markup](/issues/dead-commented-markup.md).
* **13 content images carry `alt=""`**, and `img/camera.png` (×5),
  `img/3d.png` (×3), `img/vecteur.png` carry no `alt` at all.

# Adding an experience

Add a `TimelineEntry` object to `EXPERIENCES` (or `EDUCATION`) in
[`src/app/data/cv.ts`](/architecture/content-data-layer.md) — `period`,
`headline`, `place`, `description`. Array order is display order.

Still hand-written on this page: the "Compétences" logo marquee and the five
polaroid links.

# Related

* [Content update workflow](/specs/content-update-workflow.md)
* [AudiovisuelComponent](/components/audiovisuel-page.md)
* [PhotoComponent](/components/photo-page.md)
