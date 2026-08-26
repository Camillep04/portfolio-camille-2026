---
type: Issue
title: No meta description, no Open Graph, no per-route title
description: The site shares as a bare URL on LinkedIn and Instagram, and all four routes carry the same title.
tags: [seo, p4]
resource: /src/index.html
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

Pasting the portfolio link into LinkedIn or Instagram produces no preview card —
no title, no description, no image. All four routes show the same browser tab
title.

# Evidence

`src/index.html` `<head>` contains a `<title>` and a viewport meta, and nothing
else. No `description`, no `og:*`, no `twitter:card`.

`app.routes.ts` sets no `title` on any route, so `/photo`, `/contact`,
`/audiovisuel` and `/` are all *Camille Portfolio*.

There is no `robots.txt` and no `sitemap.xml` in `public/`.

Related, from [AccueilComponent](/components/accueil-page.md): the homepage's
only `<h1>` is a JS-animated word cycling through
`["vidéo", "photo", "cinéma", ...]`, nested illegally inside a `<span>` inside
an `<h2>`. So the strongest heading signal on the page is not Camille's name,
and to a crawler that runs no JS it is **empty**.

# Impact

Higher than usual for this project specifically. This is a portfolio whose
purpose is to be shared with people who might hire its owner, and the share
preview is the first thing they see.

# Fix

1. Add to `<head>`: `<meta name="description">`, `og:title`, `og:description`,
   `og:image` (a real image, not one of
   [the 2 MB ones](/issues/oversized-images.md)), `twitter:card`.
2. Set per-route titles in `app.routes.ts` via the `title` property.
3. Add `robots.txt` and a four-URL `sitemap.xml` to `public/`.
4. Restructure the hero so the `<h1>` is Camille's name, with the typewriter
   effect demoted to a `<span>` or `<p>`.

Note that (1) is static HTML and works for crawlers; per-route `og:*` would
need server-side rendering, which this project does not have and does not need.

# Related

* [Site routes contract](/specs/site-routes.md)
