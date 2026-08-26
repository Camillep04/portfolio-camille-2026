# Code review — portfolio-camille-2026

Review date: 2026-08-21 · Branch reviewed: `develop` (identical to `main`, 346b294)

Context for the priorities below: your workflow is **add a project/experience → implement → test locally → merge to `main` → push → Netlify deploys**. Findings are ordered so that the things blocking or silently corrupting that loop come first.

> Note: I did **not** run `ng build` or `ng test` during this review (the build was declined), so items marked *(verify)* are read from the config/source rather than observed. Everything else is confirmed by reading the files.

---

## P0 — Blocks or silently breaks your workflow

### 1. `ng test` cannot pass — the default spec still asserts Angular starter values

`src/app/app.component.spec.ts:19` and `:26` still test the scaffolded app:

```ts
expect(app.title).toEqual('PortfolioAngular');           // actual: 'Camille Portfolio'
expect(compiled.querySelector('h1')?.textContent)
  .toContain('Hello, PortfolioAngular');                 // actual: no <h1> in app.component.html
```

`app.component.ts:14` sets `title = 'Camille Portfolio'`, and `app.component.html` is just header/outlet/footer — no `<h1>`. **Two tests fail on a clean checkout.** Your "test everything locally to make sure nothing broke" step therefore either always red (so you learn to ignore it) or you skip it. Either way you have no regression net.

Fix: delete the two stale assertions (keep `should create the app`), or assert the real title.

Also add a CI-friendly script, because `ng test` opens a browser and never exits:

```json
"test": "ng test",
"test:ci": "ng test --watch=false --browsers=ChromeHeadless"
```

### 2. The GitHub Actions workflow fails on every push to `main`

`.github/workflows/*` deploys to **Deno Deploy**, which is not how this site ships (Netlify is). It is broken three ways:

