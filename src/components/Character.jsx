import { useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, SoftShadows } from '@react-three/drei'
import { EffectComposer, TiltShift2 } from '@react-three/postprocessing'
import * as THREE from 'three'

function Model({ isRotated, isZoomedIn, ...props }) {
  const { nodes, materials, animations } = useGLTF('/walking.glb')
  const { ref, actions } = useAnimations(animations)
  useEffect(() => {
    actions.walk.timeScale = 0.75
    actions.walk.reset().play()
  }, [])

  useFrame(() => {
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      isRotated ? -1.5 : 0,
      0.05
    )
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      isZoomedIn ? 1 : 0,
      0.05
    )
  })

  return (
    <group {...props} ref={ref}>
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh
        castShadow
        receiveShadow
        geometry={nodes.Ch03.geometry}
        material={materials.Ch03_Body}
        skeleton={nodes.Ch03.skeleton}
      />
    </group>
  )
}

export const Character = () => {
  const [isRotated, setIsRotated] = useState(false)
  const [isZoomedIn, setIsZoomedIn] = useState(false)

  function goToDashboard() {
    setIsRotated(false)
    setIsZoomedIn(false)
  }

  function goToJournal() {
    setIsRotated(true)
    setIsZoomedIn(false)
  }

  function goToProfile() {
    setIsRotated(false)
    setIsZoomedIn(true)
  }

  useEffect(() => {
    function onRouteChage(event) {
      const path =
        event && event.detail ? event.detail.path : window.location.pathname
      switch (path) {
        case '/':
          goToDashboard()
          break
        case '/journal':
          goToJournal()
          break
        case '/profile':
          goToProfile()
          break
        default:
          break
      }
    }

    onRouteChage()

    document.addEventListener('route-change', onRouteChage)

    return () => {
      document.removeEventListener('route-change', onRouteChage)
    }
  }, [])

  return (
    <Canvas
      shadows
      gl={{ antialias: false }}
      camera={{ position: [0, 0.5, 2.5], fov: 50 }}
    >
      <color attach="background" args={['#f0f0f0']} />
      <fog attach="fog" args={['#f0f0f0', 0, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={2}
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      <Model
        position={[0, -1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        isRotated={isRotated}
        isZoomedIn={isZoomedIn}
      />
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1.01, 0]}
        receiveShadow
      >
        <planeBufferGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial transparent opacity={0.75} />
      </mesh>
      <SoftShadows size={40} samples={16} />
      <EffectComposer disableNormalPass multisampling={4}>
        <TiltShift2 blur={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
