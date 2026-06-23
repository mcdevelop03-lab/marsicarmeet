import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Sparkles, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function SportsCar({ mouse }) {
  const carRef = useRef()
  const rotY = useRef(0)

  useFrame((state) => {
    if (!carRef.current) return
    rotY.current += (mouse.current.x * 0.35 - rotY.current) * 0.04
    carRef.current.rotation.y = rotY.current + Math.sin(state.clock.elapsedTime * 0.25) * 0.04
    carRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.55) * 0.07
  })

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#080808', metalness: 0.96, roughness: 0.04 }), [])
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#050505', metalness: 0.9, roughness: 0.1 }), [])
  const tireMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111', metalness: 0.2, roughness: 0.9 }), [])
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#777', metalness: 0.97, roughness: 0.03 }), [])
  const tailMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 10 }), [])
  const headMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff8800', emissive: '#ff6600', emissiveIntensity: 6 }), [])
  const caliperMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff2200', emissive: '#ff0000', emissiveIntensity: 2 }), [])
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#060a12', metalness: 0.4, roughness: 0.05, transparent: true, opacity: 0.55 }), [])

  const wheelPositions = [
    [-1.48, -0.2, 1.0],
    [1.48, -0.2, 1.0],
    [-1.48, -0.2, -1.0],
    [1.48, -0.2, -1.0],
  ]

  return (
    <group ref={carRef} position={[0, -0.5, 0]}>
      {/* === BODY === */}
      {/* Chassis / floor */}
      <mesh material={darkMat} position={[0, 0, 0]}>
        <boxGeometry args={[4.5, 0.22, 2.0]} />
      </mesh>
      {/* Lower body panels */}
      <mesh material={bodyMat} position={[0, 0.33, 0]}>
        <boxGeometry args={[4.2, 0.42, 1.96]} />
      </mesh>
      {/* Hood — slopes down toward front */}
      <mesh material={bodyMat} position={[1.55, 0.52, 0]} rotation={[0, 0, -0.14]}>
        <boxGeometry args={[1.5, 0.08, 1.9]} />
      </mesh>
      {/* Cabin roof */}
      <mesh material={darkMat} position={[-0.18, 0.82, 0]}>
        <boxGeometry args={[2.2, 0.52, 1.78]} />
      </mesh>
      {/* Trunk lid */}
      <mesh material={bodyMat} position={[-1.62, 0.57, 0]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[1.0, 0.07, 1.92]} />
      </mesh>

      {/* === AERO === */}
      {/* Front splitter */}
      <mesh material={darkMat} position={[2.32, 0.06, 0]}>
        <boxGeometry args={[0.38, 0.12, 2.08]} />
      </mesh>
      {/* Rear diffuser */}
      <mesh material={darkMat} position={[-2.28, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.18, 2.0]} />
      </mesh>
      {/* Spoiler post */}
      <mesh material={bodyMat} position={[-2.15, 0.88, 0]}>
        <boxGeometry args={[0.12, 0.5, 1.96]} />
      </mesh>
      {/* Spoiler wing */}
      <mesh material={bodyMat} position={[-2.15, 1.14, 0]}>
        <boxGeometry args={[0.58, 0.07, 2.08]} />
      </mesh>
      {/* Side skirts */}
      <mesh material={darkMat} position={[0, 0.04, 1.06]}>
        <boxGeometry args={[3.6, 0.1, 0.1]} />
      </mesh>
      <mesh material={darkMat} position={[0, 0.04, -1.06]}>
        <boxGeometry args={[3.6, 0.1, 0.1]} />
      </mesh>

      {/* === GLASS === */}
      {/* Windshield */}
      <mesh material={glassMat} position={[0.82, 0.9, 0]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[0.62, 0.44, 1.7]} />
      </mesh>
      {/* Rear window */}
      <mesh material={glassMat} position={[-1.0, 0.87, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.52, 0.4, 1.7]} />
      </mesh>

      {/* === WHEELS === */}
      {wheelPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tyre */}
          <mesh material={tireMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.28, 28]} />
          </mesh>
          {/* Rim */}
          <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.30, 0.30, 0.29, 10]} />
          </mesh>
          {/* Centre cap */}
          <mesh material={bodyMat} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, i % 2 === 0 ? 0.135 : -0.135]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
          </mesh>
          {/* Brake caliper */}
          <mesh material={caliperMat} position={[0, 0.22, i % 2 === 0 ? 0.1 : -0.1]}>
            <boxGeometry args={[0.2, 0.1, 0.06]} />
          </mesh>
        </group>
      ))}

      {/* === LIGHTS === */}
      {/* Taillights */}
      <mesh material={tailMat} position={[-2.26, 0.44, 0.72]}>
        <boxGeometry args={[0.07, 0.1, 0.36]} />
      </mesh>
      <mesh material={tailMat} position={[-2.26, 0.44, -0.72]}>
        <boxGeometry args={[0.07, 0.1, 0.36]} />
      </mesh>
      {/* Tail bar */}
      <mesh material={tailMat} position={[-2.26, 0.44, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.48]} />
      </mesh>
      {/* Headlights */}
      <mesh material={headMat} position={[2.26, 0.44, 0.68]}>
        <boxGeometry args={[0.07, 0.09, 0.26]} />
      </mesh>
      <mesh material={headMat} position={[2.26, 0.44, -0.68]}>
        <boxGeometry args={[0.07, 0.09, 0.26]} />
      </mesh>

      {/* === NEON UNDERGLOW === */}
      <pointLight position={[0, -0.38, 0]} color="#ff4500" intensity={8} distance={6} decay={2} />
      <pointLight position={[1.8, -0.36, 0]} color="#ff2200" intensity={4} distance={3.5} decay={2} />
      <pointLight position={[-1.8, -0.36, 0]} color="#ff4500" intensity={4} distance={3.5} decay={2} />
      {/* Headlight projection */}
      <pointLight position={[3.2, 0.4, 0.7]} color="#ff9900" intensity={4} distance={8} decay={2} />
      <pointLight position={[3.2, 0.4, -0.7]} color="#ff9900" intensity={4} distance={8} decay={2} />
      {/* Taillight glow */}
      <pointLight position={[-3.0, 0.44, 0]} color="#ff0000" intensity={5} distance={5} decay={2} />

      {/* Ground neon pool */}
      <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 4.5]} />
        <meshBasicMaterial color="#ff4500" transparent opacity={0.07} />
      </mesh>
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

function CameraRig({ mouse }) {
  const { camera } = useThree()
  const tx = useRef(0)
  const ty = useRef(0)

  useFrame(() => {
    tx.current += (mouse.current.x * 0.6 - tx.current) * 0.04
    ty.current += (-mouse.current.y * 0.3 - ty.current) * 0.04
    camera.position.set(4.5 + tx.current, 1.4 + ty.current, 0.3)
    camera.lookAt(0, 0.1, 0)
  })

  return null
}

export default function CarScene({ mouse }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [4.5, 1.4, 0.3], fov: 42 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 12, 35]} />

      <ambientLight intensity={0.04} />
      <hemisphereLight skyColor="#0a0a0a" groundColor="#000" intensity={0.3} />

      <Environment preset="city" background={false} />

      <CameraRig mouse={mouse} />
      <Ground />
      <SportsCar mouse={mouse} />

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
