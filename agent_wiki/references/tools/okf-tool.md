---
type: Tool
title: okf.py
description: Validates this bundle against OKF v0.2 and renders it as one offline HTML page.
resource: /references/tools/okf.py
tags: [meta, tooling, okf]
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:32:31Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: okf-reference-agent
    resource: https://github.com/GoogleCloudPlatform/open-knowledge-format/tree/main/src/reference_agent
    title: OKF reference agent (Apache-2.0)
    author: process:google-cloud
---

# What it does

Two subcommands, one file, no project dependencies beyond PyYAML.

```bash
python agent_wiki/references/tools/okf.py validate  --bundle agent_wiki [--strict]
python agent_wiki/references/tools/okf.py visualize --bundle agent_wiki [--out FILE] [--name LABEL]
```

`validate` checks the bundle against OKF v0.2 and exits non-zero if it is not
conformant. `visualize` writes `viz.html` at the bundle root: a force-directed
graph of every concept, a detail panel with rendered markdown, trust and
staleness badges, a type legend, search, a type filter, and backlinks.

# Errors versus warnings

The split is the spec's, not a preference. **Errors** are the §11 conformance
criteria plus the keys the spec marks REQUIRED inside an optional family
(`generated.by`, `verified[].by`, `sources[].resource`, `runtime` on an
Attested Computation). A bundle with any of them is not conformant.

**Warnings** are SHOULD-level guidance: a missing `description`, a directory
with no `index.md`, a link to a concept that does not exist, a timestamp
without a UTC offset, a footnote with no matching source. The spec explicitly
forbids a consumer rejecting a bundle over these (§11), so they never fail a
run unless `--strict` is passed.

# Provenance

Derived from Google's OKF reference agent[^okf-reference-agent] (Apache-2.0);
the license and the full list of changes are in the file header and in
[NOTICE](/references/tools/NOTICE). The substantive departures:

[^okf-reference-agent]: OKF reference agent (Apache-2.0)

| Change | Why |
|--------|-----|
| Resolves bundle-absolute (`/`-prefixed) links. | Upstream skips them, so no edge is drawn for the link form §6.1 calls RECOMMENDED. |
| Ignores links inside code spans and fences. | A link in an example is documentation, not an edge — this wiki documents its own link syntax. |
| Excludes `log.md` from the concept walk. | Upstream skips only `index.md`, so `log.md` surfaces as a bogus `Unknown`-typed concept. |
| Accepts a trailing `Z` in timestamps. | `datetime.fromisoformat` only learned `Z` in Python 3.11; on 3.10 upstream reports every concept as fresh. |
| Node colors hash the `type` string. | OKF has no registered type taxonomy, so a fixed palette can only cover the types its author knew. |
| Cytoscape and marked are inlined from `vendor/`. | Upstream loads them from a CDN, which makes a page that claims to be self-contained fail offline. |
| Adds `validate`. | Upstream ships no conformance checker. |

# Regenerating the viewer

`viz.html` is a build product committed next to the bundle, the same way
upstream commits one next to each sample bundle. It goes stale the moment a
concept is added or relinked, so regenerate it in the same change:

```bash
python agent_wiki/references/tools/okf.py visualize --bundle agent_wiki
```

The output inlines the bundle, the stylesheet, the viewer script, Cytoscape,
and marked — roughly 400 KB of vendored JavaScript — so it opens from a
filesystem with no network at all and nothing on the page phones home.

# Tests

```bash
python -m pytest agent_wiki/references/tools/tests -q
```

The suite lives inside the bundle rather than in the project's `tests/` tree so
that the wiki stays portable: the whole `agent_wiki/` directory can be copied
into another project and still prove itself.
