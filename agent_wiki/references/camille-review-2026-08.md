---
type: Reference
title: Owner review, 2026-08-26
description: Camille's own list of 25 fixes, improvements and additions for the site, and where each one lands in the roadmap.
tags: [reference, owner, requests]
resource: /Camille_review.md
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T23:10:00Z }
---

# What it is

`Camille_review.md` at the repo root is the site owner's own review, written
2026-08-26 as a table of `Title | Status | Detail` rows. Twenty-five rows,
tagged **Bug**, **Amélioration**, **Ajout** or **Retirer**.

It is a different kind of document from
[the code audit](/references/review-audit-2026-08.md): the audit describes what
is broken **under** the site, this one describes what is wrong **on** it, from
the person who owns it. Where the two disagree about priority, this one wins —
it is the requirements, the audit is the diagnosis.

# How it maps onto the roadmap

| Camille's request | Lands in |
|---|---|
| Popup image sits under the navbar (`/photo`) | Session 2, with [magnific-popup](/issues/magnific-popup-script-404.md) and [the jQuery clash](/issues/duplicate-jquery-load-order.md) |
| Responsive broken on large screens | Session 2, with [the unlinked `responsive.css`](/issues/unlinked-stylesheets.md) |
| Nav buttons not centred / aligned with "Camille Prothin" | Session 2 |
| Dynamic year in the footer | Session 5 |
| `/audiovisuel` → `/projets` | Session 5, see [site routes](/specs/site-routes.md) |
| Photo popup: description, arrow-key carousel, vertical centring | Session 5 |
| Instagram call to action at the end of `/photo` | Session 5 |
| "voir la vidéo" hover: invert to white-on-black, wipe left→right, drop the grey | Session 5 |
| Clickable hearts that stay filled per visitor | Session 5 |
| Reverse project numbering (newest first), reorder photos safely, easy text/image/link edits | Session 4 — this **is** [the content refactor](/specs/content-update-workflow.md) |
| Redesign "QUI EST CAMILLE", "Expériences"/"FORMATIONS", "Mes réseaux" | Session 6, each needs a brief first |
| Swap "compétences" and "plonger dans mon univers" | Session 6 |
| Smaller, black-and-white "COMPETENCES" logos | Session 6 |
| Padding on "PHOTO" at lg/md | Session 6 |
| Digital accessibility, without changing the look | Session 6 |
| English version of the site | Session 6 |

# The overlap worth noticing

Four of Camille's requests — reverse project numbering, safe photo reordering,
easy text/image/link edits, and by extension the popup carousel — are all the
same request: **content should live in data, not in duplicated markup**. That
is exactly what
[content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
already describes. The owner arrived at the same conclusion from the outside,
which is the strongest possible argument for doing Session 4 properly rather
than cheaply.

# Requests that are not yet actionable

Everything tagged *design* in the table above — the three redesigns, the logo
sizing, the accessibility target and the English version — is a direction, not
a specification. Each needs a short brief agreed with the owner **before** any
markup is written; the roadmap records the open question next to each one.

# Related

* [Remediation roadmap](/plans/remediation-roadmap.md)
* [Code review, 2026-08-21](/references/review-audit-2026-08.md)
* [Content update workflow](/specs/content-update-workflow.md)
