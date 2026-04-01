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
  getVesselEmeraldHighlight,
} from '@/lib/narrative'

interface BloomEffectProps {
  quality: QualityLevel
  scrollProgress?: number
}

function phaseBloomMultiplier(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 0) return 1.02
  if (phase === 1) return 0.82
  if (phase === 2) return 0.94
  if (phase === 3) return 1.04
  return 1.08
}

function dofBokehForPhase(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 4) return 2.35
  if (phase === 3) return 1.95
  if (phase === 2) return 1.72
  if (phase === 1) return 1.12
  return 1.38
}

function vignetteDarkness(scrollProgress: number): number {
  const phase = getNarrativePhaseIndex(scrollProgress)
  if (phase === 4) return 1.18
  if (phase === 1) return 1.06
  return 0.98
}

function chromaticStrength(scrollProgress: number): number {
  const vessel = getVesselEmeraldHighlight(scrollProgress)
  const phase = getNarrativePhaseIndex(scrollProgress)
  let modulation = vessel * 0.52
  if (phase === 2 || phase === 3) modulation += 0.14
  return 0.0004 + modulation * 0.0011
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
            focusDistance={0.013}
            focalLength={0.017}
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
      opacity={quality === 'high' ? 0.022 : 0.014}
    />,
    <Vignette key="vig" eskil={false} offset={0.22} darkness={vigD * 0.9} />,
  ]

  return <EffectComposer>{chain}</EffectComposer>
}
