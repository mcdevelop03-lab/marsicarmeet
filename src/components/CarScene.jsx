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
