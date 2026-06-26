# Gabay — classroom textures & pictures

20 warm, low-poly classroom textures/pictures to dress walls and surroundings,
plus a `_contact-sheet.png` preview. All are **procedurally generated** by
[`scripts/generate-textures.mjs`](../../scripts/generate-textures.mjs) — they are
original output (effectively **CC0 / public domain**), so there are **no external
assets, licenses, or attributions** to track. They follow the Gabay palette
(`tailwind.config.js`) and the warm reference art direction (cream plaster walls,
wood wainscoting, wood floors, framed art, soft window light).

Regenerate any time with:

```bash
npm run textures
```

## Files

| File | Size (px) | Tileable | Suggested use |
| --- | --- | --- | --- |
| `wall-plaster-cream.png` | 512×512 | seamless (x+y) | Upper walls — main warm cream plaster |
| `wall-plaster-tan.png` | 512×512 | seamless (x+y) | Accent / mid-wall band (the warm tan stripe) |
| `wainscot-wood-vertical.png` | 512×512 | seamless (x) | Lower-wall wood paneling (vertical planks) |
| `wood-trim-rail.png` | 512×96 | seamless (x) | Chair-rail / picture-rail molding strip |
| `floor-wood-planks.png` | 512×512 | seamless (x+y) | Wood-plank floor |
| `floor-tile-warm.png` | 512×512 | seamless (x+y) | Tile floor (warm off-white) |
| `ceiling-plaster.png` | 512×512 | seamless (x+y) | Ceiling (faint panel grid) |
| `baseboard-wood.png` | 512×96 | seamless (x) | Dark skirting / baseboard strip |
| `chalkboard-green.png` | 960×600 | no (single plane) | Blackboard slate with chalk dust |
| `corkboard.png` | 512×512 | seamless (x+y) | Cork bulletin board material |
| `poster-multiplication.png` | 600×760 | no (decal) | Wall poster — times table |
| `poster-geometry-shapes.png` | 600×760 | no (decal) | Wall poster — shapes (Mga Hugis) |
| `poster-fractions.png` | 600×760 | no (decal) | Wall poster — fractions (Mga Hati) |
| `poster-number-line.png` | 820×480 | no (decal) | Wall poster — number line |
| `poster-motivational.png` | 600×760 | no (decal) | Wall poster — "Kaya mo 'yan!" |
| `picture-landscape.png` | 760×560 | no (decal) | Framed low-poly landscape art |
| `picture-abstract.png` | 600×760 | no (decal) | Framed abstract decor art |
| `window-city.png` | 780×580 | no (decal) | Window with city skyline (transparent margin) |
| `rug-warm.png` | 780×520 | no (decal) | Area rug (transparent margin) |
| `fabric-upholstery.png` | 512×512 | seamless (x+y) | Chair / sofa upholstery weave |
| `_contact-sheet.png` | — | — | Preview montage of all 20 (not for in-app use) |

Posters, pictures, the window, and the rug have transparent margins + a soft drop
shadow baked in, so they read as standalone "stickers" you can lay onto a wall or
floor plane.

## Using them in Three.js

For **color/albedo** maps set the sRGB color space, and for the **seamless**
materials enable wrapping and set a sensible repeat:

```js
import * as THREE from 'three'

const loader = new THREE.TextureLoader()

function loadTiling(url, repeatX = 1, repeatY = 1) {
  const tex = loader.load(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeatX, repeatY)
  tex.anisotropy = 8 // sharper at grazing angles; cap to renderer.capabilities
  return tex
}

const wall = new THREE.MeshStandardMaterial({
  map: loadTiling('/textures/wall-plaster-cream.png', 4, 3),
})

// decals (posters, window, rug) — no wrapping, keep transparency
function loadDecal(url) {
  const tex = loader.load(url)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
const poster = new THREE.MeshBasicMaterial({
  map: loadDecal('/textures/poster-fractions.png'),
  transparent: true,
})
```

Tips: tune `repeat` to your wall/floor scale; bump `anisotropy` for floors seen at
shallow angles; keep posters/window/rug as `transparent` planes a few millimetres
off the surface to avoid z-fighting.
