---
type: Decision
title: Netlify is the deploy target; the other three configs are dead
description: Confirmed by the owner — Netlify builds and publishes the site, so the Deno workflow, Dockerfile and docs/ folder are removable.
tags: [deploy, netlify, cleanup]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# Context

The repository contains **four** things that look like deployment mechanisms:

1. `netlify.toml`
2. `.github/workflows/deploy.yml` (Deno Deploy)
3. `Dockerfile` (nginx)
4. `docs/` (38 MB of committed build output, GitHub-Pages-shaped)

Reading the repo alone does not settle which is real. Each is plausible; three
of them are broken in ways you would only notice by running them.

# Decision

**Netlify is the live pipeline.** Confirmed by the repository owner on
2026-08-26. The other three are historical experiments that were never removed
and are to be deleted as cleanup work.

# Consequences

* `netlify.toml` is authoritative for build command and publish directory.
  Changes to the build must keep it in sync with `angular.json`.
* The three dead configs are actively harmful, not merely untidy:
  - the Deno workflow **fails on every push and PR to `main`**, training the
    owner to ignore a red X on exactly the branch that matters
    ([issue](/issues/deno-deploy-workflow-broken.md));
  - `docs/` doubles clone size and pollutes every `git grep`
    ([issue](/issues/stale-docs-build-output.md));
  - the `Dockerfile` reads as a supported path and is not
    ([issue](/issues/broken-dockerfile.md)).
* When CI is added, it goes in `.github/workflows/` as a **check** (build +
  headless tests on PR), not as a deploy. Deployment stays Netlify's job.

# Options considered

| Option | Why not |
|---|---|
| Keep the Deno workflow and fix it | Two deploy targets for one site. Nothing needs Deno Deploy. |
| Keep the Dockerfile for local parity | Netlify's build is what matters; a container adds a second thing to keep in sync for no gain on a static site. |
| Leave the dead configs in place | They are already causing the failure they would cause — a permanently red `main`. |

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
* [main is production](/decisions/main-is-production.md)
