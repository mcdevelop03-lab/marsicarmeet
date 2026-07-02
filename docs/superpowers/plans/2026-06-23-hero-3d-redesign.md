# Hero 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the procedural box-geometry car with the real `nissan-gtr.glb` GLTF model and redesign the Hero section as a premium splitscreen automotive landing page.

**Architecture:** Two files are fully rewritten — `CarScene.jsx` drops all procedural geometry and loads the GLB via `useGLTF`; `Hero.jsx` adopts a splitscreen layout with a `React.lazy`-deferred canvas, a persistent `HeroLoader` overlay that fades out on GPU-flush, and responsive mobile adaptations. Hero text stays outside Suspense to preserve LCP.

**Tech Stack:** React 18, `@react-three/fiber` v8, `@react-three/drei`, `@react-three/postprocessing`, Three.js v0.169, Framer Motion, Tailwind CSS 3, Vite 5.

## Global Constraints

- Lighthouse desktop targets: Performance > 85, LCP < 2.5s, CLS < 0.05
- No new source files — only `src/components/CarScene.jsx` and `src/components/Hero.jsx` are modified
- Brand colors: `#ff4500` (primary), `#ff6b00`, `#ffaa00`; background `#050505`
- No OrbitControls anywhere
- Mouse parallax and auto-rotation disabled on mobile (`window.innerWidth < 768`)
- `dpr={[1, 1.5]}` on Canvas — never exceed 1.5x pixel ratio
- `useGLTF.preload('/models/nissan-gtr.glb')` at CarScene module level (outside any component)
- Underglow PointLight intensity: `2.8`; Rim DirectionalLight intensity: `1.0`
- Camera position: `[6.5, 1.35, 3.8]`, FOV `38`, lookAt `[0.8, 0.4, 0]`
- ContactShadows opacity: `0.30`
- Environment: `<Environment preset="studio" environmentIntensity={0.35} background={false} />`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/CarScene.jsx` | Full rewrite | GLTF load, camera rig, lighting, ground, postprocessing |
| `src/components/Hero.jsx` | Full rewrite | Layout, lazy import, HeroLoader overlay, responsive |

---

## Task 1: Rewrite `CarScene.jsx`

**Files:**
- Modify: `src/components/CarScene.jsx` (full rewrite)

**Interfaces:**
- Produces: `default export CarScene({ mouse: React.MutableRefObject<{x:number,y:number}>, isMobile: boolean })`
- `mouse.current.x` and `mouse.current.y` are in range `[-1, 1]`

---

- [ ] **Step 1: Verify the GLB file exists**

Run in terminal:
```bash
ls public/models/
```
Expected output: `nissan-gtr.glb` listed. If the file is missing, stop — the GLB must be present before proceeding.

- [ ] **Step 2: Rewrite `CarScene.jsx` in full**

Replace the entire contents of `src/components/CarScene.jsx` with:

```jsx
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Stars, Sparkles, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

useGLTF.preload('/models/nissan-gtr.glb')

function GltfCar({ isMobile }) {
  const { scene } = useGLTF('/models/nissan-gtr.glb')
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current || isMobile) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.06
  })

  return (
    <group
      ref={groupRef}
      position={isMobile ? [0, -0.9, 0] : [1.2, -0.9, 0]}
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

export default function CarScene({ mouse, isMobile }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [6.5, 1.35, 3.8], fov: 38, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        powerPreference: 'high-performance',
      }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 15, 40]} />

      <ambientLight intensity={0.08} />
      <directionalLight color="#fff5e0" intensity={2.8} position={[8, 5, 4]} castShadow />
      <directionalLight color="#c8d8f0" intensity={0.6} position={[-6, 3, -2]} />
      <directionalLight color="#ff6020" intensity={1.0} position={[-5, 2, -6]} />
      <pointLight color="#ff4500" intensity={2.8} distance={4} decay={2} position={[0, -0.5, 0]} />

      <Environment preset="studio" environmentIntensity={0.35} background={false} />

      <CameraRig mouse={mouse} isMobile={isMobile} />
      <Ground />
      <GltfCar isMobile={isMobile} />
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.30}
        blur={2.5}
        far={8}
        resolution={256}
      />

      <Stars radius={60} depth={40} count={3500} factor={2} saturation={0} fade speed={0.2} />
      <Sparkles
        count={100}
        scale={[12, 6, 12]}
        size={1.8}
        speed={0.25}
        color="#ff4500"
        opacity={0.6}
      />

      <EffectComposer>
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  )
}
```

- [ ] **Step 3: Run dev server and verify CarScene loads**

```bash
npm run dev
```

Open `http://localhost:5173` in browser. Verify:
- No console errors (especially no `GLTF not found` or `Cannot read properties of undefined`)
- The Nissan GTR 3D model is visible (not the old box-geometry car)
- The model rotates slowly on desktop
- Moving the mouse shifts the camera slightly
- The model is offset to the right on desktop, overflowing the viewport edge

