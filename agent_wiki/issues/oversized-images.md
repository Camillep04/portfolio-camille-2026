---
type: Issue
title: 34 MB of images served at full resolution, plus a 2.1 MB favicon
description: The portfolio ships megabyte-scale PNGs and JPEGs eagerly, and the favicon alone is 2.1 MB on every page view.
tags: [performance, assets, p2]
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
