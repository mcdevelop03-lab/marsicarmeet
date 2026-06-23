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

    const targetX    = carX    != null ? carX.get()    : (isMobile ? 0 : 1.2)
    const targetRotY = carRotY != null ? carRotY.get() : 0

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
      position={[carX != null ? (isMobile ? 0 : -12) : (isMobile ? 0 : 1.2), -0.9, 0]}
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
