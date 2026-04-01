'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { CosmicParticles } from '../objects/CosmicParticles'
import { MorphingCore } from '../objects/MorphingCore'
import { CameraRig } from '../objects/CameraRig'
import { CursorEmitter } from '../objects/CursorEmitter'
import { QualityLevel } from '@/lib/constants'

interface UnifiedSceneProps {
  scrollProgress: number
  quality: QualityLevel
}

export function UnifiedScene({ scrollProgress, quality }: UnifiedSceneProps) {
  const mouseNDC = useRef(new THREE.Vector2(-10, -10))
  const mouseActive = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      mouseActive.current = true
    }
    const onLeave = () => {
      mouseActive.current = false
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <CameraRig progress={scrollProgress} />
      <CosmicParticles
        quality={quality}
        progress={scrollProgress}
        mouseNDC={mouseNDC}
        mouseActive={mouseActive}
      />
      <MorphingCore progress={scrollProgress} quality={quality} />
      <CursorEmitter mouseNDC={mouseNDC} mouseActive={mouseActive} />
    </>
  )
}
