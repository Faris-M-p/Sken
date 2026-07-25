# The Covenant

A luxury traditional Christian wedding invitation for **Melvina Varghese &
Royal Wilson**, 23 August 2026.

The site is built as an invitation *book* rather than a web page. It opens as
two doors of handmade paper held shut by a wax seal; break the seal and the
leaves part left and right. Every scroll after that turns to the next page.
There is no church imagery, no couple photography and no floral template — the
whole thing is handmade paper, gold foil, white lilies, olive branches and
candlelight.

## Running it

There is nothing to build. Serve the folder over HTTP:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight from disk mostly works, but the Google Map
embed needs `http://`.

### Optional: the photographic artwork

Every page draws its own sheet of paper in CSS — tinted cream, candle glow and
a woven fibre grain — so the site is complete and finished with no images at
all. The eleven illustrations layer *on top* of that paper as enrichment.

To add them:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-images.ps1
```

That copies `page-01-cover.png` … `page-11-thankyou.png` into `assets/img/`.
See `assets/img/README.md` for the file list and for converting to WebP.

## Structure

```
index.html          all content, all eleven pages, the ornament sprite
css/base.css        design tokens, reset, typography, paper ambience
css/layout.css      the leaf column, page scaffolding, blending, cards, doors
css/sections.css    per-page composition
js/ui.js            icons, countdown, on-demand map, candlelight dust
js/motion.js        smooth scroll, the parting of the doors, reveals
assets/img/         the eleven page illustrations
```

No build step, no framework. HTML5, CSS3 and ES6, with GSAP + ScrollTrigger,
Lenis, SplitType and Lucide loaded from CDN.

## Editing the content

Everything a family would want to change lives in `index.html`, in reading
order, under a comment banner per page. In particular:

| What | Where |
| --- | --- |
| Names, parents, addresses | Page 4 — `.card--invite` |
| Dates, times, venues | Pages 6, 7, 8 — the `.detail` lists |
| Countdown target | `data-countdown="2026-08-23T12:05:00+05:30"` on page 5 |
| Map destinations | the `href` on each `.btn`, and `data-map` on page 9 |
| Which illustration a page uses | `--art:url(...)` on each `.page__media` |

## How the pages hold together

The brief asked for one continuous experience rather than a stack of coloured
pages, so:

- **One sheet of paper.** A single fixed `.ambience` layer — vertical cream
  wash, four candle glows, an SVG grain and paper fibres — sits behind
  everything and never scrolls away.
- **No hard edges.** Every page fades to the same cream at top and bottom via
  `.page__veil`, so consecutive sections dissolve into one another instead of
  meeting at a border.
- **A seam, not a break.** Between pages a gold hairline with an alternating
  lily or cross ornament straddles the join.
- **Two widths, and only two.** `--leaf` is the sheet a page is printed on;
  `--shell` is the column the words sit in. Every page uses both, and nothing
  declares a width of its own, so the edges never shift as you scroll. Each
  leaf also fades out at its own left and right edges, so the sheet dissolves
  into the surrounding cream instead of showing a vertical line.
- **A silk marker.** A thin gold ribbon down the left edge fills as you read.

## Motion

Reveals are choreographed one per page rather than one per element, using
seven techniques so nothing repeats: characters settling, lines rising,
tracked capitals drawing together, gold rules drawn from their centre,
ornaments blooming, paper unmasked from the top, and a plain rise. Artwork
parallaxes behind the words. Everything animates `transform`, `opacity` and
`clip-path` only.

`prefers-reduced-motion: reduce` disables Lenis, the parallax, the dust and
every reveal — the whole book is simply present, and the seal opens on a tap.

## Graceful degradation

- **No JavaScript** — the doors stop being a fixed gate and become the first
  scrollable page. Every word is in the HTML.
- **CDN blocked** — `motion.js` drops the `.motion` flag, which switches off
  every reveal start-state at once, so the page can never be left blank.
- **No artwork** — nothing is lost but the photographs. Each page's paper,
  tint, grain and candle glow are all CSS.
