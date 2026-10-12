# LUMIERE — Version Description

> **Version: v0.1 "Standard"** — the current version is the project **standard**.
> **Frozen reference:** branch `development` @ `e168639` (2026-10-12) · package `cosmetic-website@0.1.0`
> **Scope of this document:** design, layout and animation rules of the standard — the contracts a future
> version must honour or consciously revise. Known gaps are registered in §8 (details in `docs/REVIEW.md`).
> **Rule of this project:** nothing changes unless explicitly requested; the standard stays as-is until a
> change request arrives. This document contains no code changes.
> **Reference study:** `docs/REFERENCE-STUDY.md` — art-direction analysis of the flat-lay mood board (scene set,
> materials, light, grade); read alongside the D1–D4 deltas.

---

## 1. How to use this document

- **Devs & agents:** read this before touching layout, timeline, materials or scroll behaviour. Treat §3–§5 as contracts, not suggestions. When a change is requested that alters one of these contracts, update this document in the same change ("desc deltas" in §7.4).
- **Companion:** `docs/REVIEW.md` holds the complete review — findings, rationale, and proposed directions (D1–D4, X1–X7).
- **Snapshot of the standard's evolution:** see §9 version log.

---

## 2. Product & experience intent

- **Brand:** LUMIERE — "Enhance your look with light." A single-product luxury cosmetic experience: one lipstick, one dark studio, two chapters of copy in the current build.
- **Experience model:** one continuous scroll (0 → 1) drives a fixed full-screen 3D stage behind fixed typographic "beats". Text never scrolls into view; it fades in place, synchronised to scene beats.
- **Motion personality:** considered, weighty, calm. Long durations (≈1 s), gentle eases (`sine.*`, `power1–3.*`), no abrupt cuts. Micro-loops (pulse, marquee, breathe) carry idle life.
- **Current completeness:** chapters "hero" and "subtitle" + a placeholder second section. The remaining narrative (cap reveal, features/macros, shades, product, contact) and its assets are staged but not built — see `REVIEW.md` D4.

---

## 3. Design rules

### 3.1 Palette & tokens (normative)

| Token / role | Value | Used by |
|---|---|---|
| Cream (primary UI ink) | `#f5e6d3` | Hero, header, subtitles, cards (`/55–/90` alpha variants) |
| Velvet (page background) | `#0a0a0a` (`--color-velvet`) | `body`, overlay plane |
| Scene void | `#050505` | Environment sphere |
| Product gold (satin) | `#c9a44a` | Tube + cap material |
| Polished gold | `#e8c46a` | Ring accent |
| Bullet red | `#a8203a` | Lipstick bullet |
| Dark accents | `#111` / `#1a1a1a` | Base cap, collar, props |
| Accent lights | `#7da4ff` (cool rim), `#ffd6a8` / `#fff0dc` / `#ffb178` (warm key/spot), `#ffe6c8` (fill) | Scene lights + Lightformers |
| Header compact bg | `rgba(12,10,9,0.55)` + `blur(24px)` | Header shell |
| Header border (compact) | `rgba(245,230,211,0.12)` | Header shell |

**Known drift (do not propagate):** CSS token `--color-gold` is `#D4AF37` while the product material uses `#c9a44a`; `--font-serif`/`--font-sans` (Playfair/Montserrat) are declared but never loaded or used. Any change request touching palette/typography should unify these to a single source.

### 3.2 Typography rules (current standard)

- **Loaded:** Geist / Geist Mono via `next/font` (variables on `<html>`); **declared in theme:** Playfair Display (serif), Montserrat (sans); **effective rendered font:** system sans fallback (see X1 in `REVIEW.md`).
- Display treatment: weight 900, `tracking-tighter`, line-height ≈ 0.8 ("LUMIERE", subtitles).
- Label treatment: uppercase, 10–13 px, tracking 0.15–0.5 em ("ENHANCE YOUR LOOK WITH LIGHT.", nav, edge text, footnotes).
- Rule: any future typography change must (a) pick one family system, (b) actually load it, (c) update this table. Keep the *treatment* (heavy display / tracked labels) unchanged unless requested.

### 3.3 Surface language

