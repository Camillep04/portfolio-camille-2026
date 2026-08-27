---
type: Issue
title: 34 MB of images served at full resolution, plus a 2.1 MB favicon
description: The portfolio ships megabyte-scale PNGs and JPEGs eagerly, and the favicon alone is 2.1 MB on every page view.
tags: [performance, assets, p2, partially-resolved]
resource: /public/img
status: stable
priority: P2
verification: confirmed-in-production
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

**Partially resolved 2026-08-27, session 3.** Items 1 and 2 of the fix list
below are done, and item 3 is started but not finished:

* Favicon regenerated: it turned out to be a 3712x3712 JPEG mislabeled `.ico`.
  Now a proper 16/32/48 multi-resolution ICO at **15 kB**.
* `loading="lazy"` added to all 70 `<img>` tags in `photo.component.html`.
* `public/img` recompressed in place — PNGs losslessly, JPEGs at quality 92
  (owner chose visually-lossless over true-lossless, since true-lossless only
  shaves a JPEG's Huffman tables and doesn't touch its DCT coefficients).
  **34 MB -> 28 MB.** The win was uneven: `clip_mmi.jpg` dropped 61% (4.5 MB ->
  1.8 MB), but the large *photographic* PNGs — `wg.png` (3.3 MB), `mf.png`
  (1.9 MB), `mr.png` (1.4 MB) — only shrank a few percent, because a lossless
  format applied to a photo is close to incompressible no matter how it's
  packed. **Format conversion (PNG -> WebP/JPEG) is still open** and is where
  the next real win is.

Items 4 (`NgOptimizedImage`) and 5 (dedupe `.jpg`/`.png` pairs) are untouched.

# Symptom

The site is very heavy to load, especially on mobile.

# Evidence

Measured on 2026-08-26:

```
public/img            34 MB
  portfolio/          27 MB
  galerie/           4.8 MB
public/favicon.ico   2,195,353 B   <- for a 16x16 icon
```

Worst individual files:

| File | Bytes |
|---|---|
| `img/portfolio/clip_mmi.jpg` | 4,550,980 |
| `img/portfolio/wg.png` | 3,337,424 |
| `img/portfolio/affiche-stand.png` | 2,295,457 |
| `img/portfolio/magical_forest.jpg` | 1,977,851 |
| `img/portfolio/mf.png` | 1,975,832 |
| `img/20.jpg` | 1,326,880 |

# Compounding factors

* **`photo.component.html` renders 70 `<img>` tags** — 35 thumbnails plus 35
  full-size copies inside the modals — and `grep -c 'loading="lazy"'` returns
  **0**. All eager, on first paint.
* Two `.webp` files exist (`20.webp`, `camille.webp`), so the conversion was
  started and abandoned; the 27 MB `portfolio/` folder has none.
* Several images exist as both `.jpg` and `.png`: `clip_mmi`, `inlive-sport`,
  `mmi`.

# Fix, cheapest first

1. **Regenerate the favicon at 15 kB or less.** One file, biggest per-view win.
2. **Add `loading="lazy"`** to the gallery images. One attribute, 70 places —
   or one place after the [refactor](/issues/content-hardcoded-in-templates.md).
3. **Compress and convert `public/img/portfolio` to WebP**, resizing to the
   dimensions actually displayed.
4. Consider `NgOptimizedImage` (`ngSrc` + `width`/`height`), which gives lazy
   loading, `srcset` and LCP priority for free.
5. Dedupe the `.jpg`/`.png` pairs.

# Related

* [public/ static assets](/components/public-assets.md)
* [PhotoComponent](/components/photo-page.md)
