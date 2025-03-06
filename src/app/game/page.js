'use client';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { EffectComposer, MotionBlur } from '@react-three/postprocessing';
import { useGLTF } from '@react-three/drei';
import Character1 from '@/components/Character1';
import Environment from '@/components/environment';





const Page = () => {

  const [currentlane, setCurrentlane] = useState(0);
  const [animation, setAnimation] = useState("running");
  
  const Skybox = () => {
    const hdri = useLoader(RGBELoader, '/textures/your-sky.hdr'); 
    hdri.mapping = THREE.EquirectangularReflectionMapping;
  
    return <primitive attach="background" object={hdri} />;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        if(currentlane == 0){
          setCurrentlane(-1)
        }else if(currentlane == 1){
          setCurrentlane(0)
        }
      } else if (event.key === 'ArrowRight') {
        if(currentlane == 0){
          setCurrentlane(1)
        }else if(currentlane == -1){
          setCurrentlane(0)
        }
      }else if (event.key === 'ArrowUp') {
        setAnimation('jump');
        
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className="w-screen h-screen">
      <Canvas className="w-full h-full" >
        <PerspectiveCamera makeDefault fov={60}  position={[0, 3.5, 6.5]}/>
        <hemisphereLight skyColor={'0xfffafa'} groundColor={0x000000} intensity={1}/>
        <directionalLight color={'0xcdc1c5'} intensity={1} position={[12, 6, -7]} castShadow shadow={{mapSize: [256, 256], camera: {near:  0.5, far:50}}}/>
        <ambientLight color={'0xfffafa'} intensity={1}/>
        <fogExp2 color={0xf0fff0} density={0.14} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} minPolarAngle={1.1} maxPolarAngle={1.1} minAzimuthAngle={-0.2} maxAzimuthAngle={0.2}/>
        <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} />
        <Environment/>
        <Character1 position={[currentlane, 1.8, 4.8]} setAnimation={setAnimation} rotationZ={-60} scale={0.5} animationName={animation}/>
      </Canvas>
    </div>
  );
};

export default Page;