- **Glass card recipe (hero):** `rounded-2xl`, `border-white/15`, gradient `from-white/[0.14] via-white/[0.07] to-white/[0.02]`, `backdrop-blur-2xl backdrop-saturate-150`, ring `white/5`, layered shadow `0_8px_32px rgba(0,0,0,.35)` + inner top/bottom highlights, top hairline sheen + rotated internal glow. Use this recipe for any future glass surface.
- **Hairline divider:** 1 px dotted via `linear-gradient` (50 % cream / 50 % transparent), animatable background position (marquee).
- **Edge label:** vertical writing (`writing-mode: vertical-rl`), right edge, 10 px / 0.5 em tracking.
- **Materials (3D recipes, current standard):**
  - Gold satin (Δ2): `#c9a44a`, `metalness 0.96`, seamless streak roughness ≈ 0.24–0.42 (avg 0.33) + `anisotropy 0.65`, thin lacquer (`clearcoat 0.12 / 0.5`); profiled lathes with chamfers & edge breaks.
  - Polished ring: `#e8c46a`, `roughness 0.12`, `metalness 1.0` (rounded-edge band).
  - Dark parts (Δ2): base `#111` / collar `#1a1a1a` now carry a matte brushed streak map (≈ 0.37–0.67); base `metalness 0.3`, collar `0.5`.
  - Bullet (Δ2): `#a8203a`, `metalness 0`, wax-grain roughness map (avg 0.46), no sheen / no clearcoat — deep red wax; classic angled tip with rounded edge bevel (R 0.042) and gently convex face.
  - Table (current, flagged incorrect): `Marble014` maps, Color sRGB / Normal+Roughness linear, repeat 2×2 on a 20×20 plane, `clearcoat 0.4`, `clearcoatRoughness 0.25`, `envMapIntensity 1.4`.
  - Fabric (parked, `Fabric.tsx`): `#c99a55`, `metalness 0.95`, `roughness 0.28`, `sheen 1.0 #ffd97a`.
- **Texture colour-space rule (normative, keep forever):** albedo → `SRGBColorSpace`; normal/roughness/displacement → `NoColorSpace`; set `needsUpdate` after changes; `anisotropy 16`; `RepeatWrapping` for tiling surfaces.

---

## 4. Layout rules

### 4.1 Document & scroll model (contract)

- `app/page.tsx`: `<main>` height **300vh** → usable travel **200vh** ≈ timeline 0 → 1.
- Progress formula (single writer, `Container.tsx`): `min(scrollY / (scrollHeight − innerHeight), 1)` → zustand `useScrollStore.scrollProgress`.
- Smoothing: Lenis (`duration: 1.2`, ease `1.001 − 2^(−10t)`, `smoothWheel`), RAF-driven.
- Native scrollbar hidden; `overscroll-behavior: none`; `scroll-behavior: auto` (Lenis owns scrolling).
- **Rule:** extend the page height only together with `SECTIONS` + tracks (§7.1).

### 4.2 Layer model (contract)

| z | Layer | Position mode | Notes |
|---|-------|---------------|-------|
| 0 | 3D canvas | fixed inset-0 | transparent canvas over `#0a0a0a` body |
| 10 | Hero copy wrapper | in-flow, `pointer-events-none` | mount reveal, then static |
| 10 | Second section | fixed inset-0 | scroll-opacity driven |
| 20 | Subtitle chapter | fixed inset-0 | scroll-opacity driven |
| 50 | Header | fixed | morphs at scroll > 0.55 |

**Rules:** text layers never receive pointer events (only real controls, e.g. nav links, do); new layers slot into this z-map; `fixed` + percentage anchors are the default text positioning pattern.

### 4.3 Overlay composition (current standard anchors)

| Element | Position / size | Notes |
|---|---|---|
| Tagline | top 18 % / left 8 %; 11 px, 0.45 em | hero |
| H1 "LUMIERE" | top 21 % / left 7 %; `clamp(96px, 16vw, 130px)`, 900 weight | hero |
| Body quote | top 40 % / right 8 %; 26 px; max 480 px | hero |
| Glass card | bottom 7 % / left 8 %; width 340 px; padding 24 | hero |
| Edge label | right 5, vertically centred | hero |
| Scroll cue | bottom 10, centred | visible while progress < 0.10 |
| Subtitle H2 | left; max-width 40 %; 72 px | chapter 2 |
| Subtitle quote | right; max-width 360 px; 33 px | chapter 2 |
| Subtitle footnote | bottom 8 / right 8; 11 px | chapter 2 |
| Second section H2 | centred; 72 px | placeholder |
| Header shell | `px-8`; padding 24 → **10** when progress > 0.55; brand scale 1 → 0.82; blur/bg/border fade in; 0.6 s `power3.out` | fixed |

