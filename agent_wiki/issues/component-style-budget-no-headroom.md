---
type: Issue
title: The anyComponentStyle budget has no warning band
description: Warning and error are both 6 kB, so the build goes from green to hard failure with no advance notice as projects are added.
tags: [build, config, p0, resolved]
resource: /angular.json
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

**Resolved 2026-08-26, session 1.** A real production build was finally run.
Minified, `audiovisuel.component.css` is **5.93 kB** — so it sat about **70
bytes** under the old 6 kB *hard error*, and the next project added would have
broken the build outright with no warning first. The audit was right and the
margin was thinner than it guessed. The budget is now `maximumWarning: 8kB`,
`maximumError: 16kB`.

For reference, the other component styles measured: `accueil` 3.54 kB,
`app` 3.43 kB, `header` 385 B, `contact` 109 B, `photo` 94 B.

# Symptom

A production build can go from succeeding to failing with no intermediate
warning, triggered by ordinary content work.

# Evidence

`angular.json`:

```json
{ "type": "anyComponentStyle", "maximumWarning": "6kB", "maximumError": "6kB" }
```

Warning equals error, so there is no band between them.

`src/app/audiovisuel/audiovisuel.component.css` is **7,597 bytes raw**.
Minification may bring it under 6 kB today — this has **not been verified by an
actual build**, and the audit did not run one either.

# Impact

`audiovisuel.component.css` is precisely the file that grows when a project is
added, which is the most common content change. See
[content update workflow](/specs/content-update-workflow.md). The failure would
land during a routine edit, with no warning history to explain it.

# Fix

Run `npm run build` once to learn the real minified size, then set a band:

```json
{ "type": "anyComponentStyle", "maximumWarning": "8kB", "maximumError": "16kB" }
```

**Verify before changing:** the numbers above are placeholders until a real
build reports the actual size.

# Related

* [AudiovisuelComponent](/components/audiovisuel-page.md)
* [Build and deploy](/architecture/build-and-deploy.md)
