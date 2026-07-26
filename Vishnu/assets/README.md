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

**Landing cover / hero** — looked up in this order (first hit wins):

| | formats tried |
|---|---|
| cover | `cover entry.png` → `assets/img/cover.png` |
| hero | `assets/img/hero.avif` → `assets/img/hero.webp` → `landing after video.png` → `assets/img/hero.png` |

Convert the tall PNG once for mobile-friendly sizes:

```powershell
powershell -ExecutionPolicy Bypass -File .\convert-hero.ps1
```

Target ~300–500 KB WebP / AVIF (max ~800 KB). The Hero `<img>` has no `src` until JS finishes `Image()` load + `decode()`, so a half-painted bitmap never appears on screen.

**Video** — `index.html` lists two sources: `assets/video/invitation-reveal.mp4`
first, then the original file in the project root. Either one works, so you can
skip the copy if you prefer. Keep it under ~8 MB if you can; H.264 baseline,
AAC audio, 1080×1920 or 720×1280 plays everywhere.

**Portraits** — `groom.jpg` and `bride.jpg` are cropped to a 3:4 arch. Until
they exist, an empty arch with the label "Groom Photo" / "Bride Photo" is shown.

**Gallery** — drop in `01.jpg` through `09.jpg`. They lazy-load and flow into a
responsive masonry (3 columns desktop, 2 tablet, 1 phone). Add more tiles by
copying a `<figure class="tile">` line in `index.html`.
