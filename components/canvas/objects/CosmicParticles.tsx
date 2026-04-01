'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, PARTICLE_COUNTS, COLOR_STAGES } from '@/lib/constants'
import { interpolateColorStages } from '@/lib/animations'
import {
  getVesselEffectStrength,
  getVesselEmeraldHighlight,
  narrativeMorphProgress,
} from '@/lib/narrative'

interface CosmicParticlesProps {
  quality: QualityLevel
  progress: number
}

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Must match PARTICLE_KEY_COUNT - 1 in lib/constants (8 keys → 7 segments) */
const MORPH_SEGMENTS = 7

/** Ancient grove: vertical trunks, canopy shells, sparse liana anchors — reads as trees from particles */
function ancientGrove(
  i: number,
  count: number,
  depthScale: number,
  seedOffset = 0,
): [number, number, number] {
  const nTrees = Math.max(28, Math.min(96, Math.floor(count / 70)))
  const treeId = (i + seedOffset) % nTrees
  const ang = treeId * 2.513274 + rand(treeId * 1.71) * 0.32
  const baseR = 1.15 + rand(i * 19.13) * 10.8
  const trunkH = (0.95 + rand(i * 23.37) * 4.35) * depthScale
  const cx = Math.cos(ang) * baseR
  const cz = Math.sin(ang) * baseR
  const role = rand(i * 29.91 + seedOffset * 0.01)

  if (role < 0.13) {
    const t = rand(i * 30.07)
    const y = t * trunkH * 0.92
    const spread = 0.035 + rand(i * 31.21) * 0.085
    return [
      cx + (rand(i * 32.33) - 0.5) * spread,
      y - 0.42,
      cz + (rand(i * 33.41) - 0.5) * spread,
    ]
  }
  if (role < 0.2) {
    const y = trunkH * (0.32 + rand(i * 34.53) * 0.58)
    const out = 0.12 + rand(i * 35.67) * 0.45
    const hang = Math.sin(i * 0.31 + treeId) * 0.25
    return [cx + Math.cos(ang + 1.1) * out + hang * 0.2, y, cz + Math.sin(ang + 1.1) * out]
  }
  const canopyT = Math.pow(rand(i * 36.79), 0.55)
  const canopyR = (0.35 + rand(i * 37.89) * 1.85) * (0.55 + canopyT * 0.9)
  const canopyA = rand(i * 38.97) * Math.PI * 2
  const canopyInc = Math.acos(2 * rand(i * 40.03) - 1) * 0.48 + 0.15
  const y = trunkH * 0.72 + Math.sin(canopyInc) * canopyR * 0.85 + rand(i * 41.11) * 0.35
  const horiz = Math.cos(canopyInc) * canopyR
  return [
    cx + Math.cos(canopyA) * horiz + (rand(i * 42.19) - 0.5) * 0.55,
    y - 0.35,
    cz + Math.sin(canopyA) * horiz + (rand(i * 43.27) - 0.5) * 0.55,
  ]
}

/** Dense emerald teardrop / heart — Active Theory containment shot */
function vesselEmeraldMass(i: number): [number, number, number] {
  const u = rand(i * 113.11)
  const v = rand(i * 114.21)
  const y = -0.76 + Math.pow(u, 0.36) * 1.56
  const t = (y + 0.76) / 1.56
  const maxR = 1.05 * Math.pow(Math.max(0.001, 1.0 - t), 1.08) + 0.05
  const ang = v * Math.PI * 2
  const radial = maxR * Math.pow(rand(i * 115.31), 0.52) * 0.94
  const x = Math.cos(ang) * radial
  const z = Math.sin(ang) * radial
  const j = (rand(i * 116.41) - 0.5) * 0.065
  return [x + j, y * 0.9 + j * 0.45, z + j]
}

