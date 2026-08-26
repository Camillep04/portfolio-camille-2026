---
type: Component
title: public/ static assets
description: The only directory copied into the build — 34 MB of images, a 2.1 MB favicon, and the legacy theme's CSS and JS.
tags: [component, assets, performance, legacy]
resource: /public
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

`angular.json` copies **`public/` and only `public/`** into the build output,
at the root. So an image referenced as `img/foo.jpg` in a template resolves
because it lives at `public/img/foo.jpg`.

The corollary catches people out: **`src/assets/` is never copied**. Anything
put there does not ship. See
[vendored magnific-popup repo](/issues/vendored-magnific-popup-repo.md).

# Contents

```
public/
  _redirects        SPA catch-all — duplicates netlify.toml's [[redirects]]
  favicon.ico       2.1 MB  ← for a 16x16 icon, on every page view
  angular.ico       15 kB, unused Angular CLI leftover
  css/              9 files, 4 of them never linked
  js/               11 files, 8 of them the legacy theme's
  img/              34 MB
    portfolio/      27 MB
    galerie/        4.8 MB
```

# The weight problem

`public/` is where essentially all of the site's payload lives, unoptimised.

| File | Size |
|---|---|
| `favicon.ico` | **2,195,353 B** |
| `img/portfolio/clip_mmi.jpg` | 4,550,980 B |
| `img/portfolio/wg.png` | 3,337,424 B |
| `img/portfolio/affiche-stand.png` | 2,295,457 B |
| `img/portfolio/magical_forest.jpg` | 1,977,851 B |
| `img/portfolio/mf.png` | 1,975,832 B |
| `img/20.jpg` | 1,326,880 B |

Two `.webp` files exist (`20.webp`, `camille.webp`), so the conversion was
started and abandoned. Several images exist as both `.jpg` and `.png`
(`clip_mmi`, `inlive-sport`, `mmi`). See
[oversized images](/issues/oversized-images.md).

# The scripts

Eight of the eleven JS files are the vendored theme's; three were written for
this project. All are loaded globally and unconditionally from
[index.html](/components/index-html.md) on every route, regardless of whether
the page uses them. Full breakdown in
[Khanas HTML template](/references/khanas-template.md).

`public/js/custom.js` is the important one to understand: it binds sticky
header, scrollspy, progress bars and Owl Carousel inside `$(document).ready`,
which fires **before** Angular renders the routed component. See
[empty component classes](/issues/empty-component-classes.md).

# Related

* [Two-layer frontend](/architecture/two-layer-frontend.md)
* [Build and deploy](/architecture/build-and-deploy.md)
