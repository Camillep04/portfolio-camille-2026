# Components

One concept per real module or subsystem, each bound to what it describes with
a `resource` pointing at the path in the repository. This is the layer that
goes stale fastest, so a component concept says what the module is *for* and
what its contract is — not a line-by-line account of code that git already
tracks.

Use `type: Component`.

# The Angular app

* [AppComponent (app-root)](app-root.md) - The header / outlet / footer frame.
* [HeaderComponent](header.md) - The bootsnav navbar and its five links.
* [FooterComponent](footer.md) - Copyright line and scroll-to-top.

# Pages

* [AccueilComponent](accueil-page.md) - `/` — hero, bio, skills, two timelines, photo teaser.
* [AudiovisuelComponent](audiovisuel-page.md) - `/projets` — ten projects from `PROJECTS`, `@for` sections, clickable hearts.
* [PhotoComponent](photo-page.md) - `/photo` — 35-photo masonry over one Angular lightbox with carousel arrows.
* [ContactComponent](contact-page.md) - `/contact` — an embedded Google Form, the only contact channel.

# State

* [FavouritesService](favourites-service.md) - Private per-visitor hearted projects, in `localStorage`.

# The static layer

* [index.html](index-html.md) - Where every global script and stylesheet is loaded, in a broken order.
* [public/ static assets](public-assets.md) - The only directory copied into the build: 34 MB of images plus the legacy theme.
