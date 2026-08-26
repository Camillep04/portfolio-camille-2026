---
type: Issue
title: Netlify and Angular config inconsistencies
description: The build command depends on a global ng, redirects are declared twice, and the test target maps assets differently from the build target.
tags: [config, build, p4]
resource: /netlify.toml
status: stable
priority: P4
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

Three small config inconsistencies, one of which quietly breaks any test that
renders a template.

# Evidence

**1. The build command depends on a global `ng`.**

```toml
command = "ng build --configuration production"
```

This works only if `ng` is on `PATH` in the build image. `npm run build` is the
portable form and uses the locally pinned CLI version, which matters given the
project is on Angular 18 while
[the dead workflow installs CLI 17](/issues/deno-deploy-workflow-broken.md).

**2. Redirects are declared twice.** `public/_redirects` contains
`/* /index.html 200`, and `netlify.toml` has an equivalent `[[redirects]]`
block. Keep one — `netlify.toml`, since it sits with the build config. Two
sources for one rule is how they drift.

**3. The test target maps assets differently from the build target.**

```json
// angular.json, test target
{ "glob": "**/*", "input": "public", "output": "/assets" }
```

but the **build** target maps `public` to the root, and every template
references images as `img/...`. So any test that renders a real template gets
404s in the Karma console for every image.

That is noise today, because
[the specs assert nothing](/issues/spec-files-are-stubs.md) — but it becomes an
obstacle the moment real rendering tests are written, which is exactly the plan.

# Fix

1. `command = "npm run build"` in `netlify.toml`.
2. Delete `public/_redirects`.
3. Align the test target's asset mapping with the build target's.

Do (3) before writing rendering tests, not after.

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
* [Site routes contract](/specs/site-routes.md)
