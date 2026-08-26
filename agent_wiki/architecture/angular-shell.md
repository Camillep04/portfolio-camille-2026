---
type: Architecture
title: Angular application shell
description: How the Angular 18 standalone app boots, routes, and composes the four pages.
tags: [architecture, angular, routing]
resource: /src/app
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# Boot sequence

Angular 18.1, **standalone components** — there is no `NgModule` anywhere.

```
src/main.ts
  └─ bootstrapApplication(AppComponent, appConfig)
       └─ src/app/app.config.ts
            ├─ provideZoneChangeDetection({ eventCoalescing: true })
            └─ provideRouter(routes)   ← src/app/app.routes.ts
```

# Page composition

[`AppComponent`](/components/app-root.md) is a fixed three-part frame; only the
middle changes:

```html
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>
```

So [header](/components/header.md) and [footer](/components/footer.md) are
present on every route, and each route swaps exactly one component into the
outlet.

# Routes

Defined in `src/app/app.routes.ts`. Four routes, **no wildcard**:

| Path | Component | Concept |
|---|---|---|
| `''` | `AccueilComponent` | [Accueil page](/components/accueil-page.md) |
| `'audiovisuel'` | `AudiovisuelComponent` | [Audiovisuel page](/components/audiovisuel-page.md) |
| `'photo'` | `PhotoComponent` | [Photo page](/components/photo-page.md) |
| `'contact'` | `ContactComponent` | [Contact page](/components/contact-page.md) |

The missing `{ path: '**' }` is a real defect on a host that rewrites unknown
URLs to `index.html`: a typo'd path renders header + footer + blank middle
instead of a 404. See [no wildcard route](/issues/no-wildcard-route.md).

# What is surprising

* **Every component class is empty.** `imports: []`, empty body, no logic.
  The classes exist only to attach a template. See
  [empty component classes](/issues/empty-component-classes.md).
* **Navigation is not Angular navigation.** There are zero uses of
  `routerLink` in the whole app; the header uses plain `href`, so every
  internal click is a full page reload that re-bootstraps Angular. See
  [no routerLink](/issues/no-routerlink-full-page-reloads.md).
* **`src/styles.css` is 81 bytes** — effectively empty. All real styling comes
  from `public/css/`, outside Angular's view encapsulation.
* **`src/assets/` is not in `angular.json`'s asset globs.** Only `public/` is
  copied to the build output, so anything under `src/assets/` never ships. See
  [vendored magnific-popup repo](/issues/vendored-magnific-popup-repo.md).

# Related

* [Two-layer frontend](/architecture/two-layer-frontend.md) — the layer this sits on top of
* [Site routes contract](/specs/site-routes.md)
