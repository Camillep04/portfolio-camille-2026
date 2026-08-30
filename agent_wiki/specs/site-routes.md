---
type: Spec
title: Site routes contract
description: The four public URLs, what each must render, and what happens today for anything else.
tags: [routing, spec]
resource: /src/app/app.routes.ts
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# The contract

| URL | Must render | Component |
|---|---|---|
| `/` | Hero, bio, skills, experience and education timelines, photo teaser | [AccueilComponent](/components/accueil-page.md) |
| `/projets` | All ten video/creative projects | [AudiovisuelComponent](/components/audiovisuel-page.md) |
| `/photo` | The 35-photo gallery | [PhotoComponent](/components/photo-page.md) |
| `/contact` | Google Form, real social links, CV download | [ContactComponent](/components/contact-page.md) |
| anything else | Camille's "perte de signal" 404 with links back into the site | [NotFoundComponent](/components/not-found-page.md) |

Session 5 renamed `/audiovisuel` → `/projets` (the owner's request). The old
path stays as `{ path: 'audiovisuel', redirectTo: 'projets', pathMatch: 'full' }`
so existing links and bookmarks resolve. The component directory and selector
keep the `audiovisuel` name.

Every route also renders [header](/components/header.md) and
[footer](/components/footer.md), supplied by
[AppComponent](/components/app-root.md).

Two URLs are not routes and must keep working as plain resources:

* `img/CV_camille_2026.pdf` — linked from the nav and from `/contact`.
* The Google Form at `docs.google.com` — the only contact channel.

# Deep links must work

Netlify rewrites `/*` to `/index.html` with status 200, so `/photo` typed
directly into a browser serves the app, which then routes client-side. Removing
that rewrite breaks every URL except `/`.

Both `netlify.toml` and `public/_redirects` currently declare it; one is
enough. See [Netlify config nits](/issues/netlify-config-nits.md).

# Unknown paths

**`{ path: '**' }` renders [NotFoundComponent](/components/not-found-page.md)**
(Session 7). Because Netlify serves `index.html` with status 200 for any
unknown path, this is a **soft 404** — the page is HTTP 200, there is no SSR to
set the code. The page itself makes the "not found" obvious and links back to
`/`, `/projets`, `/contact`.

# What is unspecified today

**Per-route titles are unspecified.** Every route shows
`<title>Camille Portfolio</title>`, so a browser with four tabs open shows four
identical ones and search engines see one title for four pages. See
[missing SEO metadata](/issues/missing-seo-metadata.md).

# Related

* [Angular application shell](/architecture/angular-shell.md)
