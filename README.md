# Bohan Hou — Personal Homepage

Static GitHub Pages site. No build step or frontend dependencies.

- `index.html`: profile, publication metadata, and the existing theme/filter behavior.
- `assets/refinement.css`: responsive research rows, visual polish, and dark-mode authorship/leadership highlights.
- `assets/refinement.js`: entrance/scroll reveals, publication filter transitions, and reading progress. Respects reduced-motion preferences and keeps content visible without JavaScript.
- `assets/papers/`: original research figures. Thumbnails link to their full-size images.

Preview locally with `python -m http.server 8766`, then open `http://localhost:8766`.

## October 2026 papers and figure sources

- [RynnVLA-Latent](https://arxiv.org/abs/2610.34356): Figure 4, VLA pretraining/post-training architecture. Core-contributor markers follow the [official project page](https://alibaba-damo-academy.github.io/RynnVLA-Latent.github.io/).
- [RynnUnify](https://arxiv.org/abs/2610.32965): Figure 1, teaser. Core-contributor and project-leader markers follow the paper and [official project page](https://alibaba-damo-academy.github.io/RynnUnify.github.io/).
- [GPT-GEAR / Astra](https://arxiv.org/abs/2610.28259): Figure 1, teaser. Equal-contribution markers follow the [official project page](https://6uooon9.github.io/GPT-GEAR/).

After adding a publication, update the static filter counts as well as `data-topics` and `data-author-role`. Runtime counts are computed automatically. The `lead` authorship facet includes first authors, co-first authors, and explicitly marked core contributors; project leadership is a separate badge.
