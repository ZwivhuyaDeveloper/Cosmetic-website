# LUMIERE — Complete Review

**Version under review:** Standard **v0.1 "Standard"** (the current version is the project standard)
**Snapshot:** branch `development` @ commit `e168639` — 2026-10-12 — repo `ZwivhuyaDeveloper/Cosmetic-website`
**Companion documents:** `docs/VERSION-DESC.md` (design / layout / animation rules of this standard) · `docs/REFERENCE-STUDY.md` (flat-lay mood board studied 2026-10-12; refines the D1–D4 targets)
**Method:** full static read of the repository + git history + screenshot forensics of the provided render
(`Screenshot 2026-10-12 203457.png`).
**Compliance note:** no application code was changed. This review is advisory; any change must be explicitly requested (project rule: *the current version is the standard until a change is requested*).

---

## 0. Verdict at a glance

| # | Area | Status | Priority |
|---|------|--------|----------|
| — | System architecture (scroll → progress → track system → 3D/DOM) | **Solid foundation**, keep | — |
| — | Header / hero / glass card / overlay language | **On target**, polish later | — |
| D1 | Lipstick mesh realism | Incomplete — primitives, no surface detailing | High |
| D2 | Table (marble) texture colour & mapping | Incorrect — wrong world-scale, heavy warm blotching | High |
| D3 | Scene & camera realism (framing, lights, env, FX) | Incomplete — flat top-down framing, contradictory lighting stack, FX disabled | High |
| D4 | Timeline & overall flow (missing sections) | Incomplete — 3D narrative ends ~0.40 (blackout); `hand` section empty; no features/product/contact content | High |
| X1–X7 | Cross-cutting (fonts, tokens, deps, dead code, perf, a11y, copy) | See §5 | Medium/Low |

The current version is a **working vertical slice**: a scroll-driven timeline system with a correct architecture, one product (lipstick) on one surface (marble table), two text chapters (hero, subtitle), and a second-section placeholder. Everything that makes it read as "real" — machining detail on the product, a believable stone surface, a true camera, and the remaining narrative sections — is exactly what is still missing, matching the four areas flagged for this review.

---

## 1. What the version *is* (verified inventory)

### 1.1 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.4 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS 4 |
| 3D | three 0.186.0 · @react-three/fiber 9.7.0 · @react-three/drei 10.7.8 · @react-three/postprocessing 3.1.1 (effects written but disabled) |
| Motion | GSAP 3.15 (+ @gsap/react) — easing vocabulary + DOM timelines · Lenis 1.3.26 — smooth scroll |
| State | zustand 5.0.15 — single `scrollProgress` scalar (`app/lib/useScrollStore.ts`) |

### 1.2 Document & scroll model

- `app/page.tsx`: `<main>` is **300vh tall** → 200vh of travel ≈ the full 0→1 timeline.
- `app/Components/Container.tsx`: Lenis (duration 1.2, custom exponential ease, `smoothWheel`) + a `window scroll` listener that writes `scrollProgress = min(scrollY / (scrollHeight − innerHeight), 1)` into the zustand store.
- A **fixed full-screen Canvas** (`Scene`) renders behind **fixed DOM text layers**; the page itself never shows anything but overlays — text "beats" swap by opacity, not by scrolling into view.

### 1.3 Layer map (z-index)

| z | Layer | Component | Behaviour |
|---|-------|-----------|-----------|
| 0 | 3D canvas (fixed inset-0) | `Scene.tsx` | All 3D content |
| 10 | Hero copy (in-flow, pointer-events-none) | `Hero.tsx` | Mount-stagger reveal, then static |
| 10 | Second section (fixed) | `SecondSection.tsx` | Scroll-faded via `section.text.opacity` |
| 20 | Subtitle chapter (fixed) | `SubtitleOverlay.tsx` | Scroll-faded via `text.opacity` |
| 50 | Header (fixed) | `Header.tsx` | Mount intro + compact morph at scroll > 0.55 |

### 1.4 Timeline system (the best-built part)