- `npm install -g @angular/cli@17` while the project is Angular **18.1** → version mismatch.
- It never runs `npm ci` / `npm install`, so `ng build` runs with no `node_modules`.
- `entrypoint: "main.ts"` at repo root — that file does not exist (it's `src/main.ts`).

Every merge to `main` produces a red X. Delete the workflow, or replace it with a real check (build + headless tests on PR). This is the single highest-value change for your workflow, because a *working* CI on PRs to `main` is what would actually catch the regressions you're testing for by hand.

### 3. The `anyComponentStyle` budget has no headroom, and it grows every time you add a project *(verify)*

`angular.json` sets both warning and error to the same value:

```json
{ "type": "anyComponentStyle", "maximumWarning": "6kB", "maximumError": "6kB" }
```

`src/app/audiovisuel/audiovisuel.component.css` is already **7,597 bytes** raw. Minification may bring it under 6 kB today, but there is *no warning band* — the build goes straight from OK to hard failure with no advance notice, and `audiovisuel.component.css` is exactly the file that grows when you add a project.

Fix: give yourself a warning band, e.g. `maximumWarning: "8kB"`, `maximumError: "16kB"`. Run `npm run build` once to see the current real number.

### 4. `develop` exists only on your machine

`git ls-remote origin` shows only `refs/heads/main`. Your working branch is not backed up anywhere. `git push -u origin develop` once.

---

## P1 — Bugs that are live on the site right now

### 5. jQuery is loaded three times, and the *oldest* copy wins

`src/index.html`:

```html
<script src="js/jquery.js"></script>                                  <!-- jQuery 2.2.4 -->
...all plugins register against 2.2.4...
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>  <!-- line 36 -->
```

Line 36 loads **jQuery 1.9.1 last**, replacing `window.jQuery` and `window.$` *after* Bootstrap, bootsnav, sticky, appear, owl and magnific-popup have all attached themselves to the 2.2.4 object. Any plugin call that resolves `$` at `document.ready` time (e.g. `public/js/popup.js`) now runs against a bare 1.9.1 with none of those plugins → `TypeError: $(...).magnificPopup is not a function`.

Also: the `//` protocol-relative URL is a legacy pattern, and jQuery 1.9.1 (2013) has known XSS advisories.

**Delete line 36.** Nothing needs it.

### 6. The magnific-popup script 404s

```html
<script src="src/app/assets/magnific-popup/jquery.magnific-popup.js"></script>
```

That path doesn't exist. The real file is `src/assets/magnific-popup/dist/jquery.magnific-popup.js` — and `src/assets` is **not** in `angular.json`'s `assets` array (only `public` is), so it is never emitted to the build output at all. The `<script>` 404s in dev and in production, and `public/js/popup.js` then throws.

Fix: either move the one file you need into `public/js/`, or delete both the script tag and `popup.js`. See also #21 — the whole vendored repo should go.

### 7. Four stylesheets ship but are never linked — Font Awesome icons are invisible

`public/css/` contains `font-awesome.min.css`, `animate.css`, `responsive.css`, `owl.carousel.min.css`, `owl.theme.default.min.css`. `index.html` links **only** `flaticon.css`, `bootstrap.min.css`, `bootsnav.css`, `style.css`.

Consequences:
- `<i class="fa fa-circle">` — 8 uses in `accueil.component.html`, 5 in `contact.component.html` — render as nothing. Your timeline dots and the contact social row are blank.
- `animated fadeInUp` / `fadeInDown` classes applied by `custom.js` do nothing.
- **`responsive.css` is not loaded**, so all the `@media` rules for the nav, `.welcome-hero` height, and the timeline layout are missing on tablet/mobile.

Fix: link them, or (better, see #8) drop Font Awesome in favour of the `bootstrap-icons` you already have in `package.json`.

### 8. Four different Bootstrap versions are fighting

| Where | Version |
|---|---|
| `public/css/bootstrap.min.css` | **3.3.6** |
| `public/js/bootstrap.min.js` | **3.3.7** |
| CDN link in `index.html:15` | **4.0.0** (loaded last, so it wins on CSS) |
| `bs5-lightbox` CDN, `index.html:38` | expects **5.x** |
| `bootstrap@5.3.3` + `bootstrap-icons` in `package.json` | **never imported** — `src/styles.css` is empty |

Real consequences in the markup:
- `accueil.component.html:140` uses `gap-4` — **Bootstrap 5 only**. Silently ignored → the two "ticket" cards have no gap.
- `accueil.component.html:408` uses `row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5` — added in **Bootstrap 4.4**, and the CDN is pinned to **4.0.0**. Silently ignored → the polaroid row does not grid the way you wrote it.
- `photo.component.html` uses BS3/4 modal markup (`data-toggle`, `data-dismiss`, `.close`) which only works because BS3's JS is what's actually running.
- `bs5-lightbox` is inert (no BS5 present).

Fix (one afternoon, big payoff): commit to **Bootstrap 5**, which you already have installed. Add to `angular.json`:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.css"
],
"scripts": ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"]
```

then delete the CDN links and the local BS3 files, and migrate `data-toggle` → `data-bs-toggle`, `data-dismiss` → `data-bs-dismiss`, `.close` → `.btn-close`, `mr-*` → `me-*`. This also lets you drop jQuery entirely once bootsnav is replaced.

### 9. The `<script>` block in `audiovisuel.component.html` never runs — and the close button throws

`src/app/audiovisuel/audiovisuel.component.html:473-499` contains inline JS defining `openPopup()` / `closePopup()`. **Angular's template compiler strips `<script>` elements from component templates** for security. That code never executes.

Downstream:
- `onclick="closePopup()"` appears 5× (lines 35, 88, 150, 202, 264). Clicking the "X" → `Uncaught ReferenceError: closePopup is not defined`.
- `openPopup()` is never called from anywhere anyway — the "Voir la vidéo" buttons are plain `<a target="_blank">` to YouTube.
- Even if it ran, line 490 `document.getElementById('popup-button')` is `null` → `TypeError` on the next line, and line 495 `document.querySelector('.close')` is `null` on this page.

Fix: delete lines 473-499 and the 5 `onclick="closePopup()"` attributes plus the dead `#popup-container` blocks. If you want a real in-page video modal later, do it as a component method with `(click)="openVideo(id)"`, not inline JS.

### 10. Duplicate DOM ids everywhere

| id | occurrences | file |
|---|---|---|
| `exampleModalLongTitle` | **35** | `photo.component.html` |
| `youtube-iframe` | **10** | `audiovisuel.component.html` |
| `popup-container` | **5** | `audiovisuel.component.html` |
| `education` | **2** | `accueil.component.html` (lines 200, 324) |

Invalid HTML; `getElementById` always returns the first one, and `aria-labelledby="modalPhotoTitle"` on every modal points at an id that **doesn't exist at all** (the actual title id is `exampleModalLongTitle`). Screen readers announce nothing. Fix by templating (see #16) so ids are generated per item.

### 11. Every internal link is a full page reload

Zero uses of `routerLink` in the whole app. All 16 internal links are plain `href`:

- `header.component.html:15-17` → `/audiovisuel`, `/photo`, `/contact`
- `header.component.html:14` → `href="index.html"` (only works because of the Netlify catch-all redirect)
- `accueil.component.html` → 11 more

Each click tears down the Angular app and re-downloads everything. Fix:

```html
<a routerLink="/audiovisuel" routerLinkActive="active">Projets</a>
```

and add `RouterLink, RouterLinkActive` to the component `imports: []` (currently empty in every component). Keep plain `href` only for the CV PDF and external links.

---

## P2 — Performance

### 12. 34 MB of images, served at full resolution

```
public/img            34 MB
  portfolio/          27 MB
  galerie/           4.8 MB
```

Worst offenders: `portfolio/clip_mmi.jpg` **4.4 MB**, `portfolio/wg.png` **3.2 MB**, `portfolio/affiche-stand.png` **2.2 MB**, `portfolio/mf.png` 1.9 MB, `img/20.jpg` 1.3 MB.

And **`public/favicon.ico` is 2.1 MB** — that downloads on every single page view for a 16×16 icon. Regenerate it at ≤ 15 kB.

Other wins:
- `photo.component.html` renders **35 gallery JPEGs plus 35 full-size duplicates inside the modals** = ~70 image requests, all eager. Add `loading="lazy"` at minimum.
- You already produce `.webp` for two images (`20.webp`, `camille.webp`) but not for the 27 MB portfolio folder. Convert them, or use `NgOptimizedImage` (`ngSrc` + `width`/`height`) which gives you lazy-loading, `srcset` and LCP priority for free.
- Several images exist as both `.jpg` and `.png` (`clip_mmi`, `inlive-sport`, `mmi`) — dedupe.

### 13. `docs/` is 38 MB of stale committed build output

128 tracked files, last touched 2026-01-20, while your source has changed through 2026-06-30. Netlify publishes `dist/portfolio-angular/browser` (per `netlify.toml`), so `docs/` is dead weight that doubles the clone size and shows up in every `git grep`. Delete it and add `/docs` to `.gitignore`.

### 14. Render-blocking script soup

10 `<script>` tags at the end of `<body>`, none with `defer`, including Modernizr 2.8.3 (2014) from a CDN which nothing in the codebase queries. Every CDN host is an extra DNS+TLS handshake and a third-party availability dependency. After #8 most of these can simply go.

---

## P3 — Maintainability (this is what will save you time on every update)

### 15. Adding a project means copy-pasting ~60 lines of SVG-heavy HTML — this is the root cause of most bugs above

Your stated workflow is "add a new experience or project." Today that means:

- **A project** → duplicate a `<section>` in `audiovisuel.component.html` (~60 lines, containing two inline SVGs of ~15 lines each, a dead popup block, and a hand-incremented `id="filmN"`), then *maybe* also touch `accueil.component.html`.
- **A photo** → duplicate ~25 lines in `photo.component.html` twice (thumbnail + modal), hand-increment `modalPhotoN`. The file is **958 lines**.
- **An experience** → duplicate ~22 lines of timeline markup in `accueil.component.html`.

That's why there are 35 duplicate ids, why the SVG paths are repeated 10+ times, and why `audiovisuel.component.css` keeps creeping toward the budget ceiling.

**Recommended refactor.** Move content to typed data and render with Angular's control flow. One file to edit per new item, no markup to copy:

```ts
// src/app/data/projects.ts
export interface Project {
  id: string;
  title: string;
  year: number;
  kind: 'video' | 'web' | '3d';
  description: string;
  image: string;
  link: string;
  linkLabel: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'athlete-reve',
    title: 'À vos marques : Athlète quel est ton rêve ?',
    year: 2024,
    kind: 'video',
    description: 'Mini web documentaire sur des athlètes calédoniennes atteintes de surdité…',
    image: 'img/portfolio/affiche-stand.png',
    link: 'https://www.youtube.com/watch?v=yZl2QbWaGJA',
    linkLabel: 'Voir la vidéo',
  },
  // adding a project = adding an object here
];
```

```html
<!-- audiovisuel.component.html -->
@for (p of projects; track p.id; let even = $even) {
  <section [id]="p.id" [class.reversed]="even">
    <app-project-card [project]="p" />
  </section>
}
```

Do the same for `GALLERY` (photos), `EXPERIENCES` and `EDUCATION`. The 958-line photo template collapses to ~30 lines plus a `PHOTOS` array; the two accueil timelines collapse to one `@for`. Extract the repeated play/heart/social SVGs into small icon components or a single `<svg><use>` sprite.

**Payoff for your workflow:** a new project becomes a 9-line object in one `.ts` file, it's type-checked at build time (a missing field fails `ng build` instead of rendering blank), and you can write a real regression test — `expect(fixture.debugElement.queryAll(By.css('section')).length).toBe(PROJECTS.length)` — that actually protects you when you merge to `main`.

### 16. Every component class is an empty shell

`AccueilComponent`, `PhotoComponent`, `AudiovisuelComponent`, `ContactComponent`, `HeaderComponent`, `FooterComponent` — all six have an empty body and `imports: []`. All logic lives in global jQuery files in `public/js/` that operate on the DOM behind Angular's back (`custom.js` binds on `$(document).ready`, which fires **before** Angular renders the routed component — so scroll-spy, sticky header and progress bars are binding against elements that don't exist yet, and never rebind on navigation).

