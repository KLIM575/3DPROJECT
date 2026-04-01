'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel } from '@/lib/constants'
import { getNarrativePhaseIndex } from '@/lib/narrative'

interface VesselAssemblyProps {
  progress: number
  quality: QualityLevel
}

const METAL = '#1c2229'
const METAL_RIM = '#252d36'

export function VesselAssembly({ progress, quality }: VesselAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress

  const floorMat = useRef<THREE.MeshStandardMaterial>(null)
  const baseMat = useRef<THREE.MeshStandardMaterial>(null)
  const rimMat = useRef<THREE.MeshStandardMaterial>(null)
  const strutMats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const glassMat = useRef<THREE.MeshPhysicalMaterial>(null)
  const wireMats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const lightCoreRef = useRef<THREE.PointLight>(null)
  const lightFillRef = useRef<THREE.PointLight>(null)

  const strutCount = quality === 'low' ? 0 : quality === 'medium' ? 8 : 14
  const wireTubeCount = quality === 'low' ? 5 : quality === 'high' ? 16 : 10

  const hangingWires = useMemo(() => {
    const geos: THREE.TubeGeometry[] = []
    const rTop = 1.36
    const yTop = 0.98
    for (let i = 0; i < wireTubeCount; i++) {
      const ang = (i / wireTubeCount) * Math.PI * 2 + 0.17 + (i % 3) * 0.08
      const sag = 0.35 + (i % 5) * 0.12
      const p0 = new THREE.Vector3(Math.cos(ang) * rTop, yTop, Math.sin(ang) * rTop)
      const p1 = new THREE.Vector3(
        Math.cos(ang) * (rTop + 0.55),
        yTop - 1.1 - sag,
        Math.sin(ang) * (rTop + 0.55),
      )
      const p2 = new THREE.Vector3(Math.cos(ang) * 2.4, -1.05, Math.sin(ang) * 2.4)
      const curve = new THREE.CatmullRomCurve3([p0, p1, p2])
      geos.push(new THREE.TubeGeometry(curve, quality === 'high' ? 22 : 14, 0.014, 5, false))
    }
    return geos
  }, [quality, wireTubeCount])

  useEffect(() => {
    return () => {
      hangingWires.forEach((g) => g.dispose())
    }
  }, [hangingWires])

  useFrame(({ clock }) => {
    const phase = getNarrativePhaseIndex(progressRef.current)
    const vesselCore = phase === 5
    const fadingOut = phase === 6
    const show = vesselCore || fadingOut
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 2.1) * 0.5
    const k = vesselCore ? 1 : fadingOut ? 0.35 : 0

    const floorOp = show ? 0.92 * k : 0
    const baseEmissive = show ? (0.45 + pulse * 0.35) * k : 0
    const metalOp = show ? 0.96 * k : 0
    const glassOp = show ? (0.55 + pulse * 0.2) * k : 0

    if (floorMat.current) {
      floorMat.current.opacity = floorOp
      floorMat.current.transparent = floorOp < 0.99
    }
    if (baseMat.current) {
      baseMat.current.opacity = Math.min(1, metalOp + 0.1)
      baseMat.current.transparent = baseMat.current.opacity < 0.99
      baseMat.current.emissiveIntensity = baseEmissive
    }
    if (rimMat.current) {
      rimMat.current.opacity = metalOp
      rimMat.current.transparent = metalOp < 0.99
    }
    strutMats.current.forEach((m) => {
      if (!m) return
      m.opacity = metalOp
      m.transparent = metalOp < 0.99
    })
    wireMats.current.forEach((m) => {
      if (!m) return
      m.opacity = metalOp * 0.95
      m.transparent = m.opacity < 0.99
    })
    if (glassMat.current) {
      glassMat.current.opacity = glassOp
      glassMat.current.transparent = true
    }

    const li = (2.4 + pulse * 1.2) * k
    const li2 = (0.85 + pulse * 0.35) * k
    if (lightCoreRef.current) lightCoreRef.current.intensity = li
    if (lightFillRef.current) lightFillRef.current.intensity = li2

    if (groupRef.current) {
      const vis =
        floorOp > 0.04 ||
        metalOp > 0.04 ||
        (glassMat.current?.opacity ?? 0) > 0.04 ||
        wireMats.current.some((m) => (m?.opacity ?? 0) > 0.04)
      groupRef.current.visible = vis
    }
  })

  const strutAngles = useMemo(
    () => Array.from({ length: strutCount }, (_, i) => (i / strutCount) * Math.PI * 2),
    [strutCount],
  )

  return (
    <group ref={groupRef}>
      <pointLight ref={lightCoreRef} position={[0, 0.05, 0]} color="#8dffc8" distance={9} decay={2} intensity={0} />
      <pointLight
        ref={lightFillRef}
        position={[1.8, 0.4, 2.2]}
        color="#b4e8ff"
        distance={14}
        decay={2}
        intensity={0}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial
          ref={floorMat}
          color="#050807"
          metalness={0.94}
          roughness={0.26}
          envMapIntensity={0.85}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.29, 0]}>
        <ringGeometry args={[1.05, 1.42, 48]} />
        <meshStandardMaterial
          ref={baseMat}
          color="#0c1812"
          emissive="#3dff8a"
          emissiveIntensity={0}
          metalness={0.55}
          roughness={0.42}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.02, 0]}>
        <torusGeometry args={[1.38, 0.058, 10, quality === 'high' ? 96 : 48]} />
        <meshStandardMaterial
          ref={rimMat}
          color={METAL_RIM}
          metalness={1}
          roughness={0.38}
          envMapIntensity={1}
          transparent
          opacity={0}
        />
      </mesh>

      {strutAngles.map((a, i) => (
        <mesh
          key={`strut-${i}`}
          position={[Math.cos(a) * 1.33, 0.04, Math.sin(a) * 1.33]}
        >
          <cylinderGeometry args={[0.026, 0.032, 1.92, 6]} />
          <meshStandardMaterial
            ref={(el) => {
              strutMats.current[i] = el
            }}
            color={METAL}
            metalness={1}
            roughness={0.45}
            envMapIntensity={0.85}
            transparent
            opacity={0}
          />
        </mesh>
      ))}

      {quality === 'high' && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <torusGeometry args={[0.58, 0.024, 12, 56]} />
          <meshPhysicalMaterial
            ref={glassMat}
            color="#e8f8ff"
            metalness={0}
            roughness={0.12}
            transmission={0.92}
            thickness={0.55}
            ior={1.52}
            transparent
            opacity={0}
            envMapIntensity={1}
          />
        </mesh>
      )}

      {hangingWires.map((geo, i) => (
        <mesh key={`hang-${quality}-${i}`} geometry={geo}>
          <meshStandardMaterial
            ref={(el) => {
              wireMats.current[i] = el
            }}
            color="#3d4854"
            metalness={0.9}
            roughness={0.48}
            envMapIntensity={0.7}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}
