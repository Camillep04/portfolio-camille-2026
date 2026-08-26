---
type: Issue
title: html lang is en on an entirely French site
description: Screen readers use the wrong pronunciation engine and search engines mis-classify the page language.
tags: [a11y, seo, p4]
resource: /src/index.html
status: stable
priority: P4
verification: confirmed-in-production
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
  - id: live
    resource: /references/live-site.md
    title: Live site checks, 2026-08-26
---

# Symptom

`src/index.html` line 2:

```html
<html lang="en">
```

Every word of visible content is French — *Accueil*, *Projets*, *Qui est
Camille ?*, *Compétences*, *Expériences*, *Formations*.

# Impact

* Screen readers select an English pronunciation engine for French text, which
  makes the site close to unusable aurally.
* Search engines mis-classify the page, which matters for a portfolio meant to
  be found.
* Browser translation prompts behave wrongly.

# Fix

```html
<html lang="fr">
```

One character-level change, no risk. Worth doing in the same pass as
[the SEO metadata](/issues/missing-seo-metadata.md).

# Related

* [index.html](/components/index-html.md)
