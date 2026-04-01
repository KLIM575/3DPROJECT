'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel, COLOR_STAGES } from '@/lib/constants'
import { interpolateColorStages } from '@/lib/animations'
import { getNarrativePhaseIndex, narrativeMorphProgress } from '@/lib/narrative'

interface MorphingCoreProps {
  progress: number
  quality: QualityLevel
}

/** Trefoil-style knot for orbit tubes (not flat rings) */
class KnotCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly scale: number,
    private readonly phase: number,
    private readonly axisSwap: 0 | 1 | 2,
  ) {
    super()
  }

  override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const u = t * Math.PI * 2 + this.phase
    let x = Math.sin(u) + 2 * Math.sin(2 * u)
    let y = Math.cos(u) - 2 * Math.cos(2 * u)
    let z = -Math.sin(3 * u)
    x *= this.scale * 0.38
    y *= this.scale * 0.38
    z *= this.scale * 0.38
    if (this.axisSwap === 1) return optionalTarget.set(z, x, y)
    if (this.axisSwap === 2) return optionalTarget.set(y, z, x)
    return optionalTarget.set(x, y, z)
  }
}

const coreVertexShader = `
  uniform float uSeg;
  uniform float uSegT;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vLocalPos;
  varying float vFresnel;

  vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x - s * v.z, v.y, s * v.x + c * v.z);
  }

  float tri(vec3 n, float k) {
    return abs(dot(normalize(n), normalize(vec3(sin(k), cos(k * 1.7), sin(k * 0.6)))));
  }

  vec3 shape0(vec3 p, vec3 n, float time) {
    float k = tri(n, time * 0.4);
    float pulse = sin(time * 2.6 + k * 18.0) * 0.11;
    return p * (1.0 + pulse);
  }

  vec3 shape1(vec3 p, vec3 n, float time) {
    float w = sin(p.y * 14.0 + time * 1.4) * 0.045;
    return vec3(p.x * 0.62 + w, p.y * 1.52, p.z * 0.62 + w);
  }

  vec3 shape2(vec3 p, vec3 n, float time) {
    float ang = atan(p.z, p.x);
    float lean = sin(ang * 3.0 + time * 0.35) * 0.14;
    return vec3(p.x * 0.7 + lean, p.y * 1.38, p.z * 0.7);
  }

  vec3 shape3(vec3 p, vec3 n, float time) {
    float r = length(p);
    float burst = 1.0 + sin(time * 0.9 + r * 6.0) * 0.35;
    return normalize(p + n * 0.02) * r * burst;
  }

  vec3 shape4(vec3 p, vec3 n, float time) {
    float ang = atan(p.z, p.x);
    vec3 q = p + n * (0.18 * sin(ang * 5.0 + time * 0.8));
    return rotY(q, p.y * 1.6 + time * 0.25);
  }

  vec3 shape5(vec3 p, vec3 n, float time) {
    float twist = p.y * 2.4 + time * 0.5;
    vec3 q = rotY(p, twist);
    return vec3(q.x * 1.22, q.y * 0.32, q.z * 1.22);
  }

  vec3 shape6(vec3 p, vec3 n, float time) {
    float cage = (abs(p.x) + abs(p.y) + abs(p.z)) * 0.55;
    float pulse = sin(time * 5.5) * 0.04;
    return p * (0.78 - cage * 0.12 + pulse);
  }

  vec3 shape7(vec3 p, vec3 n, float time) {
    float breathe = sin(time * 1.1 + length(p) * 5.0) * 0.09;
    return p * (1.0 + breathe);
  }

  vec3 pickShape(float idx, vec3 p, vec3 n, float time) {
    if (idx < 0.5) return shape0(p, n, time);
    if (idx < 1.5) return shape1(p, n, time);
    if (idx < 2.5) return shape2(p, n, time);
    if (idx < 3.5) return shape3(p, n, time);
    if (idx < 4.5) return shape4(p, n, time);
    if (idx < 5.5) return shape5(p, n, time);
    if (idx < 6.5) return shape6(p, n, time);
    return shape7(p, n, time);
  }

  void main() {
    vNormal = normal;
    float st = uSegT * uSegT * (3.0 - 2.0 * uSegT);
    vec3 pa = pickShape(uSeg, position, normal, uTime);
    float nb = min(uSeg + 1.0, 7.0);
    vec3 pb = pickShape(nb, position, normal, uTime);
    vec3 newPos = mix(pa, pb, st);

    vLocalPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vec3 worldNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vFresnel = pow(1.0 - abs(dot(worldNormal, viewDir)), 1.85);
  }
`

const coreFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSharp;

  varying vec3 vNormal;
  varying vec3 vLocalPos;
  varying float vFresnel;

  void main() {
    float edge = max(max(abs(vLocalPos.x), abs(vLocalPos.y)), abs(vLocalPos.z));
    float facet = smoothstep(0.35, 0.95, sin(edge * 11.0 + dot(vNormal, vec3(0.4, 1.0, 0.2)) * 6.0) * 0.5 + 0.5);
    float rim = pow(vFresnel, 1.2);
    vec3 base = uColor * (0.18 + facet * 0.22 + rim * 0.55);
    float alpha = (0.08 + rim * 0.62 + facet * 0.12) * uOpacity * uSharp;
    gl_FragColor = vec4(base, alpha);
  }
