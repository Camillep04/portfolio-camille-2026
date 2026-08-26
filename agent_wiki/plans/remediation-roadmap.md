---
type: Plan
title: Remediation roadmap
description: The staged order for working through the 29 audit findings, safety net first, refactor last.
tags: [plan, roadmap]
status: draft
stale_after: 2027-06-30T00:00:00Z
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

# The ordering principle

Because [main is production](/decisions/main-is-production.md) and there is no
CI, the first work must be **building the safety net**, not fixing the most
visible bugs. Every session after that is verified by the net built in
session 1.

Within each session, changes should be small enough that the owner can verify
them page by page before merging.

# Session 1 — make the safety net real

The prerequisite for everything else.

1. Fix [the stale app component spec](/issues/stale-app-component-spec.md) so
   `npm test` can pass on a clean checkout.
2. Add a `test:ci` script (`ng test --watch=false --browsers=ChromeHeadless`)
   so tests can run unattended.
3. Delete the Deno workflow and replace it with a real PR check —
   `npm ci && npm run build && npm run test:ci`. See
   [the issue](/issues/deno-deploy-workflow-broken.md).
4. Give [the style budget a warning band](/issues/component-style-budget-no-headroom.md),
   after running a real build to see the actual number.

**Done when:** a pull request into `main` runs a green check that would have
gone red for a broken build or a failing test.

# Session 2 — kill the live bugs

Everything here is currently broken for real visitors.

5. Delete the trailing [jQuery 1.9.1 tag](/issues/duplicate-jquery-load-order.md).
6. Fix or remove [the magnific-popup script](/issues/magnific-popup-script-404.md).
7. [Link the missing stylesheets](/issues/unlinked-stylesheets.md) — the cheap
   fix — or commit to
   [the Bootstrap 5 migration](/issues/bootstrap-version-conflict.md), the
   expensive one. **Decide this explicitly before starting**; they are different
   sizes of job and the second one requires replacing bootsnav.
8. Delete [the dead inline script](/issues/dead-inline-script-audiovisuel.md)
   and the five `onclick="closePopup()"` attributes.
9. Convert internal links to
   [routerLink](/issues/no-routerlink-full-page-reloads.md) — but note this
   *increases* exposure to the
   [jQuery-binds-too-early problem](/issues/empty-component-classes.md), since
   more navigation becomes client-side. Verify each page after a client-side
   navigation, not just a reload.

# Session 3 — weight

10. Regenerate the 2.1 MB favicon, compress `public/img`, add `loading="lazy"`.
    See [oversized images](/issues/oversized-images.md).
11. Delete dead weight: [docs/](/issues/stale-docs-build-output.md),
    [src/assets/magnific-popup](/issues/vendored-magnific-popup-repo.md),
    [the Dockerfile](/issues/broken-dockerfile.md),
    [app.component.css](/issues/angular-starter-boilerplate-css.md).

# Session 4 — the refactor that pays for itself

12. Extract `PROJECTS`, `PHOTOS`, `EXPERIENCES`, `EDUCATION` to typed data and
    render with `@for`. See
    [content hardcoded in templates](/issues/content-hardcoded-in-templates.md)
    and the target described in
    [the content update workflow](/specs/content-update-workflow.md).

Stage it one dataset at a time — `PHOTOS` first, since that file is the largest
and the most mechanical — so each stage is independently verifiable.

**Done when:** adding a project is a nine-line object in one `.ts` file, and a
test asserts the rendered count matches the data.

# Ongoing

13. [Linter and formatter](/issues/no-linter-or-formatter.md).
14. SEO and accessibility pass:
    [html lang](/issues/html-lang-mismatch.md),
    [SEO metadata](/issues/missing-seo-metadata.md),
    [alt text](/issues/missing-alt-text.md),
    [contact form overflow](/issues/contact-form-overflow-mobile.md),
    [placeholder content](/issues/placeholder-content-contact.md),
    [wildcard route](/issues/no-wildcard-route.md),
    [dead commented markup](/issues/dead-commented-markup.md),
    [Netlify config nits](/issues/netlify-config-nits.md).

# Related

* [All issues](/issues/index.md)
* [Branch workflow](/specs/branch-workflow.md)
