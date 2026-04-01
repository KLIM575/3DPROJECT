'use client'

import { Suspense } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { SceneAtmosphere } from '../SceneAtmosphere'
import { CosmicParticles } from '../objects/CosmicParticles'
import { MorphingCore } from '../objects/MorphingCore'
import { CameraRig } from '../objects/CameraRig'
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
            preset="city"
            environmentIntensity={quality === 'high' ? 0.28 : 0.2}
            environmentRotation={[0, 1.15, 0]}
          />
        </Suspense>
      )}
      <CameraRig progress={scrollProgress} />
      <CosmicParticles quality={quality} progress={scrollProgress} />
      <MorphingCore progress={scrollProgress} quality={quality} />
      {quality !== 'low' && (
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.22}
          scale={14}
          blur={2.8}
          far={5}
          color="#0a0a0c"
        />
      )}
    </>
  )
}