`

const ORBIT_SCALES = [2.35, 2.95, 3.55] as const
const ORBIT_PHASE = [0, 2.1, 4.2] as const
const ORBIT_SWAP: (0 | 1 | 2)[] = [0, 1, 2]

export function MorphingCore({ progress, quality }: MorphingCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const orbitRefs = useRef<(THREE.Mesh | null)[]>([])
  const orbitMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const progressRef = useRef(progress)
  progressRef.current = progress

  const detail = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1
  const tubeRadial = quality === 'high' ? 5 : quality === 'medium' ? 4 : 3

  const uniforms = useMemo(
    () => ({
      uSeg: { value: 0 },
      uSegT: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0, 1, 1) },
      uOpacity: { value: 1.0 },
      uSharp: { value: 1.0 },
    }),
    [],
  )

  const orbitGeometries = useMemo(() => {
    return ORBIT_SCALES.map((scale, i) => {
      const path = new KnotCurve(scale, ORBIT_PHASE[i], ORBIT_SWAP[i])
      return new THREE.TubeGeometry(path, quality === 'low' ? 96 : 160, 0.028, tubeRadial, false)
    })
  }, [quality, tubeRadial])

  const cageEdgeGeometry = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.48, Math.min(detail, 2))
    const edges = new THREE.EdgesGeometry(base)
    base.dispose()
    return edges
  }, [detail])

  useEffect(() => {
    return () => {
      orbitGeometries.forEach((g) => g.dispose())
      cageEdgeGeometry.dispose()
    }
  }, [orbitGeometries, cageEdgeGeometry])

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const p = progressRef.current
    const morphP = narrativeMorphProgress(p)
    const phase = getNarrativePhaseIndex(p)

    const x = morphP * 7
    const seg = Math.min(Math.floor(x), 6)
    const segT = x - seg

    uniforms.uTime.value = time
    uniforms.uSeg.value = seg
    uniforms.uSegT.value = segT

    const { primary } = interpolateColorStages(morphP, COLOR_STAGES)
    uniforms.uColor.value.setRGB(primary[0], primary[1], primary[2])

    let coreOpacity = 0.88
    let sharp = 1.0
    if (phase === 0) {
      coreOpacity = 0.72
      sharp = 0.92
    } else if (phase === 1 || phase === 2) {
      coreOpacity = 0.18
      sharp = 1.15
    } else if (phase === 3) {
      coreOpacity = 0.68
      sharp = 1.05
    } else if (phase === 4) {
      coreOpacity = 1.0
      sharp = 1.08
    } else if (phase === 5) {
      coreOpacity = 0.74
      sharp = 1.12
    } else if (phase === 6 || phase === 7) {
      coreOpacity = 0.42
      sharp = 0.98
    }
    uniforms.uOpacity.value += (coreOpacity - uniforms.uOpacity.value) * 0.07
    uniforms.uSharp.value += (sharp - uniforms.uSharp.value) * 0.06

    if (groupRef.current) {
      const precess = time * 0.11
      groupRef.current.rotation.y = precess + Math.sin(p * Math.PI * 2) * 0.25
      groupRef.current.rotation.x = Math.sin(time * 0.07 + p * 3) * 0.22
      groupRef.current.rotation.z = Math.cos(time * 0.05) * 0.12
      const s =
        1.0 +
        (phase === 4 ? 0.12 : 0) +
        (phase === 5 ? -0.06 : 0) +
        Math.sin(morphP * 6.28318) * 0.04
      groupRef.current.scale.setScalar(s)
    }

    const orbitPulse = 0.92 + Math.sin(p * Math.PI * 2 + time * 0.4) * 0.14
    const orbitDim = phase === 1 || phase === 2 ? 0.1 : phase === 5 ? 0.5 : 1

    orbitRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.rotation.y += 0.011 * (i % 2 === 0 ? 1 : -1)
      mesh.rotation.x += 0.006 * (1 + i * 0.2)
      mesh.scale.setScalar(orbitPulse)
    })

    orbitMatRefs.current.forEach((mat, i) => {
      if (!mat) return
      mat.color.setRGB(primary[0], primary[1], primary[2])
      const flicker = 0.55 + Math.sin(time * 0.7 + i * 1.7) * 0.45
      mat.opacity = (0.07 + i * 0.02) * orbitDim * flicker
    })
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[1.42, detail]} />
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
          <lineSegments geometry={cageEdgeGeometry}>
            <lineBasicMaterial color="#8a7a68" transparent opacity={0.14} />
          </lineSegments>
        )}
      </group>

      {ORBIT_SCALES.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            orbitRefs.current[i] = el
          }}
          geometry={orbitGeometries[i]}
        >
          <meshBasicMaterial
            ref={(el) => {
              orbitMatRefs.current[i] = el
            }}
            color="#c4a574"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}
