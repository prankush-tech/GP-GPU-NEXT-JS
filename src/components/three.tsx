"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import GpGpuParticles from "./GpGPU/Gpu";
import { OrbitControls } from "@react-three/drei";
import { useShape } from "@/store/ShapeShifter";
import MorphingAnimation from "./GpGPU/MorphAnimation";
import { Perf } from 'r3f-perf'
const Three = () => {

  const {shape}: any = useShape()

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
      <color attach="background" args={['#000']} />
      <GpGpuParticles morphFactor={shape} />
      {/* <OrbitControls/> */}
      <Perf/>
      <MorphingAnimation/>
    </Canvas>

  );
};

export default Three;
