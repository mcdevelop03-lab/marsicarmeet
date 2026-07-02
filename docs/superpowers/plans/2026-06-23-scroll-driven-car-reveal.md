# Scroll-Driven GTR Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the hero into a text-only section and a 150vh scroll-driven section where the Nissan GTR enters from off-screen left and stabilizes in a premium automotive studio pose, with zero React re-renders during scroll.

**Architecture:** `CarShowcase` owns scroll tracking via Framer Motion `useScroll` + `useTransform`, producing `carX` and `carRotY` MotionValues that are passed as props to `CarScene`. Inside `CarScene`, `GltfCar` reads these values via `.get()` inside `useFrame` and drives the GLB group with lerp — no setState, no re-renders. `HeroText` is a standalone text section with no 3D.

**Tech Stack:** React 18, Framer Motion 11 (`useScroll`, `useTransform`), `@react-three/fiber` v8, `@react-three/drei`, Three.js v0.169, Tailwind CSS 3, Vite 5.

## Global Constraints

- Zero `setState` calls during scroll — all animation runs inside `useFrame` via `MotionValue.get()`
- Animate only the root GLB group (`groupRef`) — never individual mesh children
- `useTransform` must be called unconditionally (both desktop and mobile values computed, then selected)
- Rolling road / animated Ground removed — ground is static
- Breathing Y (`sin(t * 0.55) * 0.015`) desktop only, independent of scroll
- No auto-rotation unrelated to scroll
- `dpr={[1, 1.5]}` on Canvas — never exceed 1.5x
- `useGLTF.preload('/models/nissan-gtr.glb')` at module level in CarScene.jsx
- Brand colors: `#ff4500`, `#ff6b00`, `#ffaa00`; background `#050505`
- Mobile breakpoint: `window.innerWidth < 768`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/CarScene.jsx` | Rewrite | GLB load, scroll-driven useFrame, static ground, camera rig, lights |
| `src/components/HeroText.jsx` | Create | Fullscreen text section, centered, no 3D |
| `src/components/CarShowcase.jsx` | Create | 150vh scroll container, derives MotionValues, renders sticky canvas |
| `src/App.jsx` | Modify | Replace `<Hero />` with `<HeroText /><CarShowcase />` |
| `src/components/Hero.jsx` | Delete | Replaced entirely |

---

## Task 1: Rewrite `CarScene.jsx`

**Files:**
- Modify: `src/components/CarScene.jsx` (full rewrite)

**Interfaces:**
- Produces: `default export CarScene({ mouse, isMobile, carX?, carRotY? })`
  - `mouse: React.MutableRefObject<{x:number, y:number}>`
  - `isMobile: boolean`
  - `carX: MotionValue<number> | undefined` — when undefined, static position `isMobile ? 0 : 1.2`
  - `carRotY: MotionValue<number> | undefined` — when undefined, static `0`

---

- [ ] **Step 1: Rewrite `src/components/CarScene.jsx` in full**

Replace the entire file with:

```jsx
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Stars, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

useGLTF.preload('/models/nissan-gtr.glb')

function GltfCar({ isMobile, carX, carRotY }) {
  const { scene } = useGLTF('/models/nissan-gtr.glb')
  const groupRef = useRef()
  const initialized = useRef(false)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    const targetX    = carX    ? carX.get()    : (isMobile ? 0 : 1.2)
    const targetRotY = carRotY ? carRotY.get() : 0

    // Snap on first frame — prevents position flash on mount
    if (!initialized.current) {
      groupRef.current.position.x = targetX
      groupRef.current.rotation.y = targetRotY
      initialized.current = true
    }

    groupRef.current.position.x += (targetX    - groupRef.current.position.x) * 0.08
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.06

    if (!isMobile) {
      groupRef.current.position.y = -0.9 + Math.sin(t * 0.55) * 0.015
    }
  })

  return (
    <group
      ref={groupRef}
      position={[isMobile ? 0 : -12, -0.9, 0]}
      scale={isMobile ? 1.0 : 1.35}
    >
      <primitive object={scene} />
    </group>
  )
}

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

function CameraRig({ mouse, isMobile }) {
  const { camera } = useThree()
  const tx = useRef(0)
  const ty = useRef(0)

  useFrame(() => {
    if (isMobile) {
      camera.position.set(6.5, 1.35, 3.8)
      camera.lookAt(0.8, 0.4, 0)
      return
    }

    const targetX = Math.max(-0.3, Math.min(0.3, mouse.current.x * 0.4))
    const targetY = Math.max(-0.15, Math.min(0.15, -mouse.current.y * 0.2))

    tx.current += (targetX - tx.current) * 0.035
    ty.current += (targetY - ty.current) * 0.035

    camera.position.set(6.5 + tx.current, 1.35 + ty.current, 3.8)
    camera.lookAt(0.8, 0.4, 0)
  })

  return null
}

