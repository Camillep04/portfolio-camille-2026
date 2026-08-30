---
type: Component
title: ContactComponent
description: An embedded Google Form with the CV download and three real social links stacked above it. Route 'contact'.
tags: [component, page, content]
resource: /src/app/contact/contact.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'contact'`. The shortest page. Class is a one-liner — it only injects
[`LanguageService`](/architecture/two-layer-frontend.md) as `i18n`.

# What it contains

Top to bottom:

1. Section heading — `i18n.t('contact.title')` (`Contactez-moi` / `Contact me`),
   `text-transform: uppercase` from the theme.
2. `.contact-intro` — the **CV download** link (`img/CV_camille_2026.pdf`, with
   `download`) and, below it, `.social-links`: three real links as inline
   Bootstrap-Icons SVGs —
   [Instagram](https://www.instagram.com/p___camille), LinkedIn,
   [GitHub](https://github.com/Camillep04).
3. The embedded **Google Form** —
   `iframe.contact-form-frame`, `[title]="i18n.t('contact.form')"`,
   `src=".../viewform?embedded=true"`. Sized in CSS: `width: 100%;
   max-width: 680px; border: 0`.

# The contact channel

There is **no backend and no form handler**. The Google Form iframe is the only
way a visitor reaches Camille through the site. Any change to this page must not
break that iframe, and the form itself lives outside this repo.

**Google caps the form card.** The embedded form renders its own content at
roughly 640px maximum regardless of the iframe width, so widening the iframe
past ~680px only adds grey margin around the card. "Make the form 2× wider" is
bounded by that — the real win was going from the old fixed `440px` (which
squashed the form *below* its natural width) up to ~640px.

# History

* **Session 6** — heading and "socials" label moved to i18n keys; the icons
  became inline Bootstrap-Icons SVGs (Font Awesome was never linked).
* **Session 8 (2026-08-30)** — restructure, [roadmap](/plans/remediation-roadmap.md)
  item 33:
  * Removed the `<h3 class="txt">Camille PROTHIN</h3>` title and the
    "Mes réseaux :" heading (`contact.socials` i18n key deleted).
  * Removed the `.hm-foot-icon` list of five dead `href="#"` links (Facebook,
    Dribbble, Twitter, LinkedIn, Instagram) — see
    [placeholder content](/issues/placeholder-content-contact.md).
  * Moved the CV button + the three real social links **above** the form.
  * Form iframe: fixed `width="440"` → fluid `max-width: 680px`, fixing
    [the mobile overflow](/issues/contact-form-overflow-mobile.md).
  * Added `.contact { padding-top: 140px }` so the heading clears the fixed
    100px nav bar (the theme only padded `.single-contact-box`, below the h2).
  * This delivers most of roadmap item 27 ("redesign the Mes réseaux block").

# Related

* [Khanas HTML template](/references/khanas-template.md) — where the dead links came from
* [Remediation roadmap](/plans/remediation-roadmap.md)
