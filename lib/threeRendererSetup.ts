import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Color pipeline defaults (Three.js r152+).
 * @see https://threejs.org/docs/#manual/en/introduction/Color-management
 */
export function configureRenderer(gl: THREE.WebGLRenderer): void {
  gl.outputColorSpace = THREE.SRGBColorSpace
  gl.toneMapping = THREE.ACESFilmicToneMapping
  gl.toneMappingExposure = 1
  gl.setClearColor(0x0c0c0e, 1)
}

export function onCanvasCreated(state: RootState): void {
  configureRenderer(state.gl)
}