### 4.4 Section registry (contract)

`SECTIONS` in `app/lib/timeline.ts` is the **single source of truth** for beat ranges (0–1):

| Section | Range | Intent (as authored) | Implemented |
|---|---|---|---|
| `hero` | 0.00–0.30 | product lifts & tumble begins | yes (lift invisible under current camera — see REVIEW §2) |
| `subtitle` | 0.30–0.50 | headline fades in, spin continues | yes (text lingers to 0.70 — drift) |
| `reset` | 0.50–0.60 | product descends to rest | yes |
| `drop` | 0.60–0.70 | cap departs (twist beat) | partial (`cap.y` starts at 0.45 — drift) |
| `secondSection` | 0.70–0.90 | second chapter text | yes (placeholder copy) |
| `hand` | 0.90–1.00 | — | **not implemented** |

**Rules:** registry names must match track prefixes and comments; do not add a section without adding both tracks and a DOM or 3D beat; keep ranges non-overlapping and contiguous.

---

## 5. Animation rules

### 5.1 The single progress scalar (contract)

- Exactly one source of scroll truth: `useScrollStore.scrollProgress` (0→1). Written only by `Container.tsx` (via the scroll listener fed by Lenis). Read via `getState()` inside `useFrame`, and via `subscribe` for DOM timelines.
- **Rule:** never introduce a second scroll/pointer source; never animate scene properties from React state or event handlers — everything derives from `readTrack(scroll, …)`.

### 5.2 Track system (contract)

- Tracks live in `app/lib/timeline.ts` as `TRACKS`: named **`"owner.property"`** → sorted keyframe list `{ scroll, value, ease? }`.
- Sampling (`readTrack`): before first keyframe → first value; after last → last value; inside a segment → linear position, eased with the **destination keyframe's** ease; missing ease = linear.
- Units: **degrees** for rotations (converted with `degToRad` in the component); world units for positions; 0–1 for opacities.
- Eases: names from `app/lib/easing.ts` (full GSAP vocabulary, parsed once and cached). House vocabulary: `sine.*` (organic motion), `power1–4.*` (UI fades/moves), `none` (constant spins). Avoid `back/elastic/bounce` in scene motion unless a request allows playfulness.
- **Rules for new tracks:** keep keyframes sorted; keep names unique; components must read tracks every frame (3D) — do not animate inline with local state.

### 5.3 Current track inventory (standard v0.1)

| Track | Keyframes (scroll → value, ease) | Read by |
|---|---|---|
| `lipstick.y` | 0.00→0 · 0.10→1.5 `sine.out` · 0.50→1.5 · 0.60→0 `sine.in` | `Lipstick.tsx` (+ rest offsets) |
| `lipstick.rotation.x` | 0.00→0° · 0.50→360° `sine.out` | `Lipstick.tsx` |
| `lipstick.rotation.y` | 0.00→0° · 0.50→720° | `Lipstick.tsx` |
| `lipstick.rotation.z` | 0.00→0° · 0.50→360° | `Lipstick.tsx` |
| `cap.y` | 0.45→2.0 · 0.70→6.0 `power2.out` | `Lipstick.tsx` (cap mesh, absolute y) |
| `text.opacity` | 0.30→0 `sine.in` · 0.40→1 `sine.out` · 0.70→0 `sine.in` | `SubtitleOverlay.tsx` |
| `section.text.opacity` | 0.72→0 `sine.in` · 0.80→1 `sine.out` · 0.88→0 `sine.in` | `SecondSection.tsx` |
| `overlay.opacity` | 0.10→0 `power1.in` · 0.40→1 `power1.out` · 1.00→1 | `Overlay.tsx` (scene blackout — see REVIEW D4) |
| `stick.rotation.z` | 0.60→0° · 0.70→360° | **nobody — orphan (register for D4)** |

### 5.4 DOM animation rules (current standard)

