'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeonGridProps {
  color?: string
  opacity?: number
  size?: number
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  float gridLine(float v, float lineWidth) {
    float g = abs(fract(v - 0.5) - 0.5) / fwidth(v);
    return 1.0 - min(g * lineWidth, 1.0);
  }

  void main() {
    float scale = 4.0;
    float majorLine = gridLine(vUv.x * scale, 0.8) + gridLine(vUv.y * scale, 0.8);
    float minorLine = gridLine(vUv.x * scale * 5.0, 0.4) + gridLine(vUv.y * scale * 5.0, 0.4);
    float g = clamp(majorLine * 0.8 + minorLine * 0.3, 0.0, 1.0);
    
    // Perspective fade from center/edge
    float fadeX = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float fadeY = smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
    float fade = fadeX * fadeY;

    // Flicker
    float flicker = 0.8 + 0.2 * sin(uTime * 3.0 + vUv.x * 10.0);
    
    // Scanline pulse
    float scan = 0.9 + 0.1 * sin(vUv.y * 80.0 - uTime * 2.0);

    vec3 col = uColor * g * fade * flicker * scan;
    float alpha = g * fade * uOpacity * 0.7;

    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.005) discard;
  }
`

export function NeonGrid({ color = '#00FFFF', opacity = 1, size = 40 }: NeonGridProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
  }), [color, opacity])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uOpacity.value = opacity
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
