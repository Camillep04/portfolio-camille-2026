#!/usr/bin/env python3
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# ---------------------------------------------------------------------------
# MODIFICATIONS
#
# This file is derived from the Open Knowledge Format reference agent
# (github.com/GoogleCloudPlatform/open-knowledge-format), specifically
# src/reference_agent/bundle/document.py and src/reference_agent/viewer/
# generator.py. Changes from upstream:
#
#   * Collapsed the package into a single dependency-light module so a bundle
#     can carry its own tooling and stay portable.
#   * Added `validate`, a conformance checker for OKF v0.2 §11 that upstream
#     does not ship.
#   * Link extraction now resolves bundle-absolute (`/`-prefixed) links.
#     Upstream skips them, so no edge is drawn for the link form the spec
#     calls RECOMMENDED (§6.1).
#   * `log.md` is excluded from the concept walk. Upstream skips only
#     `index.md`, so `log.md` surfaces as a bogus `Unknown`-typed concept.
#   * `is_stale` accepts a trailing `Z`. `datetime.fromisoformat` only learned
#     to parse it in Python 3.11, so on 3.10 upstream silently reports every
#     concept as fresh.
#   * Node colors are derived from a stable hash of the `type` string rather
#     than a fixed BigQuery-flavored palette, so a domain-specific taxonomy
#     gets distinct, stable colors for free.
#   * The viewer's JavaScript dependencies are inlined from `vendor/` instead
#     of loaded from a CDN, so the output opens with no network access.
#   * Regenerating over an existing viz.html reuses its embedded bundle name
#     when --name is not given, so a header chosen at install time survives
#     later regenerations.
# ---------------------------------------------------------------------------
"""Tooling for an Open Knowledge Format v0.2 bundle: validate and visualize.

    python okf.py validate  --bundle <dir> [--strict]
    python okf.py visualize --bundle <dir> [--out <file>] [--name <label>]

The spec this implements is at https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
Section references in this file (§4, §5, …) point into it.
"""

from __future__ import annotations

import argparse
import colorsys
import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

try:
    import yaml
except ModuleNotFoundError:  # pragma: no cover - environment guard
    sys.exit(
        "okf.py needs PyYAML to read frontmatter.\n"
        "Install it with:  python -m pip install PyYAML"
    )

OKF_VERSION = "0.2"

# §3.1 Reserved filenames. Never concept documents.
INDEX_NAME = "index.md"
LOG_NAME = "log.md"
RESERVED_NAMES = (INDEX_NAME, LOG_NAME)

# §11 conformance: `type` is the only always-required frontmatter key.
REQUIRED_FRONTMATTER_KEYS = ("type",)

_FRONTMATTER_DELIM = "---"

# A markdown link whose target is a .md file, with an optional #anchor.
_LINK_RE = re.compile(r"\]\(([^)\s]+\.md)(?:#[A-Za-z0-9_\-]*)?\)")
# Fenced code blocks and inline code spans, stripped before link extraction.
_FENCE_BLOCK_RE = re.compile(r"^(```+|~~~+)[^\n]*\n.*?^\1[^\n]*$",
                             re.DOTALL | re.MULTILINE)
_INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
# A footnote reference in the body, e.g. `[^ga4-schema]` (§5.1).
_FOOTNOTE_REF_RE = re.compile(r"\[\^([^\]]+)\]")
# A log.md date heading (§9).
_LOG_DATE_RE = re.compile(r"^##\s+(\S+)\s*$", re.MULTILINE)
_ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
# §7 actor convention: `<producer>/<version>`, `human:<id>`, `process:<id>`.
_ACTOR_RE = re.compile(r"^(human:.+|process:.+|[^/\s]+/[^/\s]+)$")


class OKFDocumentError(ValueError):
    """Raised when a document's frontmatter cannot be parsed."""


