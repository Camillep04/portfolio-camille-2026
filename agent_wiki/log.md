# Wiki Update Log

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
