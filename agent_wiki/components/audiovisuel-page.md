---
type: Component
title: AudiovisuelComponent (projects page)
description: Ten projects from PROJECTS in projects.ts, one @for section each, alternating image/info sides, with a per-project hero background.
tags: [component, page, content]
resource: /src/app/audiovisuel/audiovisuel.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'projets'` (renamed from `'audiovisuel'` in session 5, old path kept as
a redirect), labelled *Projets* in the nav. Camille's video and creative work.
The component directory and selector keep the `audiovisuel` name.

# The shape (since session 4)

`audiovisuel.component.html` dropped from 427 lines of ten hand-copied
`<section id="filmN">` blocks to a ~55-line `@for` over
[`PROJECTS` in `projects.ts`](/architecture/content-data-layer.md). Array order
is display order; the file keeps the existing order, and moving a project up is
a one-line move — the owner's "new projects at the top" request.

Each `Project`:

```
id, title, year, background, image, icon, description,
link?, linkLabel?, linkKind?  ('video' | 'project' | 'site'),  linkThumb?
```

* **`background`** is the full-bleed hero, set inline per section. It *was*
  `main section:nth-child(N)` — a positional rule, which is precisely why
  reordering used to scramble the page. The ten `nth-child` rules and their
  `<=1500px` override are gone; they varied only between `100%` and `cover`, so
  the single replacement uses `cover`. **This is the one visual side effect of
  session 4.**
* **image / info side alternates** via a `reversed` class on `$odd` plus CSS
  `order` (not `flex-direction`, so the mobile single-column stack keeps the
  same alternation).
* **The button** is one `@switch` on `linkKind`. A project with no `link`
  (Old phone) renders no button.
* **`description`** is `[innerHTML]` — keeps `<a>` / `<u>` / `<br>`, Angular
  strips scripts and styles. The leading glyph is the `icon` field.

# Interactions (session 5)

* **Link button hover/focus** inverts the label and icons to black while a
  white fill wipes in from the left (`::before` `scaleX` from
  `transform-origin: left`). The old grey translucent hover is gone — the
  owner asked for both.
* **The heart** (`.save_btn`) is clickable: an empty white outline becomes a
  filled red heart. Backed by
  [`FavouritesService`](/components/favourites-service.md) — a private
  per-visitor favourite in `localStorage`, no cookie, no count shown.
  `isFavourite(id)` / `toggleFavourite(id)` on the component; `aria-pressed`
  tracks state. Specs cover the toggle and the DOM reflection.

A spec asserts section ids equal `PROJECTS.map(p => p.id)` in order, and that
the link-button count equals the number of projects with a `link`.

# History cleared here

* The dead `<script>` popup block, the five `onclick="closePopup()"`, and the
  five `popup-container` blocks were removed in **session 2**
  ([dead inline script](/issues/dead-inline-script-audiovisuel.md)).
* The two ~15-line `SVGRepo_*` icons per project are now written once in the
  template, not copied ten times — so
  [duplicate DOM ids](/issues/duplicate-dom-ids.md) on this page is down to
  that single shared pair.
* `audiovisuel.component.css` no longer grows per project, so
  [the style budget hazard](/issues/component-style-budget-no-headroom.md) is
  defused at the source (session 1 also gave it a warning band). Dead
  `.popup-container` / `.video-container` CSS from the removed popups is still
  in the file — a cleanup, not urgent.

# Related

* [Content data layer](/architecture/content-data-layer.md)
* [Content update workflow](/specs/content-update-workflow.md)
* [AccueilComponent](/components/accueil-page.md)
