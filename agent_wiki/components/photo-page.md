---
type: Component
title: PhotoComponent (gallery page)
description: 958 lines of template rendering 35 photos twice — thumbnail and modal — with 35 duplicate ids and no lazy loading.
tags: [component, page, content, performance]
resource: /src/app/photo/photo.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'photo'`. A single `<section id="portfolio">` holding Camille's photo
gallery. **958 lines** — the largest file in the project — against 10 lines of
CSS and an empty class.

# The shape

35 photos, each written out **twice**:

1. a thumbnail in the grid,
2. a full-size copy inside its own Bootstrap modal.

That is **70 `<img>` tags**, and `grep -c 'loading="lazy"'` returns **0** — all
70 load eagerly on first paint, from a `public/img/galerie/` folder totalling
4.8 MB. See [oversized images](/issues/oversized-images.md).

Adding one photo means duplicating ~25 lines in two places and incrementing
`modalPhotoN` by hand.

# The accessibility failure

| Problem | Detail |
|---|---|
| `id="exampleModalLongTitle"` × **35** | Every modal title shares one id |
| `aria-labelledby="modalPhotoTitle"` | Points at an id that **does not exist anywhere** |
| `alt="portfolio image"` on all 35 | Identical, meaningless alt text |

A screen reader announces nothing useful for any of the 35 modals. See
[duplicate DOM ids](/issues/duplicate-dom-ids.md) and
[missing alt text](/issues/missing-alt-text.md).

The modals themselves use Bootstrap 3/4 markup — `data-toggle`, `data-dismiss`,
`.close` — which functions only because BS3's JavaScript is what actually runs.
A Bootstrap 5 migration must rewrite all 35. See
[Bootstrap version conflict](/issues/bootstrap-version-conflict.md).

# The lightbox that never worked

`public/js/popup.js` initialises magnific-popup on `.popup-gallery`. It cannot
work: the plugin's `<script>` tag in
[index.html](/components/index-html.md) points at a path that does not exist,
so `$(...).magnificPopup` is not a function. Separately,
`bs5-lightbox` is loaded from a CDN and is inert because Bootstrap 5 is absent.

Three lightbox mechanisms, none functioning; the Bootstrap 3 modals are what
actually opens a photo. See
[magnific-popup 404](/issues/magnific-popup-script-404.md).

# Where the payoff is

This is the file that benefits most from the data-driven refactor: a `PHOTOS`
array plus a ~30-line template replaces 958 lines, and the duplicate-id class of
bug disappears by construction. See
[content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

# Related

* [Content update workflow](/specs/content-update-workflow.md)
