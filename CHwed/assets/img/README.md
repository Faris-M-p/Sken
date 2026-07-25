# Page artwork

The eleven page illustrations belong here, named exactly:

| File | Page |
| --- | --- |
| `page-01-cover.png` | The sacred cover — ribbon, wax seal, lilies |
| `page-02-hero.png` | The invitation just opened |
| `page-03-verse.png` | Illuminated manuscript parchment |
| `page-04-invitation.png` | Embossed invitation card |
| `page-05-countdown.png` | Antique brass pocket watch |
| `page-06-betrothal.png` | Cream marble ceremonial card |
| `page-07-wedding.png` | Rings on an open book |
| `page-08-reception.png` | Banquet, chandeliers, crystal |
| `page-09-venue.png` | Garden pathway at sunset |
| `page-10-blessings.png` | Pressed flowers on handmade paper |
| `page-11-thankyou.png` | The book gently closing |

Run `setup-images.ps1` in the project root to copy them in automatically.

## Converting to WebP

The site references `.png`. Once you have WebP versions (roughly 60–70%
smaller at the same quality), convert them and update the `--art` values in
`index.html`:

```bash
# with cwebp, or use Squoosh at squoosh.app
for f in page-*.png; do cwebp -q 82 "$f" -o "${f%.png}.webp"; done
```

Then search `index.html` for `.png` and replace with `.webp` — the paths are
all declared inline on the `.page__media` elements, in one place per page.
