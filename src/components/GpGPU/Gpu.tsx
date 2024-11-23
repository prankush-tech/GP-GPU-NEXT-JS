import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";
import pointShader from "../../shaders/Points/GPUPoints.glsl";
import velocityShader from "../../shaders/Points/GPUVelocity.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import vertexShader from "../../shaders/vertex.glsl";
import * as THREE from "three";

const PARTICLES = 16384;
const TEXTURE_SIZE = Math.ceil(Math.sqrt(PARTICLES));

const GpGpuParticles = ({ morphFactor }: { morphFactor: number }) => {
  //get the gl renderer
  const { gl } = useThree();
  const gpuCompute = useRef<GPUComputationRenderer>();
  const pointsRef = useRef<THREE.Points>(null);
  const positionVariable = useRef<any>();
  const velocityVariable = useRef<any>();

  //create UV and Position Array
  const [positionsArray, uvArray] = useMemo(() => {
    const positionsArray = new Float32Array(PARTICLES * 3);
    const uvArray = new Float32Array(PARTICLES * 2);
    //map the UV
    for (let i = 0; i < PARTICLES; i++) {
      const i2 = i * 2;
      uvArray[i2 + 0] = (i % TEXTURE_SIZE) / TEXTURE_SIZE;
      uvArray[i2 + 1] = Math.floor(i / TEXTURE_SIZE) / TEXTURE_SIZE;
    }
    return [positionsArray, uvArray];
  }, []);

  //GPGpu Init
  useEffect(() => {
    gpuCompute.current = new GPUComputationRenderer(
      TEXTURE_SIZE,
      TEXTURE_SIZE,
      gl
    );

    //createBlack Texture
    const positionTexture = gpuCompute.current.createTexture();
    const velocityTexture = gpuCompute.current.createTexture();

    const posArray = positionTexture.image.data;
    const velArray = velocityTexture.image.data;

    for (let i = 0; i < posArray.length; i++) {
      const i4 = i * 4;

      posArray[i4 + 0] = Math.random() * 2 - 1;
      posArray[i4 + 1] = Math.random() * 2 - 1;
      posArray[i4 + 2] = Math.random() * 2 - 1;
      posArray[i4 + 3] = Math.random();

      velArray[i4 + 0] = 0;
      velArray[i4 + 1] = 0;
      velArray[i4 + 2] = 0;
      velArray[i4 + 3] = 1;
    }
    positionVariable.current = gpuCompute.current.addVariable(
      "texturePosition",
      pointShader,
      positionTexture
    );

    velocityVariable.current = gpuCompute.current.addVariable(
      "textureVelocity",
      velocityShader,
      velocityTexture
    );

    //setVaribale Dependency
    gpuCompute.current.setVariableDependencies(positionVariable.current, [
      positionVariable.current,
      velocityVariable.current,
    ]);

    gpuCompute.current.setVariableDependencies(velocityVariable.current, [
      positionVariable.current,
      velocityVariable.current,
    ]);

    //add uniforms
    positionVariable.current.material.uniforms["uPositionTime"] = { value: 0 };
    positionVariable.current.material.uniforms["uCubeSize"] = { value: 2 };
    positionVariable.current.material.uniforms["uSphereRadius"] = { value: 1 };
    positionVariable.current.material.uniforms["uMorphFactor"] = { value: 0 };

    velocityVariable.current.material.uniforms["uVelocityTime"] = { value: 0 };

    gpuCompute.current.init();
  }, [gl]);



  useFrame((state) => {
    if (gpuCompute.current && pointsRef.current) {

      const time = state.clock.elapsedTime;
      const shaderMaterial = pointsRef.current.material as THREE.ShaderMaterial;

      positionVariable.current.material.uniforms["uPositionTime"].value = time;
      positionVariable.current.material.uniforms["uMorphFactor"].value =
        morphFactor;
      velocityVariable.current.material.uniforms["uVelocityTime"].value = time;

      gpuCompute.current.compute();

      shaderMaterial.uniforms["texturePosition"].value =
        gpuCompute.current.getCurrentRenderTarget(
          positionVariable.current
        ).texture;
    }
  });
  const uniforms = useMemo(
    () => ({
      texturePosition: { value: null },
      pointSize: { value: 5 },
    }),
    []
  );
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positionsArray.length / 3}
          array={positionsArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uvArray"
          array={uvArray}
          count={uvArray.length / 2}
          itemSize={2}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default GpGpuParticles;
