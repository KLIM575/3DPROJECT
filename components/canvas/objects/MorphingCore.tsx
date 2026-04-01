'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, COLOR_STAGES } from '@/lib/constants'
import { interpolateColorStages } from '@/lib/animations'

interface MorphingCoreProps {
  progress: number
  quality: QualityLevel
}

const coreVertexShader = `
  uniform float uProgress;
  uniform float uTime;
  varying vec3 vNormal;
  varying float vFresnel;
  varying float vDisplacement;

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
    float p = clamp(uProgress, 0.0, 0.9999) * 4.0;
    float seg = floor(p);
    float t = fract(p);
    t = t * t * (3.0 - 2.0 * t);

    float d0 = sin(normal.x * 4.0 + uTime * 0.5) * sin(normal.y * 4.0 + uTime * 0.3) * 0.15;
    float d1 = (noise(normal * 3.0 + uTime * 0.2) - 0.5) * 0.5;
    float d2 = (noise(normal * 5.0 + uTime * 0.4) - 0.5) * 0.9;
    float n3 = noise(normal * 7.0 + uTime * 0.3);
    float d3 = pow(n3, 3.0) * 1.5 - 0.3;
    float angle4 = atan(normal.z, normal.x);
    float d4 = sin(angle4 * 5.0 + normal.y * 8.0 + uTime) * 0.3;

    float dispA, dispB;
    if (seg < 1.0) { dispA = d0; dispB = d1; }
    else if (seg < 2.0) { dispA = d1; dispB = d2; }
    else if (seg < 3.0) { dispA = d2; dispB = d3; }
    else { dispA = d3; dispB = d4; }

    float displacement = mix(dispA, dispB, t);
    vDisplacement = displacement;

    float scale = 1.0 + sin(uProgress * 3.14159) * 0.3;
    vec3 newPos = (position + normal * displacement) * scale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vec3 worldNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vFresnel = pow(1.0 - abs(dot(worldNormal, viewDir)), 2.5);
  }
`

const coreFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying float vFresnel;
  varying float vDisplacement;

  void main() {
    float glow = abs(vDisplacement) * 2.0;
    vec3 col = uColor * (0.15 + vFresnel * 0.85 + glow * 0.3);
    float alpha = (0.1 + vFresnel * 0.55) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`

const RING_CONFIG = [
  { radius: 2.5, rotX: 0.3, rotZ: 0.2, speedY: 0.12, speedX: 0.08, baseOpacity: 0.25 },
  { radius: 3.3, rotX: 1.2, rotZ: 0.5, speedY: -0.07, speedX: 0.04, baseOpacity: 0.18 },
  { radius: 4.2, rotX: 0.7, rotZ: 1.1, speedY: 0.05, speedX: -0.03, baseOpacity: 0.12 },
]

export function MorphingCore({ progress, quality }: MorphingCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])
  const ringMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const progressRef = useRef(progress)
  progressRef.current = progress

  const segments = quality === 'high' ? 64 : quality === 'medium' ? 32 : 16

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0, 1, 1) },
      uOpacity: { value: 1.0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const p = progressRef.current

    uniforms.uTime.value = time
    uniforms.uProgress.value = p

    const { primary } = interpolateColorStages(p, COLOR_STAGES)
    uniforms.uColor.value.setRGB(primary[0], primary[1], primary[2])

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.08
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.15
    }

    const ringScale = 1.0 + Math.sin(p * Math.PI) * 0.4
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return
      const cfg = RING_CONFIG[i]
      ring.rotation.y += cfg.speedY * 0.016
      ring.rotation.x += cfg.speedX * 0.016
      ring.scale.setScalar(ringScale)
    })

    ringMatRefs.current.forEach((mat, i) => {
      if (!mat) return
      mat.color.setRGB(primary[0], primary[1], primary[2])
      mat.opacity = RING_CONFIG[i].baseOpacity * (0.6 + Math.sin(time * 0.5 + i) * 0.4)
    })
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1.5, segments, segments]} />
          <shaderMaterial
            vertexShader={coreVertexShader}
            fragmentShader={coreFragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {quality !== 'low' && (
          <mesh>
            <icosahedronGeometry args={[2, 2]} />
            <meshBasicMaterial
              color="#00FFFF"
              wireframe
              transparent
              opacity={0.04}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {RING_CONFIG.map((cfg, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el }}
          rotation={[cfg.rotX, 0, cfg.rotZ]}
        >
          <ringGeometry args={[cfg.radius - 0.015, cfg.radius + 0.015, 128]} />
          <meshBasicMaterial
            ref={(el) => { ringMatRefs.current[i] = el }}
            color="#00FFFF"
            transparent
            opacity={cfg.baseOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  )
}
