---
type: Component
title: FavouritesService
description: Per-visitor "hearted" projects on /projets, kept privately in localStorage.
tags: [component, state, session-5]
resource: /src/app/favourites.service.ts
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-27T21:30:00Z }
---

# What it is for

Backs the clickable hearts on the [projects page](/components/audiovisuel-page.md)
(session 5, the owner's request). `@Injectable({ providedIn: 'root' })`, ~40
lines.

# Decisions baked in

The owner chose these when the roadmap raised them as open questions:

| Question | Answer |
|---|---|
| localStorage or a cookie? | **localStorage** — nothing to consent to, no banner |
| private favourite or a visible count? | **private**, no count rendered anywhere |

So the set is never serialised into a request, never leaves the browser, and
only affects the fill of the heart the visitor clicked.

# Shape

* Storage key `camille-portfolio:favourites`, a JSON string array of project ids.
* In-memory `Set<string>`, seeded from storage in the field initialiser.
* `has(id)` / `toggle(id)` — `toggle` writes through to storage.
* Every `localStorage` access is wrapped in `try/catch`. A private window or
  blocked site data degrades to in-memory-only for the session; the page never
  throws. Malformed stored data reads as an empty set.

A spec covers toggle on/off, write-through, read-on-construction, and the
malformed-data fallback.

# Related

* [AudiovisuelComponent (projects page)](/components/audiovisuel-page.md)
* [Remediation roadmap](/plans/remediation-roadmap.md) — session 5, item 21
