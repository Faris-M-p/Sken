# Vishnu &amp; Amruthanath — Wedding Invitation

A mobile-first, cinematic single-page invitation for a traditional Kerala Hindu
wedding. Plain HTML5, CSS3 and vanilla JavaScript — no framework, no build step,
no runtime dependency other than two Google Font families.

```
index.html
css/style.css
js/particles.js     canvas particle field + THANK YOU finale
js/main.js          flow controller, reveals, countdown
assets/             images + video  (see assets/README.md)
setup-assets.ps1    one-shot copier for the supplied assets
```

## Run it

The video and the canvas both need a real HTTP origin, so open it through a
server rather than double-clicking the file.

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-assets.ps1
python -m http.server 8080
```

Then visit <http://localhost:8080>. Any static server works — `npx serve`,
VS Code Live Server, or dropping the folder on Netlify / Cloudflare Pages.

## The flow

Landing cover (scroll locked) → tap **Open Invitation** → the reveal video plays
full screen with no chrome → on `ended` it cross-fades into the hero, scroll
unlocks, and the journey continues through Details, Story, Timeline, Bride &amp;
Groom, Parents, Ceremony, Reception, Venue, Gallery and the Thank You finale.

The golden particle field runs on one fixed canvas from the very first frame to
the footer. When the Thank You section is more than half in view the particles
stop drifting, converge onto a point cloud sampled from the words **THANK YOU**,
hold with a warm glow, then float upward and fade out. Scrolling back up resets
it so it can play again.

Safety valves, in case something goes wrong on a guest's phone: if the video
cannot autoplay it retries muted, a faint Skip appears after five seconds, and
a twelve-second watchdog jumps straight to the hero if the file never buffers.

## Editing content

Everything is literal text in `index.html` — no templating. The pieces you are
most likely to touch:

| What | Where |
|---|---|
| Hero typography (deliberately left empty) | `<div class="hero-typo">` in `index.html` |
| Google Maps links | the four `<a>` tags in `#ceremony`, `#reception`, `#venue` |
| Countdown target | `js/main.js`, the `new Date('2026-08-21T11:00:00+05:30')` line |
| Colours, spacing, fonts | the `:root` token block at the top of `css/style.css` |
| Particle density and finale timing | the constants at the top of `js/particles.js` |

The hero centre is intentionally blank. Add the headline typography inside
`.hero-typo` when the wording is final.

## Sample data

Anything not printed on the invitation card is marked in the page with a small
dashed **SAMPLE** pill so it cannot ship by accident. There is also a
`<section id="pending">` near the bottom listing every open item — **delete that
whole section before publishing.**

Still to confirm with the client:

- Engagement / nischayam date, time and venue
- The exact Google Maps pin behind the printed QR code, and the official English
  spelling of both venue names
- Couple portraits and gallery photographs
- The wedding story copy

Taken from the card and already correct: both names, both sets of parents, the
wedding date and muhurtham, the reception date and time, and the two phone
numbers.

## Accessibility &amp; performance

`prefers-reduced-motion` disables the canvas and every animation, and the Thank
You section falls back to real text. A `<noscript>` block skips the cover and
video entirely so the invitation is still readable. Images are lazy-loaded,
particle sprites are pre-rendered once and blitted, device pixel ratio is capped
at 1.75, and the loop pauses whenever the tab is hidden.
