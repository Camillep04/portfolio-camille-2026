---
type: Issue
title: Missing and placeholder alt text throughout
description: 13 content images have empty alt, several have none at all, and all 35 gallery photos share the same meaningless description.
tags: [a11y, seo, p4]
resource: /src/app
status: stable
priority: P4
verification: confirmed-in-production
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
  - id: live
    resource: /references/live-site.md
    title: Live site checks, 2026-08-26
---

# Symptom

The site is largely unusable with a screen reader, and image search sees
nothing.

# Evidence

| Problem | Where |
|---|---|
| `alt=""` on **content** images | 13 in `accueil` and `audiovisuel` |
| **No `alt` attribute at all** | `img/camera.png` (x5), `img/3d.png` (x3), `img/vecteur.png`, `img/menu.png` in the header, `img/monter.png` in the footer |
| Identical `alt="portfolio image"` | all **35** gallery photos |

`alt=""` is correct for purely decorative images — but it has to be a
*deliberate* choice, and here it is applied to project posters that carry
meaning.

# Impact

For a **photography and video portfolio**, alt text is not a checkbox. It is
how the work is described to anyone who cannot see it, and how image search
finds it.

# Fix

Three categories, handled differently:

1. **Decorative icons** (`camera.png`, `3d.png`, `vecteur.png`, `monter.png`) —
   give them a deliberate `alt=""`, so the intent is recorded.
2. **The menu button** — `alt="Menu"`, since it is functional.
3. **Photos and project posters** — real descriptions. This is content work only
   Camille can do; the code change is trivial, the writing is not.

Category 3 gets far cheaper after
[the data refactor](/issues/content-hardcoded-in-templates.md), where `alt`
becomes a required field on each object — which also makes omitting it a
**build failure** rather than a silent gap.

# Related

* [PhotoComponent](/components/photo-page.md)
* [duplicate DOM ids](/issues/duplicate-dom-ids.md)
