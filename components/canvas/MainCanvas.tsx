'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import { UnifiedScene } from './scenes/UnifiedScene'
import { BloomEffect } from './effects/BloomEffect'
import { COLORS, DPR, QualityLevel } from '@/lib/constants'
import { onCanvasCreated } from '@/lib/threeRendererSetup'

interface MainCanvasProps {
  scrollProgress: number
  quality: QualityLevel
}

function SceneContent({ scrollProgress, quality }: MainCanvasProps) {
  return (
    <>
      <UnifiedScene scrollProgress={scrollProgress} quality={quality} />
      <BloomEffect quality={quality} scrollProgress={scrollProgress} />
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
      camera={{ fov: 56, position: [0, 3.2, 22.5], near: 0.06, far: 2600 }}
      gl={{
        antialias: quality !== 'low',
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        preserveDrawingBuffer: false,
      }}
      onCreated={onCanvasCreated}
      style={{ background: COLORS.canvasClear }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent scrollProgress={scrollProgress} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
