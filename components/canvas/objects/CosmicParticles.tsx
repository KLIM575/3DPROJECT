'use client'

import { useRef, useMemo, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, PARTICLE_COUNTS, COLOR_STAGES } from '@/lib/constants'
import { interpolateColorStages } from '@/lib/animations'

interface CosmicParticlesProps {
  quality: QualityLevel
  progress: number
  mouseNDC: MutableRefObject<THREE.Vector2>
  mouseActive: MutableRefObject<boolean>
}

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function generateFormations(count: number) {
  const pos0 = new Float32Array(count * 3)
  const pos1 = new Float32Array(count * 3)
  const pos2 = new Float32Array(count * 3)
  const pos3 = new Float32Array(count * 3)
  const pos4 = new Float32Array(count * 3)
  const randoms = new Float32Array(count)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    randoms[i] = rand(i * 7.31)
    sizes[i] = 0.5 + rand(i * 13.17) * 2.5

    const nebR = 3 + rand(i * 17.1) * 18
    const nebTheta = rand(i * 23.7) * Math.PI * 2
    const nebPhi = Math.acos(2 * rand(i * 31.3) - 1)
    pos0[i3] = Math.sin(nebPhi) * Math.cos(nebTheta) * nebR
    pos0[i3 + 1] = (rand(i * 41.9) - 0.5) * 14
    pos0[i3 + 2] = Math.sin(nebPhi) * Math.sin(nebTheta) * nebR

    const streamIdx = i % 5
    const streamT = i / count
    const streamAngle = streamT * Math.PI * 4 + streamIdx * Math.PI * 2 / 5
    const streamR = 2 + streamT * 7 + rand(i * 53.1) * 1.5
    pos1[i3] = Math.cos(streamAngle) * streamR
    pos1[i3 + 1] = (rand(i * 61.7) - 0.5) * 6
    pos1[i3 + 2] = Math.sin(streamAngle) * streamR + (streamT - 0.5) * 5

    const sphTheta = rand(i * 71.3) * Math.PI * 2
    const sphPhi = Math.acos(2 * rand(i * 83.9) - 1)
    const sphR = 4 + (rand(i * 97.1) - 0.5) * 1.5
    pos2[i3] = Math.sin(sphPhi) * Math.cos(sphTheta) * sphR
    pos2[i3 + 1] = Math.cos(sphPhi) * sphR
    pos2[i3 + 2] = Math.sin(sphPhi) * Math.sin(sphTheta) * sphR

    const nodeCount = 7
    const node = i % nodeCount
    const nodeAngle = (node / nodeCount) * Math.PI * 2
    const nodeX = Math.cos(nodeAngle) * 5
    const nodeZ = Math.sin(nodeAngle) * 5
    const nodeY = Math.sin(nodeAngle * 2) * 1.5
    pos3[i3] = nodeX + (rand(i * 107.3) - 0.5) * 2.0
    pos3[i3 + 1] = nodeY + (rand(i * 113.7) - 0.5) * 2.0
    pos3[i3 + 2] = nodeZ + (rand(i * 127.1) - 0.5) * 2.0

    const spiralT = i / count
    const spiralAngle = spiralT * Math.PI * 10
    const spiralR = (1 - spiralT) * 8
    pos4[i3] = Math.cos(spiralAngle) * spiralR + rand(i * 131.9) * 0.5
    pos4[i3 + 1] = (spiralT - 0.5) * 14
    pos4[i3 + 2] = Math.sin(spiralAngle) * spiralR + rand(i * 139.3) * 0.5
  }

  return { pos0, pos1, pos2, pos3, pos4, randoms, sizes }
}

