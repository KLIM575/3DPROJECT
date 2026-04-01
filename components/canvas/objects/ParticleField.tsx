'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE_COUNTS, QualityLevel } from '@/lib/constants'

interface ParticleFieldProps {
  quality: QualityLevel
  color?: string
  spread?: number
  opacity?: number
}

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying float vAlpha;
  varying vec3 vColor;
  uniform vec3 uColor;
  uniform vec3 uColorB;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * aSpeed + aPhase) * 0.4;
    pos.x += cos(uTime * aSpeed * 0.7 + aPhase * 1.3) * 0.25;
    pos.z += sin(uTime * aSpeed * 0.5 + aPhase * 0.8) * 0.15;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float distFromCenter = length(pos.xz) / 25.0;
    vAlpha = (1.0 - clamp(distFromCenter, 0.0, 1.0));
    vColor = mix(uColor, uColorB, aPhase / 6.28);
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  uniform float uOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    float glow = 1.0 - smoothstep(0.0, 0.25, d);
    vec3 col = mix(vColor, vec3(1.0, 1.0, 1.0), glow * 0.6);
    gl_FragColor = vec4(col, alpha * vAlpha * uOpacity);
    if (gl_FragColor.a < 0.01) discard;
  }
`

export function ParticleField({ quality, color = '#00FFFF', spread = 20, opacity = 1 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null)
  const count = PARTICLE_COUNTS[quality]

  const { positions, sizes, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = Math.random() * spread
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.5
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      sizes[i]  = Math.random() * 2 + 0.5
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = Math.random() * 0.5 + 0.2
    }

    return { positions, sizes, phases, speeds }
  }, [count, spread])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    return geo
  }, [positions, sizes, phases, speeds])

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uOpacity: { value: opacity },
    uColor:   { value: new THREE.Color(color) },
    uColorB:  { value: new THREE.Color('#0088FF') },
  }), [color, opacity])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.elapsedTime
      uniforms.uOpacity.value = opacity
    }
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