This is the deeper reason the site "works" only on a hard reload of each page. Moving behaviour into components (or at least into `ngAfterViewInit`) fixes it.

### 17. `app.component.css` is 200 lines of untouched Angular starter boilerplate

`--bright-blue`, `--electric-violet`, `.pill`, `.angular-logo` … none of it is used by your markup. The `:host` block does leak a `font-family: Inter` and `box-sizing: border-box` onto `app-root`. Delete the file (and `public/angular.ico`, `docs/angular.ico`).

### 18. `src/assets/magnific-popup/` is a whole vendored upstream repo

1.1 MB including its own `jquery.js`, QUnit, Gruntfile, `.travis.yml`, and the plugin's marketing website. It is not in `angular.json`'s asset globs, so none of it ships — it's pure repo weight. Delete it (see #6).

### 19. No linter, no formatter

No ESLint, no Prettier, no `.editorconfig` enforcement beyond indentation. `ng add @angular-eslint/schematics` plus a `format` script would have caught the duplicate ids, the missing `alt`s, and the empty `imports: []` arrays automatically.

### 20. The `Dockerfile` is broken and unused

Every comment line is missing its `#` prefix (`Step 1: Build the Angular app`, `Set the working directory…`) — Docker parses them as instructions and the build fails immediately. It also copies `/app/dist/your-angular-project-name`, a placeholder that was never filled in. You deploy via Netlify; delete the file.