class _Loader(yaml.SafeLoader):
    """SafeLoader that leaves timestamps as the text the author wrote.

    PyYAML implements YAML 1.1, whose implicit resolvers turn a value like
    `2026-06-30T14:00:00Z` into a `datetime`. Dumping it back yields
    `2026-06-30 14:00:00+00:00`, so a parse/serialize round-trip silently
    rewrites the author's frontmatter. Dropping the resolver keeps every
    value a string, matching the YAML 1.2 core schema.
    """


_Loader.yaml_implicit_resolvers = {
    ch: [(tag, regexp) for tag, regexp in resolvers if tag != "tag:yaml.org,2002:timestamp"]
    for ch, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}


# ---------------------------------------------------------------------------
# Document parsing (§4)
# ---------------------------------------------------------------------------


@dataclass
class OKFDocument:
    """A parsed markdown file: YAML frontmatter plus a markdown body."""

    frontmatter: dict[str, Any] = field(default_factory=dict)
    body: str = ""
    has_frontmatter: bool = False

    @classmethod
    def parse(cls, text: str) -> "OKFDocument":
        lines = text.splitlines()
        if not lines or lines[0].strip() != _FRONTMATTER_DELIM:
            return cls(frontmatter={}, body=text, has_frontmatter=False)

        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == _FRONTMATTER_DELIM:
                end_idx = i
                break
        if end_idx is None:
            raise OKFDocumentError("Unterminated YAML frontmatter block")

        fm_text = "\n".join(lines[1:end_idx])
        try:
            fm = yaml.load(fm_text, Loader=_Loader) or {}
        except yaml.YAMLError as exc:
            raise OKFDocumentError(f"Invalid YAML in frontmatter: {exc}") from exc
        if not isinstance(fm, dict):
            raise OKFDocumentError("Frontmatter must be a YAML mapping")

        body = "\n".join(lines[end_idx + 1:])
        if body.startswith("\n"):
            body = body[1:]
        return cls(frontmatter=fm, body=body, has_frontmatter=True)

    def serialize(self) -> str:
        fm_text = yaml.safe_dump(
            self.frontmatter, sort_keys=False, allow_unicode=True
        ).rstrip()
        body = self.body if self.body.endswith("\n") else self.body + "\n"
        return f"{_FRONTMATTER_DELIM}\n{fm_text}\n{_FRONTMATTER_DELIM}\n\n{body}"


# ---------------------------------------------------------------------------
# Trust and lifecycle helpers (§5)
# ---------------------------------------------------------------------------


def normalize_verified(frontmatter: dict[str, Any]) -> list[dict[str, Any]]:
    """Return the `verified` events as a list (§5.2).

    A single verifier MAY be written as one `{ by, at }` mapping without the
    list dash; consumers MUST treat a bare mapping as a one-element list.
    """
    verified = frontmatter.get("verified")
    if verified is None:
        return []
    if isinstance(verified, dict):
        return [verified]
    if isinstance(verified, list):
        return [v for v in verified if isinstance(v, dict)]
    return []


def trust_tier(frontmatter: dict[str, Any]) -> str:
    """Derive a concept's trust tier from `verified` (§5.3).

    - No `verified` key            ⇒ "unverified"
    - `verified` by non-`human:`   ⇒ "machine-confirmed"
    - `verified` by a `human:<id>` ⇒ "human-reviewed"
    """
    events = normalize_verified(frontmatter)
    if not events:
        return "unverified"
    for event in events:
        if str(event.get("by") or "").startswith("human:"):
            return "human-reviewed"
    return "machine-confirmed"


