---
type: Component
title: ContactComponent
description: An embedded Google Form plus real social links — shipping alongside five leftover template placeholder links and an English heading.
tags: [component, page, content]
resource: /src/app/contact/contact.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

Route `'contact'`. 69 lines, the shortest page. Empty class.

# What it contains

1. Heading `<h2>contact me</h2>` — **English, lowercase, on a French site**.
2. An embedded **Google Form** (`docs.google.com/forms/d/e/1FAIpQLSd...`) at a
   hard-coded `width="440" height="990"`.
3. *Mes réseaux* — three real links as inline Bootstrap Icons SVGs:
   [Instagram](https://www.instagram.com/p___camille), LinkedIn, and
   [GitHub](https://github.com/Camillep04).
4. A CV download link (`img/CV_camille_2026.pdf`, with `download`).
5. A `.hm-foot-icon` list of **five dead links** — Facebook, Dribbble, Twitter,
   LinkedIn, Instagram — all `href="#"`.

# The contact channel

There is **no backend and no form handler**. The Google Form iframe is the only
way a visitor can reach Camille through the site. That matters: any change to
the contact page must not break that iframe, and the form itself lives outside
this repo entirely.

# Live defects

* **The iframe overflows on mobile.** 440 px fixed width forces horizontal
  scroll on a 375 px phone, and it has no `title` attribute (required for
  iframe accessibility). See
  [contact form overflow](/issues/contact-form-overflow-mobile.md).
* **The five `href="#"` social links are theme demo content**, duplicating the
  real links directly above them. Their `<i class="fa fa-*">` icons render as
  nothing anyway, since Font Awesome is not linked — so today they appear as
  five invisible dead links. See
  [placeholder content on contact](/issues/placeholder-content-contact.md).
* The heading language mismatch, same concept.

# Related

* [Khanas HTML template](/references/khanas-template.md) — where the dead links came from
* [unlinked stylesheets](/issues/unlinked-stylesheets.md)
