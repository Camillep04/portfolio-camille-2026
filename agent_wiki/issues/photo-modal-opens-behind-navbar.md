---
type: Issue
title: The photo popup opened a quarter-screen too high, behind the navbar
description: Bootstrap 4 markup driven by Bootstrap 3's JS — BS3 sets `in`, BS4 clears its transform on `show`, so the dialog stayed translated up.
tags: [css, bootstrap, photo, live-bug, resolved]
resource: /src/app/photo/photo.component.css
status: deprecated
priority: P1
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T23:45:00Z }
sources:
  - id: owner-review
    resource: /references/camille-review-2026-08.md
    title: Owner review, 2026-08-26
---

**Resolved 2026-08-26, session 2.**

# What the owner saw

"En cliquant sur une image l'image en popup s'affiche mal : le haut de la popup
est en dessous de la barre de nav."

# What it actually was

Not magnific-popup — `/photo` never used it. The modals are **Bootstrap 4
markup** (`modal-dialog-centered`, `data-dismiss`) opened by **Bootstrap 3's
JS**, which is what `public/js/bootstrap.min.js` is.

BS3 marks an open modal with `.in`. BS4's CSS clears its entry animation on
`.show`. Neither knows about the other, so this rule never stopped applying:

```css
.modal.fade .modal-dialog { transform: translate(0, -25%); }
```

Measured in the browser with the dialog open: `transform: matrix(1, 0, 0, 1, 0,
-223.75)`, dialog top at **y = -206** in a 930px viewport. The top of the popup
was above the top of the screen, hidden behind the 100px fixed navbar.

# The fix

In `photo.component.css`, clear the transform on `.in` as well, and cap the
image at `calc(100vh - 220px)` so a portrait photo still fits below the navbar.
Re-measured: dialog top **y = 18**, content starts at y = 141, below the bar.

This patch disappears with
[the Bootstrap 5 migration](/decisions/css-cheap-fix-before-bootstrap-5.md),
which is the real fix.

# Related

* [Bootstrap version conflict](/issues/bootstrap-version-conflict.md)
* [PhotoComponent](/components/photo-page.md)
