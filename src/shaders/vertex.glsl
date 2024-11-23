export default `
attribute vec2 uvArray;
uniform sampler2D texturePosition;
uniform float pointSize;

varying vec3 vColor;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}


void main() {

    vec3 pos = texture2D(texturePosition, uvArray).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeIn = smoothstep(0.0,1.0,pos.z);
    float sizeOut = 1.0 -  smoothstep(0.7,1.0,pos.z);
    float size = min(sizeIn,sizeOut);

    gl_PointSize = (pointSize) * 4.0 * size; 
    gl_PointSize *= (1.0 / - mvPosition.z);

    vColor = normalize(abs(pos)) * 0.5 + 0.5;
}
`;