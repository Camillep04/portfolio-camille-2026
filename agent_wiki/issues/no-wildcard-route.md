---
type: Issue
title: No wildcard route, so unknown URLs render a blank page
description: Netlify rewrites everything to index.html, and with no catch-all route a typo shows header and footer around an empty middle.
tags: [routing, p4, resolved]
resource: /src/app/app.routes.ts
status: deprecated
priority: P4
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-30, session 7.** `{ path: '**', component: NotFoundComponent }`
now catches every unknown URL and renders
[NotFoundComponent](/components/not-found-page.md) — Camille's "perte de signal"
404 mock (`proto404/proto-c-signal.html`), chosen over the redirect-home fix
below because she designed a dedicated page. The rest of this concept is the
original analysis, kept for the trail.

# Symptom

Visiting `/projets` or `/photos` — a plausible typo — shows the header and
footer with nothing between them. It looks broken rather than missing.

# Evidence

`app.routes.ts` defines four routes and no `{ path: '**' }`.

Netlify's catch-all rewrite sends every unknown URL to `index.html` with status
200, so the app boots successfully, finds no matching route, renders nothing
into `<router-outlet>` — and never 404s, because as far as the server is
concerned the request succeeded.

`public/404.html` exists in the stale
[docs/](/issues/stale-docs-build-output.md) output but is not served by this
setup.

# Fix

```ts
export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'audiovisuel', component: AudiovisuelComponent },
  { path: 'photo', component: PhotoComponent },
  { path: '**', redirectTo: '' },
];
```

A redirect home suits a four-page portfolio better than a dedicated 404 page.

# Related

* [Site routes contract](/specs/site-routes.md)
