---
type: Issue
title: docs/ is 38 MB of stale committed build output
description: 128 tracked files of a January build that nothing serves, doubling clone size and polluting every search.
tags: [repo-hygiene, performance, p2]
resource: /docs
status: stable
priority: P2
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# Symptom

The repository is far larger than the source it contains, and `git grep` returns
duplicate hits from compiled output.

# Evidence

* `git ls-files docs | wc -l` -> **128** tracked files
* `du -sh docs` -> **38 MB**
* Contents are a built Angular bundle: `main-ODP3TYSJ.js`,
  `polyfills-SCHOHYNV.js`, `styles-5INURTSO.css`, `3rdpartylicenses.txt`,
  plus a full copy of `img/` and `css/`.
* Last touched **2026-01-20**, while source has changed through 2026-06-30 —
  so it does not even match the current site.

Netlify publishes `dist/portfolio-angular/browser`, per `netlify.toml`.
Nothing reads `docs/`. See
[Netlify as the deploy target](/decisions/netlify-as-deploy-target.md).

# Impact

* Doubles clone and fetch size.
* Every `git grep` and every editor search returns stale duplicates of real
  source, which is actively confusing when tracking a bug.
* Reads as a GitHub Pages publish directory, i.e. as a second live deploy
  target that does not exist.

# Fix

```bash
git rm -r --cached docs && rm -rf docs
```

then add `/docs` to `.gitignore`.

**Confirm before running:** check GitHub repo settings do not have Pages
configured to serve from `/docs` on `main`. If it is, disabling Pages is part of
this change.

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