/** Distant mountain ridges — layered silhouettes behind the grove */
function mountainRidge(i: number): [number, number, number] {
  const hx = (rand(i * 61.31) - 0.5) * 26
  const hz = -5.8 - rand(i * 67.91) * 6.2
  const ridge = Math.abs(Math.sin(hx * 0.065 + rand(i * 68.7) * 2))
  const hy = -0.35 + ridge * 3.1 * (0.55 + rand(i * 71.11) * 0.55)
  return [hx, hy, hz]
}

function generateFormations(count: number) {
  const keys = 8
  const positions: Float32Array[] = []
  for (let k = 0; k < keys; k++) positions.push(new Float32Array(count * 3))

  const randoms = new Float32Array(count)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    randoms[i] = rand(i * 7.31)
    sizes[i] = 0.45 + rand(i * 13.17) * 2.4

    // 0: emerald particle mist — dense core, soft halo
    {
      const shell = Math.pow(rand(i * 17.11), 0.72)
      const nebR = 1.2 + shell * 13.5
      const nebTheta = rand(i * 23.71) * Math.PI * 2
      const nebPhi = Math.acos(2 * rand(i * 31.33) - 1)
      positions[0][i3] = Math.sin(nebPhi) * Math.cos(nebTheta) * nebR
      positions[0][i3 + 1] = (rand(i * 41.93) - 0.38) * 8.2
      positions[0][i3 + 2] = Math.sin(nebPhi) * Math.sin(nebTheta) * nebR
    }

    // 1: ancient forest (trees coalesce from mist)
    const [fx, fy, fz] = ancientGrove(i, count, 1, 0)
    positions[1][i3] = fx
    positions[1][i3 + 1] = fy
    positions[1][i3 + 2] = fz

    // 2: grove + distant mountains + garden floor depth
    const [fx2, fy2, fz2] = ancientGrove(i, count, 1.18, 17)
    positions[2][i3] = fx2 * 1.04
    positions[2][i3 + 1] = fy2
    positions[2][i3 + 2] = fz2
    if (rand(i * 59.13) > 0.68) {
      const [mx, my, mz] = mountainRidge(i)
      const blend = 0.48 + rand(i * 59.9) * 0.22
      positions[2][i3] = mix(positions[2][i3], mx, blend)
      positions[2][i3 + 1] = mix(positions[2][i3 + 1], my, blend)
      positions[2][i3 + 2] = mix(positions[2][i3 + 2], mz, blend)
    }

    // 3: universe — explosive radial shells (particles “разлетаются”)
    const burst = rand(i * 79.71)
    const uR = 6 + Math.pow(burst, 1.35) * 46
    const uTheta = rand(i * 83.13) * Math.PI * 2
    const uPhi = Math.acos(2 * rand(i * 89.33) - 1)
    positions[3][i3] = Math.sin(uPhi) * Math.cos(uTheta) * uR
    positions[3][i3 + 1] = Math.cos(uPhi) * uR * 0.82 + (rand(i * 90.41) - 0.5) * 3.2
    positions[3][i3 + 2] = Math.sin(uPhi) * Math.sin(uTheta) * uR

    // 4: several distinct “worlds” — orbital micro-clusters
    const worldN = 5
    const w = i % worldN
    const wAng = (w / worldN) * Math.PI * 2 + 0.55
    const wCx = Math.cos(wAng) * 8.2
    const wCz = Math.sin(wAng) * 8.2
    const wCy = Math.sin(w * 1.63 + rand(i * 95.1)) * 2.4
    const wr = 0.45 + rand(i * 97.13) * 3.1
    const wl = rand(i * 101.93) * Math.PI * 2
    const wv = Math.acos(2 * rand(i * 103.73) - 1)
    positions[4][i3] = wCx + Math.sin(wv) * Math.cos(wl) * wr
    positions[4][i3 + 1] = wCy + Math.cos(wv) * wr * 0.95
    positions[4][i3 + 2] = wCz + Math.sin(wv) * Math.sin(wl) * wr

    // 5: galactic disk + bulge + spiral arms (Milky Way read)
    if (rand(i * 107.01) < 0.09) {
      const br = rand(i * 107.21) * 1.35
      const btheta = rand(i * 107.33) * Math.PI * 2
      positions[5][i3] = Math.cos(btheta) * br
      positions[5][i3 + 1] = (rand(i * 107.45) - 0.5) * 0.42
      positions[5][i3 + 2] = Math.sin(btheta) * br
    } else {
      const arm = i % 4
      const spiralT = rand(i * 107.57)
      const spiralAngle = spiralT * Math.PI * 16 + arm * 1.57 + spiralT * arm * 0.9
      const spiralR = 0.35 + spiralT * 12.5
      const diskH = (rand(i * 109.91) - 0.5) * 0.38 * (1.0 - spiralT * 0.06)
      positions[5][i3] = Math.cos(spiralAngle) * spiralR
      positions[5][i3 + 1] = diskH
      positions[5][i3 + 2] = Math.sin(spiralAngle) * spiralR
    }

    // 6: emerald mass in cage + a few points pressed to walls (“trying to escape”)
    {
      const [tx, ty, tz] = vesselEmeraldMass(i)
      const bx = (rand(i * 117.11) - 0.5) * 2.85
      const by = (rand(i * 117.71) - 0.5) * 1.92 - 0.08
      const bz = (rand(i * 118.31) - 0.5) * 2.85
      const edge = rand(i * 118.91)
      const w = edge > 0.8 ? 0.18 + rand(i * 119.01) * 0.32 : 0
      positions[6][i3] = mix(tx, bx, w)
      positions[6][i3 + 1] = mix(ty, by, w)
      positions[6][i3 + 2] = mix(tz, bz, w)
    }

    // 7: return to garden
    const [gx, gy, gz] = ancientGrove(i + count, count, 1.06, 31)
    positions[7][i3] = gx * 0.9
    positions[7][i3 + 1] = gy
    positions[7][i3 + 2] = gz * 0.9
  }

  return {
    pos0: positions[0],
    pos1: positions[1],
    pos2: positions[2],
    pos3: positions[3],
    pos4: positions[4],
    pos5: positions[5],
    pos6: positions[6],
    pos7: positions[7],
    randoms,
    sizes,
  }
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

