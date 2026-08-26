# Decisions

Choices that were made and the reasoning that produced them, ADR-style: the
context, the options considered, what was chosen, and what it costs. This is
the directory that pays for the whole wiki — code shows what was decided, never
why, and the why is what gets re-litigated six months later.

Use `type: Decision`. A decision is **never rewritten**: when it stops holding,
mark it `status: deprecated` and have the replacement link back to it.

# Concepts

* [main is production](main-is-production.md) - Every push to `main` goes live, so only the owner merges there.
* [Netlify is the deploy target](netlify-as-deploy-target.md) - Confirmed by the owner; the Deno workflow, Dockerfile and `docs/` are dead.
