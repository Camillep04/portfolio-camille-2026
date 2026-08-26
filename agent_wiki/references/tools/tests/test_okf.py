"""Tests for okf.py — the bundle validator and offline visualizer.

Section references point into the OKF v0.2 spec.
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import json
import pytest

CONCEPT = """---
type: Component
title: Widget
description: A widget.
generated: { by: test-agent/v1, at: 2026-08-21T21:34:06Z }
---

# Body

Text.
"""


# --- Document parsing (§4) -------------------------------------------------


def test_parse_splits_frontmatter_from_body(okf):
    doc = okf.OKFDocument.parse(CONCEPT)
    assert doc.has_frontmatter
    assert doc.frontmatter["type"] == "Component"
    assert doc.body.startswith("# Body")


def test_parse_treats_a_file_without_delimiters_as_all_body(okf):
    doc = okf.OKFDocument.parse("# Just markdown\n")
    assert not doc.has_frontmatter
    assert doc.frontmatter == {}
    assert doc.body == "# Just markdown\n"


def test_parse_rejects_unterminated_frontmatter(okf):
    with pytest.raises(okf.OKFDocumentError):
        okf.OKFDocument.parse("---\ntype: Thing\n\nbody\n")


def test_parse_rejects_non_mapping_frontmatter(okf):
    with pytest.raises(okf.OKFDocumentError):
        okf.OKFDocument.parse("---\n- a\n- b\n---\n\nbody\n")


def test_timestamps_survive_a_round_trip_as_written(okf):
    """PyYAML's YAML 1.1 timestamp resolver would rewrite the author's text."""
    doc = okf.OKFDocument.parse(CONCEPT)
    assert doc.frontmatter["generated"]["at"] == "2026-08-21T21:34:06Z"
    assert "2026-08-21T21:34:06Z" in doc.serialize()


# --- Trust and lifecycle (§5) ----------------------------------------------


def test_bare_verified_mapping_is_read_as_a_one_element_list(okf):
    """§5.2: consumers MUST treat a bare mapping as a one-element list."""
    fm = {"verified": {"by": "human:reviewer", "at": "2026-08-21T00:00:00Z"}}
    assert okf.normalize_verified(fm) == [fm["verified"]]


def test_verified_absent_yields_an_empty_list(okf):
    assert okf.normalize_verified({}) == []


@pytest.mark.parametrize(
    "frontmatter,expected",
    [
        ({}, "unverified"),
        ({"verified": [{"by": "process:nightly"}]}, "machine-confirmed"),
        ({"verified": [{"by": "human:reviewer"}]}, "human-reviewed"),
        # A human anywhere in the list wins (§5.3).
        (
            {"verified": [{"by": "process:nightly"}, {"by": "human:reviewer"}]},
            "human-reviewed",
        ),
    ],
)
def test_trust_tier_is_derived_from_verified(okf, frontmatter, expected):
    assert okf.trust_tier(frontmatter) == expected


def test_timestamp_parsing_accepts_a_trailing_z(okf):
    """datetime.fromisoformat only learned `Z` in 3.11; this must work on 3.10."""
    parsed = okf.parse_timestamp("2026-09-23T00:00:00Z")
    assert parsed == datetime(2026, 9, 23, tzinfo=timezone.utc)


def test_timestamp_parsing_rejects_ambiguous_values(okf):
    # Date-only names a different instant in every timezone (§5.5).
    assert okf.parse_timestamp("2026-09-23") is None
    # No offset, same problem.
    assert okf.parse_timestamp("2026-09-23T00:00:00") is None
    assert okf.parse_timestamp("") is None
    assert okf.parse_timestamp("not a date") is None


def test_is_stale_compares_against_now(okf):
    now = datetime(2026, 8, 21, tzinfo=timezone.utc)
    assert okf.is_stale({"stale_after": "2026-01-01T00:00:00Z"}, now) is True
    assert okf.is_stale({"stale_after": "2027-01-01T00:00:00Z"}, now) is False
    assert okf.is_stale({}, now) is False
    # Unparseable means "no opinion", never "stale".
    assert okf.is_stale({"stale_after": "2026-01-01"}, now) is False


# --- Links (§6) ------------------------------------------------------------


def test_extract_links_resolves_bundle_absolute_links(okf, tmp_path):
    """§6.1 calls the `/`-prefixed form RECOMMENDED, so it must produce edges."""
    root = tmp_path / "b"
    (root / "tables").mkdir(parents=True)
    links = okf.extract_links("See [x](/tables/orders.md).", root / "metrics", root)
    assert links == ["tables/orders"]


def test_extract_links_resolves_relative_links(okf, tmp_path):
    root = tmp_path / "b"
    (root / "metrics").mkdir(parents=True)
    links = okf.extract_links("See [x](../tables/orders.md).", root / "metrics", root)
    assert links == ["tables/orders"]


def test_extract_links_ignores_external_urls(okf, tmp_path):
    root = tmp_path / "b"
    root.mkdir()
    assert okf.extract_links("[x](https://example.com/a.md)", root, root) == []


def test_extract_links_ignores_paths_escaping_the_bundle(okf, tmp_path):
    root = tmp_path / "b"
    (root / "sub").mkdir(parents=True)
    assert okf.extract_links("[x](../../outside.md)", root / "sub", root) == []


def test_extract_links_ignores_links_inside_code(okf, tmp_path):
    """A link in an example documents syntax; it is not a relationship."""
    root = tmp_path / "b"
    root.mkdir()
    body = (
        "Real [one](/a.md).\n\n"
        "Inline `[fake](/b.md)` example.\n\n"
        "```markdown\n[also fake](/c.md)\n```\n"
    )
    assert okf.extract_links(body, root, root) == ["a"]


def test_extract_links_deduplicates(okf, tmp_path):
    root = tmp_path / "b"
    root.mkdir()
    assert okf.extract_links("[a](/x.md) [b](/x.md)", root, root) == ["x"]


def test_extract_links_strips_anchors(okf, tmp_path):
    root = tmp_path / "b"
    root.mkdir()
    assert okf.extract_links("[a](/x.md#schema)", root, root) == ["x"]


# --- Graph -----------------------------------------------------------------


def test_type_color_is_stable_and_valid(okf):
    first = okf.type_color("Decision")
    assert first == okf.type_color("Decision")
    assert first != okf.type_color("Component")
    assert len(first) == 7 and first.startswith("#")
    int(first[1:], 16)  # parses as hex


def test_build_graph_drops_edges_to_missing_and_self(okf, make_bundle):
    root = make_bundle({
        "a.md": "---\ntype: T\n---\n\n[b](/b.md) [self](/a.md) [gone](/nope.md)\n",
        "b.md": "---\ntype: T\n---\n\nBody.\n",
    })
    graph = okf.build_graph(okf.load_concepts(root))
    assert [e["data"]["source"] + "->" + e["data"]["target"] for e in graph["edges"]] == ["a->b"]


def test_load_indexes_collects_index_bodies(okf, make_bundle):
    """§8 index files are not concepts, but a viewer still needs their bodies."""
    root = make_bundle({
        "index.md": '---\nokf_version: "0.2"\n---\n\n# Root\n',
        "sub/index.md": "# Sub\n",
        "sub/a.md": "---\ntype: T\n---\n\nBody.\n",
    })
    indexes = okf.load_indexes(root)
    assert set(indexes) == {"index", "sub/index"}
    # Root frontmatter is stripped; only the body survives.
    assert indexes["index"].strip() == "# Root"


def test_load_concepts_skips_reserved_files(okf, make_bundle):
    """Upstream skips only index.md, so log.md surfaces as an `Unknown` concept."""
    root = make_bundle({
        "index.md": "# Index\n",
        "log.md": "# Log\n\n## 2026-08-21\n* **Creation**: x\n",
        "a.md": "---\ntype: T\n---\n\nBody.\n",
    })
    assert [c.id for c in okf.load_concepts(root)] == ["a"]


# --- Validation (§11) ------------------------------------------------------


def _messages(findings):
    return " | ".join(f.format() for f in findings)


def test_a_minimal_bundle_is_conformant(okf, make_bundle):
    """§11: a concept carrying just `type` is fully conformant."""
    root = make_bundle({"index.md": "# Index\n", "a.md": "---\ntype: T\n---\n\nBody.\n"})
    errors, _ = okf.validate_bundle(root)
    assert errors == []


def test_missing_type_is_an_error(okf, make_bundle):
    root = make_bundle({"a.md": "---\ntitle: No type\n---\n\nBody.\n"})
    errors, _ = okf.validate_bundle(root)
    assert "missing required frontmatter key(s): type" in _messages(errors)


def test_missing_frontmatter_is_an_error(okf, make_bundle):
    root = make_bundle({"a.md": "# Just markdown\n"})
    errors, _ = okf.validate_bundle(root)
    assert "no YAML frontmatter block" in _messages(errors)


def test_unknown_type_and_extra_keys_are_tolerated(okf, make_bundle):
    """§11: consumers MUST NOT reject unknown types or unknown keys."""
    root = make_bundle({
        "index.md": "# Index\n",
        "a.md": "---\ntype: Something Nobody Registered\nwhatever: 42\n---\n\nB.\n",
    })
    errors, _ = okf.validate_bundle(root)
    assert errors == []


def test_broken_links_warn_but_never_fail(okf, make_bundle):
    """§6.1: a link to a missing target may be not-yet-written knowledge."""
    root = make_bundle({
        "index.md": "# Index\n",
        "a.md": "---\ntype: T\n---\n\n[gone](/nowhere.md)\n",
    })
    errors, warnings = okf.validate_bundle(root)
    assert errors == []
    assert "resolves to no concept" in _messages(warnings)


def test_links_to_reserved_files_are_not_reported_as_broken(okf, make_bundle):
    root = make_bundle({
        "index.md": "# Index\n",
        "log.md": "# Log\n\n## 2026-08-21\n* **Creation**: x\n",
        "a.md": "---\ntype: T\n---\n\nSee [the log](/log.md).\n",
    })
    _, warnings = okf.validate_bundle(root)
    assert "resolves to no concept" not in _messages(warnings)


def test_bad_status_is_an_error(okf, make_bundle):
    root = make_bundle({"a.md": "---\ntype: T\nstatus: whenever\n---\n\nB.\n"})
    errors, _ = okf.validate_bundle(root)
    assert "not one of draft|stable|deprecated" in _messages(errors)


def test_generated_without_by_is_an_error(okf, make_bundle):
    root = make_bundle({"a.md": "---\ntype: T\ngenerated: { at: 2026-08-21T00:00:00Z }\n---\n\nB.\n"})
    errors, _ = okf.validate_bundle(root)
    assert "`generated` requires `by`" in _messages(errors)


def test_source_without_resource_is_an_error(okf, make_bundle):
    root = make_bundle({"a.md": "---\ntype: T\nsources:\n  - id: x\n    title: X\n---\n\nB.\n"})
    errors, _ = okf.validate_bundle(root)
    assert "every `sources` entry requires `resource`" in _messages(errors)


def test_actor_convention_violations_warn(okf, make_bundle):
    """§7: `<producer>/<version>`, `human:<id>`, or `process:<id>`."""
    root = make_bundle({"a.md": "---\ntype: T\ngenerated: { by: alex }\n---\n\nB.\n"})
    errors, warnings = okf.validate_bundle(root)
    assert errors == []
    assert "does not follow the actor convention" in _messages(warnings)


def test_footnote_without_a_matching_source_warns(okf, make_bundle):
    root = make_bundle({"a.md": "---\ntype: T\n---\n\nClaim.[^nope]\n\n[^nope]: x\n"})
    _, warnings = okf.validate_bundle(root)
    assert "has no matching `sources` entry" in _messages(warnings)


def test_frontmatter_in_a_non_root_index_is_an_error(okf, make_bundle):
    """§8: only a bundle-root index.md may carry frontmatter."""
    root = make_bundle({
        "index.md": "# Index\n",
        "sub/index.md": "---\ntype: Nope\n---\n\n# Sub\n",
    })
    errors, _ = okf.validate_bundle(root)
    assert "only a bundle-root index.md may carry frontmatter" in _messages(errors)


def test_root_index_may_declare_okf_version(okf, make_bundle):
    root = make_bundle({"index.md": '---\nokf_version: "0.2"\n---\n\n# Index\n'})
    errors, _ = okf.validate_bundle(root)
    assert errors == []


def test_root_index_may_not_carry_other_keys(okf, make_bundle):
    root = make_bundle({"index.md": '---\nokf_version: "0.2"\ntitle: Nope\n---\n\n# Index\n'})
    errors, _ = okf.validate_bundle(root)
    assert "may only carry `okf_version`" in _messages(errors)


def test_non_iso_log_headings_are_an_error(okf, make_bundle):
    """§9: date headings MUST use ISO 8601 YYYY-MM-DD."""
    root = make_bundle({"log.md": "# Log\n\n## 21/08/2026\n* **Creation**: x\n"})
    errors, _ = okf.validate_bundle(root)
    assert "is not ISO 8601" in _messages(errors)


def test_attested_computation_requires_a_runtime(okf, make_bundle):
    root = make_bundle({
        "c.md": "---\ntype: Attested Computation\n---\n\n# Computation\n\n```\nls\n```\n",
    })
    errors, _ = okf.validate_bundle(root)
    assert "requires `runtime`" in _messages(errors)


def test_attested_computation_requires_a_computation(okf, make_bundle):
    root = make_bundle({"c.md": "---\ntype: Attested Computation\nruntime: shell\n---\n\nNothing.\n"})
    errors, _ = okf.validate_bundle(root)
    assert "no computation" in _messages(errors)


def test_a_directory_without_an_index_warns(okf, make_bundle):
    root = make_bundle({"index.md": "# Index\n", "sub/a.md": "---\ntype: T\n---\n\nB.\n"})
    _, warnings = okf.validate_bundle(root)
    assert "no index.md for progressive disclosure" in _messages(warnings)


def test_validate_rejects_a_missing_directory(okf, tmp_path):
    with pytest.raises(FileNotFoundError):
        okf.validate_bundle(tmp_path / "nope")


# --- Visualization ---------------------------------------------------------


def test_visualization_is_self_contained(okf, make_bundle, tmp_path):
    root = make_bundle({
        "index.md": "# Index\n",
        "a.md": "---\ntype: T\ntitle: A\n---\n\n[b](/b.md)\n",
        "b.md": "---\ntype: U\ntitle: B\n---\n\nBody.\n",
    })
    out = tmp_path / "viz.html"
    stats = okf.generate_visualization(root, out, bundle_name="Test")

    assert stats == {"concepts": 2, "edges": 1, "bytes": len(out.read_bytes())}
    html = out.read_text(encoding="utf-8")
    # Nothing may be fetched at view time.
    assert "cdn.jsdelivr" not in html
    assert "<script src=" not in html
    # The libraries and the bundle are all inlined.
    assert "cytoscape" in html.lower()
    assert "marked" in html.lower()
    assert '"Test"' in html
    assert '"id": "a"' in html or '"id":"a"' in html
    assert "__BUNDLE_DATA__" not in html
    assert "/*__VIZ_JS__*/" not in html


def test_visualization_escapes_closing_script_tags(okf, make_bundle, tmp_path):
    """A concept documenting HTML must not be able to break out of the payload.

    JSON does not escape "/", so a literal closing script tag in a body would
    end the <script> element early, leaving window.BUNDLE unassigned and the
    whole viewer blank. Any wiki documenting a page's script tags hits this.
    """
    close = "</" + "script>"
    sep = chr(0x2028)
    nl = chr(10)
    body = 'A tag: <script src="j.js">' + close + " sep:" + sep + " done." + nl
    root = make_bundle({
        "index.md": "# Index" + nl,
        "a.md": "---" + nl + "type: T" + nl + "title: A" + nl + "---" + nl + nl + body,
    })
    out = tmp_path / "viz.html"
    okf.generate_visualization(root, out)
    html = out.read_text(encoding="utf-8")

    payload = html.split("window.BUNDLE = ", 1)[1].split(nl, 1)[0]
    # The payload carries no raw terminator and no raw JS line break...
    assert close not in payload
    assert sep not in payload
    # ...and still parses, with the script tag intact. (U+2028 is not checked
    # here: OKFDocument.parse splits on it, so the body reaching the payload
    # has already had it normalised to a newline.)
    assert json.loads(payload.rstrip(";"))["bodies"]["a"].startswith(
        'A tag: <script src="j.js">' + close
    )


def test_load_logs_collects_log_bodies(okf, make_bundle):
    root = make_bundle({
        "log.md": "# Log\n\n## 2026-08-21\n* **Creation**: x\n",
        "sub/log.md": "# Sub log\n\n## 2026-08-21\n* **Update**: y\n",
    })
    assert set(okf.load_logs(root)) == {"log", "sub/log"}


def test_visualization_carries_reserved_file_bodies(okf, make_bundle, tmp_path):
    """Without them, every link to an index.md or log.md is dead in the viewer."""
    root = make_bundle({
        "index.md": "# Root\n\n* [sub/](sub/) - a directory\n",
        "log.md": "# Log\n\n## 2026-08-21\n* **Creation**: x\n",
        "sub/index.md": "# Sub\n",
        "sub/a.md": "---\ntype: T\n---\n\nSee [the listing](/sub/index.md) and [the log](/log.md).\n",
    })
    out = tmp_path / "viz.html"
    okf.generate_visualization(root, out)
    html = out.read_text(encoding="utf-8")
    assert '"indexes"' in html and '"logs"' in html
    assert "# Sub" in html


def test_visualization_defaults_the_bundle_name_to_the_directory(okf, make_bundle, tmp_path):
    root = make_bundle({"a.md": "---\ntype: T\n---\n\nB.\n"})
    out = tmp_path / "v.html"
    okf.generate_visualization(root, out)
    assert '"bundle"' in out.read_text(encoding="utf-8")


def test_regeneration_preserves_the_embedded_name(okf, make_bundle, tmp_path):
    """Regenerating without --name must not reset a header chosen at install."""
    root = make_bundle({"a.md": "---\ntype: T\n---\n\nB.\n"})
    out = tmp_path / "viz.html"
    okf.generate_visualization(root, out, bundle_name="Chosen Name")

    okf.generate_visualization(root, out)
    assert '"Chosen Name"' in out.read_text(encoding="utf-8")

    okf.generate_visualization(root, out, bundle_name="New Name")
    html = out.read_text(encoding="utf-8")
    assert '"New Name"' in html and '"Chosen Name"' not in html


# --- End to end ------------------------------------------------------------


def test_the_real_wiki_is_conformant(okf, bundle_root):
    errors, _ = okf.validate_bundle(bundle_root)
    assert errors == [], _messages(errors)


def test_the_real_wiki_renders(okf, bundle_root, tmp_path):
    stats = okf.generate_visualization(bundle_root, tmp_path / "viz.html")
    assert stats["concepts"] > 0
    assert stats["edges"] > 0