### 21. All specs are unmodified `should create` stubs

Six spec files, six identical "should create" tests, zero assertions about your actual content. Combined with #1, `ng test` currently gives you negative value. After #15, write 3-4 tests that mean something (route renders, project count matches data, nav links resolve).

---

## P4 — SEO, accessibility, content

### 22. `<html lang="en">` on an entirely French site
`src/index.html:2`. Screen readers use the wrong pronunciation engine; search engines mis-classify the page. Change to `lang="fr"`.

### 23. No meta description, no Open Graph, no per-route title
`index.html` has `<title>Camille Portfolio</title>` and nothing else. For a portfolio you share on LinkedIn/Instagram, this matters:
- Add `<meta name="description">`, `og:title`, `og:description`, `og:image`, `twitter:card`.
- Set a per-route title with `title` on the route config + `provideRouter(routes, withRouterConfig(...))`, so `/photo` isn't titled the same as `/contact`.
- Add `robots.txt` and a small `sitemap.xml` to `public/`.

### 24. Missing and empty `alt` text
13 `alt=""` on content images in `accueil`/`audiovisuel`, plus images with **no** `alt` at all (`img/camera.png` ×5, `img/3d.png` ×3, `img/vecteur.png`, `img/menu.png` in the header, `img/monter.png` in the footer). All 35 gallery images share the same `alt="portfolio image"`. Purely decorative icons should be `alt=""` *deliberately*; the photos and posters need real descriptions.

