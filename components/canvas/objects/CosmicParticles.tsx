'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, PARTICLE_COUNTS, COLOR_STAGES, MORPH_SEGMENT_COUNT } from '@/lib/constants'
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

/** ~80% texture (small), ~20% accents — power-law via uniform threshold. */
function powerLawSize(i: number): number {
  const u = rand(i * 19.413)
  if (u < 0.8) {
    const s = Math.pow(rand(i * 21.7), 2.8)
    return 0.28 + s * 1.15
  }
  const s = Math.pow(rand(i * 22.3), 0.55)
  return 1.85 + s * 5.2
}

/** Rare anchors — drive bloom threshold. */
function isAnchorParticle(i: number): number {
  return rand(i * 3.777) > 0.978 ? 1.0 : 0.0
}

const MORPH_SEGMENTS = MORPH_SEGMENT_COUNT

/** 0: dense green nebula — soft volume */
function formationCloud(i: number, pulse: number): [number, number, number] {
  const u = rand(i * 2.1)
  const v = rand(i * 2.2)
  const w = rand(i * 2.3)
  const theta = u * Math.PI * 2
  const phi = Math.acos(2 * v - 1)
  const r = Math.pow(w, 0.34 + pulse * 0.1) * (10.5 - pulse * 2.2)
  const x = Math.sin(phi) * Math.cos(theta) * r
  const y = Math.cos(phi) * r * 0.52 + (rand(i * 2.4) - 0.5) * 1.35
  const z = Math.sin(phi) * Math.sin(theta) * r
  return [
    x + (rand(i * 2.5) - 0.5) * 1.1,
    y,
    z + (rand(i * 2.6) - 0.5) * 1.1,
  ]
}

/** 1: ancient forest — trunks, canopy, ridge, lianas, shadow silhouette */
function formationForest(i: number, count: number): [number, number, number] {
  const role = rand(i * 31.7)
  if (role < 0.028) {
    const u = rand(i * 50.1)
    const v = rand(i * 50.2)
    const sx = (u - 0.5) * 1.1
    const sy = v * 2.6 - 0.15
    const sz = -0.6 - Math.abs(u - 0.5) * 0.5
    return [sx * 2.8, sy * 0.85 - 0.35, sz * 3.2 - 2.2]
  }
  if (role < 0.1) {
    const lx = (rand(i * 41) - 0.5) * 24
    const lz = -6.2 - rand(i * 41.5) * 5.5
    const h = 0.35 + Math.abs(Math.sin(lx * 0.085)) * 3.1
    return [lx * 0.9, h + (rand(i * 41.7) - 0.5) * 0.4, lz * 0.9]
  }
  if (role < 0.2) {
    const trunk = Math.floor(rand(i * 42.1) * 52)
    const ang = trunk * 0.618 + rand(trunk * 3.1) * 0.55
    const rr = 2.4 + rand(i * 42.3) * 8.2
    const x = Math.cos(ang) * rr
    const z = Math.sin(ang) * rr
    const helix = i * 0.065 + rand(i * 42.5) * 6.28
    const y = -0.35 + rand(i * 42.7) * 3.5 + Math.sin(helix) * 0.42
    const ox = Math.cos(helix * 1.65) * 0.32
    const oz = Math.sin(helix * 1.65) * 0.32
    return [x + ox, y, z + oz]
  }
  const n = Math.max(40, Math.min(150, Math.floor(count / 75)))
  const col = i % n
  const ang = col * 2.39996 + rand(col * 5.2) * 0.38
  const rad = 0.65 + rand(i * 43.1) * 9.2
  const x = Math.cos(ang) * rad
  const z = Math.sin(ang) * rad
  const h = 0.15 + rand(i * 43.3) * 4.9
  const along = rand(i * 43.5)
  const y = along * h - 0.55
  return [x + (rand(i * 43.7) - 0.5) * 0.09, y, z + (rand(i * 43.9) - 0.5) * 0.09]
}

