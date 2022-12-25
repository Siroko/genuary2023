#extension GL_OES_standard_derivatives : enable
precision highp float;


varying vec2 vUv;
varying mat3 vNormalMatrix;
varying vec4 vPosition;

uniform vec4 uRandomColors;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {

  vec3 fdx = dFdx( vPosition.xyz );
	vec3 fdy = dFdy( vPosition.xyz );
	vec3 n = vNormalMatrix * normalize(cross(fdx, fdy));

  vec3 light = vec3(-1., 0.0, 0.3);
  float lambert = max( dot( n, light ), 0.0 );

  vec3 fColor = pal( vPosition.a, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(uRandomColors.xyz) );

  gl_FragColor = vec4(fColor * lambert, 1.0);
}