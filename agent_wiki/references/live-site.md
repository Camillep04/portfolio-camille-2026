---
type: Reference
title: The live site
description: The production URL, and what the browser console actually reports there — every P1 prediction confirmed against the deployed build.
tags: [reference, deploy, verification]
resource: https://prothin-camille-portfolio.netlify.app
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T20:40:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# URL

**https://prothin-camille-portfolio.netlify.app**

Published by Netlify from `main` on every push — see
[build and deploy](/architecture/build-and-deploy.md). There is no staging URL;
this is the only deployed environment.

# Verified against production, 2026-08-26

Checked in a real browser against the deployed build, not read from source.
This turns most of the P1 list from "read in the code" into "observed live".

## Console errors on `/`

```
Uncaught SyntaxError: Unexpected token '<'
Uncaught TypeError: Cannot read properties of undefined (reading 'Modal')
Uncaught TypeError: $(...).sticky is not a function
```

## What the page reports about itself

| Probe | Value | Confirms |
|---|---|---|
| `jQuery.fn.jquery` | **`"1.9.1"`** | [duplicate jQuery load order](/issues/duplicate-jquery-load-order.md) |
| `$.fn.sticky` | `undefined` | same — the plugin is detached |
| `$.fn.magnificPopup` | `undefined` | same |
| `$.fn.owlCarousel` | `undefined` | same |
| `window.bootstrap` | `undefined` | [Bootstrap version conflict](/issues/bootstrap-version-conflict.md) — bs5-lightbox throws on `.Modal` |
| `document.documentElement.lang` | `"en"` | [html lang mismatch](/issues/html-lang-mismatch.md) |
| `meta[name=description]` | absent | [missing SEO metadata](/issues/missing-seo-metadata.md) |
| `meta[property="og:title"]` | absent | same |
| `document.title` on `/photo` | `"Camille Portfolio"` | same — identical on every route |

## What `/photo` reports

| Probe | Value | Confirms |
|---|---|---|
| `favicon.ico` size | **2,195,353 bytes** | [oversized images](/issues/oversized-images.md) |
| `<img>` count | **72** | same |
| `loading="lazy"` count | **0** | same |
| elements with `id="exampleModalLongTitle"` | **35** | [duplicate DOM ids](/issues/duplicate-dom-ids.md) |
| `getElementById('modalPhotoTitle')` | **`null`** | same — every `aria-labelledby` resolves to nothing |
| distinct `alt` values across 72 images | **2** | [missing alt text](/issues/missing-alt-text.md) |

# The finding this corrected

The audit describes the magnific-popup script as **404ing**. It does not — it
returns **`200` with `content-type: text/html`**, and the body begins
`<!doctype html>`.

The Netlify SPA catch-all (`/*` -> `/index.html`, status 200) means *no* missing
path ever 404s. The browser receives `index.html` where it expected JavaScript,
tries to parse it, and throws `Unexpected token '<'` — the first console error
above.

Practical consequences:

* You cannot find broken asset paths by looking for 404s in the network tab.
  Every one of them looks like a successful request.
* This is the same mechanism behind
  [no wildcard route](/issues/no-wildcard-route.md): the server cannot tell you
  something is missing, so the app has to.

Corrected in [the magnific-popup issue](/issues/magnific-popup-script-404.md).

# The finding this widened

The audit frames the jQuery clash mainly around `magnificPopup`. Live, **every**
plugin is detached: `sticky`, `owlCarousel` and `magnificPopup` are all
`undefined`. So on production today the sticky header, the Owl carousel and the
lightbox are *all* inert, not just the lightbox.

That raises the value of the one-line fix considerably — see
[the roadmap](/plans/remediation-roadmap.md), session 2.

# Related

* [index.html](/components/index-html.md)
* [Two-layer frontend](/architecture/two-layer-frontend.md)
