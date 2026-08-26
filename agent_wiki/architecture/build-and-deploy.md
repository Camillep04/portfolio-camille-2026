---
type: Architecture
title: Build and deploy
description: Netlify builds and publishes from main on every push; three other deploy configs in the repo are dead and misleading.
tags: [architecture, deploy, netlify, ci]
resource: /netlify.toml
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# The live pipeline

**Netlify is the only thing that deploys the site.** Confirmed by the repo owner.
It publishes to [prothin-camille-portfolio.netlify.app](/references/live-site.md).

```toml
# netlify.toml
[build]
command = "ng build --configuration production"
publish = "dist/portfolio-angular/browser"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

Push to `main` → Netlify builds → the live site updates. There is no manual
release step and no staging environment. This is why
[main is production](/decisions/main-is-production.md) is a hard rule.

The SPA catch-all redirect is what makes deep links like `/photo` work at all,
since the build produces a single `index.html`.

# Three deploy configs that do nothing

This is the trap for anyone new to the repo. All three look authoritative and
none of them run:

| File | Claims to do | Reality |
|---|---|---|
| `.github/workflows/deploy.yml` | Deploy to Deno Deploy on push/PR to `main` | Not the live pipeline, and broken three ways. See [the issue](/issues/deno-deploy-workflow-broken.md). |
| `Dockerfile` | Build + serve via nginx | Every comment is missing its `#`, so it fails on the first line. See [the issue](/issues/broken-dockerfile.md). |
| `docs/` (38 MB, 128 tracked files) | Looks like a GitHub Pages publish dir | Stale build output from 2026-01-20. See [the issue](/issues/stale-docs-build-output.md). |

There is also a redundancy: `public/_redirects` and the `[[redirects]]` block in
`netlify.toml` express the same rule. See
[Netlify config nits](/issues/netlify-config-nits.md).

# Build configuration

`angular.json`, project `PortfolioAngular`:

* Builder: `@angular-devkit/build-angular:application`
* Output: `dist/portfolio-angular` (browser bundle under `browser/`)
* Assets: **`public/` only** — `src/assets/` is not copied
* Default configuration: `production` (output hashing on, budgets enforced)

The production budgets are a live hazard: `anyComponentStyle` sets warning and
error to the **same** 6 kB, so there is no warning band before a hard build
failure. See [style budget has no headroom](/issues/component-style-budget-no-headroom.md).

# There is no CI

The only workflow in `.github/workflows/` targets the wrong platform. Nothing
runs `npm ci`, `npm run build` or the test suite on a pull request. Combined
with [stub specs](/issues/spec-files-are-stubs.md), the safety net protecting
`main` is currently **manual local checking only**.

# Related

* [Branch workflow](/specs/branch-workflow.md)
* [main is production](/decisions/main-is-production.md)
* [Netlify as the deploy target](/decisions/netlify-as-deploy-target.md)
