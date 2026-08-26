---
type: Issue
title: Four Bootstrap versions are fighting
description: BS3 CSS, BS3 JS, a BS4 CDN link, a BS5 lightbox and an unimported BS5 package all coexist, so utility classes in the markup silently do nothing.
tags: [css, bootstrap, legacy, p1, live-bug]
resource: /src/index.html
status: stable
priority: P1
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

Layout classes written in the templates have no effect, with no error anywhere.

# Evidence

| Where | Version | Verified |
|---|---|---|
| `public/css/bootstrap.min.css` | **3.3.6** | file header |
| `public/js/bootstrap.min.js` | **3.3.7** | file header |
| CDN link in `index.html` | **4.0.0** | loaded last, wins on CSS |
| `bs5-lightbox` CDN | expects **5.x** | inert |
| `bootstrap@5.3.3` + `bootstrap-icons` in `package.json` | **never imported** | `src/styles.css` is 81 bytes |

Real consequences in the markup:

* `accueil.component.html:140` uses `gap-4` — **Bootstrap 5 only**. Ignored, so
  the two TICKET cards have no gap.
* `accueil.component.html:408` uses
  `row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5` — added in **BS 4.4**,
  CDN is pinned to **4.0.0**. Ignored, so the polaroid row does not grid.
* `photo.component.html` uses BS3/BS4 modal markup (`data-toggle`,
  `data-dismiss`, `.close`) which works only because BS3's JS is running.
* `bs5-lightbox` does nothing.

# Fix

Commit to **Bootstrap 5**, which is already installed. In `angular.json`:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.css"
],
"scripts": ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"]
```

Then delete the CDN links and the local BS3 files, and migrate
`data-toggle` to `data-bs-toggle`, `data-dismiss` to `data-bs-dismiss`,
`.close` to `.btn-close`, `mr-*` to `me-*`.

# The cost nobody expects

**The navigation is `bootsnav`, not Bootstrap's navbar.** It is a separate
theme plugin with its own CSS and JS, hard-bound to jQuery and BS3. Migrating to
BS5 means rewriting the header, not just renaming attributes. Budget for that
before starting. See [HeaderComponent](/components/header.md) and
[Khanas HTML template](/references/khanas-template.md).

The payoff: once bootsnav is gone, jQuery can go entirely, and with it most of
[the render-blocking script soup](/issues/render-blocking-scripts.md).

# Related

* [unlinked stylesheets](/issues/unlinked-stylesheets.md)
* [PhotoComponent](/components/photo-page.md) — 35 modals to migrate
