export const neonGridVertexShader = `
  varying vec2 vUv;
  varying float vDistance;
  uniform float uTime;
  uniform float uScroll;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Perspective distortion for infinite feel
    vDistance = abs(pos.z) / 50.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const neonGridFragmentShader = `
  varying vec2 vUv;
  varying float vDistance;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  float grid(vec2 uv, float freq) {
    vec2 g = abs(fract(uv * freq - 0.5) - 0.5) / fwidth(uv * freq);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    float g = grid(vUv, 20.0);
    
    // Fade with distance (perspective fog)
    float fog = 1.0 - clamp(vDistance * 2.0, 0.0, 1.0);
    
    // Scanline flicker
    float flicker = 0.85 + 0.15 * sin(uTime * 2.0 + vUv.y * 50.0);
    
    vec3 col = uColor * g * fog * flicker;
    float alpha = g * fog * uOpacity;
    
    gl_FragColor = vec4(col, alpha);
    if (alpha < 0.01) discard;
  }
`;
