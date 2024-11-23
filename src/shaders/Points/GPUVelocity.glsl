export default `

uniform float uVelocityTime;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D(texturePosition, uv).xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    // Add some random movement
    velocity += vec3(
        sin(uv.x * 10.0 + uVelocityTime * 2.5) * 0.02 * rand(uv),
        cos(uv.y * 10.0 + uVelocityTime) * 0.02 * rand(uv),
        sin((uv.x + uv.y) * 10.0 + uVelocityTime) * 0.2 * rand(uv)
    );

    // Damping
    velocity *= 0.9;
    gl_FragColor = vec4(velocity, 1.0);
}

`