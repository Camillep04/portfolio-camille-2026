---
type: Issue
title: All six spec files are unmodified should-create stubs
description: Six identical scaffolded tests with zero assertions about actual content, so the test suite protects nothing.
tags: [testing, p3]
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

A green test run tells you nothing about whether the site works.

# Evidence

Six spec files — `accueil`, `audiovisuel`, `photo`, `contact`, `header`,
`footer` — each 23 lines, each containing exactly one scaffolded
`should create` test. No assertion anywhere touches routes, content, links or
rendered counts.

Plus `app.component.spec.ts`, which
[actively fails](/issues/stale-app-component-spec.md).

Net value of the suite today: negative. It costs time to run and it is red.

# Why it stayed that way

There is nothing meaningful to assert against. With
[content hard-coded as markup](/issues/content-hardcoded-in-templates.md), there
is no source of truth for "there are ten projects" — the only way to check is to
count `<section>` tags against a number written nowhere.

That is why this issue is sequenced **after** the data refactor.

# Fix

Once `PROJECTS`, `PHOTOS` and the timelines are typed data, write three or four
tests that would actually have caught a real regression:

```ts
it('renders every project', () => {
  expect(fixture.debugElement.queryAll(By.css('section')).length)
    .toBe(PROJECTS.length);
});
```

* each route renders its component
* rendered item count matches the data array
* nav links resolve to real routes
* no duplicate ids in rendered output

Four tests like these plus [a working CI](/issues/deno-deploy-workflow-broken.md)
would give [the merge gate](/decisions/main-is-production.md) something
mechanical to stand on.

# Related

* [Branch workflow](/specs/branch-workflow.md)