- **Mount reveal (hero):** GSAP timeline (1 s, `power3.out`) staggering `dot → tagline → title → body → card → edge` with ≈0.75–0.85 s overlaps; ambient loops start after (dot pulse keyframes `sine.inOut` 2.2 s; dash marquee `backgroundPositionX` 3.5 s linear; edge opacity breathe 2.5 s `sine.inOut` yoyo).
- **Scroll fades:** a paused GSAP timeline animates the layer's elements (opacity/y, 1 s, stagger 0.1, `power2.out`); a store subscription maps the track's 0→1 value onto `timeline.progress()`. Use this pattern for every future text chapter.
- **Header morph:** state flag (progress > 0.55) → GSAP tween of shell padding/bg/blur/border + brand scale (0.6 s `power3.out`); link underline via CSS (500 ms cubic-bezier(0.65, 0, 0.35, 1), scale-x origin-left).

### 5.5 Scene animation rules (current standard)

- 3D components read tracks in `useFrame` and write to `position`/`rotation` directly.
- The lipstick model is authored **lying flat** (inner group rotated −90° about X) with rest offsets `CENTER_OFFSET 1.26` and `Y_OFFSET 0.25`; group rest height ≈ 0.7 world units. Model space: base y 0 → bullet tip y 2.52.
- `cap.y` is the cap mesh's **absolute local y** (rest 2.0; 6.0 = departed).
- Frame-smoothed values (e.g. `Overlay` opacity, lerp factor 0.1/frame) are the accepted pattern for material-opacity tracks.
- **Camera rule (current):** static camera at `[0, 6, 0]`, fov 45 — with R3F's default `lookAt(0,0,0)` this resolves to a straight-down framing; the scroll does **not** move the camera in v0.1. Framing changes are governed by REVIEW D3, not by this rule set.
- Post FX (DoF/Bloom/Vignette) exist as documented recipes in `Scene.tsx` but are **disabled** in the standard.

---

## 6. Scene & render rules (current standard)

- Renderer: ACES Filmic tone mapping, exposure 1.15, PCF shadows, dpr [1,2], antialias, `alpha: true` over CSS `#0a0a0a` background.
- Lights (current, flagged for consolidation in D3): ambient ×2, hemisphere ×1, directional ×2 (shadow-casting), spot ×2 (shadow-casting), point ×1; Environment = portal children (black sphere + 2 dim Lightformers) + `preset="city"` + `environmentIntensity={100}` (contradictory — register as D3 work).
- Grounding: `ContactShadows` (y 0.011, scale 10, blur 5, far 4, opacity 0.6).
- **Rule (future):** one environment source, one shadow-casting key light, self-hosted HDRI in `public/hdri/` (folder staged) — no CDN preset dependency.

---

## 7. Extension protocol (rules for every future version)

### 7.1 Adding a section / narrative beat

1. Decide the beat's scroll range; register it in `SECTIONS` (contiguous, non-overlapping).
2. Extend `<main>` height proportionally (300vh page = 200vh travel ≈ 1.0 timeline; keep the ratio explicit).
3. Add tracks (§7.2) for product/camera/opacity changes; keep them inside the registered range or document the drift.
4. Add the DOM layer with a fixed, percentage-anchored layout in the z-map; `pointer-events-none` unless interactive.
5. Add staged assets: content images `app/assets/images/` (or `public/…` for textures/HDRI), following §3.3 colour-space rules.
6. Update §3.4/§4.4/§5.3 tables in this document (same change as the code).
7. Verify: nav link (if any) points at something real; no orphan tracks; overlay used only as a transition.

### 7.2 Adding a track

- Name it `owner.property`; keep keyframes sorted; use degrees for rotations; use the house ease vocabulary; read it in `useFrame` (or map to DOM timeline progress).
- Never animate from React state; never bypass `readTrack`.

### 7.3 Modifying the standard's rules

- Any change to §3–§6 requires an explicit request; when accepted, edit this document and bump the version (§8/§9), and note the delta (what changed + why + affected files).

### 7.4 Version log & desc deltas

- `docs/REVIEW.md` tracks findings (D1–D4, X1–X7) with proposed directions; when a workstream lands, record it here as: `vX.Y — "name" — what changed — files touched — tracks/sections added`.

---

## 8. Known deltas register (v0.1 — standard is intentionally incomplete)

