---
type: Issue
title: Four shipped stylesheets are never linked
description: font-awesome, animate, responsive and owl CSS all exist in public/css but are not in index.html, so icons are invisible and mobile breakpoints are missing.
tags: [css, responsive, a11y, p1, live-bug, resolved]
resource: /src/index.html
status: deprecated
priority: P1
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-26, session 2.** `animate.css` and `responsive.css` are
linked; `owl.carousel` was left out because no template uses an Owl carousel.

Two corrections to the audit, both found by actually loading the site:

* **Font Awesome could not have been fixed by linking it.** `public/fonts/`
  does not exist, so the webfont was missing too. The fourteen icons are
  bootstrap-icons now, served from the npm package via `angular.json`.
* **Linking `responsive.css` did not fix the owner's large-screen complaint.**
  That file contains only `max-width` rules — it has nothing to say above
  1199px. The real cause was
  [the page pinned left above 1920px](/issues/page-pinned-left-above-1920.md).

# Symptom

Font Awesome icons render as nothing, entrance animations do nothing, and the
site has no responsive breakpoints from the theme.

# Evidence

`public/css/` contains nine stylesheets. `src/index.html` links **four**:
`flaticon.css`, `bootstrap.min.css`, `bootsnav.css`, `style.css`.

Never linked:

| File | Consequence |
|---|---|
| `font-awesome.min.css` | `<i class="fa fa-*">` renders empty — 8 uses in accueil (timeline dots), 5 in contact (social row) |
| `animate.css` | `animated fadeInUp` / `fadeInDown` applied by `custom.js` do nothing |
| `responsive.css` (2,941 B) | **All `@media` rules for the nav, `.welcome-hero` height and the timeline are missing on tablet and mobile** |
| `owl.carousel.min.css`, `owl.theme.default.min.css` | Carousel is unstyled |

`responsive.css` is the serious one: the site's mobile layout is simply absent.

# Fix

Two paths, and they should be chosen deliberately:

**Cheap:** add the missing `<link>` tags. Restores mobile layout and icons in
minutes. Does nothing about the underlying version mess.

**Right:** commit to Bootstrap 5, already in `package.json`, and drop Font
Awesome in favour of the `bootstrap-icons` also already installed. Bigger job —
it requires replacing bootsnav. See
[Bootstrap version conflict](/issues/bootstrap-version-conflict.md).

Do not do both halfway. Pick one at the start of session 2 in
[the roadmap](/plans/remediation-roadmap.md).

# Related

* [index.html](/components/index-html.md)
* [Khanas HTML template](/references/khanas-template.md)