/** 2: cosmic burst — shells, debris, nebula */
function formationUniverse(i: number): [number, number, number] {
  const u = rand(i * 51.1)
  if (u < 0.09) {
    const shell = Math.floor(rand(i * 51.3) * 5)
    const R = 4.2 + shell * 3.8 + rand(i * 51.5) * 0.55
    const theta = rand(i * 51.7) * Math.PI * 2
    const phi = Math.acos(2 * rand(i * 51.9) - 1)
    return [
      Math.sin(phi) * Math.cos(theta) * R,
      Math.cos(phi) * R * 0.42,
      Math.sin(phi) * Math.sin(theta) * R,
    ]
  }
  if (u < 0.15) {
    const pj = Math.floor(rand(i * 52.1) * 6)
    const ox = Math.cos(pj * 1.047) * 5.5
    const oz = Math.sin(pj * 1.047) * 5.5
    const pr = 0.3 + rand(i * 52.3) * 1.05
    const theta = rand(i * 52.5) * Math.PI * 2
    const phi = Math.acos(2 * rand(i * 52.7) - 1)
    return [
      ox + Math.sin(phi) * Math.cos(theta) * pr,
      Math.cos(phi) * pr * 0.55,
      oz + Math.sin(phi) * Math.sin(theta) * pr,
    ]
  }
  const band = Math.pow(rand(i * 53.1), 0.48)
  const R = 1.8 + band * 46
  const theta = rand(i * 53.3) * Math.PI * 2
  const phi = Math.acos(2 * rand(i * 53.5) - 1)
  const ripple = Math.sin(Math.floor(band * 11) * 1.35 + i * 0.007) * 0.62
  const rr = R + ripple
  return [
    Math.sin(phi) * Math.cos(theta) * rr,
    Math.cos(phi) * rr * 0.88 + (rand(i * 53.7) - 0.5) * 2.6,
    Math.sin(phi) * Math.sin(theta) * rr,
  ]
}

/** 3: spiral galaxy — bulge + arms */
function formationGalaxy(i: number, count: number): [number, number, number] {
  const arms = 4
  const arm = i % arms
  const t = Math.pow(rand(i * 61.1), 0.64)
  const turns = t * Math.PI * 12 + arm * 1.5708
  const r = 0.28 + t * 13.5
  const spiral = turns + r * 0.58
  const jitter = (rand(i * 61.3) - 0.5) * (0.24 - t * 0.09)
  const x = Math.cos(spiral) * r + Math.cos(spiral * 2.05) * jitter
  const z = Math.sin(spiral) * r + Math.sin(spiral * 2.05) * jitter
  let y = (rand(i * 61.5) - 0.5) * (0.55 - t * 0.04)
  if (rand(i * 61.7) < 0.075) {
    const br = rand(i * 61.9) * 1.45
    const bth = rand(i * 62.1) * Math.PI * 2
    return [Math.cos(bth) * br * 0.38, (rand(i * 62.3) - 0.5) * 0.48, Math.sin(bth) * br * 0.38]
  }
  return [x, y, z]
}

