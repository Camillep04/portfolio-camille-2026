---
type: Component
title: VideoModalComponent + VideoModalService
description: The in-site YouTube player — a visitor watches any project video without leaving the portfolio.
tags: [component, angular, video]
resource: /src/app/video/video-modal.component.ts
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-30T00:00:00Z }
---

# What it is for

Session 8 ([roadmap](/plans/remediation-roadmap.md) item 35). Every YouTube
link on the site used to open a new tab on youtube.com. Now it opens here, in
an overlay player, so a visitor never leaves the portfolio to watch a video.

# The three pieces

| File | Role |
|---|---|
| `video/youtube.ts` | `parseYouTubeId(url)` — pulls the 11-char id out of `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/v/` forms on `www.` / `m.` / bare hosts, ignoring trailing query. Returns `null` for anything that isn't YouTube (a non-YouTube link, a relative href, junk). |
| `video/video-modal.service.ts` | Root service. One signal, `videoId: string \| null` — `null` is closed, a string is the id playing. `open(id)` / `close()`. |
| `video/video-modal.component.ts` | `<app-video-modal>`, rendered once in [AppComponent](/components/app-root.md). Renders nothing until the signal holds an id, then a fixed backdrop + a 16:9 `youtube-nocookie.com/embed/{id}?autoplay=1&rel=0` iframe. |

The click interception itself lives in [AppComponent](/components/app-root.md),
not here — one `document:click` handler for the whole site.

# Contract / gotchas

* **`youtube-nocookie.com`**, not `youtube.com` — the privacy-friendly embed
  domain. `?autoplay=1` because the click is the intent to play; `&rel=0`
  keeps related videos to the same channel.
* **Closes on** the ✕ button, a backdrop click (`(click)` on `.video-backdrop`,
  with `$event.stopPropagation()` on the dialog), or Escape
  (`@HostListener('document:keydown.escape')`).
* **Body scroll lock.** An `effect()` toggles `body.video-modal-open`
  (`overflow: hidden`, defined in `src/styles.css`) while a video is open. The
  effect is `try`/`catch`-guarded for the unit-test DOM.
* **`z-index: 10000`** on the backdrop — the theme's fixed header sets
  `.top-area { z-index: 9999 }`, so anything less renders *under* the navbar.
* **Iframe `[src]`** is a `SafeResourceUrl` from `DomSanitizer.bypassSecurityTrustResourceUrl`
  — Angular blocks a bound iframe src otherwise.
* Copy: `video.player` / `video.close` i18n keys (fr + en).
* Backdrop fade animation is disabled under `prefers-reduced-motion`.

# What it does NOT touch

The home page's inline CV-video `<iframe>` in
[AccueilComponent](/components/accueil-page.md) — that's an embed, not a link,
so the click handler never sees it. Non-YouTube project links (Sketchfab,
Google Drive, the inlive-sport site) parse to `null` and open normally.

# Related

* [AppComponent](/components/app-root.md) — the click interception
* [AudiovisuelComponent](/components/audiovisuel-page.md) — the page with the video links
* [Remediation roadmap](/plans/remediation-roadmap.md)
