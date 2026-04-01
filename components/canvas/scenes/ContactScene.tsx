'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, PARTICLE_COUNTS } from '@/lib/constants'

interface ContactSceneProps {
  opacity: number
  quality: QualityLevel
  sectionProgress: number
}

const vortexVertexShader = `
  attribute float aIndex;
  attribute float aOffset;
  uniform float uTime;
  uniform float uProgress;
  varying float vAlpha;

  void main() {
    float totalCount = 3000.0;
    float t = mod(aOffset + uTime * 0.15, 1.0);
    float angle = aIndex * 0.05 + t * 3.14159 * 6.0;
    float radius = mix(6.0, 0.1, t);
    float height = mix(-3.0, 3.0, t);

    vec3 pos = vec3(
      cos(angle) * radius,
      height,
      sin(angle) * radius
    );

    vAlpha = (1.0 - t) * uProgress;
    gl_PointSize = mix(4.0, 1.0, t) * (200.0 / length((modelViewMatrix * vec4(pos, 1.0)).xyz));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const vortexFragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
    if (alpha < 0.01) discard;
  }
`

export function ContactScene({ opacity, quality, sectionProgress }: ContactSceneProps) {
  const vortexRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  const count = Math.floor(PARTICLE_COUNTS[quality] * 0.4)

  const { indices, offsets } = useMemo(() => {
    const indices = new Float32Array(count)
    const offsets = new Float32Array(count)
    // Positions placeholder (overridden by shader)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      indices[i] = i
      offsets[i] = Math.random()
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }
    return { indices, offsets, positions }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aIndex',  new THREE.BufferAttribute(indices, 1))
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1))
    return geo
  }, [count, indices, offsets])

  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uProgress: { value: 0 },
    uColor:    { value: new THREE.Color('#00FFFF') },
  }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uProgress.value = sectionProgress * opacity

    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.05
    }
  })

  if (opacity < 0.01) return null

  return (
    <group ref={groupRef}>
      <points ref={vortexRef} geometry={geometry}>
        <shaderMaterial
          vertexShader={vortexVertexShader}
          fragmentShader={vortexFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Portal ring */}
      {[0.5, 1.0, 1.8].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, i * 0.4 - 0.4, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
          <meshBasicMaterial
            color={i === 0 ? '#00FFFF' : '#0088FF'}
            transparent
            opacity={opacity * (0.6 - i * 0.15)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Center glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={opacity * sectionProgress * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