/** 4: metal-glass vessel — cage, wires, confined interior */
function formationVessel(i: number, escapeBias: number): [number, number, number] {
  const e = escapeBias
  const hx = 1.42 + e * 0.2
  const hy = 1.02 + e * 0.16
  const hz = 1.42 + e * 0.2
  const u = rand(i * 71.1)
  if (u < 0.14) {
    const edge = Math.floor(rand(i * 72.05) * 12)
    const t = (edge / 12) * Math.PI * 2
    const ringR = hx * 0.98
    const yl = (rand(i * 72.08) - 0.5) * hy * 1.95
    return [Math.cos(t) * ringR, yl, Math.sin(t) * ringR * 0.96]
  }
  if (u < 0.22) {
    const w = Math.floor(rand(i * 71.25) * 4)
    const s = (rand(i * 71.27) - 0.5) * 2
    const t = (rand(i * 71.29) - 0.5) * 2
    if (w === 0) return [hx * 0.98, s * hy, t * hz]
    if (w === 1) return [-hx * 0.98, s * hy, t * hz]
    if (w === 2) return [s * hx, hy * 0.98, t * hz]
    return [s * hx, t * hy, hz * 0.98]
  }
  if (u < 0.32) {
    const face = Math.floor(rand(i * 71.3) * 6)
    const a = (rand(i * 71.5) - 0.5) * 2
    const b = (rand(i * 71.7) - 0.5) * 2
    if (face === 0) return [hx, a * hy, b * hz]
    if (face === 1) return [-hx, a * hy, b * hz]
    if (face === 2) return [a * hx, hy, b * hz]
    if (face === 3) return [a * hx, -hy, b * hz]
    if (face === 4) return [a * hx, b * hy, hz]
    return [a * hx, b * hy, -hz]
  }
  const rx = (rand(i * 72.5) - 0.5) * hx * 2
  const ry = (rand(i * 72.7) - 0.5) * hy * 2
  const rz = (rand(i * 72.9) - 0.5) * hz * 2
  const ax = Math.abs(rx) / hx
  const ay = Math.abs(ry) / hy
  const az = Math.abs(rz) / hz
  const m = Math.max(ax, ay, az)
  if (m > 0.9) {
    const s = 0.9 / m
    return [rx * s, ry * s, rz * s]
  }
  const n = new THREE.Vector3(rx, ry, rz).normalize()
  const push = e * (0.12 + rand(i * 73.1) * 0.52)
  return [rx + n.x * push, ry + n.y * push, rz + n.z * push]
}

/** 5: closing garden — ordered organic shell */
function formationGarden(i: number, count: number): [number, number, number] {
  const n = Math.max(2, count - 1)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const yy = 1 - (i / n) * 2
  const rr = Math.sqrt(Math.max(0, 1 - yy * yy))
  const theta = golden * i
  const rad = 2.2 + rand(i * 81.1) * 7.8
  const s = rad * 0.36
  const warp = (rand(i * 81.3) - 0.5) * 0.65
  return [
    Math.cos(theta) * rr * s + warp * 0.3,
    yy * rad * 0.5 - 0.08 + warp * 0.2,
    Math.sin(theta) * rr * s + warp * 0.3,
  ]
}

function generateFormations(count: number) {
  const pos0 = new Float32Array(count * 3)
  const pos1 = new Float32Array(count * 3)
  const pos2 = new Float32Array(count * 3)
  const pos3 = new Float32Array(count * 3)
  const pos4 = new Float32Array(count * 3)
  const pos5 = new Float32Array(count * 3)
  const randoms = new Float32Array(count)
  const sizes = new Float32Array(count)
  const anchors = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    randoms[i] = rand(i * 7.31)
    sizes[i] = powerLawSize(i)
    anchors[i] = isAnchorParticle(i)

    const set = (arr: Float32Array, p: [number, number, number]) => {
      arr[i3] = p[0]
      arr[i3 + 1] = p[1]
      arr[i3 + 2] = p[2]
    }

    set(pos0, formationCloud(i, 0))
    set(pos1, formationForest(i, count))
    set(pos2, formationUniverse(i))
    set(pos3, formationGalaxy(i, count))
    set(pos4, formationVessel(i, 1))
    set(pos5, formationGarden(i, count))
  }

  return { pos0, pos1, pos2, pos3, pos4, pos5, randoms, sizes, anchors }
}

