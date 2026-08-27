---
type: Issue
title: app.component.css is 200 lines of Angular starter boilerplate
description: Unused CLI scaffold styling that still leaks font-family and box-sizing onto app-root, so deleting it is a visible change.
tags: [cleanup, css, p3, resolved]
resource: /src/app/app.component.css
status: deprecated
priority: P3
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-27, session 3.** Moved `font-family` and `box-sizing` into
`styles.css` (scoped to `app-root`), deleted the file, dropped `styleUrl` from
the decorator, deleted `public/angular.ico`. The leftover `.mfp-fade` rules and
the `img, video, iframe` rule at the bottom were confirmed dead too — Angular's
style encapsulation keeps unscoped selectors in a component stylesheet
confined to that component's own template, and `app.component.html` has no
`img`/`video`/`iframe` of its own, only `<app-header>`, `<router-outlet>`,
`<app-footer>`.

# Symptom

200 lines of CSS that match nothing in the markup.

# Evidence

`app.component.css` is the untouched Angular CLI welcome-page stylesheet:
`--bright-blue`, `--electric-violet`, `.pill`, `.angular-logo`, and so on. None
of those classes appear anywhere in this project's templates.

`public/angular.ico` (15 kB) and `docs/angular.ico` are the same leftover.

# The catch

It is **not** entirely inert. The `:host` block sets `font-family: Inter` and
`box-sizing: border-box` on `app-root`, both of which cascade into the whole
app.

So `rm app.component.css` is a visible styling change, not a pure deletion.

# Fix

1. Move the two rules that actually matter into `src/styles.css` (currently 81
   bytes) if they are wanted — a global `box-sizing: border-box` almost
   certainly is.
2. Then delete `app.component.css` and drop `styleUrl` from the decorator.
3. Delete `public/angular.ico`.

Check the site in a browser after, specifically for font changes.

# Related

* [AppComponent](/components/app-root.md)
