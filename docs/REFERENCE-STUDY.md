# LUMIERE — Reference Study: flat-lay mood board

**Reference:** `Gemini_Generated_Image_ol8l13ol8l13ol8l (1).jpg` — supplied by the author 2026-10-12 (1424 × 751).
**Purpose:** this is the art-direction source for the scene rebuild (D1–D3) and for future section content (D4). It is a *set/material/lighting* reference — not a storyboard for scroll beats.
**Companion docs:** `docs/VERSION-DESC.md` (rules of the standard) · `docs/REVIEW.md` (findings and proposals).
**Compliance note:** study only — no code changed. Recommended home once changes are requested: `public/reference/` (folder is staged and empty).

---

## 1. What the image establishes

A top-down **flat-lay** studio photograph: a **light marble slab** with a large **gold satin drape** laid over its right two-thirds; a **two-tone rectangular lipstick case** resting flat on the fabric, surrounded by styling props — a black pencil, three brushes, a crushed-pigment spill, and an open mascara. Soft, warm, low-contrast light; moderate corner vignette; fine film grain.

Crucially, this validates and completes work already staged in the repo:

- `app/Components/Fabric.tsx` — the gold satin drape generator ("*Primary folds run diagonally… like the reference*").
- `app/Components/MakeupProps.tsx` — pencil, mascara, brushes, powder spill, placed in coordinates that mirror this layout.
- `app/Components/Table.tsx` — the marble base (currently the wrong marble — see §3.1 / REVIEW D2).

---

## 2. Composition map (normalised to frame, 0–1)

```
┌──────────────────────────────────────────────┐
│ MARBLE            │  GOLD SATIN DRAPE        │
│        ╲ pencil   │   (top edge → right edge │
│                   │    → down to ~0.85H)     │
│   brush↗          │        ╲ brush(3)        │
│      ┌──────────┐ │                          │
│      │  CASE    │ │   ← case lies ON drape,  │
│  powder spill    │ │     centred x≈0.49      │
│   brush↗          │                          │
│              mascara wand (spoolie→left)     │
│ MARBLE           │   mascara tube ╲ (open end)│
└──────────────────────────────────────────────┘
        vignette + grain across the frame
```

| Element | Placement (approx.) | Detail |
|---|---|---|
| Marble slab | Left column + bottom strip + under drape | Warm off-white, soft grey veins, large scale (no tiles) |
| Gold satin drape | From x ≈ 0.28–0.33 at the left edge, reaching top/right edges, lower boundary ≈ y 0.78–0.85, left-lower corner folds/curls | Large soft diagonal waves + a few sharper creases around the case; visible fine weave |
| Product case | x 0.459–0.529 (width ≈ 0.07 W), y ≈ 0.32–0.75 (height ≈ 0.43 H) → aspect ≈ 3.2 : 1 | Lying flat, slightly left of frame centre; thin gold band between lid and base; soft shadow cast to its lower-left |
| Pencil | Upper-left, diagonal ↘ 30–40°, tip toward centre | Black, tapered, subtle gloss |
| Brush pair | Left-centre, fanning from lower-left; heads (cream puffs) toward the powder / centre | Round fluffy heads, black tapered handles |
| Powder spill | x ≈ 0.09–0.25, y ≈ 0.66–0.82, elongated diagonal | Crushed burgundy-rose pigment: chunks + dust scatter + contact shadow |
| Mascara | Lower-right, open: tube diagonal (open end with gold ring facing up-left), wand above it with the spoolie tip pointing toward the product (≈ 0.65 W, 0.63 H) | Black gloss tube, gold trim rings, helical spoolie |
| Brush (3rd) | On the fabric, upper-right; head pointing down toward the case | Cream head, black handle |

**Camera:** near-overhead (flat-lay), mild perspective (slight taper visible on the case), no strong lens distortion, effectively deep focus with soft corner falloff. Everything lies flat — *orientation legibility* comes from object design (a rectangular case reads flat instantly; a featureless cylinder does not).

---

## 3. Material specifications (with measured anchors)

### 3.1 Marble
- Warm off-white in lit areas (measured ≈ `#beab9c`–`#d1beb0`; warmer and darker only in vignette), soft irregular grey veins, feathery transitions, large scale — veins span a large fraction of the frame.
- Matte-to-satin response; no mirror gloss; gentle contact shading. **This is the "correct" colour the current `Marble014` warm-brown doesn't deliver** (REVIEW D2): either re-grade/renormalise the current set (tint + reduced contrast) or source a lighter marble; keep the sRGB/linear colour-space discipline; set mapping by world scale so veins read at this size.

### 3.2 Gold satin drape
- Broad range: deep fold shadows ≈ `#6b3f1a`/`#50300f` → mids `#b4874c` → sheen highlights `#f8d291`–`#fade9f`.
- Fine regular weave/twill micro-pattern visible at macro; anisotropic sheen that follows the fold curvatures; folds are large and soft, with a few tight creases near the product.
- Current `Fabric.tsx` is the right vehicle: upgrade micro texture to a periodic weave pattern (instead of pure fbm grain), keep `sheen 1.0 #ffd97a`, tune fold amplitudes/creases to this reference, and give the drape a real edge (+ curl at the lower-left corner) over the marble.

