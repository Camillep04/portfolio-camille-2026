---
type: Component
title: index.html (the global script and style loader)
description: The single page shell where every global stylesheet and script is loaded, in an order that actively breaks the site.
tags: [component, html, legacy, bugs]
resource: /src/index.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

The SPA host page. Angular replaces `<app-root>`; everything else in this file
is the [legacy template layer](/architecture/two-layer-frontend.md) being
bootstrapped globally, outside Angular's knowledge.

It is a small file with an outsized blast radius: four separate live defects
live here, and several more elsewhere are downstream of it.

# What it loads

**Stylesheets, in order:**

1. `css/flaticon.css`
2. `css/bootstrap.min.css` (Bootstrap **3.3.6**)
3. `css/bootsnav.css`
4. `css/style.css` (the theme's main sheet)
5. `https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css` — Bootstrap **4.0.0**, loaded last, so it wins

Four sheets that exist in `public/css/` are **never linked**:
`font-awesome.min.css`, `animate.css`, `responsive.css`, `owl.carousel.min.css`,
`owl.theme.default.min.css`. See [unlinked stylesheets](/issues/unlinked-stylesheets.md).

**Scripts, in order** — eleven tags, none with `defer`:

```
js/jquery.js                    jQuery 2.2.4
modernizr 2.8.3 (CDN)           nothing queries it
js/bootstrap.min.js             Bootstrap 3.3.7
js/bootsnav.js, jquery.sticky.js, progressbar.js, jquery.appear.js, owl.carousel.min.js
jquery-easing (CDN)
js/custom.js, js/indexCam.js, js/portfolioCine.js, js/popup.js
src/app/assets/magnific-popup/jquery.magnific-popup.js   ← 404, path does not exist
//ajax.googleapis.com/.../jquery/1.9.1/jquery.min.js     ← jQuery 1.9.1, LAST
bs5-lightbox (CDN)              expects Bootstrap 5, which is not present
```

# The four defects in this file

| Line | Defect | Concept |
|---|---|---|
| `<html lang="en">` | The whole site is French | [html lang mismatch](/issues/html-lang-mismatch.md) |
| last jQuery tag | jQuery 1.9.1 loads **after** every plugin registered against 2.2.4, wiping them | [duplicate jQuery load order](/issues/duplicate-jquery-load-order.md) |
| magnific-popup tag | Path `src/app/assets/...` does not exist and would not ship anyway | [magnific-popup 404](/issues/magnific-popup-script-404.md) |
| `<head>` | No meta description, no Open Graph, no per-route title | [missing SEO metadata](/issues/missing-seo-metadata.md) |

Plus the whole block is render-blocking — see
[render-blocking scripts](/issues/render-blocking-scripts.md) — and mixes three
Bootstrap majors, see
[Bootstrap version conflict](/issues/bootstrap-version-conflict.md).

# Contract to preserve when editing

* `<base href="/">` must stay — Angular routing depends on it.
* `<app-root></app-root>` must stay.
* Script *order* is load-bearing for the legacy layer: jQuery must precede its
  plugins, and the plugins must precede `custom.js`. Reordering casually will
  break the nav.

# Related

* [public/ static assets](/components/public-assets.md)
* [Khanas HTML template](/references/khanas-template.md)
