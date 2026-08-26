# Tools

The wiki's own machinery, kept inside the bundle so that copying `agent_wiki/`
into another project brings everything needed to validate and render it.

`okf.py` is the entry point; `templates/`, `static/`, and `vendor/` are the
assets it inlines into the generated page, and `tests/` proves it works.
Attribution for the derived and vendored code is in `NOTICE`.

# Concepts

* [okf.py](okf-tool.md) - Validates this bundle against OKF v0.2 and renders it as one offline HTML page.
