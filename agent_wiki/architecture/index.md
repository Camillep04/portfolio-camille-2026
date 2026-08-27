# Architecture

How the system is put together: the layers, what talks to what, where state
lives, and what happens on a request or a run. Concepts here describe the shape
of the whole rather than any one module — a reader should be able to hold the
system in their head after reading this directory alone.

Use `type: Architecture`. Link down into [components/](../components/) for the
pieces and across to [decisions/](../decisions/) for why the shape is what it
is.

# Concepts

* [Two-layer frontend](two-layer-frontend.md) - An Angular 18 shell wrapped around a vendored jQuery template. **Read this first** — most defects live on that seam.
* [Angular application shell](angular-shell.md) - How the app boots, routes, and composes the four pages.
* [Build and deploy](build-and-deploy.md) - Netlify builds from `main` on every push; three other deploy configs are dead.
* [Content data layer](content-data-layer.md) - Photos, projects and CV timelines are typed arrays under `src/app/data/`, rendered with `@for`; array order is display order.
