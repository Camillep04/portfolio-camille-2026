---
type: Issue
title: Every component class is empty and all behaviour lives in global jQuery
description: custom.js binds at document.ready, before Angular renders the routed component, so the site works only on a hard reload of each page.
tags: [angular, jquery, legacy, p3, root-cause]
resource: /src/app
status: stable
priority: P3
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

Scroll-spy, sticky header, progress bars and the typewriter effect work after a
hard reload and stop working after navigating within the site.

# Evidence

All six component classes are empty shells with `imports: []` and no body:

```ts
@Component({ selector: 'app-accueil', standalone: true, imports: [], ... })
export class AccueilComponent { }
```

Every interactive feature lives in `public/js/`, operating on the DOM behind
Angular's back:

```js
// public/js/custom.js
$(document).ready(function(){
  $('.header-area').sticky({ topSpacing: 0 });
  $('body').scrollspy({ target: '.navbar-collapse', offset: 0 });
  progressBar.appear(function () { ... });
  $('#client').owlCarousel({ ... });
});
```

`$(document).ready` fires **before** Angular has rendered the routed component.
Those selectors match nothing, the handlers bind to nothing, and **nothing
rebinds on route change**.

`indexCam.js` has the same shape — it runs once at `DOMContentLoaded` and
guards with `if (!placeholder) return;`, so it silently no-ops on any later
navigation back to `/`.

`portfolioCine.js` computes section offsets into `cordsSection` at
`window.onload` and then **never reads them** — dead code.

# Why it matters more after routerLink

Today most navigation is a full page reload
([issue](/issues/no-routerlink-full-page-reloads.md)), which accidentally
re-runs everything and hides this bug. Converting to `routerLink` removes that
accident and makes the breakage visible on every page.

**Fix the two together, or fix this one first.**

# Fix

Move behaviour into the components:

* `ngAfterViewInit` for anything that needs the DOM (sticky, scrollspy,
  progress bars).
* `(click)` bindings instead of global delegated handlers.
* `ViewChild` instead of `getElementById`.

Delete `portfolioCine.js` outright.

The end state is described in
[the two-layer frontend](/architecture/two-layer-frontend.md): Angular owns the
DOM, the theme provides styling only.

# Related

* [public/ static assets](/components/public-assets.md)
