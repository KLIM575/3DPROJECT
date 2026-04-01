'use client'

import { useEffect, useRef } from 'react'
import type { QualityLevel } from '@/lib/constants'

export function BabylonChapter({ quality }: { quality: QualityLevel }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (quality === 'low') return
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let dispose: (() => void) | undefined

    const ready = import('@babylonjs/core').then((BABYLON) => {
      if (disposed || canvasRef.current !== canvas) return

      const engine = new BABYLON.Engine(canvas, true, {
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
        stencil: false,
      })

      const scene = new BABYLON.Scene(engine)
      scene.clearColor = new BABYLON.Color4(0.047, 0.047, 0.055, 1)

      const camera = new BABYLON.ArcRotateCamera(
        'cam',
        -0.95,
        1.1,
        6.4,
        BABYLON.Vector3.Zero(),
        scene,
      )
      camera.lowerRadiusLimit = 4.2
      camera.upperRadiusLimit = 11
      camera.lowerBetaLimit = 0.5
      camera.upperBetaLimit = 1.38

      const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0.2, 1, 0.2), scene)
      hemi.intensity = 0.68
      hemi.groundColor = new BABYLON.Color3(0.1, 0.1, 0.11)

      const dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(-0.45, -0.8, 0.4), scene)
      dir.intensity = 0.4
      dir.diffuse = new BABYLON.Color3(0.92, 0.84, 0.72)

      const mesh = BABYLON.MeshBuilder.CreateTorusKnot(
        'knot',
        { radius: 1.05, tube: 0.3, radialSegments: 48, tubularSegments: 14, p: 2, q: 3 },
        scene,
      )
      mesh.rotation.x = 0.38

      const pbr = new BABYLON.PBRMaterial('pbr', scene)
      pbr.albedoColor = new BABYLON.Color3(0.52, 0.45, 0.4)
      pbr.metallic = 0.9
      pbr.roughness = 0.2
      mesh.material = pbr

      const beforeRender = () => {
        mesh.rotation.y += 0.003
        camera.alpha += 0.00075
      }
      scene.registerBeforeRender(beforeRender)

      engine.runRenderLoop(() => {
        scene.render()
      })

      const onResize = () => {
        engine.resize()
      }
      window.addEventListener('resize', onResize)

      dispose = () => {
        window.removeEventListener('resize', onResize)
        scene.unregisterBeforeRender(beforeRender)
        scene.dispose()
        engine.stopRenderLoop()
        engine.dispose()
      }
    })

    return () => {
      disposed = true
      void ready.then(() => {
        dispose?.()
      })
    }
  }, [quality])

  if (quality === 'low') {
    return (
      <div className="flex min-h-[42vh] w-full items-center justify-center border border-[var(--border)] bg-[var(--bg-elevated)] px-6 text-center text-sm text-[var(--muted)]">
        3D lab is disabled in reduced performance mode.
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-full min-h-[min(52vh,560px)] w-full touch-none"
      aria-label="Babylon.js WebGL scene"
    />
  )
}
