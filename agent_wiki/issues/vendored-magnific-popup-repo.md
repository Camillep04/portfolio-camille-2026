---
type: Issue
title: src/assets/magnific-popup is a whole vendored upstream repo that never ships
description: 1.2 MB including its own jQuery, QUnit, a Gruntfile and the plugin's marketing website, none of which is copied into the build.
tags: [cleanup, repo-hygiene, p3]
resource: /src/assets/magnific-popup
status: stable
priority: P3
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

1.2 MB of third-party repository committed for the sake of one plugin file that
is never loaded.

# Evidence

`src/assets/magnific-popup/` contains the plugin's **entire upstream
repository**: `dist/`, `src/`, its own bundled `jquery.js`, QUnit, a
`Gruntfile.js`, `.travis.yml`, `bower.json`, `composer.json`, and the plugin's
marketing website under `website/` including demo HTML and a WordPress page.

`angular.json` copies **only `public/`** into the build output. `src/assets/` is
not in any asset glob, so **none of this ever ships**. It is pure repository
weight.

The one file anything references is `dist/jquery.magnific-popup.js` — and the
`<script>` tag pointing at it has the wrong path anyway. See
[magnific-popup 404](/issues/magnific-popup-script-404.md).

# Fix

Delete the directory. Decide the gallery lightbox question first:

* If magnific-popup is being dropped (recommended — the Bootstrap 3 modals
  already work), delete this directory **and** `public/js/popup.js` **and** the
  `<script>` tag.
* If it is being kept, copy `dist/jquery.magnific-popup.js` and
  `dist/magnific-popup.css` into `public/js/` and `public/css/`, wire them up,
  then delete the rest.

# Related

* [PhotoComponent](/components/photo-page.md)
* [public/ static assets](/components/public-assets.md)
