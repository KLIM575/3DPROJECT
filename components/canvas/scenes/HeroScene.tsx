'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleField } from '../objects/ParticleField'
import { NeonGrid } from '../objects/NeonGrid'
import { FloatingGeometry } from '../objects/FloatingGeometry'
import { GlowingLines } from '../objects/GlowingLines'
import { QualityLevel } from '@/lib/constants'

interface HeroSceneProps {
  opacity: number
  quality: QualityLevel
  scrollProgress: number
}

export function HeroScene({ opacity, quality, scrollProgress }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    // Slow camera drift
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.1
    // Subtle camera push on scroll
    groupRef.current.position.z = -scrollProgress * 3
  })

  if (opacity < 0.01) return null

  return (
    <group ref={groupRef}>
      <ParticleField
        quality={quality}
        color="#00FFFF"
        spread={25}
        opacity={opacity}
      />
      <NeonGrid color="#00FFFF" opacity={opacity * 0.7} size={50} />
      <FloatingGeometry count={quality === 'low' ? 6 : 12} color="#00FFFF" opacity={opacity} />
      {quality !== 'low' && (
        <GlowingLines count={quality === 'high' ? 25 : 15} color="#0088FF" opacity={opacity} />
      )}

      {/* Central glow sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color="#00FFFF"
          transparent
          opacity={opacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient light rings */}
      {[1.5, 3, 5].map((r, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
          <meshBasicMaterial
            color="#00FFFF"
            transparent
            opacity={opacity * (0.3 - i * 0.08)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
