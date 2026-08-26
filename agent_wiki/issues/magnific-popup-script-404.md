---
type: Issue
title: The magnific-popup script 404s and popup.js throws
description: The script tag points at a path that does not exist and would not ship even if it did, so the gallery lightbox init fails on every page.
tags: [javascript, assets, p1, live-bug]
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

`Uncaught SyntaxError: Unexpected token '<'` on every page load — the first
console error on [the live site](/references/live-site.md).

> **The audit called this a 404. It is not.** Verified in production: the
> request returns **`200` with `content-type: text/html`**, body starting
> `<!doctype html>`. Netlify's SPA catch-all rewrites *every* unknown path to
> `index.html` with status 200, so the browser gets HTML where it expected
> JavaScript and throws a syntax error instead.
>
> The practical lesson is bigger than this one tag: **you cannot find broken
> asset paths by looking for 404s here.** Every missing file looks like a
> successful request.

# Evidence

```html
<script src="src/app/assets/magnific-popup/jquery.magnific-popup.js"></script>
```

Two separate reasons this cannot work:

1. **The path is wrong.** The file is at
   `src/assets/magnific-popup/dist/jquery.magnific-popup.js` — note `src/assets`,
   not `src/app/assets`, and a `dist/` segment.
2. **It would not ship anyway.** `angular.json` copies only `public/` into the
   build output. `src/assets/` is never emitted. See
   [public/ static assets](/components/public-assets.md).

So the tag 404s in dev *and* in production, and `popup.js` then throws when it
calls `.magnificPopup()`.

# Impact

Combined with [the jQuery load order bug](/issues/duplicate-jquery-load-order.md),
the photo gallery has three lightbox mechanisms and none of them work. The
Bootstrap 3 modals are what actually opens a photo. See
[PhotoComponent](/components/photo-page.md).

# Fix

Decide what the gallery should use, then commit to one:

* **Simplest:** delete the script tag *and* `public/js/popup.js`. The BS3 modals
  already work.
* **If magnific-popup is wanted:** copy the one needed file into `public/js/`
  and fix the tag.

Either way, delete [the vendored upstream repo](/issues/vendored-magnific-popup-repo.md).

# Related

* [index.html](/components/index-html.md)
