---
type: Decision
title: The page is fluid, not capped at 1920px
description: The site fills any viewport width; individual sections carry their own readable max-widths instead of one page-wide cap.
tags: [decision, css, responsive]
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-27T22:10:00Z }
supersedes: /decisions/page-capped-at-1920-centred.md
---

# The choice

**Decided by the owner on 2026-08-27, opening session 6:** the layout should be
**fluid** and keep looking good past 1920px, not sit in a centred 1920px column
with empty margins either side. This reverses
[the page stays capped at 1920px](/decisions/page-capped-at-1920-centred.md).

# How it is enforced

`src/styles.css` sets `body { max-width: none !important; }`. The `!important`
beats both the theme's `body { max-width: 1920px }` (`public/css/style.css`) and
Bootstrap 4's reboot, which are loaded after it and cannot be edited cleanly
(vendored / CDN).

Readability past 1920px is **not** a page-wide cap — it is each section's
responsibility. The pattern: the section is full-width, an inner wrapper carries
`max-width` + `margin: 0 auto`. First example: `.about-wrap` in
`accueil.component.css` caps the "Qui est Camille ?" content at 1500px so the
bio's line length stays sane on a 2560px screen.

# What follows from it

* Session 6's redesigns are drawn for a **fluid canvas**, not a 1920px one. Each
  new or reworked section needs its own inner max-width where long text or wide
  grids would otherwise run away.
* The fixed navbar already spans the viewport, so it now matches the page again.
* If the Bootstrap 5 migration lands, re-check the `body` override — BS5's reboot
  also resets `body` margin, but `max-width: none !important` should still hold.

# Related

* [The page stays capped at 1920px and centred](/decisions/page-capped-at-1920-centred.md) — what this replaces
* [Page pinned left above 1920px](/issues/page-pinned-left-above-1920.md) — the original bug behind both decisions
* [AccueilComponent](/components/accueil-page.md)
* [Remediation roadmap](/plans/remediation-roadmap.md) — session 6
