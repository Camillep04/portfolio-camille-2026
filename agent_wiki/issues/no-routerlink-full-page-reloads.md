---
type: Issue
title: Every internal link is a full page reload
description: Zero uses of routerLink in the app, so each click tears down Angular and re-downloads everything.
tags: [angular, routing, performance, p1]
resource: /src/app/header/header.component.html
status: stable
priority: P1
verification: changed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

Clicking a nav link reloads the whole page instead of navigating client-side.

# Evidence

`grep -c routerLink` across `src/app` returns **0** in every file. All 16
internal links are plain `href`:

* `header.component.html` — `/`, `/audiovisuel`, `/photo`, `/contact`, plus
  `navbar-brand` still pointing at `href="index.html"`
* `accueil.component.html` — 11 more, mostly `/photo` on the polaroid row

`href="index.html"` resolves only because of the Netlify catch-all rewrite.

> **Drifted since the audit.** `review.md` reports the nav items themselves as
> `href="index.html"`; they now use real paths. Only the brand link still does.
> The finding stands — they are still not `routerLink`.

# Impact

Each click destroys and re-bootstraps the Angular app and re-downloads every
asset, including the [34 MB of images](/issues/oversized-images.md) the browser
may not have cached and the
[2.1 MB favicon](/issues/oversized-images.md).

# Fix

```html
<a routerLink="/audiovisuel" routerLinkActive="active">Projets</a>
```

and add `RouterLink, RouterLinkActive` to each component's `imports` array —
currently `[]` in every component. Keep plain `href` for the CV PDF and
external links.

# Do this one carefully

Converting to `routerLink` **increases** exposure to
[the jQuery-binds-too-early problem](/issues/empty-component-classes.md): more
navigation becomes client-side, and the legacy handlers only ever bind on a
hard load. Expect sticky header, scrollspy and the typewriter effect to stop
working on navigation once this lands.

Verify every page after a **client-side** navigation, not only after a reload.
Sequenced accordingly in [the roadmap](/plans/remediation-roadmap.md).

# Related

* [HeaderComponent](/components/header.md)
* [Two-layer frontend](/architecture/two-layer-frontend.md)
