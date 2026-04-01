'use client'

import { useMemo } from 'react'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { BLOOM_CONFIG, QualityLevel } from '@/lib/constants'
import {
  getNarrativePhaseIndex,
  getNarrativePhaseLocalT,
  getVesselEmeraldHighlight,
} from '@/lib/narrative'

interface BloomEffectProps {
  quality: QualityLevel
  scrollProgress?: number
}

function phaseBloomMultiplier(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 0) return 1.05
  if (phase === 1 || phase === 2) return 0.72
  if (phase === 3) return 0.95
  if (phase === 4) return 1.08
  if (phase === 5) return 1.02
  if (phase === 6 || phase === 7) return 0.88
  return 0.92
}

function dofBokehForPhase(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 5) return 2.6
  if (phase === 4) return 2.1
  if (phase === 3) return 1.65
  if (phase === 1 || phase === 2) return 1.1
  return 1.55
}

function vignetteDarkness(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 5) return 1.28
  if (phase === 4) return 1.12
  if (phase === 1 || phase === 2) return 1.06
  return 0.98
}

function chromaticStrength(scrollProgress: number): number {
  const vessel = getVesselEmeraldHighlight(scrollProgress)
  const phase = getNarrativePhaseIndex(scrollProgress)
  const localT = getNarrativePhaseLocalT(scrollProgress)
  let modulation = vessel * 0.52
  if (phase === 3 || phase === 4) {
    modulation += Math.sin(localT * Math.PI) * 0.2
  }
  return 0.0006 + modulation * 0.0012
}

export function BloomEffect({ quality, scrollProgress = 0 }: BloomEffectProps) {
  const caOffset = useMemo(() => {
    const s = chromaticStrength(scrollProgress)
    return new THREE.Vector2(s, s)
  }, [scrollProgress])

  if (quality === 'low') return null

  const config = BLOOM_CONFIG[quality]
  const m = phaseBloomMultiplier(scrollProgress)
  const dofBokeh = dofBokehForPhase(scrollProgress)
  const vigD = vignetteDarkness(scrollProgress)

  const chain = [
    ...(quality === 'high'
      ? [
          <DepthOfField
            key="dof"
            focusDistance={0.014}
            focalLength={0.016}
            bokehScale={dofBokeh}
            height={480}
          />,
        ]
      : []),
    <Bloom
      key="bloom"
      intensity={config.intensity * m}
      luminanceThreshold={config.luminanceThreshold}
      luminanceSmoothing={config.luminanceSmoothing}
      mipmapBlur
    />,
    ...(quality === 'high'
      ? [
          <ChromaticAberration
            key="ca"
            blendFunction={BlendFunction.NORMAL}
            offset={caOffset}
            radialModulation={false}
            modulationOffset={0}
          />,
        ]
      : []),
    <Noise
      key="noise"
      blendFunction={BlendFunction.OVERLAY}
      opacity={quality === 'high' ? 0.022 : 0.016}
    />,
    <Vignette key="vig" eskil={false} offset={0.2} darkness={vigD * 0.92} />,
  ]

  return <EffectComposer>{chain}</EffectComposer>
}
