---
type: Issue
title: jQuery loads three times and the oldest copy wins
description: jQuery 1.9.1 loads after every plugin registered against 2.2.4, wiping them off window.$ and breaking anything that resolves $ at ready time.
tags: [javascript, jquery, legacy, p1, live-bug, resolved]
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
  - id: live
    resource: /references/live-site.md
    title: Live site checks, 2026-08-26
---

**Resolved 2026-08-26, session 2.** The trailing `jquery/1.9.1` tag is gone
from `src/index.html`. Verified in the browser: `jQuery.fn.jquery` now reports
**2.2.4**, and `sticky`, `appear`, `owlCarousel` and `modal` are all attached
to it.

# Symptom

Plugin calls throw at runtime. On [the live site](/references/live-site.md)
today: `Uncaught TypeError: $(...).sticky is not a function`.

# Confirmed in production

Probed in a real browser on 2026-08-26:

| Probe | Value |
|---|---|
| `jQuery.fn.jquery` | **`"1.9.1"`** |
| `$.fn.sticky` | `undefined` |
| `$.fn.owlCarousel` | `undefined` |
| `$.fn.magnificPopup` | `undefined` |

**Wider than the audit reported.** `review.md` frames this around
`magnificPopup`; in fact **every** plugin is detached. The sticky header, the
Owl carousel and the lightbox are all inert on the live site right now.

That makes this one-line deletion the highest value-per-effort fix in the
codebase.

# Evidence

In `src/index.html`, script order:

```html
<script src="js/jquery.js"></script>   <!-- jQuery 2.2.4 (verified in the file header) -->
... bootstrap, bootsnav, sticky, appear, owl, custom.js, popup.js ...
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
```

The **last** tag loads jQuery 1.9.1, replacing `window.jQuery` and `window.$`
*after* every plugin has attached itself to the 2.2.4 object. Any code that
resolves `$` at `document.ready` time — such as `public/js/popup.js` — now runs
against a bare 1.9.1 with none of those plugins attached.

Two further problems in the same line: the `//` protocol-relative URL is a
legacy pattern, and jQuery 1.9.1 (2013) carries known XSS advisories.

# Fix

**Delete that one line.** Nothing in the codebase needs jQuery 1.9.1.

Cheapest high-impact fix in the repo — one line, no migration.

# Related

* [index.html](/components/index-html.md)
* [magnific-popup 404](/issues/magnific-popup-script-404.md)
