---
type: Issue
title: develop existed only locally
description: Resolved. The audit found develop unpushed; it is now on origin, so the working branch is backed up.
tags: [git, resolved]
status: deprecated
priority: P0
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved since the audit.** No action needed.

# What the audit found

On 2026-08-21, `git ls-remote origin` showed only `refs/heads/main`. The working
branch `develop` existed only on the owner's machine and was not backed up.

# Current state

`git branch -a` on 2026-08-26 shows:

```
* develop
  main
  remotes/origin/HEAD -> origin/main
  remotes/origin/develop
  remotes/origin/main
```

`origin/develop` exists. The finding no longer applies.

Kept as a deprecated concept so links from
[the audit reference](/references/review-audit-2026-08.md) still resolve and the
trail is intact.

# Related

* [Branch workflow](/specs/branch-workflow.md)
