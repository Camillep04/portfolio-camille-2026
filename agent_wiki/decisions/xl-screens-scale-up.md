---
type: Decision
title: Extra-large screens scale the whole page up
description: Past 2100px the page is zoomed rather than left fluid, so it reads like a large-laptop layout instead of a thin column in a field of whitespace.
tags: [decision, css, responsive]
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-30T00:00:00Z }
---

# The choice

**Decided by the owner, Session 8 (2026-08-30).** On a 2560px or 4K monitor the
fluid layout ([page is fluid](/decisions/page-is-fluid.md)) left the text
content in a ~1140px Bootstrap container marooned in the middle with hundreds of
pixels of empty margin each side. The owner wants it to **look like it does on a
large laptop, just bigger** — same proportions, scaled up.

This refines [page is fluid](/decisions/page-is-fluid.md); it does not reverse
it. Fluid still governs up to 2100px.

# How it is enforced

`src/styles.css`, stepped `@media (min-width: …)` rules setting `body { zoom: … }`:

| Viewport ≥ | `zoom` | effective layout width |
|---|---|---|
| 2100px | 1.5 | ~1400px |
| 2560px | 1.8 | ~1420px |
| 3100px | 2.15 | ~1440px |
| 3800px | 2.7 | ~1410px |

Plus `html { overflow-x: hidden }` in the first rule — a non-integer `zoom` can
round a full-width child up a pixel or two.

# Why `zoom` and not `transform: scale`

The nav bar is `position: fixed`. A `transform` on any ancestor makes `fixed`
descendants position relative to that ancestor instead of the viewport, which
would break the sticky header (and the [video modal](/components/video-modal.md)
overlay). `zoom` scales layout without creating a containing block, so fixed
positioning still resolves against the viewport. Verified: at 2560px/`zoom:1.8`
the video backdrop still covers the whole viewport.

`zoom` is supported in all current browsers (it became standard; Firefox got it
in 126).

# Trade-offs

* There is a visible **snap** at exactly 2100px (fluid → zoom 1.5). Acceptable —
  almost nobody parks a window at that precise width, and the thresholds are a
  one-line retune.
* The `@media` queries evaluate against the real (pre-zoom) viewport, so the
  breakpoints are in physical CSS pixels, not effective ones.

# Related

* [The page is fluid](/decisions/page-is-fluid.md) — what this refines
* [HeaderComponent](/components/header.md) — the nav bar, now full-bleed at every width
* [Remediation roadmap](/plans/remediation-roadmap.md) — Session 8, item 36