export default function CarScene({ mouse, isMobile, carX, carRotY }) {
  return (
    <Canvas
      key="hero-canvas"
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [6.5, 1.35, 3.8], fov: 38, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: 'high-performance',
      }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={['#050505']} />

      <ambientLight intensity={0.15} />
      <directionalLight color="#fff8f0" intensity={3.5} position={[8, 5, 4]} castShadow />
      <directionalLight color="#dde8f5" intensity={1.2} position={[-6, 3, -2]} />
      <directionalLight color="#ff6020" intensity={0.6} position={[-5, 2, -6]} />

      <Environment preset="studio" environmentIntensity={0.6} background={false} />

      <CameraRig mouse={mouse} isMobile={isMobile} />
      <Ground />
      <GltfCar isMobile={isMobile} carX={carX} carRotY={carRotY} />
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.30}
        blur={2.5}
        far={8}
        resolution={256}
      />

      <Stars radius={60} depth={40} count={2000} factor={1.5} saturation={0} fade speed={0.1} />

      <EffectComposer>
        <Bloom intensity={0.25} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `✓ built` with no errors. Two chunks: `CarScene-*.js` (~337 kB) and `index-*.js` (~977 kB).

- [ ] **Step 3: Commit**

```bash
git add src/components/CarScene.jsx
git commit -m "refactor: update CarScene for scroll-driven MotionValue props

Remove rolling road, wheel traversal, auto-rotation. Add carX/carRotY
MotionValue props read via .get() in useFrame with lerp. Ground static.
Breathing Y desktop-only. Position snap on first frame prevents flash."
```

---

## Task 2: Create `HeroText.jsx`

**Files:**
- Create: `src/components/HeroText.jsx`

**Interfaces:**
- Produces: `default export HeroText()` — no props
- Consumes: nothing from other tasks (standalone)

---

- [ ] **Step 1: Create `src/components/HeroText.jsx`**

```jsx
import { motion } from 'framer-motion'

const tickerItems = [
  'RADUNO NOTTURNO MILANO · 5 LUG',
  'TRACK DAY MONZA · 13 LUG',
  'TOUR DOLOMITI · 19 LUG',
  'GRAN RADUNO ROMA · 26 LUG',
  'TRACK DAY VALLELUNGA · 3 AGO',
  'TOUR COSTIERA AMALFITANA · 10 AGO',
]

export default function HeroText() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] flex flex-col items-center justify-center text-center px-6">

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="text-[#ff4500] text-xs font-bold tracking-[0.35em] uppercase mb-5"
      >
        ◆ La Piattaforma Premium
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-6xl md:text-[6.5rem] leading-none tracking-tight mb-6 font-bebas"
      >
        VIVI LA
        <br />
        <span className="gradient-text">PASSIONE</span>
        <br />
        DEL MOTORE
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.75 }}
        className="text-gray-400 text-sm md:text-lg mb-10 max-w-lg leading-relaxed"
      >
        Raduni, Car Meet, Track Day e Tour Panoramici.
        <br />
        Unisciti alla community italiana degli appassionati.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.95 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <a
          href="#events"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ff4500] text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#ff6b00] transition-all duration-300 neon-glow"
        >
          Trova il prossimo raduno
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
        <a
          href="#map"
          className="inline-flex items-center justify-center px-8 py-4 border border-white/15 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:border-[#ff4500]/50 hover:bg-white/4 transition-all duration-300"
        >
          Vedi la mappa
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="flex gap-10 justify-center"
      >
        {[
          { num: '2.4K+', label: 'Appassionati' },
          { num: '48', label: 'Eventi/Anno' },
          { num: '12', label: 'Regioni' },
        ].map(({ num, label }) => (
          <div key={label}>
            <div className="text-3xl font-black text-white leading-none">{num}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint — narrative bridge to CarShowcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Scopri la GTR</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[#ff4500] to-transparent"
        />
      </motion.div>

      {/* Ticker bar */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-[#ff4500]/8 border-t border-[#ff4500]/20 overflow-hidden flex items-center">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap flex items-center gap-12"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-[11px] font-bold text-[#ff4500] tracking-widest uppercase">
              ● {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `✓ built` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroText.jsx
git commit -m "feat: add HeroText section — centered text-only above-the-fold

Full viewport height, centered layout, preserves all existing content
(title, badge, CTAs, stats). Scroll hint changed to 'Scopri la GTR'
as narrative bridge. No canvas, no 3D."
```

---

## Task 3: Create `CarShowcase.jsx`

**Files:**
- Create: `src/components/CarShowcase.jsx`

**Interfaces:**
- Produces: `default export CarShowcase()` — no props
- Consumes: `CarScene({ mouse, isMobile, carX, carRotY })` from `./CarScene` (Task 1)

---

- [ ] **Step 1: Create `src/components/CarShowcase.jsx`**