| Ref | Delta | Summary | Detail |
|---|---|---|---|
| D1 | Mesh realism | Primitive-only product; no bevels/fillets, single gold material, no micro-detail | REVIEW §3-D1 |
| D2 | Table texture | 10-unit tiles on a 20-unit plane → giant warm blotches; colour fights the palette; no rotation/offset | REVIEW §3-D2 |
| D3 | Scene & camera | Top-down framing, contradictory env (children + preset + intensity 100), 4 shadow casters, FX disabled, no camera motion | REVIEW §2, §3-D3 |
| D4 | Timeline & flow | ~60 % of scroll plays behind the overlay blackout; `hand` section empty; orphan tracks; dead nav anchors; placeholder copy; staged but unused assets | REVIEW §1.5, §3-D4 |
| X1–X7 | Cross-cutting | Fonts unwired, token drift, dependency hygiene, dead inventory, perf budget, a11y, copy/metadata | REVIEW §5 |

These deltas are the *agreed description of incompleteness* — the standard stays valid until a change is explicitly requested and lands as a new version.

---

## 9. Version log (repository evolution → standard)

| Ref | Commit | Note |
|---|---|---|
| — | `4c66da0` | Create Next App baseline |
| — | `3019fd4` … `b5f45d8` | First template → hero layer → timeline parameter utility |
| — | `da0421e` | Timeline refactor; "lipstick" mesh introduced |
| — | `9aaf73f`, `c7cc87e` | Textures moved to `public/`; scene updated with effects; background pass |
| — | `9cebf4b` | Animation testing in `timeline.ts` (keyframe experiments) |
| — | `435d182` | Cap added + animated; bullet merged into one mesh |
| — | `a5faa1e` | New animated (second) section |
| **STD** | **`e168639`** | **Standard v0.1** — UI refined with placeholder copy; header animations; scene/table tuning |
| **Δ1** | 2026-10-12 (requested) | D1 first pass — mesh realism in `app/Components/Lipstick.tsx`: profiled lathes (chamfers, fillets, parting lip, inner sleeve), axial brushed grain (streak roughness + anisotropy), classic angled-tip bullet. Unchanged: part placement + envelopes (r 0.32 / 0.34 / 0.29 / 0.325 / 0.27 · model 0 → 2.52), component structure, track API. |
| **Δ2** | 2026-10-12 (requested) | Bullet shape + texture pass in `app/Components/Lipstick.tsx`: rounded edge bevel along the slanted rim (parametric grid, smooth normals, UVs added), softened slant + gently convex face; sheen removed (was washing the bullet pink); gold grain reworked as seamless periodic streaks; matte brushed textures added to base + collar; wax-grain texture added to the bullet. Envelopes / placement / API unchanged. |

---

*Appendix — file map of the standard*

| Path | Role |
|---|---|
| `app/page.tsx` | 300vh scroll shell |
| `app/Components/Container.tsx` | Lenis, store writer, layer composition |
| `app/Components/Scene.tsx` | Canvas, lights, environment, shadows, (disabled) FX |
| `app/Components/Table.tsx` | Marble surface (D2 target) |
| `app/Components/Lipstick.tsx` | Product + track readers (D1 target) |
| `app/Components/Overlay.tsx` | Blackout plane (`overlay.opacity`) |
| `app/Components/Header.tsx`, `Hero.tsx`, `SubtitleOverlay.tsx`, `SecondSection.tsx`, `ScrollIndicator.tsx` | DOM layers |
| `app/Components/Fabric.tsx`, `MakeupProps.tsx`, `Cube.tsx` | Parked / placeholder 3D content |
| `app/lib/timeline.ts` | `TRACKS` + `SECTIONS` (single source of truth) |
| `app/lib/sample.ts`, `easing.ts`, `useScrollStore.ts` | Sampling, easing cache, scroll store |
| `public/textures/marble/` | `Marble014` 2K PBR set (+ unused Displacement/NormalDX, source files) |
| `public/hdri/`, `public/reference/` | Staged (empty) for HDRI + reference imagery |
| `app/assets/images/` | Staged content: swatches (`cherry`, `mocha`, `sand`, `teal`) + macros (`dark_glass`, `golden_silk`, `lipstick_texture`, `oil_droplet`) |
| `docs/REVIEW.md` | Complete review + proposals |
