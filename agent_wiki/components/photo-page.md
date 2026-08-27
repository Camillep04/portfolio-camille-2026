---
type: Component
title: PhotoComponent (gallery page)
description: The photo gallery — 35 photos from PHOTOS in photos.ts, a CSS-columns masonry over one Angular-driven lightbox with carousel arrows.
tags: [component, page, content]
resource: /src/app/photo/photo.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'photo'`. A single `<section id="portfolio">` holding Camille's photo
gallery, an Instagram call to action at its foot, plus a decorative CSS
polaroid camera.

# The shape (since session 4)

The template is a `@for` over
[`PHOTOS` in `photos.ts`](/architecture/content-data-layer.md) — 958 lines of
hand-copied markup became ~70. Each `Photo` is `{ id, title, src, description? }`.
The loop now renders only a thumbnail button per photo; clicking it calls
`open($index)`.

`id` is a stable slug (`ballet-de-meduses`), used for the `@for` track. `src` is
decoupled from position — `img/galerie/12.jpg` can sit first.

# The lightbox (since session 5)

The 35 Bootstrap modals are gone. One Angular-driven overlay, rendered by
`@if (activePhoto)`, replaces them — the carousel needs a single reused dialog
anyway. Component state is `activeIndex: number | null`:

* `open(i)` / `close()` — `close()` also restores `document.body` scroll.
* `next()` / `prev()` — modulo `photos.length`, so they wrap at both ends.
* `@HostListener('document:keydown')` — Escape closes, ArrowLeft/ArrowRight
  browse. On-screen `‹` / `›` buttons do the same.
* backdrop click closes; clicking the `<figure>` does not (`stopPropagation`).

The image is flex-centred vertically and horizontally (the owner's "centrer les
images verticalement"). The title always shows; `description` shows beneath it
**only when the `Photo` has one** — none are set in `photos.ts` yet, the field
is ready for the owner to fill.

Specs assert: thumbnail count == `PHOTOS.length`, click opens the right photo,
wraparound, the description renders only when present, and the Instagram link
points at `https://www.instagram.com/p___camille/`.

# What sessions 4–5 fixed here

| Before | After |
|---|---|
| `id="exampleModalLongTitle"` × 35 | no per-photo modal ids at all — one lightbox |
| `alt="portfolio image"` × 35 | `alt` is the photo's title |
| Hand-packed `col-sm-4` columns | CSS-columns masonry (`column-count: 3`, `1` under 576px) that reflows on reorder with no stair-step gaps |
| dead `.isotope` / `.popup-gallery` markup | gone |
| 35 Bootstrap 3/4 modals driven by BS3 JS | one Angular lightbox, no Bootstrap JS (session 5) |
| popup opened behind the navbar; `.modal.fade.in` transform hack | not applicable — the lightbox is `position: fixed; inset: 0` |

Removing the modals also removed this page's dependence on the Bootstrap
JS/CSS version clash for the gallery. See
[Bootstrap version conflict](/issues/bootstrap-version-conflict.md) and
[photo modal opens behind the navbar](/issues/photo-modal-opens-behind-navbar.md)
(both now moot here).

# Related

* [Content data layer](/architecture/content-data-layer.md)
* [Content update workflow](/specs/content-update-workflow.md)
* [oversized images](/issues/oversized-images.md) — the gallery JPEGs, still the open WebP work