- `app/lib/timeline.ts` — `TRACKS` (named tracks of `{scroll, value, ease}` keyframes) + `SECTIONS` registry.
- `app/lib/sample.ts` — `readTrack(scroll, name)`: clamps outside the first/last keyframe, lerps inside a segment, applies the GSAP-parsed ease of the **destination** keyframe.
- `app/lib/easing.ts` — cached `gsap.parseEase` for the whole GSAP ease vocabulary.
- 3D components read tracks every frame in `useFrame`; DOM components map a track's 0→1 opacity onto the progress of a paused GSAP timeline (`SubtitleOverlay`, `SecondSection`).

### 1.5 Flow map (what the current timeline actually plays)

| Scroll | 3D scene | DOM |
|--------|----------|-----|
| 0.00–0.10 | Lipstick "lift" 0→1.5 (along the view axis — see §3.2) · tumble begins | Hero mount-stagger; scroll cue visible (<0.10) |
| 0.10–0.30 | Tumble continues; **overlay black plane fades in** (0→~0.67 by 0.30) | Hero copy static |
| 0.30–0.40 | Overlay → **1.0 (scene fully blacked except the product silhouettes)** | Subtitle chapter fades in (0.30→0.40) |
| 0.40–0.50 | Under black: tumble completes at 0.50 (x 360°, y 720°, z 360°) | Subtitle holds |
| 0.50–0.60 | "Reset": lipstick descends back to rest | Subtitle still visible |
| 0.60–0.70 | `cap.y` 2.0→6.0 — cap departs along the case axis (exits frame ~0.60–0.63) | Subtitle fades out by 0.70 |
| 0.70–0.90 | Nothing authored (scene is black) | "Second Section" in 0.72–0.80, out 0.88 |
| 0.90–1.00 | **Nothing authored** — `SECTIONS.hand` placeholder | Nothing |

**Key finding:** from ~0.40 onward the scene reads as black (the `Overlay` plane at y=0.1 covers the floor and everything below it; only the product, which sits above the plane, stays visible as floating gold shapes against black). So roughly **60 % of the scroll length plays behind the blackout** — DOM text only from 0.40–0.90, and nothing at all from 0.90–1.00 — while the authored `reset` / `drop` beats play out *invisibly*. See D4.

### 1.6 3D scene inventory

- `Scene.tsx` — Canvas (dpr [1,2], fov 45, pos [0,6,0], ACES tone mapping @ 1.15 exposure, PCF shadows, transparent background), 2 ambient lights, hemisphere light, 2 directional lights (both shadow-casting, 2048²), 2 spotlights (1024²/2048²), 1 point light, a drei `<Environment>` portal (black sphere + 2 Lightformers) *plus* `preset="city"` *plus* `environmentIntensity={100}`, `ContactShadows`, and a disabled EffectComposer block (DoF/Bloom/Vignette).
- `Table.tsx` — 20×20 marble plane, `Marble014` 2K maps (Color sRGB / NormalGL + Roughness linear — **colour-space handling is done correctly**), repeat 2×2, clearcoat 0.4, envMapIntensity 1.4.
- `Lipstick.tsx` — lathe/cylinder assembly (see D1), driven by `lipstick.y`, `lipstick.rotation.{x,y,z}`, `cap.y`.
- `Overlay.tsx` — 30×30 black plane on the floor, opacity driven by `overlay.opacity`, smoothed with a per-frame lerp.
- Parked but present: `Fabric.tsx` (deterministic draped-fabric generator, **not mounted**), `MakeupProps.tsx` (pencil, mascara, 2 brushes, powder spill, **not mounted**), `Cube.tsx` (placeholder, commented out).

---

## 2. Headline insight — how the current frame is actually produced

