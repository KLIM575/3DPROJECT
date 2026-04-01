'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA_WAYPOINTS } from '@/lib/constants'
import { getNarrativePhaseIndex, narrativeCameraParam } from '@/lib/narrative'

interface CameraRigProps {
  progress: number
}

export function CameraRig({ progress }: CameraRigProps) {
  const { camera } = useThree()
  const progressRef = useRef(progress)
  progressRef.current = progress

  const currentPos = useRef(new THREE.Vector3(
    CAMERA_WAYPOINTS[0].pos[0],
    CAMERA_WAYPOINTS[0].pos[1],
    CAMERA_WAYPOINTS[0].pos[2],
  ))
  const currentLookAt = useRef(new THREE.Vector3(
    CAMERA_WAYPOINTS[0].lookAt[0],
    CAMERA_WAYPOINTS[0].lookAt[1],
    CAMERA_WAYPOINTS[0].lookAt[2],
  ))
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const vForward = useRef(new THREE.Vector3())
  const vRight = useRef(new THREE.Vector3())
  const vUp = useRef(new THREE.Vector3(0, 1, 0))

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const p = progressRef.current
    const camT = narrativeCameraParam(p)
    const wp = CAMERA_WAYPOINTS
    const maxIdx = wp.length - 1

    const raw = Math.min(Math.max(camT, 0), 1) * maxIdx
    const idx = Math.floor(raw)
    const t = raw - idx
    const st = t * t * (3 - 2 * t)
    const next = Math.min(idx + 1, maxIdx)

    targetPos.current.set(
      wp[idx].pos[0] + (wp[next].pos[0] - wp[idx].pos[0]) * st,
      wp[idx].pos[1] + (wp[next].pos[1] - wp[idx].pos[1]) * st,
      wp[idx].pos[2] + (wp[next].pos[2] - wp[idx].pos[2]) * st,
    )
    targetLookAt.current.set(
      wp[idx].lookAt[0] + (wp[next].lookAt[0] - wp[idx].lookAt[0]) * st,
      wp[idx].lookAt[1] + (wp[next].lookAt[1] - wp[idx].lookAt[1]) * st,
      wp[idx].lookAt[2] + (wp[next].lookAt[2] - wp[idx].lookAt[2]) * st,
    )

    const phase = getNarrativePhaseIndex(p)
    const wobbleScale =
      phase === 4 ? 0.014 : phase === 3 ? 0.026 : phase === 2 ? 0.036 : 0.05
    const wobbleX = Math.sin(time * 0.11) * wobbleScale
    const wobbleY = Math.cos(time * 0.09) * wobbleScale * 0.65

    targetPos.current.x += wobbleX
    targetPos.current.y += wobbleY

    vForward.current.subVectors(targetLookAt.current, targetPos.current)
    if (vForward.current.lengthSq() > 1e-8) {
      vForward.current.normalize()
      vRight.current.crossVectors(vUp.current, vForward.current).normalize()
      const orbitA = time * 0.14 + p * 5.5
      const orbitB = time * 0.1 + p * 3.2
      const orbitMag = 0.42 + phase * 0.04
      targetPos.current.addScaledVector(vRight.current, Math.sin(orbitA) * orbitMag * 0.22)
      targetPos.current.addScaledVector(vUp.current, Math.cos(orbitB) * orbitMag * 0.14)
      targetLookAt.current.addScaledVector(vRight.current, Math.sin(orbitA * 0.85) * orbitMag * 0.06)
    }

    const lerpSpeed = phase === 4 ? 0.021 : 0.027
    currentPos.current.lerp(targetPos.current, lerpSpeed)
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