- [ ] **Step 4: Commit Task 1**

```bash
git add src/components/CarScene.jsx
git commit -m "feat: replace procedural car with Nissan GTR GLTF model

Load nissan-gtr.glb via useGLTF, cinematic lighting (key/fill/rim/underglow),
three-quarter front camera [6.5,1.35,3.8] fov=38, clamped mouse parallax,
slow auto-rotation desktop-only, ContactShadows opacity=0.30."
```

---

## Task 2: Rewrite `Hero.jsx`

**Files:**
- Modify: `src/components/Hero.jsx` (full rewrite)

**Interfaces:**
- Consumes: `CarScene({ mouse, isMobile })` from `./CarScene` — loaded via `React.lazy()`
- Consumes: `useProgress()` from `@react-three/drei` — returns `{ progress: number, active: boolean }`

---

- [ ] **Step 1: Rewrite `Hero.jsx` in full**

Replace the entire contents of `src/components/Hero.jsx` with:

```jsx
import { useRef, useEffect, useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'

const CarScene = lazy(() => import('./CarScene'))

const tickerItems = [
  'RADUNO NOTTURNO MILANO · 5 LUG',
  'TRACK DAY MONZA · 13 LUG',
  'TOUR DOLOMITI · 19 LUG',
  'GRAN RADUNO ROMA · 26 LUG',
  'TRACK DAY VALLELUNGA · 3 AGO',
  'TOUR COSTIERA AMALFITANA · 10 AGO',
]

function HeroLoader() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!active && progress === 100) {
      setFading(true)
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [active, progress])

  if (!visible) return null

  return (
    <div
      className="absolute inset-0 z-[5] bg-[#050505] flex flex-col items-center justify-center gap-6 pointer-events-none"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 600ms ease' }}
    >
      <p className="text-[#ff4500] text-xs font-bold tracking-[0.35em] uppercase">
        MARSICA R-MEET
      </p>
      <div className="w-48 h-0.5 bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#ff4500]"
          style={{ width: `${progress}%`, transition: 'width 300ms ease' }}
        />
      </div>
      <span className="text-white/30 text-xs tabular-nums">{Math.round(progress)}%</span>
    </div>
  )
}

export default function Hero() {
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

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
          <CarScene mouse={mouse} isMobile={isMobile} />
        </Suspense>
      </div>

      {/* Loading overlay — fades out after model + textures are GPU-flushed */}
      <HeroLoader />

      {/* Desktop: left-to-right gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent pointer-events-none hidden sm:block" />
      {/* Mobile: top-to-bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent pointer-events-none sm:hidden" />
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />

      {/* Hero text — left column */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-xl">

        <motion.p
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-[#ff4500] text-xs font-bold tracking-[0.35em] uppercase mb-5"
        >
          ◆ La Piattaforma Premium
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
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
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="text-gray-400 text-sm md:text-lg mb-10 max-w-lg leading-relaxed"
        >
          Raduni, Car Meet, Track Day e Tour Panoramici.
          <br className="hidden md:block" />
          Unisciti alla community italiana degli appassionati.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="flex flex-col sm:flex-row gap-4"
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

        {/* Desktop stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-14 hidden md:flex gap-10"
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

        {/* Mobile compact stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 flex md:hidden gap-6"
        >
          {[
            { num: '150+', label: 'Auto' },
            { num: '25+', label: 'Eventi' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-black text-white leading-none">{num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Event type badges — right side, desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
      >
        {[
          { label: 'RADUNO', color: '#ff4500' },
          { label: 'CAR MEET', color: '#ff4500' },
          { label: 'TRACK DAY', color: '#ff6b00' },
          { label: 'TOUR', color: '#ffaa00' },
        ].map(({ label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 + i * 0.1 }}
            className="px-4 py-2 glass-card rounded-full text-xs font-bold tracking-widest"
            style={{ color }}
          >
            {label}
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Scorri</span>
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

- [ ] **Step 2: Run dev server and verify Hero layout**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify all of the following:

**Loading state:**
- On first load, "MARSICA R-MEET" label + orange progress bar visible on dark background
- Bar fills from 0% to 100% with percentage counter
- After loading completes, overlay fades out smoothly (600ms)
- Hero text (title, CTA buttons) is visible WHILE the loader is showing — confirms text is outside Suspense

**Desktop (> 768px) — resize browser to ≥ 1024px:**
- Nissan GTR model occupies right half, overflows right edge slightly
- Left gradient blends text column seamlessly into dark background
- Moving mouse causes subtle camera shift — model doesn't drift excessively (max ±0.3 units)
- Model rotates very slowly (breathing motion)
- Stats row shows: `2.4K+`, `48`, `12`
- Event badges visible on right: RADUNO, CAR MEET, TRACK DAY, TOUR

**Mobile (< 768px) — resize browser to 375px width:**
- Top-to-bottom gradient visible instead of left-to-right
- Model is centered (not offset right)
- Model does NOT rotate
- Moving mouse does NOT shift camera
- Compact stats visible: `150+` Auto, `25+` Eventi
- Full stats row (2.4K+, 48, 12) is hidden
- CTA buttons stack vertically

**No regressions:**
- Ticker scrolls at bottom
- Scroll indicator pulses
- All Framer Motion entrance animations play on load

- [ ] **Step 3: Commit Task 2**

```bash
git add src/components/Hero.jsx
git commit -m "feat: redesign Hero section with splitscreen layout and HeroLoader