*(Refined by `docs/REFERENCE-STUDY.md`: the overhead flat-lay framing matches the supplied mood board's intent — the defects are the missing set (fabric + props), the illegible plane of a cylinder, and hero motions authored for a profile view. The overhead direction itself is right in spirit.)*

The composition in the reference screenshot is achieved by an **accidental but effective camera trick**, and this explains several of the "not realistic" symptoms:

1. **Camera:** `Scene.tsx` sets `camera={{ position: [0, 6, 0], fov: 45 }}` with **no rotation**. React Three Fiber then applies its default `camera.lookAt(0, 0, 0)` (verified in `@react-three/fiber` source). The camera therefore looks **straight down** at the table from 6 units above the origin.
2. **Product:** the lipstick is **lying flat** (inner group rotated −90° about X), pointing away from the camera.
3. **Result:** from directly overhead, the lying tube projects as a vertical column on screen — it *reads* as a standing lipstick. Verified against the screenshot by projection math (fov 45, 1875×932):
   - case width ≈ 7.2 % of frame → measured ≈ 7 %;
   - ring seam at ≈ 46 % from top → measured ≈ 47 %;
   - case top end at ≈ 17 % from top → measured ≈ 16–17 %;
   - dark base band at ≈ 76–79 % → measured ≈ 76–79 %.

**Consequences that are currently invisible or wrong:**

- The hero **"lift"** (0→1.5 world units) moves the product **along the view axis** under a top-down camera → essentially invisible.
- The **tumble** (x/y/z spins) reads as an in-frame "propeller" swing rather than a product rotating in profile.
- The **cap departure** (0.60–0.70) exits **upward out of frame** instead of reading like a cap being pulled off in perspective.
- There is **no perspective, no horizon, no silhouette drama, no reflections of a studio behind the product** — the flatness the review brief calls "scene and camera effects are not realistic".

This is not a bug in isolation — it is the crux of **D3**: a deliberate camera rig is required before any of the scene/lighting work reads as intended, and any future camera change will break the current standing illusion (the tube is not actually standing).

---

## 3. The four open workstreams

*(These are the areas flagged as incomplete. Direction and acceptance criteria below are proposals only — nothing is implemented.)*

### D1 — Mesh details are not realistic

**Status update (2026-10-12):** realism passes applied to `Lipstick.tsx` — Δ1 (profiled lathes, chamfers, parting lip, brushed grain) + Δ2 (beveled angled-tip bullet with rounded rim, wax grain, refined streaks across all parts — see `VERSION-DESC.md` Δ1/Δ2). Still open: prop meshes and the product-shape decision (`REFERENCE-STUDY.md` §7-A).

**Observation (screenshot + code).** The product is built from raw primitives: `cylinderGeometry` tube and cap (r 0.32, h 1.4 each), a protruding polished ring (r 0.34, h 0.05), a dark inner collar (r 0.29), a matte base cap (r 0.325, h 0.12) and a single lathe `BULLET_PROFILE` (r 0.27 → domed tip) — `app/Components/Lipstick.tsx`. A single `meshStandardMaterial` (gold `#c9a44a`, metalness 0.95, roughness 0.28) is shared by tube and cap. From the screenshot: razor-sharp un-bevelled silhouette edges, a flat satin gradient (mid-tone reads ≈ `#cbaa59`, edges fall to ≈ `#181613`), no brushed/streak response, no seam or parting-line realism, no micro-detail (knurling, chamfers, fillets, edge highlights), and the seam is faked by stacking rings rather than shown as real geometry gaps.

**Why it reads fake:**
- Machined metal always shows a **bright edge highlight** (chamfer/fillet catching the environment). With no bevels there is nothing to catch light.
- The environment is nearly black (§D3), so a "metal" material has almost nothing to reflect — it degrades to a matte gold gradient regardless of mesh quality.
- No map variety (no roughness/normal micro-variation, no anisotropy) → the surface has zero texture at close range.

**Proposed direction (future version, when requested):**
1. Rebuild the case as profile-based lathe/sweep assemblies: proper cap lip, real parting lines, chamfered ring, filleted edges (or a sculpted glTF produced in Blender and imported; `public/reference/` is staged for reference material).
2. Split materials per part with tuned recipes; add subtle micro-roughness/normal detail and anisotropic streaks for the satin finish.
3. Preserve the current track API (group transforms + `cap.y` reader) so `timeline.ts` keeps working unchanged.
4. **Acceptance:** at close-range framing, edges show machined highlights, the cap seam reads real, and the material holds up with the new environment (§D3).

### D2 — Background "table" texture colour and mapping are incorrect

**Observation (code).** `Table.tsx` maps `Marble014` Color/Normal/Roughness (2K) onto a **20×20** plane with `repeat(2,2)` → each tile spans **10 world units**, and the visible view window (fov 45 at 1875×932) is only ≈ **9.9 × 4.97 units** — i.e. the hero frame shows roughly *half of one tile* of a texture authored to read at human scale. Result (measured in the screenshot): giant warm grey-brown blotches (warm patch ≈ `#856f55`, dark areas ≈ `#221b14`) with speckle grain (highlights up to `(178,167,153)`) — it reads as "smoky dirt", not stone. Colour: `Marble014`'s albedo is a warm brown; combined with clearcoat hotspots and the near-black environment it skews muddy. No rotation/offset: the blotch direction is locked to world axes, amplifying the tiled, flat feel.

**Root causes:** (a) world-scale mapping wrong for this camera distance; (b) source texture colour doesn't match the brand's dark/gold staging; (c) specular response (clearcoat 0.4 + envMapIntensity 1.4) tuned for an environment that no longer exists in its intended form (§D3).

**Proposed direction:**
- Decide the intended surface identity first (recommend: a quiet, dark or off-white stone with sparse veining — the current warm brown fights the gold).
- Set mapping by world scale: target ≈ 2–4 world units per tile (repeat ≈ 5–10 on the 20-unit plane), add a small `rotation`/`offset` to break axis alignment; keep `RepeatWrapping`, anisotropy 16, sRGB/linear colour-space rules (already correct).
- Consider `Displacement` (present but unused) at low scale, or drop it; retune clearcoat/roughness once the new environment (§D3) exists.
- **Acceptance:** at hero framing, the surface reads as an intentional material at correct apparent scale; no visible repetition; tone supports the gold product.

### D3 — Scene and camera effects are not realistic

**Findings (audit of `Scene.tsx`):**

| Item | Current value | Issue |
|------|---------------|-------|
| Camera | `[0,6,0]`, fov 45, **no rotation** | R3F auto-`lookAt(0,0,0)` → straight-down framing (§2). No scroll-driven camera work exists. |
| Ambient | **two** ambient lights (0.35 `#20243a` + 1.2 `#ffffff`) | Duplicated intent; washes out shading |
| Hemisphere | 0.9 | Fine |
| Directional ×2 | intensity 10 `#ffd6a8` and 20 `#585654`, both casting 2048² shadows, `scale={10}` | Double shadow casters; `scale` on lights is a no-op; grey "light" at 20 intensity is excessive |
| Spot ×2 | 24 `#ffb178` (1024²) + 40 `#fff0dc` top-down (2048², `penumbra={2}` — outside the 0–1 range) | Two more shadow casters; four shadow maps/frame total |
| Point | 3, `#ffe6c8`, decay 2 | Fill; overlapping with ambient/hemisphere |
| Environment | portal children (black sphere + 2 dim Lightformers) **and** `preset="city"` **and** `environmentIntensity={100}` | Contradictory configuration: the children cubemap is a near-black studio while a preset HDR is also loaded (runtime CDN fetch — offline risk) and the intensity is extreme. Net effect: metals get an almost black IBL → flat gold. |
| ContactShadows | y 0.011, scale 10, blur 5, far 4, opacity 0.6 | OK in isolation, but stacks with 4 shadow maps → muddy, offset dark smears from multiple directions (visible as the dark slab beside the product in the screenshot) |
| Post FX | DoF / Bloom / Vignette written but **commented out** | No depth-of-field, no bloom on gold highlights, no vignette → no "cinema" |
| Background | transparent canvas over CSS `#0a0a0a` body | No fog, no backdrop, no floor falloff — flat void |

**Why it reads fake:** four competing shadow directions, a black IBL, an extreme tone-mapping exposure (1.15) over an over-lit diffuse stack, and no post-processing. The product has no crisp reflections to sell "metal"; the scene has no depth cue to sell "space".

**Proposed direction (the big one):**
1. **Camera rig** — explicit `lookAt` target; authored scroll-keyed moves (e.g. low three-quarter hero → orbit/settle at subtitle → macro push-in for the cap reveal → pull-back for sections). Add camera tracks to `timeline.ts` (same contract) and document them. The reference screenshot's standing-product framing becomes honest (product actually upright) rather than an overhead accident.
2. **Lighting consolidation** — one key (with shadows), one fill, one rim; drop duplicates; single shadow cast per object; keep ACES; re-tune exposure.
3. **Environment** — one source of truth: either a curated Lightformer studio *or* a self-hosted HDRI placed in `public/hdri/` (folder is staged), with sane intensity (start at ~1) — never preset + children together.
4. **Post FX** — re-enable and tune DoF (focal on product), Bloom (gold highlights only), light Vignette; keep `EffectComposer multisampling` for AA. Document final values in `VERSION-DESC.md`.
5. **Grounding** — single consistent contact shadow + soft sheen on the (re-mapped) table.
6. **Acceptance:** hero frame reads as a studio product shot; metal shows crisp environment reflections; no double shadows; FX subtle; still ≥ 60 fps on the dev target with dpr [1,2].

### D4 — Timeline and overall flow are missing new sections

**Findings:**
- Only two text chapters (hero, subtitle) + one placeholder ("Second Section", `SecondSection.tsx`). `SECTIONS.hand` (0.90–1.00) has **no implementation at all**; the last 10 % of scroll is empty.
- The `Overlay` blackout from ~0.40 (see §1.5) hides the scene for the majority of the scroll — the `reset`, `drop` and all future 3D beats play behind black. Either the overlay becomes a brief "dip to black" transition (in/out within ~5 % of scroll), or the flow must be restructured (recommended — see proposal).
- **SECTIONS vs tracks drift:** subtitle text lingers to 0.70 while `SECTIONS.subtitle` ends at 0.50; `cap.y` starts at 0.45 while `SECTIONS.drop` says 0.60; comment "aligned to SECTIONS.drop" is not true.
- **Orphan track:** `stick.rotation.z` (0.60–0.70) is read by nobody; `SECTIONS` itself is exported but read by nobody; `Cube`'s `cube.z` no longer exists in `TRACKS`.
- **Dead nav:** header links `#intro`, `#features`, `#product`, `#contact` point at anchors that do not exist. The nav effectively promises four sections that aren't built.
- **Staged but unused content** (clearly the intended next chapters): `app/assets/images/` — swatches `cherry`, `mocha`, `sand`, `teal` + macros `dark_glass`, `golden_silk`, `lipstick_texture`, `oil_droplet`; `MakeupProps.tsx` (pencil/mascara/brushes/powder spill); `Fabric.tsx` (draped fabric set); `public/hdri/` and `public/reference/` folders.
- **Placeholder copy:** subtitle chapter still reads *"ISN'T JUST A COASTER."* (leftover from another project template), second section headline is literally "Second Section", page metadata is still "Create Next App".

**Proposed direction (illustrative flow map — proposal only):**

| Beat | Scroll | Content | 3D |
|------|--------|---------|----|
| 1 Hero | 0.00–0.12 | LUMIERE + tagline + card | Product standing, camera 3/4, slow settle |
| 2 Statement | 0.12–0.24 | Subtitle chapter (final copy) | Orbit / light play |
| 3 Reveal & features | 0.24–0.46 | Cap reveal, macro texture cards (staged macros) | Camera push-in, cap off, bullet exposed |
| 4 Shades / collection | 0.46–0.64 | Swatch cards (cherry/mocha/sand/teal) | Table props arrange in (MakeupProps) |
| 5 Product detail | 0.64–0.80 | Specs / craft copy | Macro of ring/seam, fabric set (Fabric) |
| 6 Closing & contact | 0.80–0.95 | Brand close, contact CTA | Pull-back, hero pose return |
| 7 Outro | 0.95–1.00 | Footer | Ambient loop |

Mechanics: extend page height (300vh → ~700vh), register every beat in `SECTIONS`, add tracks per rule, add DOM layers per layout rules, decide overlay as short transition dips only. Also: wire nav anchors to real targets, replace placeholder copy, remove or implement orphan tracks.

**Acceptance:** every nav link lands somewhere real; no dead tracks; `SECTIONS` ↔ tracks in sync; overlay used only as a transition; placeholder copy replaced.

---

## 4. What is working well (keep these)

- **Timeline architecture** — one scalar → named tracks → shared easing vocabulary is clean, testable and easy to extend; `readTrack` clamping/segment semantics are correct.
- **Colour-space discipline** in `Table.tsx` (sRGB albedo, linear normal/roughness, `needsUpdate` after re-upload, anisotropy 16) — this is exactly right and should be the template for all future textures.
- **Separation of concerns** — canvas vs DOM layers, with a clear z-map and `pointer-events-none` discipline.
- **Glass card / surface language** and the header compact morph are already convincing; hero typography hierarchy is strong.
- **Staged assets and parked components** show the intended direction (macro details, swatches, props, fabric, HDRI) — they give the D4 work everything it needs.

---

## 5. Cross-cutting findings (X-items)

| # | Finding | Detail | Priority |
|---|---------|--------|----------|
| X1 | **Typography not wired** | `globals.css` declares Playfair Display (serif) + Montserrat (sans); `layout.tsx` loads Geist/Geist Mono via `next/font` and attaches variables — but *no class uses any of them*. Effective UI font = system sans fallback. Decide one family system, load it, use the tokens. | Medium |
| X2 | **Token drift** | `--color-gold: #D4AF37` (CSS) vs product gold `#c9a44a` / ring `#e8c46a` (mesh) vs UI cream `#f5e6d3`. Single palette source recommended. | Low |
| X3 | **Dependency hygiene** | `zustand` (5.0.15) and `postprocessing` (6.39.5) are used but not in `package.json` (transitive only); `lucide-react` is declared but unused; drei `preset="city"` needs a runtime CDN fetch (breaks offline; see D3). | Medium |
| X4 | **Dead / unwired inventory** | `Fabric.tsx` + `MakeupProps.tsx` not mounted; `Cube.tsx` commented (+ reads non-existent `cube.z`); `stick.rotation.z` orphan track; `SECTIONS` unused; 8 staged images unused; `public/hdri` + `public/reference` empty; EffectComposer imports unused (JSX commented); `Hero.tsx` imports Header unused; `SecondSection` `-top-50` is a no-op class; light `scale` props are no-ops; `Container` ref typed `HTMLDivElement` on a `<section>`. Most are deliberate staging — keep, but track as work items. | Low |
| X5 | **Performance budget** | 4 shadow-casting lights (2×2048² dir, 1024²+2048² spot) + ContactShadows pass + 2K maps ×3 + dpr≤2. Consolidate shadows with the D3 lighting pass; keep dpr cap. | Medium |
| X6 | **Accessibility / UX** | Lenis scroll-jack with hidden scrollbar; no `prefers-reduced-motion` handling; very small (10–11px) tracked type; anchor links have no focus-visible styling. Add reduced-motion fallback + keyboard focus states when asked. | Low |
| X7 | **Copy & metadata** | `layout.tsx` metadata still "Create Next App"; subtitle copy is a template leftover ("ISN'T JUST A COASTER."); "Second Section" placeholder. Replace as part of D4 content work. | High (brand-facing) |

---

## 6. Verification guide (for validating this review)

1. `npm run dev` and open at a wide viewport (≥1600×900) to match the reference render.
2. Scroll checkpoints to observe (current build):
   - **0 %** — top-down frame; gold column with seam ring ~47 % from top; dark base band at bottom; marble blotches with speckle; muddy offset shadow left of the product.
   - **~33 %** — scene ~2/3 blacked out; subtitle text fading in.
   - **~40 %** — scene black except floating product silhouettes.
   - **50 %** — tumble completes (in-frame swing).
   - **60–70 %** — subtitle fades out; cap departs upward out of frame.
   - **72–88 %** — "Second Section" text only.
   - **90–100 %** — nothing.
3. Measurements in §2 reproduce by projecting the tube endpoints with fov 45 / position [0,6,0] / lookAt origin.

---

## 7. Suggested sequencing (when changes are requested)

1. **D3 camera rig + lighting/env consolidation** (unlocks every other visual fix; no mesh/texture work will read correctly under the current camera/light stack).
2. **D2 table re-mapping + tone** (fast win, pairs with new env).
3. **D1 mesh upgrade** (largest modelling work; keep track API).
4. **D4 flow build-out** (content + sections + copy; extend scroll length; dissolve the permanent blackout).
5. **X-items** opportunistically (fonts/tokens/deps as touched).

---

*Appendix — current track & section tables are kept canonical in `docs/VERSION-DESC.md` (§4.4, §3.4) to avoid duplicate sources of truth.*
