---
type: Component
title: AudiovisuelComponent (projects page)
description: Ten hand-duplicated project sections plus a dead inline script whose functions five buttons still call.
tags: [component, page, content, bugs]
resource: /src/app/audiovisuel/audiovisuel.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'audiovisuel'`, labelled *Projets* in the nav. Camille's video and
creative work. 499 lines of template, 388 lines of CSS, empty class.

# The ten projects

Each is a `<section id="filmN">`, N = 1…10, hand-numbered:

| id | Title |
|---|---|
| `film1` | À vos marques : Athlète quel est ton rêve ? |
| `film2` | Showreel |
| `film3` | ROOM TOUR |
| `film4` | Menageum Rapidax |
| `film5` | Wrong guy |
| `film6` | Magical forest |
| `film7` | Old phone |
| `film8` | Voydof space |
| `film9` | Clip MMI |
| `film10` | Inlive-sport |

Each section is roughly 60 lines: a poster image, a title, a description, two
inline SVG icons of ~15 lines each, an outbound YouTube link, and a dead popup
block. **Adding a project means duplicating all of it and incrementing the id
by hand.** See [content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

The repeated SVGs are why `id="SVGRepo_iconCarrier"` and its siblings each
appear 16 times in the app — copied straight from an icon site, ids included.

# The dead popup machinery

Lines 473–499 contain a `<script>` block defining `openPopup(videoId)` and
`closePopup()`. **Angular's template compiler strips `<script>` elements from
component templates.** That code never runs.

Consequences, all live:

* `onclick="closePopup()"` appears **5×** (lines 35, 88, 150, 202, 264).
  Clicking the "X" throws `ReferenceError: closePopup is not defined`.
* `openPopup()` is never called from anywhere regardless — the "Voir la vidéo"
  buttons are plain `<a target="_blank">` to YouTube.
* Even if it ran, `document.getElementById('popup-button')` is `null` and
  `document.querySelector('.close')` is `null` on this page — two more throws.

See [dead inline script](/issues/dead-inline-script-audiovisuel.md).

# Duplicate ids on this page

| id | count |
|---|---|
| `SVGRepo_bgCarrier` / `iconCarrier` / `tracerCarrier` | 16 each (app-wide) |
| `youtube-iframe` | 10 (several inside comments) |
| `popup-container` | 5 |

See [duplicate DOM ids](/issues/duplicate-dom-ids.md).

# The CSS budget hazard

`audiovisuel.component.css` is **7,597 bytes raw** against an
`anyComponentStyle` budget whose warning and error are both 6 kB. It is the file
that grows every time a project is added, and there is no warning band before
the build hard-fails. See
[style budget has no headroom](/issues/component-style-budget-no-headroom.md).

# Related

* [Content update workflow](/specs/content-update-workflow.md)
* [AccueilComponent](/components/accueil-page.md)
