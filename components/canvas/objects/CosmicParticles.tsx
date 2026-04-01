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

/** Jittered integer lattice — “digital seed” */
function latticeMist(i: number, count: number): [number, number, number] {
  const cells = Math.max(14, Math.min(28, Math.round(Math.cbrt(count * 1.15))))
  const ix = i % cells
  const iy = Math.floor(i / cells) % cells
  const iz = Math.floor(i / (cells * cells)) % cells
  const cell = 1.22
  const ox = (ix - cells * 0.5 + 0.5) * cell
  const oy = (iy - cells * 0.5 + 0.5) * cell * 0.42
  const oz = (iz - cells * 0.5 + 0.5) * cell
  return [
    ox + (rand(i * 13.4) - 0.5) * 0.62,
    oy + (rand(i * 15.1) - 0.5) * 0.62,
    oz + (rand(i * 17.3) - 0.5) * 0.62,
  ]
}

/** Vertical light-columns (forest as beams, not organic blobs) */
function columnForest(i: number, count: number, spread: number): [number, number, number] {
  const n = Math.max(36, Math.min(120, Math.floor(count / 65)))
  const col = i % n
  const ang = col * 2.618034 + rand(col * 3.1) * 0.4
  const r = 0.85 + rand(i * 19.7) * 9.5
  const x = Math.cos(ang) * r * spread
  const z = Math.sin(ang) * r * spread
  const h = 0.15 + rand(i * 21.3) * 4.8
  const along = rand(i * 22.9)
  const y = along * h - 0.35
  const wobble = (rand(i * 24.1) - 0.5) * 0.06
  return [x + wobble, y, z + wobble]
}

/** Terraced planes + distant ridge markers */
function terraceDepth(i: number, count: number): [number, number, number] {
  const layer = Math.floor(rand(i * 31.7) * 5)
  const lx = (rand(i * 33.2) - 0.5) * 16
  const lz = (rand(i * 35.8) - 0.5) * 16
  const y = -0.55 + layer * 0.55 + (rand(i * 37.1) - 0.5) * 0.22
  if (rand(i * 39.4) > 0.78) {
    const hx = (rand(i * 41.0) - 0.5) * 22
    const hz = -6.2 - rand(i * 42.2) * 4.5
    const hy = -0.2 + Math.abs(Math.sin(hx * 0.08)) * 2.4
    const w = 0.35 + rand(i * 43.5) * 0.25
    return [mix(lx, hx, w), mix(y, hy, w * 0.85), mix(lz, hz, w)]
  }
  return [lx, y, lz]
}

/** Sharp radial shells — velocity-like strata */
function shockShells(i: number): [number, number, number] {
  const shell = Math.pow(rand(i * 51.2), 0.55)
  const R = 1.4 + shell * 38
  const theta = rand(i * 53.1) * Math.PI * 2
  const phi = Math.acos(2 * rand(i * 55.4) - 1)
  const band = Math.floor(shell * 7)
  const ripple = Math.sin(band * 1.7 + i * 0.01) * 0.35
  const rr = R + ripple
  return [
    Math.sin(phi) * Math.cos(theta) * rr,
    Math.cos(phi) * rr * 0.78 + (rand(i * 57.2) - 0.5) * 2.8,
    Math.sin(phi) * Math.sin(theta) * rr,
  ]
}

/** Thick toroidal ribbon — one coherent orbit */
function torusRibbon(i: number, count: number): [number, number, number] {
  const major = 7.2 + rand(i * 61.3) * 0.8
  const minor = 0.55 + rand(i * 63.1) * 2.1
  const u = rand(i * 65.7) * Math.PI * 2
  const v = rand(i * 67.2) * Math.PI * 2
  const cx = Math.cos(u) * major
  const cz = Math.sin(u) * major
  const cy = Math.sin(v) * minor * 0.95 + (rand(i * 69.4) - 0.5) * 0.65
  const arm = (i % 6) * 1.0472
  const lift = Math.sin(arm + u * 0.5) * 0.85
  return [cx + Math.cos(v + arm) * 0.35, cy + lift, cz + Math.sin(v + arm) * 0.35]
}

/** Logarithmic spiral arms — vortex read, not flat Milky disk */
function spiralVortex(i: number, count: number): [number, number, number] {
  const arms = 3
  const a = i % arms
  const t = Math.pow(rand(i * 71.5), 0.72)
  const angle = t * Math.PI * 14 + a * 2.0944
  const r = 0.4 + t * 11.5
  const h = (rand(i * 73.8) - 0.5) * (0.55 - t * 0.12)
  return [Math.cos(angle) * r, h, Math.sin(angle) * r]
}

/** Mass biased to center + edge suction on box cage */
function cagedMass(i: number): [number, number, number] {
  const u = rand(i * 81.2)
  const v = rand(i * 82.4)
  const y = -0.72 + Math.pow(u, 0.4) * 1.5
  const tt = (y + 0.72) / 1.5
  const maxR = 1.02 * Math.pow(Math.max(0.001, 1.0 - tt), 1.05)
  const ang = v * Math.PI * 2
  const radial = maxR * Math.pow(rand(i * 84.1), 0.5)
  const tx = Math.cos(ang) * radial
  const tz = Math.sin(ang) * radial
  const bx = (rand(i * 86.2) - 0.5) * 2.75
  const by = (rand(i * 87.3) - 0.5) * 1.85 - 0.06
  const bz = (rand(i * 88.4) - 0.5) * 2.75
  const edge = rand(i * 89.5)
  const w = edge > 0.82 ? 0.22 + rand(i * 90.6) * 0.35 : 0
  return [mix(tx, bx, w), mix(y * 0.9, by, w), mix(tz, bz, w)]
}

