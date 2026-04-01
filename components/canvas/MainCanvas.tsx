'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import { HeroScene } from './scenes/HeroScene'
import { ProjectsScene } from './scenes/ProjectsScene'
import { AboutScene } from './scenes/AboutScene'
import { ServicesScene } from './scenes/ServicesScene'
import { ContactScene } from './scenes/ContactScene'
import { BloomEffect } from './effects/BloomEffect'
import { useSceneTransition } from '@/hooks/useSceneTransition'
import { useSectionProgress } from '@/hooks/useScrollProgress'
import { DPR, QualityLevel, SCENE_RANGES } from '@/lib/constants'

interface MainCanvasProps {
  scrollProgress: number
  quality: QualityLevel
}

function SceneContent({ scrollProgress, quality }: MainCanvasProps) {
  const visibility = useSceneTransition(scrollProgress)

  const heroProgress = useSectionProgress(SCENE_RANGES.hero.start, SCENE_RANGES.hero.end, scrollProgress)
  const projectsProgress = useSectionProgress(SCENE_RANGES.projects.start, SCENE_RANGES.projects.end, scrollProgress)
  const aboutProgress = useSectionProgress(SCENE_RANGES.about.start, SCENE_RANGES.about.end, scrollProgress)
  const servicesProgress = useSectionProgress(SCENE_RANGES.services.start, SCENE_RANGES.services.end, scrollProgress)
  const contactProgress = useSectionProgress(SCENE_RANGES.contact.start, SCENE_RANGES.contact.end, scrollProgress)

  // Detect scene transition for chromatic aberration
  const isTransitioning = Object.values(visibility).filter(v => v.active).length > 1
  const transitionProgress = isTransitioning ? 1 : 0

  return (
    <>
      {/* Camera is set via Canvas camera prop */}

      {/* Scenes */}
      <HeroScene
        opacity={visibility.hero.opacity}
        quality={quality}
        scrollProgress={heroProgress}
      />
      <ProjectsScene
        opacity={visibility.projects.opacity}
        quality={quality}
        sectionProgress={projectsProgress}
      />
      <AboutScene
        opacity={visibility.about.opacity}
        quality={quality}
        sectionProgress={aboutProgress}
      />
      <ServicesScene
        opacity={visibility.services.opacity}
        quality={quality}
        sectionProgress={servicesProgress}
      />
      <ContactScene
        opacity={visibility.contact.opacity}
        quality={quality}
        sectionProgress={contactProgress}
      />

      {/* Post-processing */}
      <BloomEffect quality={quality} transitionProgress={transitionProgress} />

      {/* Performance */}
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
      camera={{ fov: 60, position: [0, 0, 8], near: 0.1, far: 1000 }}
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
