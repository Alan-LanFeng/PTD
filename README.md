# Parametric Trajectory Distillation (PTD)

Few-step distillation for video and sound.

| | |
|---|---|
| Project page | [`docs/`](docs/) (not published yet) |
| Paper | coming soon |
| Code | coming soon |
| Weights | coming soon |

## Repository layout

- `docs/`: the project website. It is a static site with relative paths only and no external requests, so GitHub Pages can serve it as is
  (Settings → Pages → Deploy from a branch → `main` / `docs`). Turning Pages on publishes the site to anyone with the URL, even while this
  repository is private (and Pages on a private repository needs a paid plan), so leave it off until the checklist below is done.

The code will be added here later.

## Preview the website locally

Open `docs/index.html` directly, or serve the folder:

```bash
npx http-server docs -p 8000
```

Then open http://localhost:8000. `python3 -m http.server` also serves the page, but it does not support byte-range requests, so the film's
chapter buttons and scrubbing jump back to 0:00 there. GitHub Pages supports range requests, so the published site is not affected.

## Before making the repository or the site public

- Fill in the author list in the page header in `docs/index.html`. The comment there shows the markup.
- Turn on the Code and Weights buttons: add `href`, remove `role` and `aria-disabled`, and drop the "Coming soon" tag.
- Rewrite the BibTeX entry in the Citation section of the page: the cite key `anonymous2026ptd`, `author = {Anonymous}` and
  `note = {Under review}`, with the final paper title and venue or arXiv id.
- Remove `<meta name="robots" content="noindex,nofollow">` from `docs/index.html` if the page should be indexed by search engines.
- Make `og:image` an absolute URL of the published site (for example `https://alan-lanfeng.github.io/PTD/media/film/og.jpg`) so that link
  previews show the image, and consider adding `og:url` and `<meta name="twitter:card" content="summary_large_image">`.
- Add a `LICENSE`. The fonts are under the SIL Open Font License and the film music under the Mixkit Stock Music Free License (credited in
  the page footer).
- Note that `docs/media/film/ptd-film.mp4` is 87 MiB. GitHub accepts files up to 100 MiB but warns above 50 MiB; keep it out of Git LFS,
  because GitHub Pages does not serve LFS files.
