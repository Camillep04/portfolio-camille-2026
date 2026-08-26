---
type: Issue
title: No linter and no formatter
description: Nothing mechanical catches duplicate ids, missing alt attributes or empty imports arrays, so all of them accumulated.
tags: [tooling, quality, p3]
resource: /package.json
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

Defect classes that a linter catches automatically are present dozens of times
each.

# Evidence

`package.json` has no ESLint, no Prettier, no lint script. The only quality
tooling is `.editorconfig`, which sets indentation and charset and is enforced
by nothing.

Things a standard Angular lint setup would have flagged:

* [35 duplicate ids](/issues/duplicate-dom-ids.md)
* [images with no alt attribute](/issues/missing-alt-text.md)
* `imports: []` on components using directives they never imported
* [the stripped `<script>` block](/issues/dead-inline-script-audiovisuel.md)
* unused variables — e.g. `owl` in `custom.js` is referenced but never defined

# Fix

```bash
ng add @angular-eslint/schematics
```

plus Prettier and a `format` script. Add both to the PR check once
[CI exists](/issues/deno-deploy-workflow-broken.md).

# Do this at the right time

Running a formatter over the current 2,000+ lines of hand-formatted template
produces an enormous diff that hides real changes and makes review impossible.

**Either** run it before any other work in a single dedicated commit, **or**
wait until after [the data refactor](/issues/content-hardcoded-in-templates.md)
has shrunk the templates. Do not interleave it with bug fixes.

# Related

* [Branch workflow](/specs/branch-workflow.md)
