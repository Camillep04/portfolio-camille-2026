# Wiki Update Log

## 2026-08-30

* **Work**: Session 8 — owner cleanup pass ([roadmap](/plans/remediation-roadmap.md)
  items 32–36), ordered trivial → demanding. In progress.
  * **Item 24 dropped**: the "compétences" / "univers" swap is no longer wanted.
  * **Item 32 ✅**: `/404` `<h1>` gets `margin-top: 0.8em`.
  * **Item 33 ✅**: `/contact` restructure — removed the "Camille PROTHIN"
    title, the "Mes réseaux :" heading (`contact.socials` key deleted) and the
    five dead `.hm-foot-icon` links; CV button + three real social links moved
    above the form; form iframe `width="440"` → fluid `max-width: 680px` with a
    `[title]`; `.contact` gets `padding-top: 140px` to clear the fixed nav.
    Verified at 1280 / 375px, no overflow. 42/42 tests (was 39, +3 contact
    specs), build clean.
  * **Item 34 ✅**: removed `text-transform: capitalize` from
    `public/css/style.css` — the global `h1–h6` rule + 8 others (6 dead).
    "Télécharger mon CV", the footer copyright and the `#parcours` org names
    now render as authored. Section headings unchanged (already `uppercase`).
    Two data typos noted for the owner (`projects.ts` "Réalisation Par…").
    42/42 tests, build clean.
  * **Item 35 ✅**: in-site YouTube player. New `src/app/video/` —
    `parseYouTubeId()`, `VideoModalService` (one signal), `VideoModalComponent`
    (nocookie embed, close on ✕/backdrop/Escape, body scroll lock,
    `z-index: 10000` to clear the theme header's 9999). `AppComponent` gains a
    `document:click` handler that opens the player for any YouTube `<a>` and
    leaves everything else alone. New i18n keys `video.player` / `video.close`.
    54/54 tests (+12), build clean, verified in-browser.
  * **New**: [VideoModalComponent + VideoModalService](/components/video-modal.md).
  * **Item 36 ✅**: extra-large screens. `header.component.css` — the fixed nav
    bar is full-bleed at every width (`left: 0; right: 0`, was capped 1920 +
    centred). `src/styles.css` — stepped `body { zoom }` past 2100px (1.5 →
    2.7), effective layout width held ~1400px so XL reads like a large-laptop
    view. `zoom` not `transform` so the fixed nav + video modal survive.
    `html { overflow-x: hidden }` mops up `zoom`'s sub-pixel rounding.
    Verified 1920/2100/2560/3840, burger menu still toggles. Item 28
    (accessibility) marked abandoned per owner.
  * **New**: [XL screens scale up](/decisions/xl-screens-scale-up.md) decision.
  * **Rewritten**: [ContactComponent](/components/contact-page.md);
    [AppComponent](/components/app-root.md) and
    [HeaderComponent](/components/header.md) (both badly stale — described the
    deleted starter CSS, failing spec, and pre-`routerLink` nav);
    [page is fluid](/decisions/page-is-fluid.md) gains a "refined" note;
    [contact form overflow](/issues/contact-form-overflow-mobile.md) → deprecated;
    [placeholder content](/issues/placeholder-content-contact.md) → deprecated;
    [not-found-page](/components/not-found-page.md); roadmap.
* **Work**: Session 7 — the 404 page. Camille built three mocks on branch
  `page_404` (`proto404/proto-{a,b,c}-*.html`); she picked **proto C, "perte de
  signal"**. Ported it to a real component:
  * `src/app/not-found/` — `NotFoundComponent`, standalone, `RouterLink`
    buttons, all copy via new `notFound.*` i18n keys (fr + en). The decorative
    SMPTE timecode ticks 25×/s **outside the Angular zone** and writes straight
    to the element, so it doesn't drive app-wide change detection.
  * `app.routes.ts` — added `{ path: '**', component: NotFoundComponent }`.
  * `not-found.component.spec.ts` — create, three router links, i18n toggle.
* **Verification**: 39/39 tests (was 36), `ng build` clean, checked in-browser
  at 1305 / 375 px in both languages — no console errors, no horizontal
  overflow, real routes unaffected. (The wiki's old "two tests fail on a clean
  checkout" note in [branch-workflow](/specs/branch-workflow.md) is stale —
  all green.)
* **New**: [NotFoundComponent](/components/not-found-page.md).
* **Rewritten**: [no wildcard route](/issues/no-wildcard-route.md) → resolved;
  [site routes](/specs/site-routes.md) contract + soft-404 note;
  [angular shell](/architecture/angular-shell.md) routes table; the
  `components/` and `issues/` indexes.
* **Merged earlier**: branch `page_404` (the three raw protos) fast-forwarded
  into `develop`.

## 2026-08-28

* **Work**: Session 6, item 23 — the "Expériences" / "Formations" redesign.
  Owner picked a direction from three canvas prototypes
  ([design canvas](https://claude.ai/code/artifact/687eb5d7-8331-47dc-8b07-1a8ba0a93501),
  working files under `design/timeline/`): **"rail éditorial"** — one shared
  red vertical axis, experiences left / formations right, big watermark
  millésime in the negative space opposite each card.
  * `data/cv.ts` — new `TIMELINE`: `EXPERIENCES` + `EDUCATION` merged into one
    strand, most recent first, experiences ahead of formations that end the
    same year. Each item carries `kind` and `year` (the watermark).
  * `accueil.component` — the two `#experiences` / `#formations` sections
    collapse into one `#parcours` section, a single `@for` over `TIMELINE`.
    CSS-grid rows (`1fr rail 1fr`), rail drawn as `.xp-timeline::before`,
    per-item dot as `.tl-item::after`. Stacks to a left rail below 992px;
    the watermark year hides on mobile, the `.tl-period` line in the card
    carries it instead.
  * `accueil.component.spec` — the timeline test now counts
    `#parcours .tl-item.is-experience/.is-formation`, plus a new test that
    the strand is ordered most-recent-first.
* **Verification**: 36/36 tests, `ng build` clean. Layout checked in-browser
  by computed geometry at 1305 / 900 / 391 px — cards symmetric 40px off the
  rail, single grid row per item, no card overlaps, no horizontal overflow
  from the section (the pre-existing ~15px page overflow from the compétences
  marquee is untouched and out of scope). No screenshot — the Browser pane
  was not displayable this session.
* **Rewritten**: [accueil-page](/components/accueil-page.md) section map and
  "adding an experience"; [content data layer](/architecture/content-data-layer.md)
  cv.ts row. [Roadmap](/plans/remediation-roadmap.md) item 23 marked done.
* **New working files**: `design/timeline/` (Design Components canvas source),
  and a `portfolio-preview` entry in `.claude/launch.json` (port 4288, so the
  Browser tools have their own dev server when another session holds 4200).

## 2026-08-27

* **Work**: Session 6 — two cross-cutting design changes only. Committed to
  `develop`.
  * The page is now **fluid**, reversing the session-2 cap. New decision
    [the page is fluid](/decisions/page-is-fluid.md);
    [the 1920px cap](/decisions/page-capped-at-1920-centred.md) is deprecated.
    `body { max-width: none !important }` in `src/styles.css`; sections will own
    their readable max-width as they are redesigned.
  * Every site button shares one corner radius, `border-radius: 16px`
    (`.header-text a`, `.playstore-button`, `.instagram-link`), set once in
    `src/styles.css`.
  * **Verification**: 28/28 tests, `ng build` clean, no console errors, no
    horizontal overflow at 2560px, button radii confirmed in-browser on `/`,
    `/projets`, `/photo`. No screenshot — the preview pane was not displayed.
* **Item 22** ("QUI EST CAMILLE" block) was built and then pulled back at the
  owner's request — the design needs refining first. Deferred, still open in the
  roadmap.
* **Open for the rest of session 6**: items 22–29 still need briefs (see the
  roadmap's open questions).

## 2026-08-27

* **Work**: Session 5 — the owner's features. Eight requests, four commits on
  `develop`, one per page/area, each verified in a browser:
  * `footer.ts` — copyright year is `new Date().getFullYear()`.
  * `app.routes.ts` — `/audiovisuel` renamed to `/projets`, old path kept as a
    `redirectTo`. Component dir/selector unchanged. See
    [site routes](/specs/site-routes.md).
  * `audiovisuel.*` — link-button hover wipes a white fill in from the left and
    inverts the text to black (grey hover dropped); the heart is now clickable,
    empty → filled red, backed by the new
    [`FavouritesService`](/components/favourites-service.md). **Owner's answers
    to the open question:** `localStorage` (no cookie, no banner), and a
    **private** favourite with no count.
  * `photo.*` — the 35 Bootstrap 3/4 modals became one Angular-driven lightbox:
    vertical centring, optional `description`, `‹`/`›` + arrow-key carousel over
    `PHOTOS` order with wraparound, Escape/backdrop close, body scroll lock.
    Instagram CTA added at the foot of the gallery.
* **New concept**: [FavouritesService](/components/favourites-service.md).
* **Rewritten**: [photo-page](/components/photo-page.md) (lightbox replaces the
  modal section), [audiovisuel-page](/components/audiovisuel-page.md) (route
  name, interactions), [footer](/components/footer.md), and
  [site routes](/specs/site-routes.md). The two Bootstrap-modal issues
  ([version conflict](/issues/bootstrap-version-conflict.md),
  [modal behind navbar](/issues/photo-modal-opens-behind-navbar.md)) are moot
  for `/photo` now — noted in the component, not yet reflected in the issues.
* **Verification**: `ng build` clean, 28/28 tests (was 19), `/`, `/projets`,
  `/photo` and the `/audiovisuel` redirect all checked in a browser including
  after client-side navigation. `viz.html` regenerated.

## 2026-08-27

* **Work**: Session 4 — the content refactor. Every repeated dataset is now
  typed data under `src/app/data/`, rendered with `@for`. New concept:
  [content data layer](/architecture/content-data-layer.md). Landed in three
  commits, one dataset each, each verified in a browser:
  * `photos.ts` — `photo.component.html` 958 → ~70 lines. CSS-columns masonry
    replaces the hand-packed grid; per-photo modal ids; `alt` is the title.
  * `projects.ts` — `audiovisuel.component.html` 427 → ~55 lines. Each project
    carries its own hero `background` (was a positional `nth-child` rule, the
    reason reordering scrambled the page); image/info side alternates via CSS
    `order`. The ten `nth-child` rules unified to `background-size: cover` —
    the one intentional visual change.
  * `cv.ts` — the two home-page timelines, ~185 lines → two loops. The
    duplicate `id="education"` became `id="experiences"` / `id="formations"`.
* **Resolved**: [content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
  (the P3 root cause) and [duplicate DOM ids](/issues/duplicate-dom-ids.md)
  (`uniq -d` on template ids now returns nothing).
  [The content update workflow](/specs/content-update-workflow.md) target is
  reached. Partial progress on
  [spec files are stubs](/issues/spec-files-are-stubs.md) (three content pages
  got real assertions, 19/19) and
  [missing alt text](/issues/missing-alt-text.md) (gallery + posters).
* **Verification**: `ng build` clean, 19/19 tests, `/`, `/photo`,
  `/audiovisuel` all checked in a browser at desktop and 375px — counts,
  labels, links, backgrounds, alternation, no horizontal overflow, no console
  errors, and content surviving client-side navigation. Committed to `develop`,
  not pushed.
* Component concepts [photo-page](/components/photo-page.md),
  [audiovisuel-page](/components/audiovisuel-page.md) and
  [accueil-page](/components/accueil-page.md) rewritten to the post-refactor
  state (they had also drifted since sessions 2–3).

## 2026-08-27

* **Work**: Session 3 of [the roadmap](/plans/remediation-roadmap.md) — weight.
  Four issues closed outright:
  [stale docs/](/issues/stale-docs-build-output.md) (38 MB, confirmed GitHub
  Pages isn't configured to serve it, before deleting),
  [vendored magnific-popup](/issues/vendored-magnific-popup-repo.md),
  [the broken Dockerfile](/issues/broken-dockerfile.md), and
  [the Angular starter CSS](/issues/angular-starter-boilerplate-css.md) — the
  last one needed `font-family`/`box-sizing` moved into `styles.css` first,
  since Angular's style encapsulation meant only those two `:host` rules
  actually reached `app-root`; the rest of the 200 lines, including the
  leftover `.mfp-fade` rules, were already dead.
* [Oversized images](/issues/oversized-images.md) partially resolved: the
  favicon was a 3712x3712 JPEG mislabeled `.ico` (2.1 MB -> 15 kB fixed),
  `loading="lazy"` added to all 70 gallery images, and `public/img`
  recompressed 34 MB -> 28 MB. The owner chose visually-lossless (quality 92)
  over true-lossless for JPEGs, since true-lossless only optimizes Huffman
  tables and barely moves files like `clip_mmi.jpg`. The large photographic
  PNGs (`wg.png`, `mf.png`, `mr.png`) barely shrank either way — lossless
  recompression can't do much for a photo already in a lossless format.
  WebP conversion is the remaining, bigger win and is still open.
* **Verification**: `ng build` succeeds, 11/11 tests green, and `/`, `/photo`,
  `/audiovisuel` all loaded clean in a browser (dev server) with zero console
  errors and every image request returning 200 — including the lazy-loaded
  gallery.
* Committed to `develop` as `Session 3: shed the weight`, not yet pushed.

## 2026-08-26

* **Decision**: the page
  [stays capped at 1920px and centred](/decisions/page-capped-at-1920-centred.md).
  This closes the one question session 2 left open, and it constrains session 6:
  the redesigns are drawn for a 1920px canvas.
* **Session ended here.** Sessions 1 and 2 are complete and committed on
  `develop` (three commits, not yet pushed — the owner will push). The next
  session starts at **session 3** of
  [the roadmap](/plans/remediation-roadmap.md).

## 2026-08-26

* **Work**: Session 2 — the live bugs are fixed and **verified in a browser**
  at 2560px, 1366px and 375px, not just built. Three of the audit's guesses
  turned out to be wrong in instructive ways:
  * Font Awesome could never have worked. The audit said the stylesheet was
    unlinked; `public/fonts/` does not exist either, so the webfont was missing
    too. The icons are bootstrap-icons now.
  * The owner's *"popup opens under the nav bar"* had nothing to do with
    magnific-popup. `/photo` uses Bootstrap **4 markup** driven by Bootstrap
    **3's JS**: BS3 marks an open modal `in`, BS4 clears its entry transform on
    `show`, so the dialog kept `translate(0, -25%)` and opened at y = -206.
    New concept:
    [photo modal opens behind the navbar](/issues/photo-modal-opens-behind-navbar.md).
  * The owner's *"responsive cassé sur les grands écrans"* was not
    `responsive.css` — that file only has `max-width` rules. Bootstrap 4's
    reboot, loaded from the CDN after the theme, resets `body { margin: 0 }` and
    killed the theme's `margin: 0 auto`. Above 1920px the page sat pinned to the
    left with a 625px blank strip. New concept:
    [page pinned left above 1920px](/issues/page-pinned-left-above-1920.md).
* **Decision**: [cheap CSS fix before Bootstrap 5](/decisions/css-cheap-fix-before-bootstrap-5.md),
  taken by the owner. The migration becomes its own session before the redesigns.
* **Evidence that session 1 was worth doing first**: converting links to
  `routerLink` turned two component specs red (no `ActivatedRoute`). The net
  caught it the same minute it was introduced. 11 tests green now.

## 2026-08-26

* **Work**: Session 1 of [the roadmap](/plans/remediation-roadmap.md) is done —
  the safety net exists. Spec fixed, `test:ci` added, the Deno workflow replaced
  by a real build-and-test check, and the style budget given a band. Three P0
  issues moved to `resolved`. The budget one is worth recording: the real
  minified size of `audiovisuel.component.css` is **5.93 kB** against a 6 kB
  hard error, so the margin was ~70 bytes, not the comfortable gap the audit
  assumed.
* **Creation**: [Owner review, 2026-08-26](/references/camille-review-2026-08.md),
  Camille’s own 25 requests, and a rewritten roadmap that interleaves them with
  the audit findings. Two new sessions: **5** for the specified features and
  **6** for design, accessibility and the English version — every item in 6
  carries the open question that must be answered before it can be built.

## 2026-08-26

* **Review**: alexp read the bundle and approved it. Recorded as
  `verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }` on all 55 concepts,
  which raises every one of them to the **human-reviewed** trust tier (OKF
  §5.3). This is the baseline the improvement work starts from.

* **Fix**: [okf.py](/references/tools/okf-tool.md) embedded the bundle as JSON
  inside a `<script>` element with a plain `json.dumps`. JSON does not escape
  `/`, so the literal closing script tags quoted in
  [index.html](/components/index-html.md) and two issue concepts terminated the
  element early, leaving `window.BUNDLE` unassigned and `viz.html` blank. Added
  `_embed_json` (escapes `</` and U+2028/9), a regression test, and ported both
  back into the skill's bundle template.
* **Verification**: Checked the [live site](/references/live-site.md) in a
  browser. Every P1 prediction holds in production. Two corrections: the
  magnific-popup script returns **200 with HTML**, not a 404 (Netlify's SPA
  catch-all means nothing 404s), and the jQuery clash detaches **every** plugin
  — sticky, Owl and magnific — not just the lightbox.
* **Creation**: [The live site](/references/live-site.md), recording the URL and
  the console evidence. Eight issues promoted to
  `verification: confirmed-in-production`.

* **Survey**: Read the codebase — `angular.json`, `netlify.toml`,
  `.github/workflows/`, all six components, `src/index.html`, `public/js` and
  `public/css` — and recorded the shape in
  [two-layer frontend](/architecture/two-layer-frontend.md),
  [angular shell](/architecture/angular-shell.md) and
  [build and deploy](/architecture/build-and-deploy.md).
* **Creation**: Nine [component concepts](/components/index.md) covering the
  app shell, the four pages, `index.html` and `public/`.
* **Creation**: Three [specs](/specs/index.md) —
  [content update workflow](/specs/content-update-workflow.md) (the measure this
  project is judged by), [branch workflow](/specs/branch-workflow.md) and
  [site routes](/specs/site-routes.md).
* **Creation**: Two [decisions](/decisions/index.md) confirmed with the owner —
  [main is production](/decisions/main-is-production.md) and
  [Netlify is the deploy target](/decisions/netlify-as-deploy-target.md).
* **Creation**: All 29 findings from `review.md` as
  [issue concepts](/issues/index.md), each **re-verified against the code**
  rather than transcribed. One ([develop not pushed](/issues/develop-not-pushed.md))
  was already resolved and is deprecated; one
  ([no routerLink](/issues/no-routerlink-full-page-reloads.md)) had drifted and
  is marked `changed`; one
  ([style budget](/issues/component-style-budget-no-headroom.md)) needs a real
  build to confirm and is marked `unverified`.
* **Creation**: [Remediation roadmap](/plans/remediation-roadmap.md), the live
  version of the audit's four-session work order.
* **Creation**: References for
  [the audit](/references/review-audit-2026-08.md) and
  [the Khanas theme](/references/khanas-template.md) that `public/` came from.

* **Initialization**: Created the bundle as an Open Knowledge Format v0.2 tree —
  `architecture/`, `components/`, `specs/`, `decisions/`, `plans/`, `issues/`,
  `computations/`, `references/` — each with an `index.md`, plus this log.
* **Creation**: Wrote the [maintenance protocol](/references/wiki-protocol.md),
  which defines roles, where concepts go, naming, linking, and lifecycle.
* **Creation**: Wrote [the OKF reference](/references/okf-spec.md) recording
  which parts of the spec this wiki leans on, and noting that the canonical
  spec has moved to its own repository.
* **Creation**: Added [okf.py](/references/tools/okf-tool.md), the validator and
  offline visualizer, adapted from Google's Apache-2.0 reference agent.
* **Creation**: Added the [wiki conformance
  computation](/computations/wiki-conformance.md) with its
  [executor](/references/skills/run-command.md) and
  [attester](/references/attesters/index.md), so "the wiki is valid" is a
  checkable claim rather than an assertion.
