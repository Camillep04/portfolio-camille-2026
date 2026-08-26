---
type: Component
title: AccueilComponent (home page)
description: The 501-line home page — hero, bio, skills, two timelines, and a photo teaser — all hand-written markup with no data layer.
tags: [component, page, content]
resource: /src/app/accueil/accueil.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `''`. The longest-lived page and the one Camille edits most often when a
new experience or diploma is added.

501 lines of template, 325 lines of CSS, empty class.

# Section map

| Line | `id` | Content |
|---|---|---|
| 1 | `welcome-hero` | Hero. `J'aime m'amuser en :` followed by a typewriter effect |
| 20 | `about` | *Qui est Camille ?* — bio, social SVG links, CV download, an embedded YouTube CV video (line 63) |
| 86 | `clients` | *Compétences* — progress bars |
| ~138 | — | *Plongez dans mon univers* — two "TICKET" cards linking to `/audiovisuel` and `/photo` |
| 200 | `education` | *Expériences* — 5 timeline entries (2022–2026) |
| 324 | `education` | *Formations* — 3 timeline entries (Bac 2021 → Master 2025-2027) |
| ~406 | — | *PHOTO* — 9 polaroids, each linking to `/photo` |

# The duplicate `id="education"`

Lines 200 and 324 both carry `id="education"`. Invalid HTML;
`getElementById('education')` only ever finds *Expériences*. This is a symptom
of the copy-paste authoring pattern, not a one-off typo — see
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

# Adding an experience today

Duplicate ~22 lines of timeline markup inside the right `education` section and
edit the strings by hand. This is the workflow that
[content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
exists to replace.

# Related

* [Content update workflow](/specs/content-update-workflow.md)
* [AudiovisuelComponent](/components/audiovisuel-page.md)
* [PhotoComponent](/components/photo-page.md)
