---
type: Issue
title: The GitHub Actions workflow fails on every push to main
description: A Deno Deploy workflow that is not the real pipeline and is broken three ways, turning main permanently red.
tags: [ci, deploy, p0, resolved]
resource: /.github/workflows/deploy.yml
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

**Resolved 2026-08-26, session 1.** `.github/workflows/deploy.yml` was deleted
and replaced by `.github/workflows/ci.yml`, which runs
`npm ci`, `npm run build` and `npm run test:ci` on Node 20 for every pull
request and every push to `main`. It is a *check*, not a deploy — Netlify still
owns publishing. See
[Netlify is the deploy target](/decisions/netlify-as-deploy-target.md).

# Symptom

Every push and every pull request to `main` produces a failed check.

# Evidence

`.github/workflows/deploy.yml` deploys to **Deno Deploy**, which
[is not how this site ships](/decisions/netlify-as-deploy-target.md). It is
broken independently of that:

| Step | Problem |
|---|---|
| `npm install -g @angular/cli@17` | The project is Angular **18.1** |
| (missing) | Never runs `npm ci` / `npm install`, so `ng build` has no `node_modules` |
| `entrypoint: "main.ts"` | No `main.ts` at repo root — it is `src/main.ts` |

# Impact

The single highest-value fix in the codebase, for one reason: a permanently red
check on `main` trains the owner to ignore red checks on `main`. That is exactly
the signal a real CI would need to be believed.

# Fix

Delete it, and replace it with a check that runs on pull requests into `main`:

```yaml
- run: npm ci
- run: npm run build
- run: npm run test:ci
```

Depends on [test:ci existing](/issues/stale-app-component-spec.md).

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
* [Branch workflow](/specs/branch-workflow.md)