const vertexShader = `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute float aRandom;
  attribute float aSize;

  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uMouseRayOrigin;
  uniform vec3 uMouseRayDir;
  uniform float uMouseActive;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float p = clamp(uProgress, 0.0, 0.9999) * 4.0;
    float seg = floor(p);
    float t = fract(p);
    t = t * t * (3.0 - 2.0 * t);

    vec3 posA = aPos0;
    vec3 posB = aPos1;

    if (seg < 1.0) {
      posA = aPos0; posB = aPos1;
    } else if (seg < 2.0) {
      posA = aPos1; posB = aPos2;
    } else if (seg < 3.0) {
      posA = aPos2; posB = aPos3;
    } else {
      posA = aPos3; posB = aPos4;
    }

    vec3 pos = mix(posA, posB, t);

    // Transition turbulence
    float turbulence = sin(t * 3.14159) * 0.6;
    float phase = aRandom * 6.28318;
    pos.x += sin(uTime * 1.2 + phase) * turbulence * 0.4;
    pos.y += cos(uTime * 0.9 + phase * 1.3) * turbulence * 0.3;
    pos.z += sin(uTime * 0.7 + phase * 0.8) * turbulence * 0.25;

    // Ambient drift
    pos.x += sin(uTime * 0.3 + aRandom * 50.0) * 0.12;
    pos.y += cos(uTime * 0.25 + aRandom * 40.0) * 0.15;
    pos.z += sin(uTime * 0.2 + aRandom * 30.0) * 0.08;

    // Mouse repulsion — push particles away from the cursor ray
    vec3 toPoint = pos - uMouseRayOrigin;
    float projLen = dot(toPoint, uMouseRayDir);
    vec3 closestOnRay = uMouseRayOrigin + uMouseRayDir * max(projLen, 0.0);
    vec3 repelVec = pos - closestOnRay;
    float rayDist = length(repelVec);
    float repelForce = smoothstep(3.5, 0.0, rayDist) * 2.5 * uMouseActive;
    pos += normalize(repelVec + vec3(0.001)) * repelForce;

    // Particles near cursor glow brighter and grow
    float repelGlow = smoothstep(3.5, 0.5, rayDist) * uMouseActive;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float size = aSize * (1.0 + repelGlow * 0.6) * (200.0 / -mvPos.z);
    gl_PointSize = clamp(size, 0.5, 14.0);
    gl_Position = projectionMatrix * mvPos;

    float dist = -mvPos.z;
    vAlpha = clamp(1.0 - dist / 40.0, 0.03, 1.0) * (1.0 + repelGlow * 0.4);
    vColor = mix(uColor1, uColor2, aRandom);
    // Near cursor: shift toward white
    vColor = mix(vColor, vec3(1.0), repelGlow * 0.3);
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  uniform float uOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha * uOpacity;
    float glow = 1.0 - smoothstep(0.0, 0.2, d);
    vec3 col = mix(vColor, vec3(1.0), glow * 0.35);
    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.003) discard;
  }
`

export function CosmicParticles({ quality, progress, mouseNDC, mouseActive }: CosmicParticlesProps) {
  const meshRef = useRef<THREE.Points>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress

  const raycaster = useRef(new THREE.Raycaster())
  const count = PARTICLE_COUNTS[quality]
  const formations = useMemo(() => generateFormations(count), [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute('aPos0', new THREE.BufferAttribute(formations.pos0, 3))
    geo.setAttribute('aPos1', new THREE.BufferAttribute(formations.pos1, 3))
    geo.setAttribute('aPos2', new THREE.BufferAttribute(formations.pos2, 3))
    geo.setAttribute('aPos3', new THREE.BufferAttribute(formations.pos3, 3))
    geo.setAttribute('aPos4', new THREE.BufferAttribute(formations.pos4, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(formations.randoms, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(formations.sizes, 1))
    return geo
  }, [count, formations])

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0, 1, 1) },
      uColor2: { value: new THREE.Color(0, 0.2, 0.4) },
      uOpacity: { value: 1.0 },
      uMouseRayOrigin: { value: new THREE.Vector3() },
      uMouseRayDir: { value: new THREE.Vector3(0, 0, -1) },
      uMouseActive: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock, camera }) => {
    const p = progressRef.current
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uProgress.value = p

    const { primary, secondary } = interpolateColorStages(p, COLOR_STAGES)
    uniforms.uColor1.value.setRGB(primary[0], primary[1], primary[2])
    uniforms.uColor2.value.setRGB(secondary[0], secondary[1], secondary[2])

    raycaster.current.setFromCamera(mouseNDC.current, camera)
    uniforms.uMouseRayOrigin.value.copy(raycaster.current.ray.origin)
    uniforms.uMouseRayDir.value.copy(raycaster.current.ray.direction)
    uniforms.uMouseActive.value = mouseActive.current ? 1.0 : 0.0
  })

  return (
    <points ref={meshRef} geometry={geometry} frustumCulled={false}>
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
