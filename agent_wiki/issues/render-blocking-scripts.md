---
type: Issue
title: Ten render-blocking script tags, none deferred
description: Every route loads the full legacy script stack synchronously, including a 2014 Modernizr build nothing queries.
tags: [performance, javascript, legacy, p2]
resource: /src/index.html
status: stable
priority: P2
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

Slow first paint on every route, and a hard dependency on four third-party CDNs
being reachable.

# Evidence

`src/index.html` ends with **eleven** `<script>` tags, **none** carrying `defer`
or `async`. They load unconditionally on every route, whether or not the page
uses them.

Notable passengers:

* **Modernizr 2.8.3** (2014, from a CDN) — nothing in the codebase queries any
  `Modernizr.*` feature flag.
* **jquery-easing** from a CDN — used by exactly one `animate()` call in
  `custom.js`.
* **bs5-lightbox** from a CDN — inert, since Bootstrap 5 is not present.
* Two of them are outright broken: see
  [magnific-popup 404](/issues/magnific-popup-script-404.md) and
  [duplicate jQuery load order](/issues/duplicate-jquery-load-order.md).

Each CDN host is an extra DNS lookup plus TLS handshake, and a third-party
availability dependency for a portfolio that must load when someone clicks a
link from LinkedIn.

# Fix

Sequence matters — do not start here.

1. First remove the dead tags (jQuery 1.9.1, magnific-popup, Modernizr,
   bs5-lightbox). Free, no risk.
2. After [the Bootstrap 5 migration](/issues/bootstrap-version-conflict.md),
   most of the rest can go with jQuery itself.
3. Add `defer` to whatever survives, checking that
   [custom.js still binds correctly](/issues/empty-component-classes.md) — it
   depends on jQuery and its plugins being present at `document.ready`.

# Related

* [index.html](/components/index-html.md)
* [Khanas HTML template](/references/khanas-template.md)
