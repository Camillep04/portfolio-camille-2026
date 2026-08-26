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

* [Stale AppComponent spec](stale-app-component-spec.md) - Two tests fail on a clean checkout, so the regression net is ignored.
* [Deno Deploy workflow broken](deno-deploy-workflow-broken.md) - Fails on every push to `main`, training everyone to ignore red checks.
* [Style budget has no headroom](component-style-budget-no-headroom.md) - Warning equals error at 6 kB, on the file that grows with every project.
* [develop not pushed](develop-not-pushed.md) - **Resolved** since the audit; kept for the trail.

# P1 — bugs live on the site now

* [Duplicate jQuery load order](duplicate-jquery-load-order.md) - jQuery 1.9.1 loads last and wipes every plugin.
* [magnific-popup script 404s](magnific-popup-script-404.md) - Wrong path, and `src/assets` never ships anyway.
* [Unlinked stylesheets](unlinked-stylesheets.md) - Font Awesome invisible, and **no mobile breakpoints at all**.
* [Bootstrap version conflict](bootstrap-version-conflict.md) - Four versions fighting; utility classes silently ignored.
* [Dead inline script in audiovisuel](dead-inline-script-audiovisuel.md) - Angular strips it; five close buttons throw.
* [Duplicate DOM ids](duplicate-dom-ids.md) - 35 identical modal ids and an `aria-labelledby` pointing at nothing.
* [No routerLink](no-routerlink-full-page-reloads.md) - Every internal click re-bootstraps the whole app.

# P2 — performance

* [Oversized images](oversized-images.md) - 34 MB of images, a 2.1 MB favicon, 70 eager `<img>` tags.
* [Stale docs/ build output](stale-docs-build-output.md) - 38 MB, 128 tracked files, nothing serves it.
* [Render-blocking scripts](render-blocking-scripts.md) - Ten synchronous tags including a 2014 Modernizr nothing queries.

# P3 — maintainability

* [Content hardcoded in templates](content-hardcoded-in-templates.md) - **The root cause of most of the list above.**
* [Empty component classes](empty-component-classes.md) - All behaviour is global jQuery binding before Angular renders.
* [Angular starter boilerplate CSS](angular-starter-boilerplate-css.md) - 200 unused lines that still leak two real rules.
* [Vendored magnific-popup repo](vendored-magnific-popup-repo.md) - 1.2 MB of upstream repo that never ships.
* [No linter or formatter](no-linter-or-formatter.md) - Nothing mechanical catches the defects that accumulated.
* [Broken Dockerfile](broken-dockerfile.md) - Every comment lost its `#`; unused regardless.
* [Spec files are stubs](spec-files-are-stubs.md) - Six identical `should create` tests asserting nothing.

# P4 — SEO, accessibility, content

* [html lang mismatch](html-lang-mismatch.md) - `lang="en"` on an entirely French site.
* [Missing SEO metadata](missing-seo-metadata.md) - No description, no Open Graph, no per-route title.
* [Missing alt text](missing-alt-text.md) - On a photography portfolio.
* [Contact form overflows on mobile](contact-form-overflow-mobile.md) - The only contact channel, cut off on a phone.
* [Placeholder content on contact](placeholder-content-contact.md) - Five dead theme links and an English heading.
* [No wildcard route](no-wildcard-route.md) - A typo'd URL renders a blank middle, not a 404.
* [Dead commented markup](dead-commented-markup.md) - Blocks git already remembers.
* [Netlify config nits](netlify-config-nits.md) - Portability, duplicated redirects, and a test asset mapping that breaks rendering tests.

# Working order

Not this list — see [the remediation roadmap](/plans/remediation-roadmap.md),
which sequences these so each stage is verifiable before the next.
