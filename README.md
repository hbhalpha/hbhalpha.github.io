# Bohan Hou — Personal Homepage

Static GitHub Pages site. No build step or frontend dependencies.

- `index.html`: profile, publication metadata, and the existing theme/filter behavior.
- `assets/refinement.css`: responsive research rows, visual polish, and dark-mode authorship/leadership highlights.
- `assets/refinement.js`: one-time positional reveals, interruptible publication filter transitions, and reading progress. Readable cards never fade back to transparent.
- `assets/interactions.js`: interruptible anchor scrolling, sliding navigation marker, pointer lighting, and reversible author-list disclosures.
- `assets/image-loader.js`: decode-aware image loading. Loaded images stay visible; loading and failure states retain their reserved frames.
- `assets/papers/`: original research figures. Responsive WebP previews in `thumbs/` link to these full-size originals. Keep the image width/height and source-set descriptors accurate when adding figures.

Motion respects reduced-motion preferences. Content remains visible without JavaScript. Preview requests begin early at low priority; the 17 paper previews total approximately 454 KB at 480 px or 1.24 MB at 960 px, compared with 9.37 MB of full-size originals.

Preview locally with `python -m http.server 8766`, then open `http://localhost:8766`.

## October 2026 papers and figure sources

- [RynnVLA-Latent](https://arxiv.org/abs/2610.34356): Figure 4, VLA pretraining/post-training architecture. Core-contributor markers follow the [official project page](https://alibaba-damo-academy.github.io/RynnVLA-Latent.github.io/).
- [RynnUnify](https://arxiv.org/abs/2610.32965): Figure 1, teaser. Core-contributor and project-leader markers follow the paper and [official project page](https://alibaba-damo-academy.github.io/RynnUnify.github.io/).
- [GPT-GEAR / Astra](https://arxiv.org/abs/2610.28259): Figure 1, teaser. Equal-contribution markers follow the [official project page](https://6uooon9.github.io/GPT-GEAR/).

After adding a publication, update the static filter counts as well as `data-topics` and `data-author-role`. Runtime counts are computed automatically. The `lead` authorship facet includes first authors, co-first authors, and explicitly marked core contributors; project leadership is a separate badge.
