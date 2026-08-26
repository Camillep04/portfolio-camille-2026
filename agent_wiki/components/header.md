---
type: Component
title: HeaderComponent
description: The site-wide bootsnav navbar — five links, all plain hrefs, styled entirely by the legacy theme.
tags: [component, navigation]
resource: /src/app/header/header.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

The fixed top navigation, rendered on every route by
[AppComponent](/components/app-root.md). 25 lines of template, empty class.

# The links

| Label | Target | Kind |
|---|---|---|
| `Camille PROTHIN` (brand) | `index.html` | plain href — only resolves because of the Netlify catch-all |
| Accueil | `/` | plain href |
| Projets | `/audiovisuel` | plain href |
| Photos | `/photo` | plain href |
| Contact | `/contact` | plain href |
| CV | `img/CV_camille_2026.pdf` | external, `target="_blank"` — correctly a plain href |

**None of the four internal links use `routerLink`.** Every click destroys and
re-bootstraps the Angular app. See
[no routerLink](/issues/no-routerlink-full-page-reloads.md).

# What surprises you

* **The nav is `bootsnav`, not Bootstrap's own navbar.** The classes
  `navbar-default bootsnav navbar-fixed dark no-background` and the
  `data-in`/`data-out` attributes belong to `public/js/bootsnav.js`. A
  Bootstrap 5 migration cannot just rewrite the markup — it has to replace
  bootsnav outright. See [Khanas template](/references/khanas-template.md).
* **The mobile toggle uses Bootstrap 3 syntax** (`data-toggle="collapse"`,
  `data-target="#navbar-menu"`), which works only because BS3's JS is what is
  actually executing.
* **`<img src="img/menu.png">` has no `alt`.** See
  [missing alt text](/issues/missing-alt-text.md).
* **`<li class="smooth-menu active"></li>` is empty** — a leftover anchor for
  the theme's scroll-spy, which does nothing here.
* **There is no active-route highlighting.** `routerLinkActive` would give this
  for free once the links become `routerLink`.

# Related

* [FooterComponent](/components/footer.md)
* [Site routes contract](/specs/site-routes.md)
