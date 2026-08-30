---
type: Component
title: NotFoundComponent
description: The catch-all 404 page — Camille's "perte de signal" glitch mock on a dark film-set backdrop, wired to the wildcard route.
tags: [component, page, routing]
resource: /src/app/not-found/not-found.component.ts
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-30T00:00:00Z }
---

# What it is for

Route `{ path: '**' }` in [app.routes.ts](/src/app/app.routes.ts). Anything that
is not one of the four real routes (`/`, `/projets`, `/photo`, `/contact`) or
the `/audiovisuel` redirect renders this. It replaces the old blank middle
described in [no wildcard route](/issues/no-wildcard-route.md) — which chose a
dedicated page over a redirect home once Camille designed one.

# Origin

Ported from `proto404/proto-c-signal.html` (branch `page_404`, one of three
mocks Camille built — "clap", "planche", "signal"). Session 7 picked proto C.
The other two protos stay in `proto404/` for reference.

# What it contains

1. `● SIGNAL PERDU` / `SIGNAL LOST` label with a blinking dot.
2. A giant `404` with two offset colour copies (`.r` red, `.c` cyan) that
   glitch for ~0.4s every 3.2s via CSS `steps(1)` keyframes.
3. Heading — `notFound.title`.
4. Three `routerLink` buttons: home, `/projets`, `/contact` (labels from
   `notFound.home`, `nav.projects`, `nav.contact`).
5. A decorative SMPTE timecode at the foot that ticks 25×/s.

# Contract / gotchas

* **All copy is i18n.** Keys `notFound.*` live in both `fr` and `en` in
  [translations.ts](/src/app/i18n/translations.ts); the toggle swaps them live
  like every other page.
* **The timecode runs outside the Angular zone.** `NgZone.runOutsideAngular` +
  a direct `ElementRef.textContent` write. A zone-tracked `setInterval` at 40ms
  would trigger a whole-app change-detection pass 25 times a second for as long
  as the page is open. Cleared in `ngOnDestroy`.
* **Scoped dark theme.** All CSS is under `:host` / `.notfound`, so the
  `#0f1117` backdrop sits between the shared [header](/components/header.md) and
  [footer](/components/footer.md) instead of taking the viewport. `min-height:
  80vh` keeps it from collapsing.
* **`h1 { text-transform: none }`** is a deliberate override — the vendored
  theme capitalises every word of every `h1`
  ([two-layer frontend](/architecture/two-layer-frontend.md) seam).
* Button radius is `--radius: 16px` — the one shared button radius Session 6
  standardised on across the site (`src/styles.css`).
* Animations are disabled under `prefers-reduced-motion`.

# Soft 404

Netlify rewrites `/*` → `/index.html` with **status 200**
([site routes](/specs/site-routes.md)), so this page is served with HTTP 200,
not 404. There is no SSR to set the status code. Acceptable for a portfolio;
noted so nobody hunts for a "real" 404 response.

# Related

* [Site routes contract](/specs/site-routes.md)
* [No wildcard route](/issues/no-wildcard-route.md) — the issue this closes
* [Angular application shell](/architecture/angular-shell.md)