const vertexShader = `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute vec3 aPos5;
  attribute vec3 aPos6;
  attribute vec3 aPos7;
  attribute float aRandom;
  attribute float aSize;

  uniform float uProgress;
  uniform float uTime;
  uniform float uVesselStrength;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uEmeraldBoost;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float m = clamp(uProgress, 0.0, 0.99999) * ${MORPH_SEGMENTS}.0;
    float seg = floor(m);
    float t = fract(m);
    t = t * t * (3.0 - 2.0 * t);

    vec3 posA = aPos0;
    vec3 posB = aPos1;
    if (seg < 0.5) { posA = aPos0; posB = aPos1; }
    else if (seg < 1.5) { posA = aPos1; posB = aPos2; }
    else if (seg < 2.5) { posA = aPos2; posB = aPos3; }
    else if (seg < 3.5) { posA = aPos3; posB = aPos4; }
    else if (seg < 4.5) { posA = aPos4; posB = aPos5; }
    else if (seg < 5.5) { posA = aPos5; posB = aPos6; }
    else { posA = aPos6; posB = aPos7; }

    vec3 pos = mix(posA, posB, t);

    float segN = floor(clamp(uProgress, 0.0, 0.99999) * 7.0);
    float cosmicBoost = smoothstep(2.0, 3.5, segN) * (1.0 - smoothstep(4.5, 5.5, segN));

    float turbulence = sin(t * 3.14159) * 0.55;
    turbulence *= 1.0 + cosmicBoost * 0.62;
    float phase = aRandom * 6.28318;
    pos.x += sin(uTime * 1.15 + phase) * turbulence * 0.38;
    pos.y += cos(uTime * 0.88 + phase * 1.25) * turbulence * 0.32;
    pos.z += sin(uTime * 0.72 + phase * 0.85) * turbulence * 0.26;

    float esc = uVesselStrength;
    if (esc > 0.01) {
      vec3 n = normalize(pos + vec3(0.0001));
      float pulse = sin(uTime * 6.0 + phase * 3.0) * 0.5 + 0.5;
      pos += n * esc * pulse * 0.45;
      pos.x += sin(uTime * 9.0 + aRandom * 40.0) * esc * 0.12;
      pos.y += cos(uTime * 8.0 + aRandom * 35.0) * esc * 0.12;
    }

    pos.x += sin(uTime * 0.28 + aRandom * 50.0) * 0.11;
    pos.y += cos(uTime * 0.24 + aRandom * 40.0) * 0.13;
    pos.z += sin(uTime * 0.19 + aRandom * 30.0) * 0.07;

    float phasePointScale = 1.0;
    if (segN < 0.5) phasePointScale = 1.14;
    else if (segN < 2.5) phasePointScale = 0.96;
    else if (segN < 3.5) phasePointScale = 1.32;
    else if (segN < 4.5) phasePointScale = 1.06;
    else if (segN < 5.5) phasePointScale = 1.12;
    else phasePointScale = 0.78;

    phasePointScale *= 1.0 + uEmeraldBoost * 0.28;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float size = aSize * phasePointScale * (200.0 / -mvPos.z);
    gl_PointSize = clamp(size, 0.5, 18.0);
    gl_Position = projectionMatrix * mvPos;

    float dist = -mvPos.z;
    vAlpha = clamp(1.0 - dist / 42.0, 0.03, 1.0);
    vAlpha *= 1.0 + uEmeraldBoost * 0.22;
    vColor = mix(uColor1, uColor2, aRandom);
    vColor = mix(vColor, vec3(0.82, 1.0, 0.92), uEmeraldBoost * 0.38);
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  uniform float uOpacity;
  uniform float uEmeraldBoost;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float soft = 0.22 + uEmeraldBoost * 0.06;
    float edge = 0.48 + uEmeraldBoost * 0.08;
    float alpha = (1.0 - smoothstep(soft, edge, d)) * vAlpha * uOpacity;
    float glow = 1.0 - smoothstep(0.0, 0.32 + uEmeraldBoost * 0.1, d);
    vec3 hot = vec3(0.95, 1.0, 0.98);
    vec3 col = mix(vColor, hot, glow * (0.28 + uEmeraldBoost * 0.42));
    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.003) discard;
  }
`

