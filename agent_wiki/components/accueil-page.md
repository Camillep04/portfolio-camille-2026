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

Route `''`. The longest-lived page. The CV timeline is now
[`TIMELINE` in `cv.ts`](/architecture/content-data-layer.md); adding an entry
is one object in `EXPERIENCES` or `EDUCATION`.

# Section map

| Line | `id` | Content |
|---|---|---|
| 1 | `welcome-hero` | Hero. `J'aime m'amuser en :` followed by a typewriter effect |
| 20 | `about` | *Qui est Camille ?* — bio, social SVG links, CV download, an embedded YouTube CV video (line 63) |
| 86 | `clients` | *Compétences* — B&W logo marquee (progress bars are gone) |
| ~138 | — | *Plongez dans mon univers* — two "TICKET" cards linking to `/projets` and `/photo` |
| ~196 | `parcours` | *Expériences* + *Formations* — one `@for` over `TIMELINE` (8 items) |
| ~220 | — | *PHOTO* — 5 polaroids, each linking to `/photo` |

# The "parcours" timeline (session 6, item 23)

`#experiences` and `#formations` were two separate `@for` sections until
session 6. They are now **one `#parcours` section**: a shared vertical red
axis, experiences to its left, formations to its right, interleaved by date
(`TIMELINE`). Each card has a big watermark year (`.tl-year`) in the empty
space opposite it.

* Layout is CSS grid (`.tl-item`: `1fr` / rail / `1fr`), **not** the theme's
  `.education-horizontal-timeline` — those `public/css/style.css` rules are no
  longer referenced. The rail is `.xp-timeline::before`, the per-entry dot is
  `.tl-item::after`.
* Both grid children are pinned to `grid-row: 1` — without it, auto-placement
  drops the card onto a second row (DOM order is year-then-card).
* Below **992px** it collapses to a single left-rail stack; `.tl-year` hides
  and the `.tl-period` line inside the card shows the period instead.
* Specs assert one `.tl-item` per `EXPERIENCES` / `EDUCATION` entry and that
  the strand is ordered most-recent-first.

Earlier fix, still true: both sections once carried `id="education"` (invalid
HTML). Session 4 split them; session 6 merged them under one clean id. See
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
  (BS5 only) and `row-cols-md-*` / `row-cols-lg-*` on the polaroid row (BS 4.4+,
  but the CDN is pinned to 4.0.0), so the polaroids render 2-up, not 5-up. Both
  silently ignored. See
  [Bootstrap version conflict](/issues/bootstrap-version-conflict.md).
* **The polaroid `.row` is wrapped in `.container-fluid`** (Session 8). Without
  a padded parent, the row's `-15px` gutter margins bled past the viewport and
  gave the whole page ~15px of horizontal scroll.
* **Progress bars never animate.** `custom.js` binds `.progress-bar` via
  `jquery.appear` at `$(document).ready`, before this component renders.
  *(The parcours timeline no longer uses Font Awesome dots — session 6.)*
* **Lines 465–500 are commented-out polaroid blocks.** See
  [dead commented markup](/issues/dead-commented-markup.md).
* **13 content images carry `alt=""`**, and `img/camera.png` (×5),
  `img/3d.png` (×3), `img/vecteur.png` carry no `alt` at all.

# Adding an experience

Add a `TimelineEntry` object to `EXPERIENCES` (or `EDUCATION`) in
[`src/app/data/cv.ts`](/architecture/content-data-layer.md) — `period`,
`headline`, `place`, `description`. `TIMELINE` re-derives: `kind` picks the
side, the most-recent year in `period` places it in the strand and becomes
the watermark. Within a `period` array, order only matters as the tie-break
between entries of the same year.

Still hand-written on this page: the "Compétences" logo marquee and the five
polaroid links.

# Related

* [Content update workflow](/specs/content-update-workflow.md)
* [AudiovisuelComponent](/components/audiovisuel-page.md)
* [PhotoComponent](/components/photo-page.md)