### 3.3 Product case (target design)
- **Brushed gold lid**: satin metal, fine brushing grain along the case axis, mid ≈ `#ab8153`, highlights to `#d8b478`; crisp chamfered edges with thin bright edge lines.
- **Gloss black base**: near-black `#0e0a0b` with soft, smeared reflections (glass-like); thin **gold band** at the lid/base union.
- This is a *rectangular two-tone case* — the strongest departure from today's all-gold cylinder (see §6 decision A). Proportions from the image: ≈ 3.2:1, lid ≈ 55 %, base ≈ 45 %.

### 3.4 Props
- Pencil/eyeliner: black with subtle gloss, tapered sharpened tip, small gold band near the ferrule end (~ `MakeupProps.Pencil` already has this).
- Brushes: black tapered handles (satin), cream/peach fluffy heads (`#e8c9b0`-family) with **visible fibre structure** — individual hairs, soft splay, darker core; soft shadow beneath.
- Mascara: black gloss tube + **gold trim rings**; wand with a **helical spoolie** (spiral bristle rows, tapered silhouette) and glossy tapered cap end.
- Powder spill: crushed pigments (`#8f5b50`-family) — irregular chunks with facets, plus fine dust scatter and a soft contact shadow; current disc-stack approach (`PowderSpill`) is a placeholder, not a match.

### 3.5 Grade & grain
- Warm, slightly desaturated grade; gentle contrast; moderate vignette (corners noticeably darker); fine film grain across surfaces.

---

## 4. Light specification

- **Key:** one large, soft source (area-like), from the upper-right, slightly warm; no small hard speculars anywhere.
- **Fill:** broad ambient; shadows are soft, wide, and fall to the lower-left (case, props, brushes all show this direction consistently).
- **Response:** satin sheen follows fabric curvature; the gloss black face reflects soft shapes only; the marble stays matte-satin.
- **Practical target for `Scene.tsx`:** this is a low-light-count, big-soft-source look — the opposite of the current multi-spot/hard-shadow stack (REVIEW D3): one big key + soft fill + subtle rim; single soft shadow direction; vignette and grade moved to post/CSS rather than baked into muddy shadow overlap.

---

## 5. Relationship to staged assets

| Asset | Relation to this reference |
|---|---|
| `golden_silk_macro_*.jpg` | Macro of flowing satin — same material family as the drape (dark background) → feature/texture section card |
| `dark_glass_macro_*.jpg` | Dark glass + gold reflections — matches the gloss-black case language → feature card |
| `lipstick_texture_macro_*.jpg` | Red bullet texture on dark stone → feature card / bullet detail |
| `oil_droplet_macro_*.jpg` | Golden droplet/halo on black → feature card |
| `cherry / mocha / sand / teal swatches` | Shade collection for a future "shades" section (cherry ≈ the current bullet `#a8203a`) |

The macros are dark/moody (consistent with the site's current dark theme); the flat-lay reference is warm/bright. See §6 decision B.

---

## 6. Impact on the review (refinements, not rewrites)

- **D3 (camera/scene) — refine:** the **near-overhead flat-lay is the intended master composition** — so the current top-down direction is right *in spirit*; what's wrong is (a) the set is missing (fabric + props), (b) a plain cylinder reads illegibly from above, (c) the hero motions (lift/tumble) were authored for a profile view and are invisible/odd from overhead. Target: near-overhead with mild perspective + **small, slow micro-motions** (drift, slight rotation, fabric breathing) rather than big spins; keep flat-lay legibility.
- **D2 (surface) — sharpened:** two surfaces, not one: **light marble** (re-grade/remap; veins large-scale) **plus the gold satin drape** as the dominant surface (enable `Fabric.tsx`, tune to §3.2). The current warm-brown marble is definitively wrong against this reference.
- **D1 (mesh) — sharpened:** product + props detail targets are now explicit (§3.3–§3.4): brushed two-tone case, fibrous brush heads, helical spoolie, faceted powder chunks, chamfered edges. Add the missing third brush.
- **D4 (flow) — sharpened:** props, macros and swatches are the future sections' content (features/texture cards, shade collection); the flat-lay is the "hero" set, sections can re-frame while keeping the same materials.

---

## 7. Decisions needed from the author (before any build)

| # | Decision | Options / recommendation |
|---|---|---|
| A | **Product shape** — rectangular two-tone case (as in reference) vs current gold cylinder | Reference strongly implies the rectangular case (brushed gold lid + gloss black base). Recommend adopting it; keep the existing track API (`lipstick.*`, `cap.y`). |
| B | **Scene grade** — reference is warm/bright; the site is dark | Recommend: build the set to *reference realism*, then grade per section (hero can stay moodier via exposure/vignette/scrims for UI legibility; mid-page sections can open up brighter). Agree the target before lighting work. |
| C | **Flat-lay scope** — full set for the hero vs staged across sections | Recommend: full flat-lay as the master set (hero + early chapters), then re-frame (macro pushes, drape close-ups) for later sections using the same assets. |

---

## 8. Follow-ups (when change is requested)

1. Copy the reference into `public/reference/` (staged folder) and the flat-lay crops alongside, so future sessions build against it.
2. Then, per `REVIEW.md` §7 sequencing: D3 (light + camera rig per §4/§6) → D2 (marble + drape) → D1 (case + props per §3) → D4 (sections per §5/§6).
3. Keep every step inside the standard's rules (`VERSION-DESC.md` §3–§7) — tracks, layer map, colour-space rules — and update the desc when a delta lands.
