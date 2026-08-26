---
type: Architecture
title: Two-layer frontend
description: The site is an Angular 18 shell wrapped around a vendored jQuery HTML template, and almost every bug traces back to that seam.
tags: [architecture, angular, jquery, legacy]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# The shape of the whole

This is the single most important thing to understand before changing anything.
The site is **two independent frontends stacked on top of each other**, and they
do not know about one another.

| Layer | Lives in | Owns | Runs when |
|---|---|---|---|
| Angular 18 app | `src/` | Routing, component templates, the DOM you see | After Angular bootstraps |
| Vendored HTML template | `public/css/`, `public/js/` | Styling, nav behaviour, scroll effects, carousels, animations | At `$(document).ready`, i.e. **before** Angular renders |

The Angular layer was added around an existing static HTML template (see
[the Khanas template reference](/references/khanas-template.md)). The template's
CSS and JS were dropped into `public/` and loaded globally from
[`src/index.html`](/components/index-html.md); the template's markup was pasted
into Angular component templates.

# Why this matters

Angular expects to own the DOM. The template's JavaScript expects a static
page that exists at `DOMContentLoaded`. Both assumptions cannot hold.

**The ordering problem.** `public/js/custom.js` binds sticky-header, scrollspy,
progress bars and Owl carousel inside `$(document).ready(...)`. That fires
before Angular has rendered the routed component, so those handlers bind
against elements that do not exist yet — and nothing rebinds them on route
change. This is why the site behaves correctly only on a **hard reload of each
page**, and degrades once you navigate within the app. See
[empty component classes](/issues/empty-component-classes.md).

**The ownership problem.** All six component classes are empty shells with
`imports: []`. There is no Angular-side behaviour at all — every interactive
feature is global jQuery reaching into the DOM behind Angular's back.

**The version problem.** The template ships Bootstrap 3 and jQuery 2.2.4, while
`package.json` installs Bootstrap 5 (never imported) and `index.html` pulls
Bootstrap 4 from a CDN. See
[Bootstrap version conflict](/issues/bootstrap-version-conflict.md) and
[duplicate jQuery load order](/issues/duplicate-jquery-load-order.md).

# Data flow

There is none. There is **no data layer, no service, no HTTP call, no state**.
All content — every project, photo, experience and diploma — is hand-written
HTML inside component templates. That is a deliberate-by-default choice rather
than a considered one, and it is the root cause of most defects in this wiki;
see [content hardcoded in templates](/issues/content-hardcoded-in-templates.md).

# The direction of travel

The long-term shape the codebase is heading toward:

1. Angular owns the DOM. Behaviour moves into components (`ngAfterViewInit`,
   `(click)` handlers), not global jQuery.
2. One CSS framework — Bootstrap 5, already installed.
3. Content becomes typed data arrays rendered with `@for`, so adding a project
   is an object, not sixty lines of markup.

None of that has happened yet. See
[the remediation roadmap](/plans/remediation-roadmap.md).

# Related

* [Angular application shell](/architecture/angular-shell.md)
* [Build and deploy](/architecture/build-and-deploy.md)