/** Fibonacci sphere — calm ordered return */
function fibonacciGarden(i: number, count: number, seed: number): [number, number, number] {
  const n = Math.max(2, count)
  const idx = (i + seed * 997) % n
  const golden = Math.PI * (3 - Math.sqrt(5))
  const y = 1 - (idx / (n - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = golden * idx
  const rad = 2.2 + rand(i * 91.7) * 8.4
  const s = rad * 0.36
  return [Math.cos(theta) * r * s, y * rad * 0.5 - 0.18, Math.sin(theta) * r * s]
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

    // 0: digital lattice mist
    {
      const [x, y, z] = latticeMist(i, count)
      positions[0][i3] = x
      positions[0][i3 + 1] = y
      positions[0][i3 + 2] = z
    }

    // 1: vertical columns
    {
      const [x, y, z] = columnForest(i, count, 1)
      positions[1][i3] = x
      positions[1][i3 + 1] = y
      positions[1][i3 + 2] = z
    }

    // 2: terraces + ridge silhouettes
    {
      const [x, y, z] = terraceDepth(i, count)
      positions[2][i3] = x * 1.06
      positions[2][i3 + 1] = y
      positions[2][i3 + 2] = z * 1.06
    }

    // 3: shock shells / radial burst
    {
      const [x, y, z] = shockShells(i)
      positions[3][i3] = x
      positions[3][i3 + 1] = y
      positions[3][i3 + 2] = z
    }

    // 4: single torus ribbon
    {
      const [x, y, z] = torusRibbon(i, count)
      positions[4][i3] = x
      positions[4][i3 + 1] = y
      positions[4][i3 + 2] = z
    }

    // 5: logarithmic spiral vortex
    {
      const [x, y, z] = spiralVortex(i, count)
      positions[5][i3] = x
      positions[5][i3 + 1] = y
      positions[5][i3 + 2] = z
    }

    // 6: caged mass
    {
      const [x, y, z] = cagedMass(i)
      positions[6][i3] = x
      positions[6][i3 + 1] = y
      positions[6][i3 + 2] = z
    }

    // 7: fibonacci / ordered garden
    {
      const [x, y, z] = fibonacciGarden(i, count, 41)
      positions[7][i3] = x * 0.94
      positions[7][i3 + 1] = y
      positions[7][i3 + 2] = z * 0.94
    }
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

    float morphWave = sin(t * 3.14159);
    float swirlAmp = 0.52 * morphWave * (1.0 + cosmicBoost * 0.55);
    float phase = aRandom * 6.28318;
    float rXZ = length(pos.xz) + 0.001;
    float ang = atan(pos.z, pos.x);
    float flow = uTime * (0.28 + segN * 0.055);
    pos.x += cos(ang + flow + phase * 0.35) * swirlAmp * 0.48;
    pos.z += sin(ang + flow * 0.92 + phase * 0.28) * swirlAmp * 0.48;
    pos.y += sin(flow * 1.1 + rXZ * 0.55 + phase) * swirlAmp * 0.36;
    float latticePulse = smoothstep(0.0, 0.6, 1.0 - segN) * 0.14;
    vec3 pulse3 = vec3(
      sin(pos.x * 2.3 + uTime * 0.9 + phase),
      sin(pos.y * 2.2 + uTime * 0.85 + phase * 1.1),
      sin(pos.z * 2.4 + uTime * 0.95 + phase * 0.9)
    );
    pos += pulse3 * latticePulse;

    float esc = uVesselStrength;
    if (esc > 0.01) {
      vec3 n = normalize(pos + vec3(0.0001));
      float pulse = sin(uTime * 6.0 + phase * 3.0) * 0.5 + 0.5;
      pos += n * esc * pulse * 0.45;
      pos.x += sin(uTime * 9.0 + aRandom * 40.0) * esc * 0.12;
      pos.y += cos(uTime * 8.0 + aRandom * 35.0) * esc * 0.12;
    }

    float drift = 0.08 + smoothstep(3.0, 5.0, segN) * 0.05;
    pos.x += sin(uTime * 0.31 + aRandom * 50.0) * drift;
    pos.y += cos(uTime * 0.26 + aRandom * 40.0) * drift * 1.1;
    pos.z += sin(uTime * 0.21 + aRandom * 30.0) * drift * 0.75;

    float phasePointScale = 1.0;
    if (segN < 0.5) phasePointScale = 1.22;
    else if (segN < 2.5) phasePointScale = 0.94;
    else if (segN < 3.5) phasePointScale = 1.38;
    else if (segN < 4.5) phasePointScale = 1.1;
    else if (segN < 5.5) phasePointScale = 1.18;
    else phasePointScale = 0.82;

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
    float soft = 0.18 + uEmeraldBoost * 0.05;
    float edge = 0.44 + uEmeraldBoost * 0.07;
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