const vertexShader = `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute vec3 aPos5;
  attribute float aRandom;
  attribute float aSize;
  attribute float aAnchor;

  uniform float uProgress;
  uniform float uTime;
  uniform float uVesselStrength;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uMetalBoost;

  varying float vAlpha;
  varying vec3 vColor;
  varying float vAnchor;
  varying float vSizeNorm;

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
    else { posA = aPos4; posB = aPos5; }

    vec3 pos = mix(posA, posB, t);

    float segF = clamp(uProgress, 0.0, 0.99999) * ${MORPH_SEGMENTS}.0;
    float segN = floor(segF);

    float breathe = sin(uTime * 0.52 + aRandom * 6.28318) * 0.055;
    breathe *= 1.0 - smoothstep(3.0, 5.0, segN) * 0.55;
    pos.y += breathe;

    float esc = uVesselStrength;
    if (esc > 0.01) {
      vec3 n = normalize(pos + vec3(0.0001));
      float pulse = sin(uTime * 6.2 + aRandom * 6.28318) * 0.5 + 0.5;
      pos += n * esc * pulse * 0.42;
    }

    float turb = 0.038 + smoothstep(1.0, 4.0, segN) * 0.045;
    pos.x += sin(uTime * 0.26 + aRandom * 50.0) * turb;
    pos.y += cos(uTime * 0.21 + aRandom * 40.0) * turb * 0.88;
    pos.z += sin(uTime * 0.18 + aRandom * 35.0) * turb * 0.72;

    float phaseScale = 1.0;
    if (segN < 0.5) phaseScale = 1.14;
    else if (segN < 2.5) phaseScale = 0.94;
    else if (segN < 3.5) phaseScale = 1.2;
    else if (segN < 4.5) phaseScale = 1.06;
    else phaseScale = 0.92;

    float anchor = aAnchor;
    float anchorScale = 1.0 + anchor * (1.95 + uMetalBoost * 0.5);
    float sizePulse = 1.0 + sin(uTime * 1.15 + aRandom * 12.0) * 0.06 * (1.0 - anchor * 0.35);
    phaseScale *= anchorScale * sizePulse;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float baseSize = aSize * phaseScale * (210.0 / -mvPos.z);
    gl_PointSize = clamp(baseSize, 0.42, 24.0);
    gl_Position = projectionMatrix * mvPos;

    float dist = -mvPos.z;
    vAlpha = clamp(1.0 - dist / 52.0, 0.035, 1.0);
    vColor = mix(uColor1, uColor2, aRandom);
    vAnchor = anchor;
    vSizeNorm = clamp(aSize / 6.0, 0.08, 1.0);
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vAnchor;
  varying float vSizeNorm;

  uniform float uOpacity;
  uniform float uMetalBoost;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float spikes = pow(abs(cos(a * 3.0)), 10.0) * (1.0 - smoothstep(0.08, 0.38, r));
    float cross = (1.0 - smoothstep(0.0, 0.035, abs(uv.x))) * (1.0 - smoothstep(0.22, 0.4, abs(uv.y)));
    cross += (1.0 - smoothstep(0.0, 0.035, abs(uv.y))) * (1.0 - smoothstep(0.22, 0.4, abs(uv.x)));
    cross *= 0.55;

    float edge0 = 0.26 - vAnchor * 0.05;
    float edge1 = 0.36 - vAnchor * 0.04;
    float disk = 1.0 - smoothstep(edge0, edge1, r);
    float core = 1.0 - smoothstep(0.0, 0.14 + vAnchor * 0.1 + vSizeNorm * 0.04, r);

    float starBody = clamp(disk + spikes * 0.85 + cross, 0.0, 1.0);
    float alpha = starBody * vAlpha * uOpacity;
    float hot = core * (0.12 + vAnchor * 0.62 + uMetalBoost * 0.22);
    vec3 hotCol = vec3(0.94, 0.97, 1.0);
    vec3 col = mix(vColor, hotCol, hot);
    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.0035) discard;
  }
`

export function CosmicParticles({ quality, progress }: CosmicParticlesProps) {
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
    geo.setAttribute('aRandom', new THREE.BufferAttribute(formations.randoms, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(formations.sizes, 1))
    geo.setAttribute('aAnchor', new THREE.BufferAttribute(formations.anchors, 1))
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
      uColor1: { value: new THREE.Color(0.15, 0.7, 0.36) },
      uColor2: { value: new THREE.Color(0.05, 0.35, 0.18) },
      uOpacity: { value: 1.0 },
      uMetalBoost: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    const p = progressRef.current
    const morphP = narrativeMorphProgress(p)
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uProgress.value = morphP
    uniforms.uVesselStrength.value = getVesselEffectStrength(p)
    uniforms.uMetalBoost.value = getVesselEmeraldHighlight(p)

    const { primary, secondary } = interpolateColorStages(morphP, COLOR_STAGES)
    uniforms.uColor1.value.setRGB(primary[0], primary[1], primary[2])
    uniforms.uColor2.value.setRGB(secondary[0], secondary[1], secondary[2])
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
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
