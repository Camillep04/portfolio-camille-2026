---
type: Reference
title: Khanas HTML template (upstream)
description: The third-party jQuery/Bootstrap 3 theme that all of public/css and public/js came from, and what that implies.
tags: [reference, legacy, vendor]
resource: /public
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is

Everything in `public/css/` and most of `public/js/` is a vendored copy of a
third-party HTML template. The attribution is still in the source:

```js
/* public/js/custom.js
 * Author        : "ThemeSine"
 * Template Name : Khanas HTML Template
 * Version       : 1.0
 */
```

Nobody wrote this code for this project. It was downloaded, dropped in, and the
Angular app was built around it.

# Why that is worth knowing

* **Class names in the templates are the theme's, not ours.** `welcome-hero`,
  `header-text`, `section-heading`, `single-contact-box`, `hm-foot-icon`,
  `return-to-top` — these come with the theme and are styled by
  `public/css/style.css` (20 kB). Renaming one silently unstyles the page.
* **Leftovers ship as if they were ours.** The five dead social links on the
  contact page, and the caption in `popup.js` that credits a photographer who
  has nothing to do with this portfolio, are the theme's demo content, still
  live. See [placeholder content on contact](/issues/placeholder-content-contact.md).
* **The theme's stack is fixed at 2016.** jQuery 2.2.4, Bootstrap 3.3.6/3.3.7,
  Owl Carousel, bootsnav, jquery.sticky, jquery.appear, Modernizr 2.8.3. Any
  migration to Bootstrap 5 means replacing `bootsnav` (the whole nav) too —
  that is the real cost hiding inside
  [Bootstrap version conflict](/issues/bootstrap-version-conflict.md).
* **There is no upgrade path.** It is a vendored snapshot with no package
  manager entry. Changes to it are ours to keep forever.

# The vendored files

| Path | Origin | Loaded? |
|---|---|---|
| `public/css/style.css`, `bootsnav.css`, `flaticon.css` | theme | yes |
| `public/css/animate.css`, `responsive.css`, `font-awesome.min.css`, `owl.*.css` | theme | **no** — see [unlinked stylesheets](/issues/unlinked-stylesheets.md) |
| `public/js/custom.js` | theme | yes |
| `public/js/bootsnav.js`, `jquery.sticky.js`, `jquery.appear.js`, `progressbar.js`, `owl.carousel.min.js`, `bootstrap.min.js`, `jquery.js` | theme | yes |
| `public/js/indexCam.js`, `portfolioCine.js`, `popup.js` | project-written | yes |
| `src/assets/magnific-popup/` | full upstream repo, 1.2 MB | **never ships** |

Only three JS files were written for this project: `indexCam.js` (the typewriter
effect on the homepage), `portfolioCine.js` (computes section offsets, then does
nothing with them), and `popup.js` (magnific-popup gallery init, currently
throwing).

# Related

* [Two-layer frontend](/architecture/two-layer-frontend.md)
* [public/ static assets](/components/public-assets.md)
