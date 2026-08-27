---
type: Component
title: PhotoComponent (gallery page)
description: The photo gallery — 35 photos from PHOTOS in photos.ts, rendered as a CSS-columns masonry with one Bootstrap modal each.
tags: [component, page, content]
resource: /src/app/photo/photo.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'photo'`. A single `<section id="portfolio">` holding Camille's photo
gallery, plus a decorative CSS polaroid camera.

# The shape (since session 4)

The template is a `@for` over
[`PHOTOS` in `photos.ts`](/architecture/content-data-layer.md) — 958 lines of
hand-copied markup became ~70. Each `Photo` is `{ id, title, src, description? }`.

Per photo the loop renders:

1. a thumbnail button in the masonry;
2. a Bootstrap modal, `id="modalPhoto-<id>"`, title `id="modalPhotoTitle-<id>"`.

`id` is a stable slug (`ballet-de-meduses`), used for the `@for` track and the
DOM ids, so reordering the array never collides two ids. `src` is decoupled
from position — `img/galerie/12.jpg` can sit first. `description` is unused
today; Session 5's popup will show it.

# What session 4 fixed here

| Before | After |
|---|---|
| `id="exampleModalLongTitle"` × 35 | `id="modalPhotoTitle-<slug>"`, unique |
| `aria-labelledby="modalPhotoTitle"` → nothing | points at the real per-photo id |
| `alt="portfolio image"` × 35 | `alt` is the photo's title |
| Hand-packed `col-sm-4` columns | CSS-columns masonry (`column-count: 3`, `1` under 576px) that reflows on reorder with no stair-step gaps |
| dead `.isotope` / `.popup-gallery` markup | gone |

Specs assert `.item` count and `.modal` count both equal `PHOTOS.length`, and
that modal ids are unique.

# The modals still use Bootstrap 3 JS

The markup is `data-toggle` / `data-dismiss` / `.close` — Bootstrap 3/4, driven
by the BS3 JS that actually runs. Session 2 fixed the "opens behind the navbar"
bug with `.modal.fade.in .modal-dialog { transform: none }`; that rule is still
here. A Bootstrap 5 migration will rewrite the one templated modal instead of
35. See [Bootstrap version conflict](/issues/bootstrap-version-conflict.md) and
[photo modal opens behind the navbar](/issues/photo-modal-opens-behind-navbar.md).

Session 5 (arrows + description in the popup) will likely replace the
Bootstrap modal with an Angular-driven single lightbox, since carousel
controls need one reused dialog anyway.

# Related

* [Content data layer](/architecture/content-data-layer.md)
* [Content update workflow](/specs/content-update-workflow.md)
* [oversized images](/issues/oversized-images.md) — the gallery JPEGs, still the open WebP work