export function CosmicParticles({ quality, progress }: CosmicParticlesProps) {
  const meshRef = useRef<THREE.Points>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress
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
    geo.setAttribute('aPos5', new THREE.BufferAttribute(formations.pos5, 3))
    geo.setAttribute('aPos6', new THREE.BufferAttribute(formations.pos6, 3))
    geo.setAttribute('aPos7', new THREE.BufferAttribute(formations.pos7, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(formations.randoms, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(formations.sizes, 1))
    return geo
  }, [count, formations])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uVesselStrength: { value: 0 },
      uColor1: { value: new THREE.Color(0.2, 0.9, 0.45) },
      uColor2: { value: new THREE.Color(0.06, 0.5, 0.26) },
      uOpacity: { value: 1.0 },
      uEmeraldBoost: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    const p = progressRef.current
    const morphP = narrativeMorphProgress(p)
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uProgress.value = morphP
    uniforms.uVesselStrength.value = getVesselEffectStrength(p)
    uniforms.uEmeraldBoost.value = getVesselEmeraldHighlight(p)

    const { primary, secondary } = interpolateColorStages(morphP, COLOR_STAGES)
    uniforms.uColor1.value.setRGB(primary[0], primary[1], primary[2])
    uniforms.uColor2.value.setRGB(secondary[0], secondary[1], secondary[2])
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
