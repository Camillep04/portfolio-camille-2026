---
type: Issue
title: Dead commented-out markup across several files
description: Four commented polaroid blocks, several commented iframes, and a commented-out init block that git already remembers.
tags: [cleanup, p4]
resource: /src/app
status: stable
priority: P4
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

Files are longer and harder to read than the live markup warrants, and commented
blocks are easy to mistake for active code.

# Evidence

| Location | What |
|---|---|
| `accueil.component.html:465-500` | 4 commented-out polaroid blocks |
| `audiovisuel.component.html:37, 90, 152, 204, 266` | commented `<iframe id="youtube-iframe">` tags |
| `public/js/popup.js:1-11` | a commented-out `magnificPopup` init for video links |

The commented iframes also inflate the
[duplicate `youtube-iframe` id count](/issues/duplicate-dom-ids.md) when
grepping, which makes that issue harder to assess than it should be.

# Fix

Delete all of it. Git has the history; a commented block carries no information
about *why* it was disabled, which is the only thing that would have been worth
keeping — and that belongs in a commit message or in
[decisions/](/decisions/index.md).

Cheap to do alongside
[the dead inline script removal](/issues/dead-inline-script-audiovisuel.md),
which touches the same regions of `audiovisuel.component.html`.

# Related

* [AccueilComponent](/components/accueil-page.md)
