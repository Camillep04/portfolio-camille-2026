---
type: Issue
title: Template placeholder content still ships on the contact page
description: Five dead social links from the purchased theme sit below the three real ones, under an English heading on a French page.
tags: [content, cleanup, p4]
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

**Resolved in Session 8 (2026-08-30).** The `.hm-foot-icon` block of five dead
links is deleted; the heading has been an i18n key (`contact.title`, French
first) since Session 6; `popup.js` was deleted in Session 2. See
[ContactComponent](/components/contact-page.md) and
[the roadmap](/plans/remediation-roadmap.md) item 33.

# Symptom

Leftover demo content from the vendored theme is live on the public site.

# Evidence

`contact.component.html:57-63` — a `.hm-foot-icon` list of five social links,
all `href="#"`:

```html
<li><a href="#"><i class="fa fa-facebook"></i></a></li>
<li><a href="#"><i class="fa fa-dribbble"></i></a></li>
<li><a href="#"><i class="fa fa-twitter"></i></a></li>
<li><a href="#"><i class="fa fa-linkedin"></i></a></li>
<li><a href="#"><i class="fa fa-instagram"></i></a></li>
```

These duplicate the **three real** links added directly above (Instagram,
LinkedIn, GitHub). Today they render as five invisible dead links, because
[Font Awesome is not linked](/issues/unlinked-stylesheets.md) — so they are
currently a blank clickable row.

The section heading is `<h2>contact me</h2>` — English, lowercase, on an
otherwise entirely French page.

`public/js/popup.js` carries the same kind of leftover: its gallery caption
appends the name of the photographer from the plugin's demo, who has no
connection to this portfolio. It never runs today
([why](/issues/magnific-popup-script-404.md)), but it would if the lightbox were
repaired.

# Fix

1. Delete the `.hm-foot-icon` block entirely.
2. Change the heading to French — e.g. `<h2>Me contacter</h2>`.
3. Fix or delete the caption in `popup.js` as part of
   [the lightbox decision](/issues/magnific-popup-script-404.md).

# Related

* [Khanas HTML template](/references/khanas-template.md) — where this came from
