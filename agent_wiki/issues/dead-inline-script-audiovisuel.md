---
type: Issue
title: The inline script in audiovisuel never runs, and five buttons call into it
description: Angular strips script elements from component templates, so openPopup/closePopup do not exist and every close button throws a ReferenceError.
tags: [angular, javascript, p1, live-bug, resolved]
resource: /src/app/audiovisuel/audiovisuel.component.html
status: deprecated
priority: P1
verification: resolved
generated: { by: claude-code/opus-5, at: 2026-08-26T19:45:00Z }
verified: { by: human:alexp, at: 2026-08-26T21:05:00Z }
sources:
  - id: review
    resource: /references/review-audit-2026-08.md
    title: Code review, 2026-08-21
---

**Resolved 2026-08-26, session 2.** The `<script>` block and all five
`onclick="closePopup()"` attributes are gone, and so are the five
`popup-container` blocks they belonged to — each one held an empty YouTube
iframe that nothing could ever open. That also removed 5 duplicate
`popup-container` ids and 5 duplicate `youtube-iframe` ids; see
[duplicate DOM ids](/issues/duplicate-dom-ids.md), which is now down to the
SVG boilerplate and `education`.

# Symptom

Clicking the "X" on a project popup throws
`Uncaught ReferenceError: closePopup is not defined`.

# Evidence

`audiovisuel.component.html:473-499` contains a `<script>` block defining
`openPopup(videoId)` and `closePopup()`.

**Angular's template compiler strips `<script>` elements from component
templates** as a security measure. The code never executes — there is no way to
make it execute from there.

Downstream, all live:

* `onclick="closePopup()"` appears **5×**, at lines 35, 88, 150, 202 and 264.
  Every one throws.
* `openPopup()` is never called from anywhere regardless: the "Voir la vidéo"
  buttons are plain `<a target="_blank">` links to YouTube.
* Even if the block ran, `document.getElementById('popup-button')` is `null`
  and `document.querySelector('.close')` is `null` on this page — two more
  throws at parse time.

# Fix

Delete lines 473–499, the five `onclick="closePopup()"` attributes, and the
dead `#popup-container` blocks that go with them (which also removes five
duplicate ids — see [duplicate DOM ids](/issues/duplicate-dom-ids.md)).

If an in-page video modal is wanted later, it is a component method:

```html
<button (click)="openVideo(p.youtubeId)">Voir la vidéo</button>
```

not inline JS. That requires the component class to stop being empty — see
[empty component classes](/issues/empty-component-classes.md).

# Related

* [AudiovisuelComponent](/components/audiovisuel-page.md)
