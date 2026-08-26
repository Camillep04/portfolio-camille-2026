---
okf_version: "0.2"
---

# The wiki

The agent's working memory for this project, kept as an [Open Knowledge Format
v0.2](references/okf-spec.md) bundle: plain markdown with YAML frontmatter, no
tool required to read it, diffable in git.

Start with the [maintenance protocol](references/wiki-protocol.md) — it says
what belongs where and how concepts are written. Open `viz.html` for the graph.

# The project in five lines

**portfolio-camille-2026** is Camille Prothin's public portfolio, live at
[prothin-camille-portfolio.netlify.app](references/live-site.md): an Angular 18
standalone SPA, four routes, no backend, built and published by Netlify from
`main` on every push. It is maintained by its owner, who codes competently but
not professionally, so **the cost of adding one project or photo is the measure
that matters** for any change here.

Read these three first:

1. [Two-layer frontend](architecture/two-layer-frontend.md) — an Angular shell
   over a vendored jQuery theme. Almost every bug lives on that seam.
2. [main is production](decisions/main-is-production.md) — every push to `main`
   goes live, and only the owner merges.
3. [Content update workflow](specs/content-update-workflow.md) — what a routine
   content edit actually costs today.

Then [the remediation roadmap](plans/remediation-roadmap.md) for what to work on
and in what order.

# Knowledge

* [architecture/](architecture/) - How the system is put together: layers, data flow, runtime shape.
* [components/](components/) - One concept per real module or subsystem, bound to a path.
* [specs/](specs/) - Behaviour contracts: what the thing must do, independent of how.
* [decisions/](decisions/) - Choices made and the reasoning behind them, never rewritten.

# Work

* [plans/](plans/) - Work not yet done: roadmaps, staged plans, todos.
* [issues/](issues/) - Known defects, limitations, and open questions.

# Machinery

* [computations/](computations/) - Sanctioned, runnable procedures whose result can be attested.
* [references/](references/) - External material, run instructions, attesters, and the wiki's own tooling.
* [log.md](log.md) - What changed here, newest first.
