---
type: Issue
title: The contact form iframe overflows on mobile
description: A hard-coded 440px Google Form forces horizontal scroll on a phone, and has no title attribute.
tags: [a11y, responsive, p4]
resource: /src/app/contact/contact.component.html
status: deprecated
priority: P4
verification: confirmed
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved in Session 8 (2026-08-30).** The form iframe is now
`class="contact-form-frame"` with `width: 100%; max-width: 680px; border: 0`
and a `[title]` binding — no fixed pixel width, verified at 375px with no
horizontal overflow. See [ContactComponent](/components/contact-page.md),
[roadmap](/plans/remediation-roadmap.md) item 33. The YouTube-iframe half of the
"Fix" note below is handled separately by roadmap item 35.

# Symptom

On a phone, the contact page scrolls sideways and the form is cut off.

# Evidence

`contact.component.html:18`:

```html
<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform?embedded=true"
        width="440" height="990" frameborder="0" ...>
```

440 px fixed width on a 375 px viewport forces horizontal scroll for the whole
page. There is also no `title` attribute, which screen readers require to
announce an iframe.

Made worse by [the missing responsive.css](/issues/unlinked-stylesheets.md) —
the theme's mobile breakpoints are not loaded at all.

# Impact

This is the **only contact channel on the site**. See
[ContactComponent](/components/contact-page.md). A portfolio visitor on a phone
is the most likely visitor there is.

# Fix

```html
<iframe src="..."
        title="Formulaire de contact"
        style="width:100%;max-width:440px;border:0"
        height="990">
```

Same treatment for the YouTube iframe in `accueil.component.html:67` — it has a
`title` already, but no responsive wrapper beyond `.video-wrapper`.

Test at 375 px width before merging.

# Related

* [ContactComponent](/components/contact-page.md)
