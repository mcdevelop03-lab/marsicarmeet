---
name: hero-3d-redesign
description: Complete redesign of MarsicaRMeet Hero section using real Nissan GTR GLTF model, splitscreen layout, cinematic lighting, with Lighthouse targets
metadata:
  type: project
---

# Hero 3D Redesign — MarsicaRMeet

**Date:** 2026-06-23
**Files affected:** `src/components/CarScene.jsx`, `src/components/Hero.jsx`

## Goals

Replace the procedural box-geometry car in CarScene with the real `nissan-gtr.glb` GLTF model.
Redesign the Hero layout to a premium splitscreen: text left, dominant 3D model right with viewport overflow.

**Lighthouse targets (desktop):**
- Performance > 85
- LCP < 2.5s
- CLS < 0.05

---

## Architecture

### File changes (no new files)

**`src/components/CarScene.jsx`** — full rewrite:
- Remove `SportsCar` procedural geometry class entirely
- Add `GltfCar` component using `useGLTF('/models/nissan-gtr.glb')`
- Call `useGLTF.preload('/models/nissan-gtr.glb')` at module level (outside component) for early fetch
- Retain `CameraRig`, `Ground`, `EffectComposer` with updated parameters
- Add `HeroLoader` component using `useProgress` from Drei

**`src/components/Hero.jsx`** — layout redesign:
- Canvas `absolute inset-0` (fullscreen behind everything)
- Left text column `max-w-xl justify-center` — preserve all existing content (title, badge, stats, CTA, ticker)
- Denser left gradient `from-[#050505] via-[#050505]/70 to-transparent`
- Replace opaque Suspense fallback `<div>` with `<HeroLoader />`

### Import strategy (performance)
- `CarScene` imported via `React.lazy()` in Hero.jsx
- `useGLTF.preload` called at CarScene module level so GLB fetch starts when the JS chunk loads
- Hero text is NOT inside Suspense — renders immediately, no LCP impact

---

## Layout

### Desktop (>= 1024px)
- `<section>` → `relative h-screen w-full overflow-hidden bg-[#050505]` (height fixed from paint — no CLS)
- Canvas → `absolute inset-0` (behind text)
- Text column → `relative z-10`, `px-8 md:px-16`, `max-w-xl`, `justify-center`
- Gradient → `bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent`
- Model group offset → `position={[1.2, -0.9, 0]}`, `scale={1.35}` — overflows right edge ~12%

### Tablet (768–1023px)
- Text column → `max-w-sm`, font-size reduced one step
- Model → `scale={1.1}`, offset reduced to `[0.8, -0.9, 0]`

### Mobile (< 768px)
- Text → centered, font smaller
- Stats → compact inline row: `150+ Auto` · `25+ Eventi` (full stats row hidden)
- Gradient changes to `gradient-to-t` (top-down) instead of left-right
- Model → `scale={1.0}`, centered `position={[0, -0.9, 0]}`
- Mouse parallax → **disabled** (isMobile check via `window.innerWidth < 768`)
- Auto-rotation → **disabled**

---

## Camera

| Property | Value |
|---|---|
| Initial position | `[6.5, 1.35, 3.8]` |
| FOV | `38` |
| LookAt target | `[0.8, 0.4, 0]` |
| Near / Far | `0.1 / 100` |

**Mouse parallax (desktop only):**
```
tx = clamp(mouse.x * 0.4, -0.3, 0.3)
ty = clamp(-mouse.y * 0.2, -0.15, 0.15)
lerp factor: 0.035
```

**Auto-rotation (desktop only):**
```
rotation.y = baseRotation + sin(time * 0.18) * 0.06
```

---

## Lighting

| Light | Type | Color | Intensity | Position |
|---|---|---|---|---|
| Key (warm front-right) | DirectionalLight | `#fff5e0` | `2.8` | `[8, 5, 4]` |
| Fill (cool left) | DirectionalLight | `#c8d8f0` | `0.6` | `[-6, 3, -2]` |
| Rim (brand orange) | DirectionalLight | `#ff6020` | `1.0` | `[-5, 2, -6]` |
| Underglow | PointLight | `#ff4500` | `2.8` dist `4` | `[0, -0.5, 0]` |
| Ambient | AmbientLight | — | `0.08` | — |

**Environment:**
- `<Environment preset="studio" environmentIntensity={0.35} background={false} />`
- Custom HDRI (`/hdri/studio_small.hdr`) can be swapped in later without code changes
- `background={false}` always — sky not visible

**ContactShadows:** `opacity={0.30}`, `blur={2.5}`, `far={8}`, `resolution={256}`

---

## Post-processing

- `Bloom`: `intensity={2.5}`, `luminanceThreshold={0.15}`, `luminanceSmoothing={0.85}`, `mipmapBlur`
- `Vignette`: `offset={0.1}`, `darkness={0.8}`

---

## Loader

Component: `HeroLoader` — rendered as Suspense fallback inside Hero.jsx.

Uses `useProgress` from `@react-three/drei`.

**Visibility rule:** stays mounted until `progress === 100 && active === false`.
Drei's `active` flag goes false only after textures and env map are flushed to GPU — prevents flash of untextured model.

**Exit:** `opacity 1 → 0` CSS transition `600ms ease`, then `display:none`.

**Layout:**
```
bg-[#050505] absolute inset-0 flex flex-col items-center justify-center gap-6
  ├── "MARSICA R-MEET"  (text-[#ff4500], text-xs, tracking-[0.35em])
  ├── progress bar track (w-48 h-0.5 bg-white/10)
  │     └── fill  (bg-[#ff4500], transition-width 300ms)
  └── "XX%"  (text-white/30, text-xs)
```

---

## Performance

| Concern | Solution |
|---|---|
| LCP | Hero text NOT in Suspense — renders immediately |
| CLS | `h-screen` on section from first paint; Suspense fallback is `absolute inset-0` — no reflow |
| Bundle size | `React.lazy()` on CarScene — Three.js chunk deferred |
| GLB fetch | `useGLTF.preload()` at module level — starts with chunk, not after render |
| GPU load | `dpr={[1, 1.5]}`, `powerPreference:"high-performance"`, `performance.regress` hook |
| Mobile | Parallax + rotation disabled; same `dpr` cap |

---

## What is NOT changed

- All Framer Motion animations in Hero.jsx (title, badge, stats, CTAs, scroll indicator)
- Ticker bar at bottom
- Event type badges (right side, desktop only)
- Stats row (2.4K+, 48, 12)
- Brand colors (#ff4500, gradient-text, neon-glow classes)
- Navbar, all other sections