def parse_timestamp(raw: str) -> datetime | None:
    """Parse an OKF timestamp: ISO 8601 with an explicit UTC offset (§5).

    Returns None for anything else — a date-only `2026-12-31` names a
    different instant in every timezone, so it is ignored rather than guessed
    at. A trailing `Z` is normalized to `+00:00` because
    `datetime.fromisoformat` only accepts it from Python 3.11 onward.
    """
    text = str(raw or "").strip()
    if "T" not in text:
        return None
    if text.endswith(("Z", "z")):
        text = text[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    return parsed if parsed.tzinfo is not None else None


def is_stale(frontmatter: dict[str, Any], now: datetime | None = None) -> bool:
    """Whether a concept is stale per `stale_after` (§5.5)."""
    stale_after = parse_timestamp(frontmatter.get("stale_after"))
    if stale_after is None:
        return False
    return (now or datetime.now(timezone.utc)) >= stale_after


# ---------------------------------------------------------------------------
# Bundle walking (§3, §6)
# ---------------------------------------------------------------------------


@dataclass
class Concept:
    """One concept document, resolved for consumption."""

    id: str
    path: Path
    type: str
    title: str
    description: str
    resource: str
    tags: list[str]
    body: str
    status: str = "stable"
    generated: dict[str, Any] = field(default_factory=dict)
    verified: list[dict[str, Any]] = field(default_factory=list)
    stale_after: str = ""
    sources: list[dict[str, Any]] = field(default_factory=list)
    frontmatter: dict[str, Any] = field(default_factory=dict)
    trust_tier: str = "unverified"
    stale: bool = False
    links_to: list[str] = field(default_factory=list)

    def to_node(self) -> dict[str, Any]:
        return {
            "data": {
                "id": self.id,
                "label": self.title or self.id,
                "type": self.type,
                "description": self.description,
                "resource": self.resource,
                "tags": self.tags,
                "status": self.status,
                "generated": self.generated,
                "verified": self.verified,
                "stale_after": self.stale_after,
                "sources": self.sources,
                "trust_tier": self.trust_tier,
                "stale": self.stale,
                "color": type_color(self.type),
                "size": 30 + min(60, len(self.body) // 200),
            }
        }


def concept_id_for(path: Path, bundle_root: Path) -> str:
    """A concept's id: its path within the bundle, minus the `.md` (§2)."""
    rel = path.relative_to(bundle_root).with_suffix("")
    return "/".join(rel.parts)


def iter_markdown(bundle_root: Path) -> Iterator[Path]:
    """Every markdown file in the bundle, in stable order."""
    for path in sorted(bundle_root.rglob("*.md")):
        yield path


def strip_code(body: str) -> str:
    """Blank out fenced code blocks and inline code spans.

    A link inside a code span is an example of link syntax, not a relationship
    — a distinction that matters as soon as a bundle documents its own
    conventions. Blocks are replaced rather than deleted so nothing downstream
    depends on offsets shifting.
    """
    without_fences = _FENCE_BLOCK_RE.sub(
        lambda m: "\n" * m.group(0).count("\n"), body
    )
    return _INLINE_CODE_RE.sub("", without_fences)


def extract_links(body: str, doc_dir: Path, bundle_root: Path) -> list[str]:
    """Concept ids this body links to (§6.1).

    Handles both link forms the spec defines: bundle-absolute (`/tables/x.md`,
    the RECOMMENDED form) and relative (`../tables/x.md`). External URLs and
    links inside code are ignored. Targets are returned as concept ids whether
    or not they resolve to a real file — consumers MUST tolerate broken links,
    so filtering to existing concepts is the caller's job.
    """
    out: list[str] = []
    seen: set[str] = set()
    bundle_root_resolved = bundle_root.resolve()
    for match in _LINK_RE.finditer(strip_code(body)):
        target = match.group(1)
        if "://" in target:
            continue
        if target.startswith("/"):
            # Bundle-relative: interpreted against the bundle root.
            candidate = bundle_root_resolved / target.lstrip("/")
        else:
            candidate = doc_dir / target
        try:
            resolved = candidate.resolve().relative_to(bundle_root_resolved)
        except ValueError:
            # Escapes the bundle; not a concept link.
            continue
        rel = resolved.as_posix()
        if rel.endswith(".md"):
            rel = rel[:-3]
        if rel and rel not in seen:
            seen.add(rel)
            out.append(rel)
    return out


def load_concepts(bundle_root: Path) -> list[Concept]:
    """Parse every concept document in the bundle, skipping reserved files."""
    concepts: list[Concept] = []
    for md_path in iter_markdown(bundle_root):
        if md_path.name in RESERVED_NAMES:
            continue
        try:
            doc = OKFDocument.parse(md_path.read_text(encoding="utf-8"))
        except OKFDocumentError:
            continue
        fm = doc.frontmatter or {}
        tags = fm.get("tags") or []
        if not isinstance(tags, list):
            tags = [str(tags)]
        generated = fm.get("generated") if isinstance(fm.get("generated"), dict) else {}
        sources = fm.get("sources")
        if isinstance(sources, dict):
            sources = [sources]
        elif not isinstance(sources, list):
            sources = []
        concepts.append(
            Concept(
                id=concept_id_for(md_path, bundle_root),
                path=md_path,
                type=str(fm.get("type") or "Unknown"),
                title=str(fm.get("title") or concept_id_for(md_path, bundle_root)),
                description=str(fm.get("description") or ""),
                resource=str(fm.get("resource") or ""),
                tags=[str(t) for t in tags],
                body=doc.body or "",
                status=str(fm.get("status") or "stable"),
                generated=generated or {},
                verified=normalize_verified(fm),
                stale_after=str(fm.get("stale_after") or ""),
                sources=[s for s in sources if isinstance(s, dict)],
                frontmatter=fm,
                trust_tier=trust_tier(fm),
                stale=is_stale(fm),
                links_to=extract_links(doc.body or "", md_path.parent, bundle_root),
            )
        )
    return concepts


# ---------------------------------------------------------------------------
# Validation (§11)
# ---------------------------------------------------------------------------


@dataclass
class Finding:
    """One validation result, anchored to a file."""

    path: str
    message: str
    section: str

    def format(self) -> str:
        return f"{self.path}: {self.message} [{self.section}]"


def _check_actor(value: Any, where: str, path: str, findings: list[Finding]) -> None:
    actor = str(value or "")
    if actor and not _ACTOR_RE.match(actor):
        findings.append(
            Finding(
                path,
                f"{where} '{actor}' does not follow the actor convention "
                f"(`<producer>/<version>`, `human:<id>`, or `process:<id>`)",
                "§7",
            )
        )


def _check_timestamp(value: Any, where: str, path: str, findings: list[Finding]) -> None:
    if value in (None, ""):
        return
    if parse_timestamp(value) is None:
        findings.append(
            Finding(
                path,
                f"{where} '{value}' is not an ISO 8601 datetime with an explicit "
                f"UTC offset",
                "§5",
            )
        )


def _validate_index(path: Path, rel: str, is_bundle_root: bool,
                    errors: list[Finding], warnings: list[Finding]) -> None:
    """§8: index files carry no frontmatter, except okf_version at the root."""
    try:
        doc = OKFDocument.parse(path.read_text(encoding="utf-8"))
    except OKFDocumentError as exc:
        errors.append(Finding(rel, str(exc), "§8"))
        return
    if not doc.has_frontmatter:
        return
    if not is_bundle_root:
        errors.append(
            Finding(rel, "only a bundle-root index.md may carry frontmatter", "§8")
        )
        return
    extra = set(doc.frontmatter) - {"okf_version"}
    if extra:
        errors.append(
            Finding(
                rel,
                f"bundle-root index.md may only carry `okf_version`, found: "
                f"{', '.join(sorted(extra))}",
                "§12",
            )
        )
    declared = str(doc.frontmatter.get("okf_version") or "")
    if declared and declared != OKF_VERSION:
        warnings.append(
            Finding(rel, f"declares okf_version {declared}; this tool targets "
                         f"{OKF_VERSION}", "§12")
        )


def _validate_log(path: Path, rel: str,
                  errors: list[Finding], warnings: list[Finding]) -> None:
    """§9: date headings MUST use ISO 8601 `YYYY-MM-DD`."""
    text = path.read_text(encoding="utf-8")
    if text.lstrip().startswith(_FRONTMATTER_DELIM):
        errors.append(Finding(rel, "log.md must not carry frontmatter", "§9"))
    headings = _LOG_DATE_RE.findall(text)
    if not headings:
        warnings.append(
            Finding(rel, "no `## YYYY-MM-DD` date headings found", "§9")
        )
    for heading in headings:
        if not _ISO_DATE_RE.match(heading):
            errors.append(
                Finding(rel, f"date heading '## {heading}' is not ISO 8601 "
                             f"YYYY-MM-DD", "§9")
            )


def _validate_concept(concept: Concept, rel: str, known_ids: set[str],
                      bundle_root: Path,
                      errors: list[Finding], warnings: list[Finding]) -> None:
    fm = concept.frontmatter

    # §11.2 — the one hard requirement.
    missing = [k for k in REQUIRED_FRONTMATTER_KEYS if not fm.get(k)]
    if missing:
        errors.append(
            Finding(rel, f"missing required frontmatter key(s): "
                         f"{', '.join(missing)}", "§11")
        )

    # Recommended fields (§4.1). Absence is legal but costs consumers.
    for key in ("title", "description"):
        if not fm.get(key):
            warnings.append(Finding(rel, f"no `{key}` (recommended)", "§4.1"))

    # §5.4 lifecycle.
    status = fm.get("status")
    if status is not None and str(status) not in ("draft", "stable", "deprecated"):
        errors.append(
            Finding(rel, f"status '{status}' is not one of draft|stable|deprecated",
                    "§5.4")
        )

    # §5.2 trust.
    generated = fm.get("generated")
    if generated is not None:
        if not isinstance(generated, dict):
            errors.append(Finding(rel, "`generated` must be a mapping", "§5.2"))
        else:
            if not generated.get("by"):
                errors.append(Finding(rel, "`generated` requires `by`", "§5.2"))
            _check_actor(generated.get("by"), "generated.by", rel, warnings)
            _check_timestamp(generated.get("at"), "generated.at", rel, warnings)
    else:
        warnings.append(
            Finding(rel, "no `generated`; consumers cannot tell a recent edit "
                         "from a stale fact", "§5.2")
        )

    for event in normalize_verified(fm):
        if not event.get("by"):
            errors.append(Finding(rel, "a `verified` entry requires `by`", "§5.2"))
        _check_actor(event.get("by"), "verified[].by", rel, warnings)
        _check_timestamp(event.get("at"), "verified[].at", rel, warnings)

    _check_timestamp(fm.get("stale_after"), "stale_after", rel, warnings)

    # §5.1 provenance.
    source_ids: set[str] = set()
    raw_sources = fm.get("sources")
    if raw_sources is not None and not isinstance(raw_sources, (list, dict)):
        errors.append(Finding(rel, "`sources` must be a list", "§5.1"))
    for source in concept.sources:
        if not source.get("resource"):
            errors.append(
                Finding(rel, "every `sources` entry requires `resource`", "§5.1")
            )
        if source.get("id"):
            source_ids.add(str(source["id"]))
        _check_timestamp(source.get("last_modified"), "sources[].last_modified",
                         rel, warnings)
        if source.get("author"):
            _check_actor(source.get("author"), "sources[].author", rel, warnings)
    if any(s.get("usage_count") for s in concept.sources) and not fm.get("usage_window"):
        warnings.append(
            Finding(rel, "`usage_count` given without a `usage_window` to frame it",
                    "§5.1")
        )

    # §5.1 per-claim attribution: footnote labels join into `sources[].id`.
    for label in set(_FOOTNOTE_REF_RE.findall(concept.body)):
        if label not in source_ids:
            warnings.append(
                Finding(rel, f"footnote [^{label}] has no matching `sources` entry "
                             f"with that id", "§5.1")
            )

    # §10 attested computations.
    if concept.type == "Attested Computation":
        if not fm.get("runtime"):
            errors.append(
                Finding(rel, "an Attested Computation requires `runtime`", "§10.2")
            )
        has_inline = "# Computation" in concept.body
        if not fm.get("computation") and not has_inline:
            errors.append(
                Finding(rel, "no computation: set `computation` to a path, or add a "
                             "`# Computation` section with a fenced block", "§10.3")
            )
        if fm.get("computation") and has_inline:
            warnings.append(
                Finding(rel, "both a `computation` path and an inline "
                             "`# Computation` section; the path wins", "§10.3")
            )
        for param in fm.get("parameters") or []:
            if not isinstance(param, dict) or not param.get("name"):
                errors.append(
                    Finding(rel, "every `parameters` entry needs a `name`", "§10.2")
                )

    # §6.1 — broken links are legal ("not-yet-written knowledge") but worth saying.
    # A link to a reserved file resolves to a real document that is simply not a
    # concept, so it is navigation, not a dangling edge.
    for target in concept.links_to:
        if target in known_ids or (bundle_root / f"{target}.md").exists():
            continue
        warnings.append(
            Finding(rel, f"link to '{target}' resolves to no concept in the "
                         f"bundle", "§6.1")
        )


def validate_bundle(bundle_root: Path) -> tuple[list[Finding], list[Finding]]:
    """Check a bundle against OKF v0.2.

    Returns (errors, warnings). Errors are the §11 conformance criteria plus
    the keys the spec marks REQUIRED within an optional family — a bundle with
    any of them is not conformant. Warnings cover SHOULD-level guidance and
    consumer-hostile omissions; the spec explicitly forbids rejecting a bundle
    over them (§11), so they never fail the run unless --strict is passed.
    """
    bundle_root = Path(bundle_root)
    if not bundle_root.is_dir():
        raise FileNotFoundError(f"Bundle directory not found: {bundle_root}")

    errors: list[Finding] = []
    warnings: list[Finding] = []

    concepts = load_concepts(bundle_root)
    known_ids = {c.id for c in concepts}

    for md_path in iter_markdown(bundle_root):
        rel = md_path.relative_to(bundle_root).as_posix()
        if md_path.name == INDEX_NAME:
            _validate_index(md_path, rel, md_path.parent == bundle_root,
                            errors, warnings)
            continue
        if md_path.name == LOG_NAME:
            _validate_log(md_path, rel, errors, warnings)
            continue

        text = md_path.read_text(encoding="utf-8")
        try:
            doc = OKFDocument.parse(text)
        except OKFDocumentError as exc:
            errors.append(Finding(rel, str(exc), "§11"))
            continue
        if not doc.has_frontmatter:
            errors.append(
                Finding(rel, "no YAML frontmatter block", "§11")
            )
            continue
        concept = next((c for c in concepts if c.path == md_path), None)
        if concept is not None:
            _validate_concept(concept, rel, known_ids, bundle_root, errors, warnings)

    # §8 progressive disclosure: a directory of concepts wants an index.
    for directory in sorted({p.parent for p in iter_markdown(bundle_root)}):
        if not (directory / INDEX_NAME).exists():
            rel = directory.relative_to(bundle_root).as_posix() or "."
            warnings.append(
                Finding(rel, "directory has no index.md for progressive disclosure",
                        "§8")
            )

    if not (bundle_root / INDEX_NAME).exists():
        warnings.append(Finding(".", "bundle has no root index.md", "§8"))

    return errors, warnings


# ---------------------------------------------------------------------------
# Visualization
# ---------------------------------------------------------------------------


def type_color(type_name: str) -> str:
    """A stable, distinct color for a concept type.

    OKF deliberately has no registered type taxonomy (§4.1), so a fixed
    palette can only ever cover the types its author happened to know. Hashing
    the type name gives every taxonomy readable, well-separated colors that
    stay put across regenerations.
    """
    digest = hashlib.sha256(type_name.encode("utf-8")).digest()
    hue = digest[0] / 255.0
    saturation = 0.45 + (digest[1] / 255.0) * 0.25   # 0.45 – 0.70
    lightness = 0.52 + (digest[2] / 255.0) * 0.12    # 0.52 – 0.64
    r, g, b = colorsys.hls_to_rgb(hue, lightness, saturation)
    return "#{:02x}{:02x}{:02x}".format(int(r * 255), int(g * 255), int(b * 255))


def _load_reserved(bundle_root: Path, filename: str) -> dict[str, str]:
    """Bodies of one kind of reserved file, keyed by path minus the `.md`.

    Reserved files are not concepts, so they are absent from the graph — but
    they are real documents that concepts link to constantly. Carrying their
    bodies lets a viewer render them instead of leaving a dead link.
    """
    found: dict[str, str] = {}
    for md_path in iter_markdown(bundle_root):
        if md_path.name != filename:
            continue
        try:
            doc = OKFDocument.parse(md_path.read_text(encoding="utf-8"))
        except OKFDocumentError:
            continue
        found[concept_id_for(md_path, bundle_root)] = doc.body or ""
    return found


def load_indexes(bundle_root: Path) -> dict[str, str]:
    """Every `index.md` body — the bundle's progressive-disclosure layer (§8)."""
    return _load_reserved(bundle_root, INDEX_NAME)


def load_logs(bundle_root: Path) -> dict[str, str]:
    """Every `log.md` body — the record of what changed and when (§9)."""
    return _load_reserved(bundle_root, LOG_NAME)


def build_graph(concepts: list[Concept]) -> dict[str, Any]:
    """Nodes, edges, and bodies for the viewer."""
    ids = {c.id for c in concepts}
    nodes = [c.to_node() for c in concepts]
    edges: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for concept in concepts:
        for target in concept.links_to:
            if target == concept.id or target not in ids:
                continue
            key = (concept.id, target)
            if key in seen:
                continue
            seen.add(key)
            edges.append(
                {"data": {"id": f"{concept.id}__{target}",
                          "source": concept.id,
                          "target": target}}
            )
    types = sorted({c.type for c in concepts})
    return {
        "nodes": nodes,
        "edges": edges,
        "bodies": {c.id: c.body for c in concepts},
        "types": types,
        "palette": {t: type_color(t) for t in types},
    }


def _asset(name: str, *parts: str) -> str:
    return (Path(__file__).parent.joinpath(*parts, name)).read_text(encoding="utf-8")


_EMBEDDED_NAME_RE = re.compile(r'window\.BUNDLE_NAME = ("(?:[^"\\]|\\.)*");')


def _previous_bundle_name(out_path: Path) -> str | None:
    """The bundle name embedded in an earlier render of the same output file.

    Regenerating without --name must not silently reset a header that was
    chosen at install time, so the existing page is the fallback the flag
    overrides.
    """
    if not out_path.is_file():
        return None
    match = _EMBEDDED_NAME_RE.search(out_path.read_text(encoding="utf-8"))
    if match is None:
        return None
    try:
        name = json.loads(match.group(1))
    except json.JSONDecodeError:
        return None
    return name if isinstance(name, str) and name else None


def _embed_json(value: object) -> str:
    """Serialise a value for inlining inside an HTML <script> element.

    JSON does not escape "/", so a concept body containing a literal
    "</" + "script>" -- anything documenting HTML will have one -- would close
    the script element early and leave window.BUNDLE unassigned, breaking the
    whole viewer. "<\/" is a legal JSON string escape that parses
    identically, so escaping every "</" is safe and costs nothing.

    U+2028 and U+2029 are also escaped: they are valid inside JSON strings
    but are line terminators in JavaScript source.
    """
    return (
        json.dumps(value, default=str)
        .replace("</", "<\\/")
        .replace(" ", "\\u2028")
        .replace(" ", "\\u2029")
    )


def generate_visualization(
    bundle_root: Path,
    out_path: Path,
    *,
    bundle_name: str | None = None,
) -> dict[str, int]:
    """Walk a bundle and write one self-contained HTML file.

    Everything the page needs — the bundle, the stylesheet, the viewer script,
    Cytoscape, and marked — is inlined, so the result opens from a filesystem
    with no network access.

    Returns counts: {'concepts': N, 'edges': M, 'bytes': K}.
    """
    bundle_root = Path(bundle_root)
    out_path = Path(out_path)
    if not bundle_root.is_dir():
        raise FileNotFoundError(f"Bundle directory not found: {bundle_root}")

    concepts = load_concepts(bundle_root)
    graph = build_graph(concepts)
    graph["indexes"] = load_indexes(bundle_root)
    graph["logs"] = load_logs(bundle_root)
    name = (bundle_name or _previous_bundle_name(out_path)
            or bundle_root.resolve().name)

    html = (
        _asset("viz.html", "templates")
        .replace("/*__CYTOSCAPE__*/", _asset("cytoscape.min.js", "vendor"))
        .replace("/*__MARKED__*/", _asset("marked.min.js", "vendor"))
        .replace("/*__VIZ_CSS__*/", _asset("viz.css", "static"))
        .replace("/*__VIZ_JS__*/", _asset("viz.js", "static"))
        .replace("__BUNDLE_NAME__", _embed_json(name))
        .replace("__BUNDLE_DATA__", _embed_json(graph))
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    # newline="\n" so the committed page is byte-identical whatever platform
    # regenerated it; otherwise Windows rewrites every line ending and the
    # whole 400 KB file shows up as a diff.
    out_path.write_text(html, encoding="utf-8", newline="\n")

    return {
        "concepts": len(concepts),
        "edges": len(graph["edges"]),
        "bytes": len(html.encode("utf-8")),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def _cmd_validate(args: argparse.Namespace) -> int:
    errors, warnings = validate_bundle(Path(args.bundle))
    for finding in errors:
        print(f"ERROR   {finding.format()}")
    for finding in warnings:
        print(f"warning {finding.format()}")

    concepts = load_concepts(Path(args.bundle))
    print(
        f"\n{len(concepts)} concept(s), {len(errors)} error(s), "
        f"{len(warnings)} warning(s)"
    )
    if errors:
        print(f"NOT conformant with OKF v{OKF_VERSION}")
        return 1
    if warnings and args.strict:
        print(f"Conformant with OKF v{OKF_VERSION}, but --strict fails on warnings")
        return 1
    print(f"Conformant with OKF v{OKF_VERSION}")
    return 0


def _cmd_visualize(args: argparse.Namespace) -> int:
    bundle = Path(args.bundle)
    out = Path(args.out) if args.out else bundle / "viz.html"
    stats = generate_visualization(bundle, out, bundle_name=args.name)
    print(
        f"Wrote {out} — {stats['concepts']} concept(s), {stats['edges']} edge(s), "
        f"{stats['bytes'] / 1024:.0f} KB"
    )
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="okf.py",
        description=f"Validate and visualize an Open Knowledge Format v{OKF_VERSION} bundle.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_validate = sub.add_parser("validate", help="check a bundle against OKF v0.2")
    p_validate.add_argument("--bundle", required=True, help="bundle root directory")
    p_validate.add_argument("--strict", action="store_true",
                            help="fail on warnings too, not just conformance errors")
    p_validate.set_defaults(func=_cmd_validate)

    p_viz = sub.add_parser("visualize", help="render a bundle as one static HTML file")
    p_viz.add_argument("--bundle", required=True, help="bundle root directory")
    p_viz.add_argument("--out", help="output path (default: <bundle>/viz.html)")
    p_viz.add_argument("--name", help="display name in the viewer header")
    p_viz.set_defaults(func=_cmd_visualize)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