```jsx
import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { useScroll, useTransform } from 'framer-motion'

const CarScene = lazy(() => import('./CarScene'))

export default function CarShowcase() {
  const sectionRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Both sets always computed — useTransform cannot be called conditionally
  const desktopCarX    = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-12, 0, 1.2, 1.2])
  const desktopCarRotY = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.25, 0.08, 0, 0])
  const mobileCarX     = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [-6, 0, 0, 0])
  const mobileCarRotY  = useTransform(scrollYProgress, [0, 0.5, 0.8, 1.0], [0.15, 0.04, 0, 0])

  const carX    = isMobile ? mobileCarX    : desktopCarX
  const carRotY = isMobile ? mobileCarRotY : desktopCarRotY

  return (
    <section ref={sectionRef} className="relative h-[150vh] bg-[#050505]">
      <div className="sticky top-0 h-screen">
        <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
          <CarScene
            mouse={mouse}
            isMobile={isMobile}
            carX={carX}
            carRotY={carRotY}
          />
        </Suspense>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `✓ built` with no errors. Three chunks: `index-*.js`, `CarScene-*.js`, and possibly a `CarShowcase-*.js` depending on Vite's tree-shaking.

- [ ] **Step 3: Commit**

```bash
git add src/components/CarShowcase.jsx
git commit -m "feat: add CarShowcase — 150vh scroll-driven GTR reveal

useScroll offset [start start, end end] over 150vh gives 50vh scroll
travel. Desktop carX [-12→0→1.2→1.2], mobile [-6→0→0→0]. Both
MotionValue sets always computed (no conditional hooks). Sticky canvas
h-screen inside h-[150vh] section."
```

---

## Task 4: Wire App.jsx + delete Hero.jsx

**Files:**
- Modify: `src/App.jsx`
- Delete: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `HeroText` (Task 2), `CarShowcase` (Task 3)

---

- [ ] **Step 1: Rewrite `src/App.jsx`**

Replace the entire file with:

```jsx
import Navbar from './components/Navbar'
import HeroText from './components/HeroText'
import CarShowcase from './components/CarShowcase'
import EventsSection from './components/EventsSection'
import MapSection from './components/MapSection'
import CalendarSection from './components/CalendarSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-[#050505] text-white overflow-x-hidden">
      <Navbar />
      <HeroText />
      <CarShowcase />
      <EventsSection />
      <MapSection />
      <CalendarSection />
      <CTASection />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Delete `src/components/Hero.jsx`**

```bash
git rm src/components/Hero.jsx
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: `✓ built` with no errors. No reference to `Hero.jsx` in output.

- [ ] **Step 4: Run dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5174`. Verify:

**Above the fold (HeroText):**
- Fullscreen dark section, NO 3D canvas
- All text centered: badge, H1, subtitle, CTA buttons, stats
- Scroll hint reads "Scopri la GTR" with pulsing orange line
- Ticker scrolls at bottom

**Scroll into CarShowcase:**
- At 0% scroll into section: GTR is completely off-screen left (not visible)
- As user scrolls: GTR enters smoothly from left
- At ~50% scroll progress: GTR crosses center of viewport
- At ~80% scroll progress: GTR settles slightly right of center, three-quarter front view
- Last 20%: movement decelerates naturally (lerp trailing effect)
- Car fully visible — no clipping at viewport edges
- Ground / grid static (no rolling road)
- Breathing micro-movement visible on desktop (subtle Y oscillation)

**Mobile (resize to 375px):**
- GTR enters from left with reduced offset (−6 instead of −12)
- Settles centered (x=0), not offset right
- No breathing on mobile
- Camera fixed

**All other sections:**
- EventsSection, MapSection, etc. unchanged and visible after CarShowcase

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire HeroText + CarShowcase, remove Hero

Split single Hero into text section (HeroText) + scroll-driven 3D
reveal (CarShowcase). Hero.jsx removed. App renders both in sequence
before EventsSection."
```

---

## Self-Review

**Spec coverage:**
- ✅ HeroText: centered layout, no 3D — Task 2
- ✅ CarShowcase: 150vh, sticky canvas, `h-screen` — Task 3
- ✅ `useScroll` offset `["start start", "end end"]` — Task 3
- ✅ Desktop MotionValues `[-12, 0, 1.2, 1.2]` / `[0.25, 0.08, 0, 0]` — Task 3
- ✅ Mobile MotionValues `[-6, 0, 0, 0]` / `[0.15, 0.04, 0, 0]` — Task 3
- ✅ Both sets always computed (no conditional hooks) — Task 3
- ✅ `carX.get()` + `carRotY.get()` in useFrame — Task 1
- ✅ Lerp 0.08 on position.x, 0.06 on rotation.y — Task 1
- ✅ Position snap on first frame (`initialized` ref) — Task 1
- ✅ Breathing Y desktop-only — Task 1
- ✅ Rolling road removed, Ground static — Task 1
- ✅ Hero.jsx deleted — Task 4
- ✅ App.jsx updated — Task 4
- ✅ Mouse parallax in CarShowcase (moved from Hero) — Task 3
- ✅ `isMobile` state with resize listener — Task 3
- ✅ `useGLTF.preload` at module level — Task 1 (preserved)
- ✅ No setState during scroll — all in MotionValues + useFrame — Task 1 + 3
