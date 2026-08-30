---
type: Component
title: HeaderComponent
description: The site-wide bootsnav navbar — five links plus the FR/EN toggle, styled by the legacy theme, full-bleed at every width.
tags: [component, navigation]
resource: /src/app/header/header.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

The fixed top navigation, rendered on every route by
[AppComponent](/components/app-root.md). Empty class — it injects only
[`LanguageService`](/architecture/two-layer-frontend.md) as `i18n`.

# The links

| Label | Target | Kind |
|---|---|---|
| `Camille PROTHIN` (brand) | `/` | `routerLink` |
| Accueil / Home | `/` | `routerLink`, `routerLinkActive` |
| Projets / Projects | `/projets` | `routerLink`, `routerLinkActive` |
| Photos | `/photo` | `routerLink`, `routerLinkActive` |
| Contact | `/contact` | `routerLink`, `routerLinkActive` |
| CV | `img/CV_camille_2026.pdf` | plain href, `target="_blank"` — correct |
| FR / EN | — | `<button>` calling `i18n.toggle()` |

Session 2 converted the internal links to `routerLink` (see
[the resolved issue](/issues/no-routerlink-full-page-reloads.md)); Session 6
added the language toggle.

# What surprises you

* **The nav is `bootsnav`, not Bootstrap's own navbar.** The classes
  `navbar-default bootsnav navbar-fixed dark no-background` and the
  `data-in`/`data-out` attributes belong to `public/js/bootsnav.js`, hard-bound
  to jQuery + Bootstrap 3. A Bootstrap 5 migration cannot just rewrite the
  markup — it has to replace bootsnav outright, which is why BS5 is its own
  session. See [Khanas template](/references/khanas-template.md).
* **The mobile toggle uses Bootstrap 3 syntax** (`data-toggle="collapse"`,
  `data-target="#navbar-menu"`), which works only because BS3's JS is what is
  actually executing. Verified still working after the Session 8 CSS change.
* **`<img src="img/menu.png">` (burger) has no `alt`.** See
  [missing alt text](/issues/missing-alt-text.md).

# Layout

* **`@media (min-width: 992px)`** in `header.component.css` centres the link
  list on the bar and vertically aligns it with the "Camille PROTHIN" wordmark
  (Session 2).
* **Full-bleed at every width** (Session 8, [roadmap](/plans/remediation-roadmap.md)
  item 36). The bar used to be capped at 1920px and centred, from when the page
  was capped too; now `nav.navbar.bootsnav.navbar-fixed { left: 0; right: 0 }`
  and it fills the screen. On [XL screens](/decisions/xl-screens-scale-up.md)
  it scales up with the rest of the page (`body { zoom }`).
* The FR/EN toggle is a pill `<button>`, styled in `header.component.css`.

# Related

* [FooterComponent](/components/footer.md)
* [Site routes contract](/specs/site-routes.md)
* [XL screens scale up](/decisions/xl-screens-scale-up.md)
