---
type: Plan
title: Remediation roadmap
description: The staged order for the 29 audit findings and the owner's 25 requests, safety net first, design last.
tags: [plan, roadmap]
status: draft
stale_after: 2027-06-30T00:00:00Z
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
  - id: owner-review
    resource: /references/camille-review-2026-08.md
    title: Owner review, 2026-08-26
---

# The ordering principle

Because [main is production](/decisions/main-is-production.md) and there is no
CI, the first work must be **building the safety net**, not fixing the most
visible bugs. Every session after that is verified by the net built in
session 1.

Two documents feed this plan: [the code audit](/references/review-audit-2026-08.md)
(what is broken underneath) and [the owner's review](/references/camille-review-2026-08.md)
(what is wrong on screen). Owner requests are marked **[C]** below. Where the
two agree — the content refactor — that item gets priority.

Within each session, changes should be small enough that the owner can verify
them page by page before merging.

# Session 1 — make the safety net real ✅ done 2026-08-26

The prerequisite for everything else.

1. ✅ Fixed [the stale app component spec](/issues/stale-app-component-spec.md);
   the suite now passes on a clean checkout (9/9 green).
2. ✅ Added `test:ci` (`ng test --watch=false --browsers=ChromeHeadless`).
3. ✅ Deleted the Deno workflow, replaced with `.github/workflows/ci.yml` —
   `npm ci && npm run build && npm run test:ci` on every PR and push to `main`.
   See [the issue](/issues/deno-deploy-workflow-broken.md).
4. ✅ Gave [the style budget a warning band](/issues/component-style-budget-no-headroom.md):
   warning 8 kB, error 16 kB. A real build measured
   `audiovisuel.component.css` at **5.93 kB** against the old 6 kB *hard error* —
   about 70 bytes of headroom, so the next project added would have broken the
   build with no warning first.

**Done when:** a pull request into `main` runs a green check that would have
gone red for a broken build or a failing test.

# Session 2 — kill the live bugs ✅ done 2026-08-26

Decided first, as the plan required:
[cheap fix now, Bootstrap 5 later](/decisions/css-cheap-fix-before-bootstrap-5.md).
Everything below was verified in a browser at 2560px, 1366px and 375px, not
just built.

5. ✅ Deleted the trailing [jQuery 1.9.1 tag](/issues/duplicate-jquery-load-order.md).
   jQuery is 2.2.4 again and every plugin is attached to it.
6. ✅ Deleted [the magnific-popup script](/issues/magnific-popup-script-404.md)
   and `popup.js` — `/photo` never used magnific-popup.
   **[C]** The owner's "popup opens under the nav bar" bug was a different
   fault: [Bootstrap 3's JS marking the modal `in` while Bootstrap 4's CSS waits
   for `show`](/issues/photo-modal-opens-behind-navbar.md), leaving the dialog
   translated a quarter-screen up. Fixed and re-measured.
7. ✅ [Linked animate.css and responsive.css](/issues/unlinked-stylesheets.md).
   Font Awesome could not be repaired by linking — `public/fonts/` does not
   exist either — so the fourteen icons are **bootstrap-icons** now, from the
   npm package already in `package.json`.
   **[C]** Linking `responsive.css` did *not* fix the large-screen complaint;
   that file has only `max-width` rules. The real cause was
   [the page pinned left above 1920px](/issues/page-pinned-left-above-1920.md).
8. ✅ **[C]** Centred the navbar links on the bar and aligned them with the
   "Camille Prothin" wordmark, in [the header](/components/header.md).
9. ✅ Deleted [the dead inline script](/issues/dead-inline-script-audiovisuel.md),
   the five `onclick="closePopup()"` attributes, and the five dead
   `popup-container` blocks they belonged to.
10. ✅ Converted internal links to
    [routerLink](/issues/no-routerlink-full-page-reloads.md). The audit's
    warning was real: the hero typewriter had to move into `AccueilComponent`
    and the burger menu had to learn to close on `NavigationEnd`.

**Still open from this session's territory:** whether the site should stay
capped at 1920px and centred, or stretch on very wide screens. That is a design
question for session 6.

# Session 3 — weight

11. Regenerate the 2.1 MB favicon, compress `public/img`, add `loading="lazy"`.
    See [oversized images](/issues/oversized-images.md).
12. Delete dead weight: [docs/](/issues/stale-docs-build-output.md),
    [src/assets/magnific-popup](/issues/vendored-magnific-popup-repo.md),
    [the Dockerfile](/issues/broken-dockerfile.md),
    [app.component.css](/issues/angular-starter-boilerplate-css.md).

# Session 4 — the refactor that pays for itself

The audit and the owner arrived at this one independently, which makes it the
highest-value session in the plan.

13. Extract `PROJECTS`, `PHOTOS`, `EXPERIENCES`, `EDUCATION` to typed data and
    render with `@for`. See
    [content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
    and the target described in
    [the content update workflow](/specs/content-update-workflow.md).

    Three owner requests are satisfied by this and by nothing else:
    * **[C]** New projects added at the **top**, numbered newest-first
      (4, 3, 2, 1) instead of each one inheriting the previous.
    * **[C]** Photo order changeable without breaking the responsive grid —
      array order becomes display order.
    * **[C]** Texts, images and links editable in one place, the site staying
      coherent and responsive.

Stage it one dataset at a time — `PHOTOS` first, since that file is the largest
and the most mechanical — so each stage is independently verifiable. The photo
data model must carry an optional `description`, because Session 5's popup
needs it.

**Done when:** adding a project is a nine-line object in one `.ts` file, and a
test asserts the rendered count matches the data.

# Session 5 — the owner's features

All **[C]**, all specified well enough to build. Ordered cheapest first.

14. Footer: replace the hard-coded `2026` with the current year.
15. Rename the projects route `/audiovisuel` to `/projets`, keeping a redirect
    from the old path so existing links survive. See
    [site routes](/specs/site-routes.md).
16. Projects page buttons ("voir la vidéo" / "voir le projet"): on hover, invert
    to white background and black text with the fill wiping left to right, and
    remove the current grey colour change.
17. `/photo`: centre the images vertically.
18. `/photo`: Instagram call to action at the end of the page, to
    `https://www.instagram.com/p___camille/`.
19. `/photo` popup: show the photo's description when it has one.
20. `/photo` popup: left/right arrow controls to browse the gallery as a
    carousel. Needs Session 4's `PHOTOS` array to be the source of order.
21. Projects page: clickable hearts, empty becoming filled, remembered per
    visitor. *Open question before building: remember in `localStorage`
    (simplest, no consent banner) or a real cookie? And is it a private
    favourite, or should a count be displayed?*

# Session 6 — design, accessibility and reach

Every item here is a direction rather than a specification. **Agree a short
brief with the owner before writing markup** — that is the rule for this whole
session, and the open question is recorded next to each item.

22. **[C]** Redesign the "QUI EST CAMILLE" block for design and legibility.
    *Open: what specifically reads badly — line length, contrast, the photo/text
    ratio? Any reference site?*
23. **[C]** Redesign "Expériences" and "FORMATIONS".
    *Open: keep the vertical timeline, or move to cards / two columns?*
24. **[C]** Swap the order of "compétences" and "plonger dans mon univers" on
    the home page. Mechanical, but it changes the page's rhythm, so it belongs
    with the redesign above.
25. **[C]** "COMPETENCES" logos: smaller, and in black and white.
    *Open: how much smaller, and greyscale at rest with colour on hover, or
    greyscale always?*
26. **[C]** `/photo`: add padding at the `lg` and `md` breakpoints.
    *Open: matching the site's existing section padding, or wider?*
27. **[C]** Redesign the "Mes réseaux :" block on `/contact`.
    *Open: this depends on [unlinked stylesheets](/issues/unlinked-stylesheets.md)
    being fixed first — the icons are invisible today, so the current design has
    never actually been seen.*
28. **[C]** Digital accessibility pass **without changing the current design**.
    *Open: which target — WCAG 2.1 AA, or RGAA? That decides how much of "sans
    modifier le site actuel" is achievable, since contrast ratios may force
    colour changes.*
29. **[C]** English version of the site.
    *Open: Angular's `@angular/localize` (two builds, two URLs, good for SEO) or
    a runtime language toggle (simpler, one build)? And who writes the English
    copy?* This is much cheaper after Session 4 — translating a data file beats
    translating duplicated markup.

# Ongoing

30. [Linter and formatter](/issues/no-linter-or-formatter.md).
31. SEO and technical accessibility:
    [html lang](/issues/html-lang-mismatch.md) — which becomes a real decision
    once item 29 lands —
    [SEO metadata](/issues/missing-seo-metadata.md),
    [alt text](/issues/missing-alt-text.md),
    [contact form overflow](/issues/contact-form-overflow-mobile.md),
    [placeholder content](/issues/placeholder-content-contact.md),
    [wildcard route](/issues/no-wildcard-route.md),
    [dead commented markup](/issues/dead-commented-markup.md),
    [Netlify config nits](/issues/netlify-config-nits.md).

# Related

* [All issues](/issues/index.md)
* [Owner review, 2026-08-26](/references/camille-review-2026-08.md)
* [Branch workflow](/specs/branch-workflow.md)
