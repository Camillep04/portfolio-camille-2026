---
type: Issue
title: Above 1920px the page was pinned left and the navbar ran off the screen
description: Bootstrap 4's reboot resets body margin after the theme centres the page, so wide screens got a blank strip on the right.
tags: [css, responsive, bootstrap, live-bug, resolved]
resource: /src/styles.css
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

"Fixer le responsive pour les grands écrans."

# What it actually was

The obvious suspect was
[the unlinked `responsive.css`](/issues/unlinked-stylesheets.md), but that file
contains only `max-width` rules — it says nothing about large screens.

The theme centres the page:

```css
body { max-width: 1920px; margin: 0 auto; }   /* public/css/style.css */
```

The Bootstrap 4 CDN link sits **after** `style.css` in `index.html`, and its
reboot sets `body { margin: 0 }`. Measured at a 2560px viewport: body 1920px
wide at **x = 0** — a 625px blank strip on the right — while bootsnav's
`position: fixed; width: 100%` navbar started at the page's left edge and ran
**off the right of the screen**, so the menu no longer sat over the content.

# The fix

`src/styles.css` (which the bundler loads after the CDN) restores
`margin-left/right: auto`, and `header.component.css` pins the fixed navbar to
the centred page with `left: 50%; transform: translateX(-50%); max-width:
1920px`.

Re-measured at 2560px: body, navbar and content all centred on x = 1273, the
viewport centre. Re-checked at 1366px and 375px — unchanged.

# Still open

Whether the site *should* stay capped at 1920 and centred, or stretch to fill a
wide screen, is a design question for the owner. This issue only covers the
broken state.

# Related

* [Unlinked stylesheets](/issues/unlinked-stylesheets.md)
* [HeaderComponent](/components/header.md)
