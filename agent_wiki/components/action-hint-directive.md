---
type: Component
title: ActionHintDirective
description: Desktop-only pointer hint — a tiny label below a control that flags a click will leave the portfolio (external link or download).
tags: [component, angular, directive, ux, desktop]
resource: /src/app/ui/action-hint.directive.ts
status: stable
generated: { by: claude-code/sonnet-5, at: 2026-08-30T00:00:00Z }
---

# What it is for

Session 10, a new owner request (not on the [roadmap](/plans/remediation-roadmap.md)):
on desktop, hovering a control that takes the visitor *off* the portfolio
shows a short label saying so, before the click.

Scope is deliberately narrow — **only controls that leave the site**:

* external links (`target="_blank"`) → `hint.newTab` ("Nouvel onglet" / "New tab")
* file downloads (`download`) → `hint.download` ("Téléchargement" / "Download")

Everything that stays in the app is left unmarked: in-app routes (the hero CTA,
the ticket cards, the photo teasers, the nav links), the [lightbox](/components/photo-page.md),
the [in-site video player](/components/video-modal.md) (so `linkKind: 'video'`
project links get **no** hint), the favourite hearts, the scroll-to-top arrow.

# How it works

`[appActionHint]="'already-translated string'"` — a standalone attribute
directive. Empty / blank string = no hint (that is how
[`AudiovisuelComponent.linkHint()`](/components/audiovisuel-page.md) stays quiet
for video links).

* On `mouseenter` **or** `focus` it creates one `<div class="action-hint">`,
  appends it to `<body>`, and positions it `fixed` **below** the host's
  `getBoundingClientRect()`, centred and pulled back inside the viewport edges.
  `<body>`, not the host, so a clipped or `transform`ed ancestor can't hide it.
* On `mouseleave`, `blur` or `click` it removes the node. `click` matters:
  without it the tip would linger after an in-app navigation.
* `window:scroll` / `window:resize` re-position a live tip.
* `ngOnDestroy` removes any leftover node.

# Contract / gotchas

* **Pointer only.** The constructor reads
  `matchMedia('(hover: hover) and (pointer: fine)')` once; on touch the
  directive is inert.
* **`aria-hidden="true"`** on the node, `pointer-events: none`. Every host
  already carries visible text or an `aria-label`.
* **Styling is global** — `.action-hint` in `src/styles.css`, not a component
  stylesheet, because the node lives outside every component view.
  `font-size` is in **px, not rem** — the theme sets the root to 10px.
  `z-index: 10001` clears the fixed navbar (9999) and the
  [video modal](/components/video-modal.md) (10000). Entry animation is
  dropped under `prefers-reduced-motion`.
* **Copy lives in i18n** — `hint.newTab` / `hint.download` in `translations.ts`
  (fr + en), bound as `i18n.t('hint.…')` so the tip follows the language
  toggle. Kept as short as the owner asked — two words at most.

# Where it is applied

| Page / component | Controls |
|---|---|
| [Header](/components/header.md) | nav CV link (`hint.newTab` — opens the PDF in a tab) |
| [Accueil](/components/accueil-page.md) | three social icons, the CV download button |
| [Audiovisuel](/components/audiovisuel-page.md) | each project's image link + button via `linkHint()` — `hint.newTab` for `linkKind` `project` / `site`, blank for `video` |
| [Photo](/components/photo-page.md) | the Instagram CTA |
| [Contact](/components/contact-page.md) | the CV download button, three social icons |

# Related

* [VideoModalComponent](/components/video-modal.md) — why `linkKind: 'video'` gets no hint
* [`LanguageService`](/architecture/two-layer-frontend.md) — the `hint.*` keys
* [Remediation roadmap](/plans/remediation-roadmap.md)
