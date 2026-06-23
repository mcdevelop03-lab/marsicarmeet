---
name: scroll-driven-car-reveal
description: Split hero into text section + scroll-driven 3D GTR reveal with Framer Motion useScroll/useTransform and R3F useFrame lerp. No setState on scroll.
metadata:
  type: project
---

# Scroll-Driven GTR Reveal — MarsicaRMeet

**Date:** 2026-06-23
**Files affected:** `src/App.jsx`, `src/components/CarScene.jsx` (modified), `src/components/Hero.jsx` (deleted), `src/components/HeroText.jsx` (new), `src/components/CarShowcase.jsx` (new)

## Goals

Split the current single Hero into two distinct sections:
1. **HeroText** — fullscreen text-only above-the-fold section, centered layout
2. **CarShowcase** — 150vh scroll-driven section where the GTR enters from left and stabilizes in a premium automotive studio pose

Zero React re-renders during scroll. All animation runs inside R3F `useFrame` via `MotionValue.get()` + lerp.

---

## Architecture

### Files

| File | Action | Responsibility |
|---|---|---|
| `src/components/HeroText.jsx` | Create | Fullscreen text section, no 3D |
| `src/components/CarShowcase.jsx` | Create | 150vh scroll container, derives MotionValues, renders sticky canvas |
| `src/components/CarScene.jsx` | Modify | Accepts `carX` + `carRotY` MotionValues; drives group via lerp in useFrame; removes rolling road; keeps breathing |
| `src/App.jsx` | Modify | Replace `<Hero />` with `<HeroText /><CarShowcase />` |
| `src/components/Hero.jsx` | Delete | Replaced by HeroText + CarShowcase |

---

## Section 1: HeroText

**Layout:** fullscreen (`h-screen`), centered (`flex flex-col items-center justify-center text-center`), background `#050505`.

**Content (unchanged from current Hero, recentered):**
- Badge: `◆ La Piattaforma Premium` — `text-[#ff4500]`
- H1: `VIVI LA / PASSIONE / DEL MOTORE` — `font-bebas`, gradient-text on PASSIONE
- Subtitle: `Raduni, Car Meet, Track Day e Tour Panoramici.`
- CTA row: `[Trova il prossimo raduno →]` + `[Vedi la mappa]`
- Stats row: `2.4K+` · `48` · `12`
- Scroll hint: `↓ Scopri la GTR` (replaces generic "Scorri") — creates narrative anticipation
- Ticker bar: preserved at bottom `absolute bottom-0`

**Framer Motion entrance animations:** preserved from current Hero (same delays and transitions).

**No canvas, no gradient overlay, no 3D.** Background is pure `#050505`.

---

## Section 2: CarShowcase

### Scroll mechanism

```jsx
const sectionRef = useRef()
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end end"]
})
// scrollYProgress: 0 when section top = viewport top
//                  1 when section bottom = viewport bottom
// Scroll travel = 150vh - 100vh = 50vh of "extra" scroll
```

### Derived MotionValues (desktop)

```jsx
const carX    = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-12, 0, 1.2, 1.2])
const carRotY = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.25, 0.08, 0, 0])
```

### Derived MotionValues (mobile, `window.innerWidth < 768`)

```jsx
const carX    = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-6, 0, 0, 0])
const carRotY = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.15, 0.04, 0, 0])
```

### JSX structure

```jsx
<section ref={sectionRef} className="relative h-[150vh] bg-[#050505]">
  <div className="sticky top-0 h-screen">
    <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
      <CarScene carX={carX} carRotY={carRotY} isMobile={isMobile} />
    </Suspense>
  </div>
</section>
```

**No `HeroLoader` in CarShowcase** — model is already loaded by HeroText section (useGLTF.preload at module level). By the time the user scrolls to CarShowcase, the GLB is cached.

---

## Animation Timeline

| Scroll % | `carX` desktop | `carRotY` | Description |
|---|---|---|---|
| 0% | −12 | 0.25 | Off-screen left |
| 50% | 0 | 0.08 | Center crossing |
| 80% | 1.2 | 0 | Final position reached |
| 100% | 1.2 | 0 | Stable (lerp natural ease-out) |

The `useTransform` interpolation is linear between keypoints. The lerp inside `useFrame` (`factor 0.08`) adds a natural trailing deceleration — no GSAP, no custom easing functions needed.

---

## CarScene Changes

### Props

```ts
CarScene({ mouse, isMobile, carX, carRotY })
// carX: MotionValue<number> | undefined
// carRotY: MotionValue<number> | undefined
// When undefined (e.g. standalone usage), defaults to static position
```

### useFrame — GltfCar

```js
useFrame((state) => {
  if (!groupRef.current) return
  const t = state.clock.elapsedTime

  // Scroll-driven transforms (read MotionValue — no re-render)
  const targetX    = carX    ? carX.get()    : (isMobile ? 0 : 1.2)
  const targetRotY = carRotY ? carRotY.get() : 0

  // Lerp — smooth, 60fps, premium trailing
  groupRef.current.position.x  += (targetX    - groupRef.current.position.x)  * 0.08
  groupRef.current.rotation.y  += (targetRotY - groupRef.current.rotation.y)  * 0.06

  // Breathing — desktop only, independent of scroll
  if (!isMobile) {
    groupRef.current.position.y = -0.9 + Math.sin(t * 0.55) * 0.015
  }
})
```

**Important:** only `groupRef` (the root GLB group) is animated. No individual mesh transforms.

### Removed from CarScene

- Rolling road (Ground group no longer has `useFrame` / position.z animation)
- `useEffect` wheel traversal + wheel rotation
- Auto-rotation `sin(t * 0.12) * 0.018` — replaced by scroll-driven rotation.y
- `rotation.z` micro roll

### Ground (simplified, static)

```jsx
function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.96, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#030303" metalness={0.85} roughness={0.15} />
      </mesh>
      <gridHelper args={[60, 60, '#1a0800', '#0d0400']} position={[0, -0.95, 0]} />
    </>
  )
}
```

No `useFrame`, no props.

---

## Camera, Lights, Environment

All unchanged from previous iteration:

- Camera: `[6.5, 1.35, 3.8]`, fov `38`, lookAt `[0.8, 0.4, 0]`
- Mouse parallax (desktop only): clamped ±0.3/±0.15, lerp 0.035
- Key: `#fff8f0` intensity `3.5` at `[8, 5, 4]`
- Fill: `#dde8f5` intensity `1.2` at `[-6, 3, -2]`
- Rim: `#ff6020` intensity `0.6` at `[-5, 2, -6]`
- Ambient: `0.15`
- Environment: `preset="studio"` `environmentIntensity={0.35}`
- ContactShadows: `opacity={0.30}`
- Bloom: `intensity={0.25}`, `luminanceThreshold={0.85}`
- Vignette: `darkness={0.55}`

---

## Performance

| Concern | Solution |
|---|---|
| Scroll re-renders | `useScroll` + `useTransform` produce MotionValues — never trigger React re-render |
| Reads in useFrame | `carX.get()` is O(1) synchronous — no overhead |
| GLB already loaded | `useGLTF.preload` at module level in CarScene — cached by time user scrolls to CarShowcase |
| Mobile perf | breathing disabled, carX range halved, no mouse parallax |

---

## What is NOT changed

- All other sections: EventsSection, MapSection, CalendarSection, CTASection, Footer
- Brand colors, Tailwind classes, font-bebas
- Navbar
- All lighting values (from previous iteration)
- Bloom / Vignette post-processing values
