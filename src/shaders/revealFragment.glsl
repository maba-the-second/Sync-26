uniform float uTime;
uniform float uProgress;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  float scanline = sin(vPosition.y * 24.0 - uTime * 6.0) * 0.5 + 0.5;
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  vec3 finalColor = mix(uColor * 0.4, uColor, scanline * 0.6 + fresnel * 0.8);
  float alpha = clamp(uProgress * (0.65 + scanline * 0.35), 0.0, 1.0);

  gl_FragColor = vec4(finalColor, alpha);
}
