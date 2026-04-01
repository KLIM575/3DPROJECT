'use client'

import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { SceneAtmosphere } from '../SceneAtmosphere'
import { CosmicParticles } from '../objects/CosmicParticles'
import { MorphingCore } from '../objects/MorphingCore'
import { CameraRig } from '../objects/CameraRig'
import { ShadowWalker } from '../objects/ShadowWalker'
import { LianaField } from '../objects/LianaField'
import { VesselAssembly } from '../objects/VesselAssembly'
import { NarrativeWorlds } from '../objects/NarrativeWorlds'
import { QualityLevel } from '@/lib/constants'

interface UnifiedSceneProps {
  scrollProgress: number
  quality: QualityLevel
}

export function UnifiedScene({ scrollProgress, quality }: UnifiedSceneProps) {
  return (
    <>
      <SceneAtmosphere progress={scrollProgress} />
      {quality !== 'low' && (
        <Suspense fallback={null}>
          <Environment
            preset="night"
            environmentIntensity={quality === 'high' ? 0.52 : 0.36}
            environmentRotation={[0, 0.9, 0]}
          />
        </Suspense>
      )}
      <CameraRig progress={scrollProgress} />
      <CosmicParticles quality={quality} progress={scrollProgress} />
      <MorphingCore progress={scrollProgress} quality={quality} />
      <NarrativeWorlds progress={scrollProgress} quality={quality} />
      <VesselAssembly progress={scrollProgress} quality={quality} />
      <LianaField progress={scrollProgress} quality={quality} />
      <ShadowWalker progress={scrollProgress} />
    </>
  )
}
