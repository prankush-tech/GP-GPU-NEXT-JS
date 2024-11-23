export default `

uniform float uPositionTime;
uniform float uCubeSize;
uniform float uSphereRadius;
uniform float uMorphFactor;

void main()
{
    //uv
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    //initial Position and velocity
    vec4 tempPosition = texture(texturePosition,uv);
    vec3 position = tempPosition.xyz;
    vec3 velocity = texture(textureVelocity,uv).xyz;


    //Sphere Position
    vec3 spherePosition = normalize(vec3(
        uv.x - 0.5,
        uv.y - 0.5,
        tempPosition.w - 0.5
    )) * uSphereRadius;

    //Cube Position
    vec3 cubePosition = vec3(
        (uv.x - 0.5) * uCubeSize,
        (uv.y - 0.5) * uCubeSize,
        (tempPosition.w - 0.5) * uCubeSize
    );

    //based on MorPhing Factor change shape
    vec3 targetPosition;

    if(uMorphFactor == 0.0)
        targetPosition = spherePosition;
    else
        targetPosition = cubePosition;
    
    position += (targetPosition - position) * 0.1;
    position += velocity *0.016;

    gl_FragColor = vec4(position, tempPosition.w);
}


`