---
type: Decision
title: Fix the CSS layer cheaply now, migrate to Bootstrap 5 later
description: Session 2 links the missing stylesheets and leaves the Bootstrap 3/4/5 mix in place; the migration becomes its own session before the redesigns.
tags: [decision, css, bootstrap]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T23:40:00Z }
---

# The choice

[The roadmap](/plans/remediation-roadmap.md) required an explicit decision
before session 2: link the four unlinked stylesheets (cheap) or commit to
[the Bootstrap 5 migration](/issues/bootstrap-version-conflict.md) (expensive).

**Decided by the owner on 2026-08-26: cheap fix now, Bootstrap 5 later**, as its
own session scheduled *before* the session 6 redesigns.

# Why

The live bugs were costing visitors something every day — invisible icons, a
popup opening behind the navbar, no media queries at all — while the migration
is a multi-session job that requires replacing bootsnav and rewriting every
modal. Stopping the bleeding first is worth the rework.

# What it costs

The rework is known and accepted:

* The navbar centring fix will be redone against a Bootstrap 5 navbar.
* The photo modals will be rewritten from BS3/BS4 markup to BS5, which removes
  the `.in` / `.show` patch added in session 2.
* `gap-4` and `row-cols-*` stay silently ignored until the migration, so two
  layouts on the home page are still not what the markup asks for.

# What it bought

Measured after session 2, not predicted:

* Fourteen icons became visible; they had **two** things missing, not one —
  the stylesheet was unlinked *and* `public/fonts/` does not exist, so Font
  Awesome could never have rendered. They are bootstrap-icons now.
* `responsive.css` is linked, so the theme's media queries apply for the first
  time.
* The [large-screen bug](/issues/unlinked-stylesheets.md) turned out to be a
  different fault entirely — see the log for 2026-08-26.

# Related

* [Bootstrap version conflict](/issues/bootstrap-version-conflict.md)
* [Unlinked stylesheets](/issues/unlinked-stylesheets.md)
* [Owner review](/references/camille-review-2026-08.md)
