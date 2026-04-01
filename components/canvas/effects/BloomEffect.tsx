'use client'

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { BLOOM_CONFIG, QualityLevel } from '@/lib/constants'

interface BloomEffectProps {
  quality: QualityLevel
  transitionProgress?: number
}

function BloomOnly({ quality }: { quality: Exclude<QualityLevel, 'low'> }) {
  const config = BLOOM_CONFIG[quality]
  return (
    <EffectComposer>
      <Bloom
        intensity={config.intensity}
        luminanceThreshold={config.luminanceThreshold}
        luminanceSmoothing={config.luminanceSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  )
}

function BloomWithCA({ quality, transitionProgress }: { quality: 'high'; transitionProgress: number }) {
  const config = BLOOM_CONFIG[quality]
  return (
    <EffectComposer>
      <Bloom
        intensity={config.intensity}
        luminanceThreshold={config.luminanceThreshold}
        luminanceSmoothing={config.luminanceSmoothing}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(transitionProgress * 0.002, transitionProgress * 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  )
}

export function BloomEffect({ quality, transitionProgress = 0 }: BloomEffectProps) {
  if (quality === 'low') return null
  if (quality === 'high' && transitionProgress > 0.01) {
    return <BloomWithCA quality="high" transitionProgress={transitionProgress} />
  }
  return <BloomOnly quality={quality} />
}
