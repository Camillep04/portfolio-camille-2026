---
type: Spec
title: Branch and release workflow
description: The contract for how a change travels from an idea to the live site, and where an agent must stop.
tags: [workflow, process, git]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# Branches

| Branch | Role |
|---|---|
| `main` | **Production.** Every push deploys. Owner-only merges. |
| `develop` | Integration branch. All work happens here or on branches off it. |

Both are on GitHub (`origin`), at
`https://github.com/Camillep04/portfolio-camille-2026`.

# The loop

```
work on develop
  → verify locally (build + tests + manual check of the affected pages)
  → owner reviews
  → owner merges develop → main
  → push main
  → Netlify rebuilds → live
```

# What must be true before proposing a merge

This is the contract, and it is stricter than usual because
[main is production](/decisions/main-is-production.md) and there is no CI.

1. `npm run build` succeeds — including production budgets.
2. `npm test` is green, or its current failures are known and unchanged.
   Today two tests fail on a clean checkout; see
   [stale app component spec](/issues/stale-app-component-spec.md).
3. Every page touched by the change has been loaded in a browser, including
   after a **client-side navigation**, not only after a hard reload — the
   [two-layer seam](/architecture/two-layer-frontend.md) means those two paths
   behave differently.
4. No regression on pages the change did not intend to touch. Global CSS and
   global jQuery mean blast radius is often wider than the diff.

# Where an agent stops

An agent may commit and push to `develop`. An agent must **not**:

* push to `main`,
* merge anything into `main`,
* create and merge a PR into `main`,
* force-push any shared branch.

The merge is the owner's, always.

# Known gaps in this contract

* **No CI enforces any of it.** Steps 1–4 are honour-system and manual.
* **`npm test` opens a browser and never exits**, so it cannot run
  unattended. A `test:ci` script is the prerequisite for automating step 2.
* The only workflow in `.github/workflows/` deploys to the wrong platform and
  fails on every PR, so a red check on `main` currently means nothing.

Closing those gaps is session 1 of
[the remediation roadmap](/plans/remediation-roadmap.md).

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
