'use client'

import { useRef, useMemo, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CursorEmitterProps {
  mouseNDC: MutableRefObject<THREE.Vector2>
  mouseActive: MutableRefObject<boolean>
}

const MAX_SPARKS = 180
const SPAWN_PER_FRAME = 4
const DRAG = 0.94
const GRAVITY = -3.0

const sparkVertexShader = `
  attribute float aLife;
  attribute float aSize;
  varying float vLife;

  void main() {
    vLife = clamp(aLife, 0.0, 1.0);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float size = aSize * vLife * (150.0 / -mvPos.z);
    gl_PointSize = clamp(size, 0.0, 24.0);
    gl_Position = projectionMatrix * mvPos;
  }
`

const sparkFragmentShader = `
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    // Hot core
    float core = 1.0 - smoothstep(0.0, 0.12, d);

    // 4-pointed cross rays
    float ax = abs(uv.x);
    float ay = abs(uv.y);
    float cross4 = (1.0 - smoothstep(0.0, 0.07, min(ax, ay))) * 0.55;

    // Diagonal X rays
    float dg1 = abs(uv.x - uv.y) * 0.707;
    float dg2 = abs(uv.x + uv.y) * 0.707;
    float crossX = (1.0 - smoothstep(0.0, 0.05, min(dg1, dg2))) * 0.35;

    // Soft outer glow
    float glow = 1.0 - smoothstep(0.0, 0.5, d);

    float shape = core + (cross4 + crossX) * glow + glow * 0.12;
    float alpha = shape * vLife;

    // Color: white-hot center → gold → ember
    vec3 hotWhite = vec3(1.0, 1.0, 0.95);
    vec3 gold = vec3(1.0, 0.75, 0.25);
    vec3 ember = vec3(1.0, 0.35, 0.08);

    vec3 col = mix(ember, gold, glow);
    col = mix(col, hotWhite, core);
    col *= 1.0 + core * 0.5;

    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.004) discard;
  }
`

interface SparkState {
  positions: Float32Array
  velocities: Float32Array
  lifes: Float32Array
  maxLifes: Float32Array
  sizes: Float32Array
  spawnIdx: number
}

export function CursorEmitter({ mouseNDC, mouseActive }: CursorEmitterProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const raycaster = useRef(new THREE.Raycaster())
  const cursorWorld = useRef(new THREE.Vector3(0, -1000, 0))

  const stateRef = useRef<SparkState | null>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(MAX_SPARKS * 3)
    const lifes = new Float32Array(MAX_SPARKS)
    const sparkSizes = new Float32Array(MAX_SPARKS)

    for (let i = 0; i < MAX_SPARKS; i++) {
      positions[i * 3 + 1] = -1000
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aLife', new THREE.BufferAttribute(lifes, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sparkSizes, 1))

    stateRef.current = {
      positions,
      velocities: new Float32Array(MAX_SPARKS * 3),
      lifes,
      maxLifes: new Float32Array(MAX_SPARKS),
      sizes: sparkSizes,
      spawnIdx: 0,
    }

    return geo
  }, [])

  useFrame(({ camera }, delta) => {
    const state = stateRef.current
    if (!state) return
    const dt = Math.min(delta, 0.05)

    raycaster.current.setFromCamera(mouseNDC.current, camera)
    cursorWorld.current
      .copy(raycaster.current.ray.origin)
      .addScaledVector(raycaster.current.ray.direction, 7)

    const cx = cursorWorld.current.x
    const cy = cursorWorld.current.y
    const cz = cursorWorld.current.z

    if (mouseActive.current) {
      for (let s = 0; s < SPAWN_PER_FRAME; s++) {
        const idx = state.spawnIdx
        const i3 = idx * 3

        state.positions[i3] = cx + (Math.random() - 0.5) * 0.15
        state.positions[i3 + 1] = cy + (Math.random() - 0.5) * 0.15
        state.positions[i3 + 2] = cz + (Math.random() - 0.5) * 0.15

        const speed = 1.5 + Math.random() * 3.5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        state.velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed
        state.velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 1.0
        state.velocities[i3 + 2] = Math.cos(phi) * speed

        state.lifes[idx] = 1.0
        state.maxLifes[idx] = 0.5 + Math.random() * 0.7
        state.sizes[idx] = 2.5 + Math.random() * 4.0

        state.spawnIdx = (state.spawnIdx + 1) % MAX_SPARKS
      }
    }

    for (let i = 0; i < MAX_SPARKS; i++) {
      if (state.lifes[i] <= 0) continue
      const i3 = i * 3

      state.lifes[i] -= dt / state.maxLifes[i]

      state.velocities[i3] *= DRAG
      state.velocities[i3 + 1] *= DRAG
      state.velocities[i3 + 1] += GRAVITY * dt
      state.velocities[i3 + 2] *= DRAG

      state.positions[i3] += state.velocities[i3] * dt
      state.positions[i3 + 1] += state.velocities[i3 + 1] * dt
      state.positions[i3 + 2] += state.velocities[i3 + 2] * dt

      if (state.lifes[i] <= 0) {
        state.lifes[i] = 0
        state.positions[i3 + 1] = -1000
      }
    }

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const lifeAttr = geometry.getAttribute('aLife') as THREE.BufferAttribute
    const sizeAttr = geometry.getAttribute('aSize') as THREE.BufferAttribute
    posAttr.needsUpdate = true
    lifeAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={sparkVertexShader}
        fragmentShader={sparkFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