### 25. The contact form overflows on mobile
`contact.component.html:18` embeds the Google Form at a hard-coded `width="440" height="990"`. On a 375 px phone it forces horizontal scroll. Use `style="width:100%;max-width:440px;border:0"` and add a `title` attribute (required for iframe accessibility). Same for the YouTube iframe in `accueil.component.html:67` — it has a `title`, good, but no responsive wrapper beyond `.video-wrapper`.

### 26. Placeholder content still shipping on the contact page
`contact.component.html:57-63` — a `.hm-foot-icon` list of five template social links all pointing at `href="#"` (Facebook, Dribbble, Twitter, LinkedIn, Instagram), duplicating the real links you added just above. And the section heading is `<h2>contact me</h2>` — English, lowercase, on an otherwise French page.

Related: `accueil.component.html:10` nests `<h1 class="writing">` **inside** an `<h2>` inside a `<span>` — invalid, and it means your only `<h1>` on the homepage is a JS-animated word ("vidéo", "photo", …) rather than your name.

### 27. No wildcard route
`app.routes.ts` has 4 routes and no `{ path: '**' }`. Netlify rewrites every unknown URL to `index.html`, so a typo'd URL renders header + footer + **blank middle** rather than a 404. Add a catch-all redirecting to `''`.

### 28. Dead commented-out markup
`accueil.component.html:465-500` (4 polaroid blocks), `audiovisuel.component.html:37`, `:90`, `:152` etc., `public/js/popup.js:1-11`. Git remembers; delete it.

### 29. Netlify config nits
- `netlify.toml` runs `command = "ng build"` — depends on `ng` being on PATH. `npm run build` is the portable form.
- `public/_redirects` and the `[[redirects]]` block in `netlify.toml` do the same thing. Keep one (`netlify.toml`).
- `angular.json`'s **test** target maps `public` → `/assets`, while the app references images at `img/…` (root). Any test that renders a template gets 404s in the Karma console. Align it with the build target's mapping.

---

## Suggested order of work

**Session 1 — make the safety net real (half a day)**
1. Fix `app.component.spec.ts` (#1) and add `test:ci` (#1).
2. Delete the Deno workflow; add a PR check running `npm ci && npm run build && npm run test:ci` (#2).
3. Widen the style budget (#3). Push `develop` to origin (#4).

**Session 2 — kill the live bugs (half a day)**
4. Delete the second jQuery (#5) and the 404'ing magnific-popup script (#6).
5. Link the missing stylesheets or migrate to Bootstrap 5 (#7, #8).
6. Delete the dead `<script>` block and `onclick="closePopup()"` (#9).
7. Convert internal links to `routerLink` (#11).

**Session 3 — weight (a couple of hours)**
8. Regenerate the favicon, compress `public/img`, add `loading="lazy"` (#12).
9. `git rm -r docs` (#13). Delete `src/assets/magnific-popup`, `Dockerfile`, `app.component.css` (#17, #18, #20).

**Session 4 — the refactor that pays for itself (1-2 days)**
10. Extract `PROJECTS` / `PHOTOS` / `EXPERIENCES` / `EDUCATION` to typed data + `@for` (#15). Everything after this is a one-object edit.

**Ongoing**
11. Lint/format (#19), SEO + a11y pass (#22-#26).
