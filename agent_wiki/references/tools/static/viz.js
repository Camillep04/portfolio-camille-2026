// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// MODIFICATIONS from the upstream OKF reference viewer script:
//   * Search and the type filter share one applyFilters() pass. Upstream
//     handles them independently, so each one wipes the other's dimming.
//   * Added a clickable type legend, driven by the same filter state.
//   * The initially shown concept is the most-linked-to one rather than
//     whichever node happens to be a BigQuery Dataset.
(function () {
  const bundle = window.BUNDLE;
  const bundleName = window.BUNDLE_NAME;
  document.title = `${bundleName} — OKF Viewer`;
  document.getElementById("bundle-name").textContent = bundleName;

  // Populate type filter
  const typeSelect = document.getElementById("filter-type");
  for (const t of bundle.types) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    typeSelect.appendChild(opt);
  }

  // Build reverse-link index for backlinks
  const backlinks = {};
  for (const edge of bundle.edges) {
    const { source, target } = edge.data;
    (backlinks[target] ||= []).push(source);
  }

  // Look up node label/type by id
  const nodeIndex = {};
  for (const n of bundle.nodes) nodeIndex[n.data.id] = n.data;

  // Reserved files (§3.1) keyed by path minus the .md. Not concepts, so not
  // nodes, but they are real documents concepts link to constantly: index.md
  // is the progressive-disclosure layer (§8), log.md the change history (§9).
  const indexes = bundle.indexes || {};
  const logs = bundle.logs || {};
  const reserved = {};
  for (const [id, body] of Object.entries(indexes)) reserved[id] = { kind: "Index", body };
  for (const [id, body] of Object.entries(logs)) reserved[id] = { kind: "Log", body };
  const ROOT_INDEX = "index";

  const cy = cytoscape({
    container: document.getElementById("graph"),
    elements: [...bundle.nodes, ...bundle.edges],
    style: [
      {
        selector: "node",
        style: {
          "background-color": "data(color)",
          "label": "data(label)",
          "color": "#0f172a",
          "font-size": 11,
          "text-valign": "bottom",
          "text-margin-y": 4,
          "text-wrap": "wrap",
          "text-max-width": 120,
          "width": "data(size)",
          "height": "data(size)",
          "border-width": 1,
          "border-color": "#0f172a",
        },
      },
      {
        selector: "node[?stale]",
        style: {
          "border-width": 2,
          "border-color": "#b91c1c",
          "border-style": "dashed",
        },
      },
      {
        selector: 'node[status = "deprecated"]',
        style: { "opacity": 0.55 },
      },
      {
        selector: "node:selected",
        style: {
          "border-width": 3,
          "border-color": "#f59e0b",
        },
      },
      {
        selector: "edge",
        style: {
          "width": 1.5,
          "line-color": "#cbd5e1",
          "target-arrow-color": "#cbd5e1",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          "arrow-scale": 0.9,
        },
      },
      {
        selector: "edge:selected",
        style: {
          "line-color": "#f59e0b",
          "target-arrow-color": "#f59e0b",
          "width": 2.5,
        },
      },
      {
        selector: ".dim",
        style: { "opacity": 0.15 },
      },
    ],
    layout: { name: "cose", animate: false, padding: 30 },
    wheelSensitivity: 0.2,
  });

  // ---- Legend -------------------------------------------------------------
  // Node colors come from a hash of the type name, so the mapping is only
  // discoverable if we show it.
  const legend = document.getElementById("legend");
  for (const t of bundle.types) {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.dataset.type = t;
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = bundle.palette[t] || "#94a3b8";
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(t));
    // Clicking a legend entry drives the same filter as the dropdown, so the
    // two can never disagree.
    item.addEventListener("click", () => {
      typeSelect.value = typeSelect.value === t ? "" : t;
      applyFilters();
    });
    legend.appendChild(item);
  }

  // ---- Filtering ----------------------------------------------------------
  function applyFilters() {
    const q = document.getElementById("search").value.trim().toLowerCase();
    const type = typeSelect.value;

    cy.nodes().forEach((n) => {
      const d = n.data();
      const matchesType = !type || d.type === type;
      const hay =
        (d.label || "").toLowerCase() + " " +
        d.id.toLowerCase() + " " +
        (d.tags || []).join(" ").toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      n.toggleClass("dim", !(matchesType && matchesQuery));
    });
    cy.edges().forEach((edge) => {
      edge.toggleClass("dim", edge.source().hasClass("dim") || edge.target().hasClass("dim"));
    });

    for (const item of legend.querySelectorAll(".legend-item")) {
      item.classList.toggle("off", Boolean(type) && item.dataset.type !== type);
    }
  }

  cy.on("tap", "node", (evt) => showDetail(evt.target.id()));
  cy.on("tap", (evt) => {
    if (evt.target === cy) clearSelection();
  });

  document.getElementById("layout").addEventListener("change", (e) => {
    cy.layout({ name: e.target.value, animate: false, padding: 30 }).run();
  });

  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById("search").value = "";
    typeSelect.value = "";
    applyFilters();
    cy.fit(null, 30);
    clearSelection();
  });

  document.getElementById("search").addEventListener("input", applyFilters);
  typeSelect.addEventListener("change", applyFilters);

  function clearSelection() {
    cy.elements().unselect();
    document.getElementById("detail-empty").hidden = false;
    document.getElementById("detail-content").hidden = true;
  }

  // The frontmatter grid and badges describe a concept; an index has neither.
  function setConceptChromeVisible(visible) {
    document.querySelector("dl.frontmatter").hidden = !visible;
    document.getElementById("detail-badges").hidden = !visible;
  }

  function showReserved(id) {
    const entry = reserved[id];
    if (!entry) return;
    cy.elements().unselect();

    document.getElementById("detail-empty").hidden = true;
    document.getElementById("detail-content").hidden = false;
    setConceptChromeVisible(false);

    const chip = document.getElementById("detail-type");
    chip.textContent = entry.kind;
    chip.style.background = "#94a3b8";

    const scope = dirOf(id);
    const title = entry.kind === "Index"
      ? (id === ROOT_INDEX ? bundleName : scope + "/")
      : (scope ? scope + "/ change log" : "Change log");
    document.getElementById("detail-title").textContent = title;
    document.getElementById("detail-id").textContent =
      id + ".md — reserved file, not a concept";

    const bodyEl = document.getElementById("detail-body");
    bodyEl.innerHTML = marked.parse(entry.body, { breaks: false, gfm: true });
    rewriteInternalLinks(bodyEl, scope);

    document.getElementById("detail-backlinks").hidden = true;
  }

  function showDetail(conceptId) {
    const data = nodeIndex[conceptId];
    if (!data) return;
    cy.elements().unselect();
    const node = cy.getElementById(conceptId);
    if (node) node.select();

    document.getElementById("detail-empty").hidden = true;
    const content = document.getElementById("detail-content");
    content.hidden = false;
    setConceptChromeVisible(true);

    const chip = document.getElementById("detail-type");
    chip.textContent = data.type;
    chip.style.background = data.color;

    document.getElementById("detail-title").textContent = data.label;
    document.getElementById("detail-id").textContent = conceptId;
    document.getElementById("detail-description").textContent = data.description || "—";

    const resourceEl = document.getElementById("detail-resource");
    resourceEl.innerHTML = "";
    if (data.resource) {
      const a = document.createElement("a");
      a.href = data.resource;
      a.textContent = data.resource;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "external";
      resourceEl.appendChild(a);
    } else {
      resourceEl.textContent = "—";
    }

    const tagsEl = document.getElementById("detail-tags");
    tagsEl.innerHTML = "";
    if (data.tags && data.tags.length) {
      for (const t of data.tags) {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        tagsEl.appendChild(span);
      }
    } else {
      tagsEl.textContent = "—";
    }

    // v0.2 signal badges: status, trust tier, staleness.
    const badgesEl = document.getElementById("detail-badges");
    badgesEl.innerHTML = "";
    const status = data.status || "stable";
    badgesEl.appendChild(makeBadge(status, "status-" + status));
    const tier = data.trust_tier || "unverified";
    badgesEl.appendChild(makeBadge(tier.replace(/-/g, " "), "trust-" + tier));
    if (data.stale) {
      const label = data.stale_after ? `stale (since ${data.stale_after})` : "stale";
      badgesEl.appendChild(makeBadge(label, "stale"));
    } else if (data.stale_after) {
      badgesEl.appendChild(makeBadge(`stale after ${data.stale_after}`, "fresh"));
    }

    document.getElementById("detail-generated").textContent = formatActorEvent(data.generated);

    const verifiedEl = document.getElementById("detail-verified");
    const verified = data.verified || [];
    verifiedEl.textContent = verified.length
      ? verified.map(formatActorEvent).join("; ")
      : "—";

    const sourcesEl = document.getElementById("detail-sources");
    sourcesEl.innerHTML = "";
    const sources = data.sources || [];
    if (sources.length) {
      const ul = document.createElement("ul");
      ul.className = "sources-list";
      for (const s of sources) {
        const li = document.createElement("li");
        const label = s.title || s.resource || s.id || "source";
        if (s.resource && /^https?:\/\//.test(s.resource)) {
          const a = document.createElement("a");
          a.href = s.resource;
          a.textContent = label;
          a.target = "_blank";
          a.rel = "noopener";
          a.className = "external";
          li.appendChild(a);
        } else {
          li.textContent = s.resource ? `${label} (${s.resource})` : label;
        }
        ul.appendChild(li);
      }
      sourcesEl.appendChild(ul);
    } else {
      sourcesEl.textContent = "—";
    }

    const body = bundle.bodies[conceptId] || "";
    const bodyEl = document.getElementById("detail-body");
    bodyEl.innerHTML = marked.parse(body, { breaks: false, gfm: true });
    rewriteInternalLinks(bodyEl, dirOf(conceptId));

    const bl = backlinks[conceptId] || [];
    const blSection = document.getElementById("detail-backlinks");
    const blList = document.getElementById("backlinks-list");
    blList.innerHTML = "";
    if (bl.length) {
      blSection.hidden = false;
      for (const src of bl) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = nodeIndex[src]?.label || src;
        a.dataset.target = src;
        a.addEventListener("click", () => showDetail(src));
        li.appendChild(a);
        const muted = document.createElement("span");
        muted.className = "muted";
        muted.textContent = ` (${src})`;
        li.appendChild(muted);
        blList.appendChild(li);
      }
    } else {
      blSection.hidden = true;
    }

    cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 1.0) }, { duration: 200 });
  }

  function makeBadge(text, cls) {
    const span = document.createElement("span");
    span.className = "badge " + cls;
    span.textContent = text;
    return span;
  }

  function formatActorEvent(event) {
    if (!event || !event.by) return "—";
    return event.at ? `${event.by} · ${event.at}` : String(event.by);
  }

  // Resolve a markdown href against the directory of the document it appears
  // in, covering both link forms in §6.1 plus the bare `subdir/` entries an
  // index.md uses.
  function resolveTarget(href, baseDir) {
    let path = href.startsWith("/")
      ? href.slice(1)
      : (baseDir ? baseDir + "/" : "") + href;

    const parts = [];
    for (const part of path.split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part);
    }
    path = parts.join("/");

    // `subdir/` and `subdir` both name that directory's index.
    return path.endsWith(".md") ? path.slice(0, -3) : path + "/index";
  }

  function rewriteInternalLinks(root, baseDir) {
    root.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.includes("://") || href.startsWith("#")) {
        markExternal(a);
        return;
      }

      const target = resolveTarget(href, baseDir || "");
      const navigate =
        nodeIndex[target] ? () => showDetail(target)
        : reserved[target] ? () => showReserved(target)
        : null;

      if (!navigate) {
        markExternal(a);
        return;
      }
      a.className = "internal";
      a.setAttribute("href", "javascript:void(0)");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        navigate();
      });
    });
  }

  function markExternal(a) {
    a.className = "external";
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  }

  function dirOf(id) {
    const cut = id.lastIndexOf("/");
    return cut === -1 ? "" : id.slice(0, cut);
  }

  // The bundle's front page is its root index, so the header title returns to
  // it the way a site logo does.
  if (reserved[ROOT_INDEX]) {
    const heading = document.getElementById("bundle-name");
    heading.classList.add("home");
    heading.title = "Back to the bundle index";
    heading.addEventListener("click", () => showReserved(ROOT_INDEX));
  }

  // Open on the root index if there is one — it is written to be read first.
  // Otherwise fall back to the most-cited concept, which in a wiki is reliably
  // the one everything else hangs off.
  if (reserved[ROOT_INDEX]) {
    showReserved(ROOT_INDEX);
  } else {
    const initial = bundle.nodes
      .slice()
      .sort((a, b) =>
        (backlinks[b.data.id] || []).length - (backlinks[a.data.id] || []).length
      )[0];
    if (initial) showDetail(initial.data.id);
  }
})();
