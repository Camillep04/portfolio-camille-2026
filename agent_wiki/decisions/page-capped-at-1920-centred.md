---
type: Decision
title: The page stays capped at 1920px and centred
description: Above 1920px the site does not stretch; it keeps the theme's max-width and sits in the middle of the screen.
tags: [decision, css, responsive]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-27T00:05:00Z }
---

# The choice

Fixing [the page pinned left above 1920px](/issues/page-pinned-left-above-1920.md)
left a real fork: restore the theme's intent, or let the layout stretch to fill
a very wide screen.

**Decided by the owner on 2026-08-26: keep the theme's intent** — `body` stays
`max-width: 1920px`, centred, and the fixed navbar is pinned to that centred
page.

# What follows from it

* Session 6's redesigns are designed for a **1920px canvas at most**. Nothing
  needs to work at 2560px except the empty margin either side of the page.
* Any future full-bleed section must be built inside the 1920px page, not
  against the viewport.
* `src/styles.css` carries the one rule that keeps this true against Bootstrap
  4's reboot. If the Bootstrap 5 migration lands, that rule must be re-checked
  rather than assumed — BS5's reboot resets `body` margin too.

# Related

* [Page pinned left above 1920px](/issues/page-pinned-left-above-1920.md)
* [CSS: cheap fix before Bootstrap 5](/decisions/css-cheap-fix-before-bootstrap-5.md)
