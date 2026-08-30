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

**Answered, then reversed:** session 2 chose to keep the site
[capped at 1920px and centred](/decisions/page-capped-at-1920-centred.md); the
owner reversed that opening session 6 — [the page is fluid](/decisions/page-is-fluid.md)
and each section carries its own readable max-width.

# Session 3 — weight ✅ done 2026-08-27

11. ✅ Regenerated the favicon (a mislabeled 3712x3712 JPEG, not actually an
    ICO) at 15 kB, added `loading="lazy"` to all 70 gallery `<img>` tags,
    recompressed `public/img` (34 MB -> 28 MB: PNGs losslessly, JPEGs at
    quality 92). **Not fully done** — the large photographic PNGs barely
    shrank under lossless recompression; converting them to WebP is the
    remaining win. See [oversized images](/issues/oversized-images.md).
12. ✅ Deleted dead weight: [docs/](/issues/stale-docs-build-output.md) (38 MB,
    confirmed GitHub Pages doesn't serve it),
    [src/assets/magnific-popup](/issues/vendored-magnific-popup-repo.md),
    [the Dockerfile](/issues/broken-dockerfile.md),
    [app.component.css](/issues/angular-starter-boilerplate-css.md) (moved its
    two live rules into `styles.css` first).

**Done when:** `ng build` succeeds, 11/11 tests pass, and `/`, `/photo`,
`/audiovisuel` all load clean in a browser with no console errors — verified.

# Session 4 — the refactor that pays for itself ✅ done 2026-08-27

The audit and the owner arrived at this one independently, which made it the
highest-value session in the plan. Landed one dataset at a time, one commit
each, each verified in a browser before the next.

13. ✅ Extracted every content dataset to typed data under
    [`src/app/data/`](/architecture/content-data-layer.md), rendered with
    `@for`. See
    [content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
    (now resolved) and [the content update workflow](/specs/content-update-workflow.md).
    * ✅ **`PHOTOS`** (`photos.ts`) — `photo.component.html` 958 → ~70 lines.
      Per-photo DOM ids, so the 35 duplicate `exampleModalLongTitle` ids are
      gone and `aria-labelledby` resolves. Hand-packed `col-sm-4` columns →
      CSS-columns masonry, so reordering the array reflows without gaps. `alt`
      is the photo title. Model carries optional `description` for Session 5.
    * ✅ **`PROJECTS`** (`projects.ts`) — `audiovisuel.component.html` 427 →
      ~55 lines. Each project carries its own `background`; it *was* a
      positional `nth-child` rule, which is exactly why reordering scrambled
      the page. image/info side alternates via a class + CSS `order`.
    * ✅ **`EXPERIENCES` + `EDUCATION`** (`cv.ts`) — the two home-page
      timelines, ~185 lines → two `@for` loops. The two `id="education"`
      sections became `id="experiences"` / `id="formations"`.

    Owner requests satisfied by this and nothing else:
    * **[C]** New projects added at the **top** — array order is display order;
      `projects.ts` keeps the current order, moving one is a one-line move.
    * **[C]** Photo order changeable without breaking the responsive grid — the
      CSS-columns masonry makes array order the fill order.
    * **[C]** Texts, images and links editable in one place — one typed object
      per item, type-checked at build.

**Done:** adding an item is one object in one `.ts` file; specs assert the
rendered count matches the data for photos, projects, experiences and
formations. 19/19 green.

**One visual side effect, on purpose:** the projects page's ten `nth-child`
hero backgrounds unified to `background-size: cover` (they varied only between
`100%` and, below 1500px, `cover`). Session 6 owns that redesign anyway.

# Session 5 — the owner's features ✅ done 2026-08-27

All **[C]**, all specified well enough to build. Ordered cheapest first. Four
commits on `develop`, one per page/area, each verified in a browser.

14. ✅ Footer: `currentYear = new Date().getFullYear()` in the copyright line.
15. ✅ Renamed the projects route `/audiovisuel` → `/projets`;
    `{ path: 'audiovisuel', redirectTo: 'projets', pathMatch: 'full' }` keeps
    old links working. Component dir/selector keep the `audiovisuel` name. See
    [site routes](/specs/site-routes.md).
16. ✅ [Projects page](/components/audiovisuel-page.md) link buttons: hover/focus
    inverts label + icons to black while a white fill wipes in from the left
    (`::before` `scaleX`, `transform-origin: left`). The grey translucent hover
    is gone.
17. ✅ `/photo`: the lightbox image is flex-centred vertically and horizontally.
18. ✅ `/photo`: Instagram call to action at the foot of the gallery →
    `https://www.instagram.com/p___camille/`.
19. ✅ `/photo` popup: shows `photo.description` under the title when set (no
    photo has one yet — the field is ready).
20. ✅ `/photo` popup: the 35 Bootstrap modals became **one Angular lightbox**.
    `‹` / `›` buttons and ArrowLeft/ArrowRight browse `PHOTOS` in array order,
    wrapping at both ends; Escape and backdrop click close.
21. ✅ [Projects page](/components/audiovisuel-page.md) clickable hearts, empty →
    filled, via [`FavouritesService`](/components/favourites-service.md).
    **Owner's answers:** `localStorage`, not a cookie; a **private** favourite,
    no count shown.

**Done:** `ng build` clean, 28/28 tests, and `/`, `/projets`, `/photo` plus the
`/audiovisuel` redirect all checked in a browser — including after a
client-side navigation.

# Session 6 — design, accessibility and reach

Every item here is a direction rather than a specification. **Agree a short
brief with the owner before writing markup** — that is the rule for this whole
session, and the open question is recorded next to each item.

**Cross-cutting, done 2026-08-27:** the page is now
[fluid, not 1920px-capped](/decisions/page-is-fluid.md), and **all site buttons**
share one corner radius (`border-radius: 16px`, set once in `src/styles.css` for
`.header-text a`, `.playstore-button`, `.instagram-link`).

22. ✅ **[C]** Redesign the "QUI EST CAMILLE" block — done 2026-08-30 (Session 11)
    to the owner's spec. Two columns at md/lg: the section heading moved *into*
    each column (`about-left` / `about-right`), left-aligned and 2× larger
    (`.about-title` — 48px, `min-height: 2.75em` so both reserve two lines and
    the photo/video tops line up). Left = photo (float) + bio, the theme's
    `border-bottom` rule under the bio removed at ≥768px. Right = video
    (`pb-5`), then a `justify-content-between` row: the `Télécharger mon CV`
    button on the left, the three social icons (moved here from the left
    column, `li` `px-5`→`p-2`, `ul` `mr-0 ml-auto` to beat the theme's
    `ul { margin: 0 auto }`) flush to the video's right edge. Below 768px: one
    stacked column, each heading stays above its own content at the theme's
    24px centred, the bio rule is visible again, the right column sits under
    the left. Verified 1360 / 768 / 375px, no overflow.
    *Earlier attempt on 2026-08-27 was pulled back pending the owner's spec.*
23. ✅ **[C]** Redesign "Expériences" and "FORMATIONS" — done 2026-08-28.
    Owner chose, from [three canvas prototypes](https://claude.ai/code/artifact/687eb5d7-8331-47dc-8b07-1a8ba0a93501),
    the **"rail éditorial"** direction: one shared red vertical axis,
    experiences left / formations right, interleaved by date, with a big
    watermark year in the space opposite each card. The two `@for` sections
    became one `#parcours` section over `TIMELINE` (`cv.ts`); CSS grid, stacks
    to a left rail below 992px. See [accueil-page](/components/accueil-page.md).
    36/36 tests, build clean, geometry verified in-browser.
24. ~~**[C]** Swap the order of "compétences" and "plonger dans mon univers" on
    the home page.~~ **Dropped 2026-08-30** — the owner decided the current
    order is fine and this is no longer wanted.
25. **[C]** "COMPETENCES" logos: smaller, and in black and white.
    *Open: how much smaller, and greyscale at rest with colour on hover, or
    greyscale always?*
26. **[C]** `/photo`: add padding at the `lg` and `md` breakpoints.
    *Open: matching the site's existing section padding, or wider?*
27. **[C]** Redesign the "Mes réseaux :" block on `/contact`.
    *Open: this depends on [unlinked stylesheets](/issues/unlinked-stylesheets.md)
    being fixed first — the icons are invisible today, so the current design has
    never actually been seen.*
28. ~~**[C]** Digital accessibility pass.~~ **Abandoned 2026-08-30** by owner
    decision — the accessibility idea is not being implemented. (Technical
    a11y nits that ride along with other work — `alt` text, iframe titles —
    still get fixed opportunistically; there is just no dedicated pass or
    conformance target.)
29. **[C]** English version of the site.
    *Open: Angular's `@angular/localize` (two builds, two URLs, good for SEO) or
    a runtime language toggle (simpler, one build)? And who writes the English
    copy?* This is much cheaper after Session 4 — translating a data file beats
    translating duplicated markup.

# Session 7 — the 404 page ✅ done 2026-08-30

Off-roadmap but tracked here for continuity. The wildcard route landed
Camille's "perte de signal" 404 design as a real component. See
[NotFoundComponent](/components/not-found-page.md), [site routes](/specs/site-routes.md)
and [the resolved wildcard-route issue](/issues/no-wildcard-route.md).

# Session 8 — owner cleanup pass, in progress 2026-08-30

A batch of owner requests from a fresh review, ordered trivial → demanding.
Bootstrap 5 was on this list and was **deferred to its own session** (the
bootsnav header rewrite is too big to ride along). Accessibility (item 28) is
**abandoned** by owner decision.

32. ✅ **[C]** `/404`: more breathing room above the `<h1>` (`margin-top: 0.8em`).
33. ✅ **[C]** `/contact` restructure — see [ContactComponent](/components/contact-page.md):
    removed the "Camille PROTHIN" title, the "Mes réseaux :" heading and the
    five dead `.hm-foot-icon` links; moved the CV button + the three real social
    links **above** the form; widened the Google Form iframe (440px → fluid,
    `max-width: 680px` — Google caps its own form card near 640px, so a wider
    iframe only adds grey margin); added section top-padding so the heading
    clears the fixed nav. Fixes [contact form overflow](/issues/contact-form-overflow-mobile.md)
    and [placeholder content](/issues/placeholder-content-contact.md). This also
    delivers most of roadmap item 27.
34. ✅ **[C]** Removed `text-transform: capitalize` site-wide — the theme's
    global `h1–h6` rule plus 8 others in `public/css/style.css`. Visible effect:
    the `.header-text a` buttons ("Télécharger mon CV") and the footer copyright
    ("Réalisé par…") now render as authored, and the `#parcours` org-name `<h3>`s
    stop mangling into "d'AudioVisuel" → "D'AudioVisuel". ALL-CAPS section
    headings were already `text-transform: uppercase` (more specific), so they
    are unchanged. Six of the nine rules were dead — theme selectors for markup
    that no longer exists. Two source-copy typos surfaced but were left for the
    owner: `projects.ts` "Réalisation **Par** Louanne Dronne" (fr + en).
35. ✅ **[C]** YouTube links open in an in-site popup player instead of a new
    tab. One `document:click` handler in `AppComponent` +
    [VideoModalComponent](/components/video-modal.md) (`src/app/video/`).
    Covers the `/projets` link buttons, the inline links in project blurbs, and
    anything added later; non-YouTube links and modified clicks pass through.
    54/54 tests, verified in-browser (open via button + inline link, close via
    ✕ / backdrop / Escape, mobile 375px).
36. ✅ **[C]** Extra-large screens. The fixed nav bar now spans the full
    viewport width at every size (`header.component.css` — was capped at 1920px
    and centred). Past **2100px** the whole page is scaled up with stepped
    `body { zoom }` (1.5 → 2.7), keeping the effective layout width ~1400px so
    it reads like a large-laptop view instead of a thin centred column. `zoom`,
    not `transform`, so the fixed nav and the video modal keep working. New
    decision: [XL screens scale up](/decisions/xl-screens-scale-up.md), refining
    [page is fluid](/decisions/page-is-fluid.md). Verified at 1920 / 2100 / 2560
    / 3840 — nav full-bleed, no horizontal scroll, modal still covers the
    viewport.

All five items ✅ done 2026-08-30. Verified: `ng build` clean, **54/54 tests**
(was 39), every page checked in-browser including client-side navigation and at
375 / 1440 / 1920 / 2560 / 3840px. Committed to `develop`, not pushed — the
merge is the owner's.

**Follow-up (same day):** fixed a pre-existing ~15px horizontal scroll on `/` —
the polaroid `.row` had no padded parent to absorb its Bootstrap `-15px` gutter
margins, so it bled past the viewport. Wrapped it in `.container-fluid`. See
[AccueilComponent](/components/accueil-page.md).

Still open after this: Bootstrap 5 (its own session), the Ongoing list below.

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
