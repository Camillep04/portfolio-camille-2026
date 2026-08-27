# Issues

Known defects, limitations, and open questions — the things a newcomer would
otherwise rediscover the hard way. An issue concept records what is wrong, how
to reproduce or recognise it, and what is known about the cause.

Use `type: Issue`. Fixed issues become `status: deprecated` with a line saying
what fixed them; that record is why the next person does not reintroduce it.

All 29 findings from the [2026-08-21 audit](/references/review-audit-2026-08.md),
each **re-verified against the code on 2026-08-26**. Frontmatter carries
`priority` (P0–P4) and `verification` — `confirmed` (re-read in the code),
`confirmed-in-production` (also observed in a browser against
[the live site](/references/live-site.md)), `changed`, `unverified`, or
`resolved`.

# P0 — blocks or silently breaks the workflow

* [Stale AppComponent spec](stale-app-component-spec.md) - **Resolved** in session 1; the suite is green.
* [Deno Deploy workflow broken](deno-deploy-workflow-broken.md) - **Resolved** in session 1; replaced by a build-and-test check.
* [Style budget has no headroom](component-style-budget-no-headroom.md) - **Resolved** in session 1; it had ~70 bytes of headroom left.
* [develop not pushed](develop-not-pushed.md) - **Resolved** since the audit; kept for the trail.

# P1 — bugs live on the site now

* [Photo popup opens behind the navbar](photo-modal-opens-behind-navbar.md) - **Resolved** in session 2; BS3 `in` vs BS4 `show`.
* [Page pinned left above 1920px](page-pinned-left-above-1920.md) - **Resolved** in session 2; BS4's reboot killed the theme's centring.
* [Duplicate jQuery load order](duplicate-jquery-load-order.md) - **Resolved** in session 2; 2.2.4 keeps its plugins.
* [magnific-popup script 404s](magnific-popup-script-404.md) - **Resolved** in session 2; the tag and `popup.js` are deleted.
* [Unlinked stylesheets](unlinked-stylesheets.md) - **Resolved** in session 2; icons are bootstrap-icons now.
* [Bootstrap version conflict](bootstrap-version-conflict.md) - Four versions fighting; utility classes silently ignored.
* [Dead inline script in audiovisuel](dead-inline-script-audiovisuel.md) - **Resolved** in session 2; the five dead popups went with it.
* [Duplicate DOM ids](duplicate-dom-ids.md) - **Resolved** across sessions 2 and 4; `uniq -d` on template ids returns nothing.
* [No routerLink](no-routerlink-full-page-reloads.md) - **Resolved** in session 2; the typewriter and burger menu moved into Angular.

# P2 — performance

* [Oversized images](oversized-images.md) - 34 MB of images, a 2.1 MB favicon, 70 eager `<img>` tags.
* [Stale docs/ build output](stale-docs-build-output.md) - 38 MB, 128 tracked files, nothing serves it.
* [Render-blocking scripts](render-blocking-scripts.md) - Ten synchronous tags including a 2014 Modernizr nothing queries.

# P3 — maintainability

* [Content hardcoded in templates](content-hardcoded-in-templates.md) - **Resolved** in session 4; content is typed data under `src/app/data/`. Was the root cause of most of the list above.
* [Empty component classes](empty-component-classes.md) - All behaviour is global jQuery binding before Angular renders.
* [Angular starter boilerplate CSS](angular-starter-boilerplate-css.md) - 200 unused lines that still leak two real rules.
* [Vendored magnific-popup repo](vendored-magnific-popup-repo.md) - 1.2 MB of upstream repo that never ships.
* [No linter or formatter](no-linter-or-formatter.md) - Nothing mechanical catches the defects that accumulated.
* [Broken Dockerfile](broken-dockerfile.md) - Every comment lost its `#`; unused regardless.
* [Spec files are stubs](spec-files-are-stubs.md) - **Partly resolved** in session 4; the three content pages have real assertions (19/19). `contact` / `header` / `footer` still stubs.

# P4 — SEO, accessibility, content

* [html lang mismatch](html-lang-mismatch.md) - `lang="en"` on an entirely French site.
* [Missing SEO metadata](missing-seo-metadata.md) - No description, no Open Graph, no per-route title.
* [Missing alt text](missing-alt-text.md) - Gallery photos and project posters fixed in session 4; header/footer/bio images still open.
* [Contact form overflows on mobile](contact-form-overflow-mobile.md) - The only contact channel, cut off on a phone.
* [Placeholder content on contact](placeholder-content-contact.md) - Five dead theme links and an English heading.
* [No wildcard route](no-wildcard-route.md) - A typo'd URL renders a blank middle, not a 404.
* [Dead commented markup](dead-commented-markup.md) - Blocks git already remembers.
* [Netlify config nits](netlify-config-nits.md) - Portability, duplicated redirects, and a test asset mapping that breaks rendering tests.

# Working order

Not this list — see [the remediation roadmap](/plans/remediation-roadmap.md),
which sequences these so each stage is verifiable before the next.
