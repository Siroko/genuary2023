precision highp float;

uniform sampler2D uPositionsTexture;
uniform sampler2D uVelocitiesTexture;
uniform float uTime;
uniform float uDeltaTime;

varying vec2 vUv;

void main() {

  vec4 positions = texture2D(uPositionsTexture, vUv);
  vec4 velocity = texture2D(uVelocitiesTexture, vUv);

  positions.xyz += velocity.xyz * uDeltaTime;

  gl_FragColor = vec4(positions.xyz, velocity.w);
}