# Specs

Behaviour contracts: what the system must do, stated so that an implementation
can be checked against it. Deliberately independent of how — a spec that
changes every time the code is refactored is a component concept in disguise.

Use `type: Spec`. Where a spec has a runnable check, link it to a concept in
[computations/](../computations/).

# Concepts

* [Content update workflow](content-update-workflow.md) - What it costs to add a project, photo or experience today, and the target to judge refactors against.
* [Branch and release workflow](branch-workflow.md) - How a change reaches the live site, and where an agent must stop.
* [Site routes contract](site-routes.md) - The four public URLs and what each must render.
