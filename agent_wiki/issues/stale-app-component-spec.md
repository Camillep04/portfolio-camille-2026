---
type: Issue
title: Stale AppComponent spec fails on a clean checkout
description: Two of three tests in app.component.spec.ts assert Angular starter values that no longer exist, so npm test is red for everyone.
tags: [testing, p0, ci, resolved]
resource: /src/app/app.component.spec.ts
status: deprecated
priority: P0
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-26, session 1.** `app.component.spec.ts` was rewritten: the
title assertion now expects `Camille Portfolio`, and the `Hello, PortfolioAngular`
`<h1>` test was replaced by one asserting the real shell — `app-header` and
`app-footer` around the router outlet. `provideRouter(routes)` was added so the
outlet resolves. `npm run test:ci` reports **9 of 9 green**.

# Symptom

`npm test` reports two failures on a fresh clone, before anyone has changed
anything.

# Evidence

`app.component.spec.ts` still tests the Angular CLI scaffold:

```ts
expect(app.title).toEqual('PortfolioAngular');
expect(compiled.querySelector('h1')?.textContent).toContain('Hello, PortfolioAngular');
```

But `app.component.ts` sets `title = 'Camille Portfolio'`, and
`app.component.html` is three tags — header, outlet, footer — with **no `<h1>`
at all**.

# Impact

This is a P0 because of what it does to the workflow, not because of the tests
themselves. [Branch workflow](/specs/branch-workflow.md) says "verify locally
before merging", and [main is production](/decisions/main-is-production.md)
makes that the only gate. A suite that is permanently red teaches you to skip
the step — so there is effectively **no regression net** on the branch that
deploys.

# Fix

1. Delete the two stale assertions (keep `should create the app`), or assert
   the real title.
2. Add a script that can run unattended, because `ng test` opens a browser and
   never exits:

```json
"test": "ng test",
"test:ci": "ng test --watch=false --browsers=ChromeHeadless"
```

Prerequisite for the PR check in
[the roadmap](/plans/remediation-roadmap.md), session 1.

# Related

* [AppComponent](/components/app-root.md)
* [Spec files are stubs](/issues/spec-files-are-stubs.md)
