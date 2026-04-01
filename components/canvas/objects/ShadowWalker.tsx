'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getNarrativePhaseIndex } from '@/lib/narrative'

interface ShadowWalkerProps {
  progress: number
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uOpacity;
  void main() {
    vec2 c = vUv - 0.5;
    c.x *= 0.52;
    float head = 1.0 - smoothstep(0.1, 0.2, length(c - vec2(0.0, 0.3)));
    float body = 1.0 - smoothstep(0.07, 0.19, abs(c.x) + abs(c.y - 0.02) * 0.92);
    float legs = 1.0 - smoothstep(0.055, 0.13, abs(c.x - 0.055) + abs(c.y + 0.27));
    float legs2 = 1.0 - smoothstep(0.055, 0.13, abs(c.x + 0.055) + abs(c.y + 0.27));
    float m = clamp(max(head, max(body, max(legs, legs2))), 0.0, 1.0);
    float soft = smoothstep(0.0, 0.1, m);
    vec3 col = vec3(0.015, 0.04, 0.025);
    gl_FragColor = vec4(col, soft * uOpacity * 0.88);
    if (gl_FragColor.a < 0.02) discard;
  }
`

const shadowFrag = `
  varying vec2 vUv;
  uniform float uOpacity;
  void main() {
    vec2 q = vUv - 0.5;
    q.x *= 1.35;
    float d = length(q);
    float a = (1.0 - smoothstep(0.2, 0.48, d)) * uOpacity * 0.35;
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    if (a < 0.008) discard;
  }
`

export function ShadowWalker({ progress }: ShadowWalkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
    }),
    [],
  )
  const groundUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
    }),
    [],
  )
  const groundMatRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    const phase = getNarrativePhaseIndex(progressRef.current)
    const inForest = phase === 1 || phase === 2
    const targetOp = inForest ? 0.94 : 0
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value += (targetOp - matRef.current.uniforms.uOpacity.value) * 0.07
    }
    if (groundMatRef.current) {
      groundMatRef.current.uniforms.uOpacity.value += (targetOp - groundMatRef.current.uniforms.uOpacity.value) * 0.07
    }
    if (!groupRef.current) return
    const t = clock.elapsedTime * 0.52
    const forestSpan = 0.22 - 0.11
    const path = Math.min(1, Math.max(0, (progressRef.current - 0.11) / forestSpan))
    const walk = inForest ? Math.sin(t) * 1.85 + path * 1.15 - 0.55 : 0
    groupRef.current.position.x = walk
    groupRef.current.position.z = Math.cos(t * 0.88) * 0.42 - 1.35
    groupRef.current.position.y = -0.035
  })

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, -0.02, 0.005]} renderOrder={0}>
        <planeGeometry args={[1.5, 0.55]} />
        <shaderMaterial
          ref={groundMatRef}
          vertexShader={vertexShader}
          fragmentShader={shadowFrag}
          uniforms={groundUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.02]} renderOrder={2}>
        <planeGeometry args={[1.05, 1.55]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
