---
type: Component
title: AppComponent (app-root)
description: The three-part page frame — header, router outlet, footer — and the 200 lines of untouched Angular starter CSS attached to it.
tags: [component, angular, shell]
resource: /src/app/app.component.ts
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

The root component. It is the only component with a non-empty `imports` array
and the only one that composes other components.

```html
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>
```

`imports: [RouterOutlet, HeaderComponent, FooterComponent]`. The class body
holds one field, `title = 'Camille Portfolio'`, which nothing renders — no
`<h1>` exists in this template.

# Contract

* Present on every route.
* Guarantees [header](/components/header.md) above and
  [footer](/components/footer.md) below whatever the route renders.
* Provides no state, no services, no lifecycle hooks.

# What surprises you

**`app.component.css` is 200 lines of Angular CLI starter boilerplate** —
`--bright-blue`, `--electric-violet`, `.pill`, `.angular-logo`. None of it
matches this markup. It is not inert, though: the `:host` block leaks
`font-family: Inter` and `box-sizing: border-box` onto `app-root`, so deleting
the file is a visible change, not a no-op. See
[Angular starter boilerplate CSS](/issues/angular-starter-boilerplate-css.md).

**`app.component.spec.ts` asserts starter values and fails.** Two of its three
tests check for the title `'PortfolioAngular'` and an `<h1>` containing
`'Hello, PortfolioAngular'`. Neither exists. See
[stale app component spec](/issues/stale-app-component-spec.md).

# Related

* [Angular application shell](/architecture/angular-shell.md)
