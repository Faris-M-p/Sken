# Assets

Everything here is referenced by relative path from `index.html`.
If a file is missing the site still works — it falls back to a CSS-painted
scene or a labelled placeholder tile, so nothing ever looks broken.

```
assets/
├─ img/
│  ├─ cover.png            Asset 1 · landing cover (first screen)
│  ├─ hero.png             Asset 3 · hero background (after the video)
│  ├─ groom.jpg            optional portrait
│  ├─ bride.jpg            optional portrait
│  ├─ invitation-card.png  scan of the printed card (reference only)
│  └─ gallery/
│     └─ 01.jpg … 09.jpg   gallery photos, any aspect ratio
└─ video/
   └─ invitation-reveal.mp4   Asset 2 · the reveal video
```

## Notes

**Landing cover / hero** — these are looked up in order, first hit wins:

| | first choice | then |
|---|---|---|
| cover | `cover entry.png` *(project root)* | `assets/img/cover.png` → `.jpg` → `.webp` |
| hero | `landing after video.png` *(project root)* | `assets/img/hero.png` → `.jpg` → `.webp` |

So the two files can simply sit in the project root under those exact names —
no copying needed. The chain is declared in `data-fallbacks` on each `<img>` in
`index.html`. Export at roughly 1600 px on the long edge, or supply a `.webp`
for the smallest payload.

Both are portrait artwork. On phones they fill the screen edge to edge. On
anything wider than 5:7 the hero is letterboxed as a centred panel and the gap
either side is filled with a blurred, over-scaled copy of the same image, so the
decorative pillars and lamps never get cropped away.

**Video** — `index.html` lists two sources: `assets/video/invitation-reveal.mp4`
first, then the original file in the project root. Either one works, so you can
skip the copy if you prefer. Keep it under ~8 MB if you can; H.264 baseline,
AAC audio, 1080×1920 or 720×1280 plays everywhere.

**Portraits** — `groom.jpg` and `bride.jpg` are cropped to a 3:4 arch. Until
they exist, an empty arch with the label "Groom Photo" / "Bride Photo" is shown.

**Gallery** — drop in `01.jpg` through `09.jpg`. They lazy-load and flow into a
responsive masonry (3 columns desktop, 2 tablet, 1 phone). Add more tiles by
copying a `<figure class="tile">` line in `index.html`.
