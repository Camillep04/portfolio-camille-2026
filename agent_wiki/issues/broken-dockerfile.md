---
type: Issue
title: The Dockerfile is syntactically broken and unused
description: Every comment line is missing its hash prefix, so Docker parses prose as instructions and the build fails on line one.
tags: [cleanup, deploy, p3, resolved]
resource: /Dockerfile
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

**Resolved 2026-08-27, session 3.** Deleted. The site deploys via Netlify.

# Symptom

`docker build` fails immediately.

# Evidence

Every comment in the file lost its `#`:

```dockerfile
Step 1: Build the Angular app
Use the official Node.js image to build the app
FROM node:18 as build

Set the working directory inside the container
WORKDIR /app
```

Docker parses `Step 1: Build the Angular app` as an instruction and errors on
the first line.

It is also unfinished regardless:

```dockerfile
COPY --from=build /app/dist/your-angular-project-name /usr/share/nginx/html
```

`your-angular-project-name` is a placeholder that was never filled in. The real
path is `dist/portfolio-angular/browser`.

# Impact

Low functional impact — nothing runs it. The cost is that it reads as a
supported deployment path to anyone opening the repo, alongside two other dead
deploy configs. See
[Netlify as the deploy target](/decisions/netlify-as-deploy-target.md).

# Fix

Delete it. The site deploys via Netlify and a static Angular build needs no
container.

# Related

* [Build and deploy](/architecture/build-and-deploy.md)
