// Vertex shader for particle field
// Used as raw strings in ParticleField.tsx

export const particleVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uProgress;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Gentle float animation
    pos.y += sin(uTime * 0.5 + aPhase) * 0.3;
    pos.x += cos(uTime * 0.3 + aPhase * 1.5) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (250.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Distance-based alpha
    float dist = length(pos.xz) / 30.0;
    vAlpha = (1.0 - clamp(dist, 0.0, 1.0)) * uProgress;
  }
`;

export const particleFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Circular particle with soft edges
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    
    // Glow core
    float glow = 1.0 - smoothstep(0.0, 0.3, d);
    vec3 col = mix(uColor, vec3(1.0), glow * 0.5);
    
    gl_FragColor = vec4(col, alpha * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;
