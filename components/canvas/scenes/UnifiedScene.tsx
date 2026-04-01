'use client'

import { SceneAtmosphere } from '../SceneAtmosphere'
import { CosmicParticles } from '../objects/CosmicParticles'
import { CameraRig } from '../objects/CameraRig'
import { QualityLevel } from '@/lib/constants'

interface UnifiedSceneProps {
  scrollProgress: number
  quality: QualityLevel
}

/** Single continuous particle field — no separate hero meshes or cross-fades */
export function UnifiedScene({ scrollProgress, quality }: UnifiedSceneProps) {
  return (
    <>
      <SceneAtmosphere progress={scrollProgress} />
      <CameraRig progress={scrollProgress} />
      <CosmicParticles quality={quality} progress={scrollProgress} />
    </>
  )
}
