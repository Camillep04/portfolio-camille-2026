---
type: Decision
title: main is production, and only the owner merges to it
description: Every push to main goes live immediately, so main is protected by a human gate rather than by CI.
tags: [workflow, process, deploy]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# Context

Netlify rebuilds and republishes the live portfolio on **every push to `main`**.
There is no staging environment, no approval step, and no CI that could block a
bad merge — see [build and deploy](/architecture/build-and-deploy.md). The site
is a working professional's public portfolio; a broken deploy is visible to
anyone who follows a link from LinkedIn or Instagram.

# Decision

**`main` is the production branch. The repository owner is the only person who
merges into it.**

Agents and collaborators work on `develop` (or a branch off it) and stop at the
point of merge. Merging happens only after everything is verified to work with
no regression.

# Consequences

* Every change must be verifiable **locally** before it is proposed, because
  local verification is the only gate that exists today.
* An agent must never push to `main`, merge into `main`, or open-and-merge a PR
  into `main`, regardless of how safe a change looks.
* Adding real CI on pull requests into `main` does not replace this rule — it
  strengthens it, by giving the human gate something mechanical to lean on.
  That is the highest-value item in
  [the remediation roadmap](/plans/remediation-roadmap.md).
* Regression risk is the dominant constraint on how work is sequenced. Large
  refactors are staged so each stage is independently verifiable, rather than
  landed as one merge.

# Options considered

| Option | Why not |
|---|---|
| Trunk-based, push straight to `main` | Every mistake is live instantly, with no undo short of a revert-and-rebuild. |
| Branch protection with required CI | Desirable, but there is no working CI yet — the only workflow targets the wrong platform. Revisit once a real check exists. |
| Netlify deploy previews as the gate | Worth adding later, but previews do not catch what the site's real problems are (load-order bugs, missing regression tests). |

# Related

* [Branch workflow](/specs/branch-workflow.md)
* [Netlify as the deploy target](/decisions/netlify-as-deploy-target.md)
