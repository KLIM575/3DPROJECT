'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel } from '@/lib/constants'

interface AboutSceneProps {
  opacity: number
  quality: QualityLevel
  sectionProgress: number
}

// Organic blob scene using vertex displacement
const blobVertexShader = `
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vNormal;
  varying float vDisplacement;

  // Simple noise
  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    vNormal = normal;
    float n = noise(normal * 3.0 + uTime * 0.3);
    float displacement = (n - 0.5) * 0.8 * uPulse;
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const blobFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    float glow = abs(vDisplacement) * 2.0;
    vec3 col = uColor * (0.3 + fresnel * 0.7 + glow * 0.5);
    float alpha = (0.2 + fresnel * 0.5) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`

export function AboutScene({ opacity, quality, sectionProgress }: AboutSceneProps) {
  const blobRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  const segments = quality === 'high' ? 64 : quality === 'medium' ? 32 : 16

  const blobUniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uPulse:   { value: 1 },
    uColor:   { value: new THREE.Color('#00FFFF') },
    uOpacity: { value: opacity },
  }), [opacity])

  // Orbit particles
  const orbitGeo = useMemo(() => {
    const orbitCount = quality === 'high' ? 200 : 100
    const orbitPositions = new Float32Array(orbitCount * 3)
    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2
      const r = 2.5 + Math.random() * 0.5
      orbitPositions[i * 3]     = Math.cos(angle) * r
      orbitPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      orbitPositions[i * 3 + 2] = Math.sin(angle) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3))
    return geo
  }, [quality])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    blobUniforms.uTime.value = t
    blobUniforms.uPulse.value = 0.5 + sectionProgress * 0.7 + Math.sin(t * 0.5) * 0.1
    blobUniforms.uOpacity.value = opacity

    if (blobRef.current) {
      blobRef.current.rotation.y = t * 0.1
      blobRef.current.rotation.x = Math.sin(t * 0.07) * 0.2
    }
    if (particleRef.current) {
      particleRef.current.rotation.y = t * 0.15
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.5 + sectionProgress * 0.7)
    }
  })

  if (opacity < 0.01) return null

  return (
    <group ref={groupRef}>
      {/* Main blob */}
      <mesh ref={blobRef}>
        <sphereGeometry args={[2, segments, segments]} />
        <shaderMaterial
          vertexShader={blobVertexShader}
          fragmentShader={blobFragmentShader}
          uniforms={blobUniforms}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting particles */}
      <points ref={particleRef} geometry={orbitGeo}>
        <pointsMaterial
          color="#00FFFF"
          size={0.04}
          transparent
          opacity={opacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial
          color="#0088FF"
          wireframe
          transparent
          opacity={opacity * 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