React.lazy CarScene for bundle splitting, HeroLoader overlay with useProgress
fade-out on GPU-flush, splitscreen text-left/model-right layout, responsive
mobile gradient + compact stats, isMobile prop disables parallax and rotation."
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ GLTF model via useGLTF — Task 1 Step 2 (`GltfCar`)
- ✅ useGLTF.preload at module level — Task 1 Step 2
- ✅ Camera `[6.5, 1.35, 3.8]` fov 38 — Task 1 Step 2 (`CameraRig`, Canvas)
- ✅ Clamped mouse parallax ±0.3/±0.15 — Task 1 Step 2 (`CameraRig`)
- ✅ Auto-rotation `sin * 0.06` — Task 1 Step 2 (`GltfCar.useFrame`)
- ✅ Mobile: rotation + parallax disabled — Task 1 Step 2 (isMobile checks)
- ✅ Key/Fill/Rim/Underglow/Ambient lights — Task 1 Step 2 (Canvas lights)
- ✅ Environment preset="studio" intensity=0.35 — Task 1 Step 2
- ✅ ContactShadows opacity=0.30 — Task 1 Step 2
- ✅ Bloom + Vignette — Task 1 Step 2 (EffectComposer)
- ✅ HeroLoader with useProgress, progress bar, fade-out — Task 2 Step 1
- ✅ Hero text outside Suspense (LCP) — Task 2 Step 1 (structure)
- ✅ h-screen on section (CLS) — Task 2 Step 1 (`relative h-screen`)
- ✅ React.lazy for CarScene (bundle split) — Task 2 Step 1
- ✅ Splitscreen layout, model offset [1.2,-0.9,0] scale=1.35 — Task 1 Step 2
- ✅ Mobile compact stats 150+/25+ — Task 2 Step 1
- ✅ Desktop/mobile gradient swap — Task 2 Step 1
- ✅ All existing Hero content preserved — Task 2 Step 1
