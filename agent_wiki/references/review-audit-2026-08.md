---
type: Reference
title: Code review, 2026-08-21
description: The full-codebase audit that seeded this wiki's issue list, and how its 29 findings map to concepts here.
tags: [reference, audit]
resource: /review.md
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is

`review.md` at the repo root is a code review of the whole project, dated
**2026-08-21**, branch `develop`. It produced 29 findings graded P0–P4 plus a
suggested four-session work order. It is the starting point for the improvement
work, not a historical curiosity.

# How it landed in this wiki

Every one of the 29 findings is now an [issue concept](/issues/index.md), and
each was **re-checked against the code on 2026-08-26** rather than transcribed.
Each issue records its own verification status in frontmatter:

| `verification` | Meaning |
|---|---|
| `confirmed` | Re-read the file; the finding still holds exactly as described. |
| `changed` | Still a defect, but details in `review.md` have drifted. |
| `unverified` | Depends on running a build, which has not been done. |
| `resolved` | Fixed since the audit; the concept is `deprecated` and kept for the trail. |

# What changed between the audit and this wiki

* **Finding #4 (`develop` not pushed) is resolved.** `git branch -a` now shows
  `remotes/origin/develop`. See [the deprecated concept](/issues/develop-not-pushed.md).
* **Finding #11 has drifted.** The audit says `header.component.html:14` uses
  `href="index.html"`. The nav links now use `href="/"`, `/audiovisuel`,
  `/photo`, `/contact`; only the `navbar-brand` still uses `href="index.html"`.
  The finding stands — they are still plain `href`, not `routerLink` — but the
  specifics moved.

# Caveats the audit records about itself

The reviewer did **not** run `ng build` or `ng test`; items about build
behaviour were read from config rather than observed. Anything depending on
minified output size — chiefly the
[style budget](/issues/component-style-budget-no-headroom.md) — remains
unverified by an actual build.

# The suggested work order

Carried into [the remediation roadmap](/plans/remediation-roadmap.md), which is
the live version. Prefer the roadmap; `review.md` is frozen at its audit date.
