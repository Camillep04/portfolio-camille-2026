---
type: Component
title: AppComponent (app-root)
description: The header / outlet / footer page frame, plus the one global behaviour — intercepting YouTube links into the in-site player.
tags: [component, angular, shell]
resource: /src/app/app.component.ts
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

The root component. It composes the page frame and owns the one piece of
behaviour that has to be global.

```html
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>
<app-video-modal></app-video-modal>
```

`imports: [RouterOutlet, HeaderComponent, FooterComponent, VideoModalComponent]`.

# Contract

* Present on every route: [header](/components/header.md) above,
  [footer](/components/footer.md) below, whatever the route renders in between.
* Renders [VideoModalComponent](/components/video-modal.md) once — invisible
  until a YouTube link is clicked.
* **YouTube link interception** (Session 8, [roadmap](/plans/remediation-roadmap.md)
  item 35): a `@HostListener('document:click')` catches any click on an
  `<a>` whose href [parses as a YouTube URL](/src/app/video/youtube.ts),
  `preventDefault()`s it and opens the in-site player via
  [`VideoModalService`](/components/video-modal.md). Modified clicks
  (⌘/Ctrl/Shift/Alt, non-primary button) and already-cancelled events pass
  through untouched, and if the listener never runs the links are ordinary
  `target="_blank"` anchors — so the feature degrades cleanly.
* Otherwise provides no state and no lifecycle hooks. `title = 'Camille
  Portfolio'` is unused (no `<h1>` in the template).

# History

* Session 3 deleted `app.component.css` (200 lines of Angular CLI starter
  boilerplate); its two live rules moved to `src/styles.css`.
* Session 1 fixed the stale spec; it asserts the real frame now.
* Session 8 added the YouTube interception and `<app-video-modal>`.

# Related

* [Angular application shell](/architecture/angular-shell.md)
* [VideoModalComponent](/components/video-modal.md)
