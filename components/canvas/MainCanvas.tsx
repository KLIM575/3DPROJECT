'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import { UnifiedScene } from './scenes/UnifiedScene'
import { BloomEffect } from './effects/BloomEffect'
import { DPR, QualityLevel } from '@/lib/constants'

interface MainCanvasProps {
  scrollProgress: number
  quality: QualityLevel
}

function SceneContent({ scrollProgress, quality }: MainCanvasProps) {
  const frac = (scrollProgress * 4) % 1
  const transitionProgress = Math.sin(frac * Math.PI) * 0.5

  return (
    <>
      <UnifiedScene scrollProgress={scrollProgress} quality={quality} />
      <BloomEffect quality={quality} transitionProgress={transitionProgress} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
    </>
  )
}

export function MainCanvas({ scrollProgress, quality }: MainCanvasProps) {
  return (
    <Canvas
      dpr={DPR[quality]}
      camera={{ fov: 60, position: [0, 0.5, 15], near: 0.1, far: 1000 }}
      gl={{
        antialias: quality !== 'low',
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      style={{ background: '#050510' }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent scrollProgress={scrollProgress} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
