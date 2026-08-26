---
type: Component
title: FooterComponent
description: Copyright line plus the scroll-to-top button, whose behaviour lives in legacy jQuery rather than in the component.
tags: [component]
resource: /src/app/footer/footer.component.html
status: stable
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
---

# What it is for

14 lines: a centred copyright line (`© Réalisé par Camille PROTHIN - 2026`) and
a scroll-to-top control. Empty class, empty CSS file (0 lines).

# The scroll-to-top coupling

```html
<div id="scroll-Top">
  <div class="return-to-top">
    <img src="img/monter.png" class="pb-3">
  </div>
</div>
```

This markup is inert on its own. Its behaviour — fade in past 600 px of scroll,
animate back to top on click — is bound in `public/js/custom.js` against
`.return-to-top`, at `$(document).ready`.

That is the [two-layer seam](/architecture/two-layer-frontend.md) in miniature:
the element is Angular's, the behaviour is jQuery's, and the binding happens
before Angular renders. The footer happens to survive this because it is inside
[AppComponent](/components/app-root.md) rather than a routed component, so it
renders early — but it is still a coupling nothing in the component declares.

# What surprises you

* `img/monter.png` has **no `alt`**. See [missing alt text](/issues/missing-alt-text.md).
* The copyright year is hard-coded to 2026.
* `footer.component.css` is empty; all styling comes from the theme's
  `.footer-copyright` rules in `public/css/style.css`.

# Related

* [HeaderComponent](/components/header.md)
* [public/ static assets](/components/public-assets.md)
