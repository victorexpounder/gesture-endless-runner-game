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
import CharacterRunning1 from '@/components/CharacterRunning1';
import TWEEN, { Tween } from '@tweenjs/tween.js';
import Tress from '@/components/Tress';
import TreeObstacles from '@/components/Tress';
import BoxObstacles from '@/components/BoxObstacles';
import GameOverScreen from '@/components/GameOverScreen';
import { useMediaQuery } from 'react-responsive';


const Page = () => {

  const [currentlane, setCurrentlane] = useState(0);
  const [animation, setAnimation] = useState("running");
  const [isGameOver, setisGameOver] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const characterRef = useRef();
  const rollingGroundRef = useRef();
  const isMobile = useMediaQuery({maxWidth: 768})

  
  const Skybox = () => {
    const hdri = useLoader(RGBELoader, '/textures/your-sky.hdr'); 
    hdri.mapping = THREE.EquirectangularReflectionMapping;
  
    return <primitive attach="background" object={hdri} />;
  };

  const handleReset = () => {
    setisGameOver(false)
    setResetKey((prevKey) => prevKey + 1)
  }

  useEffect(() => {
    console.log('heroRef:', characterRef.current);
    console.log('rollingGroundSphereRef:', rollingGroundRef.current);
  }, []);
  

  return (
    <div className="w-screen h-screen">
      <Canvas className="w-full h-full" key={resetKey}>
        <PerspectiveCamera 
        makeDefault fov={60}  
        position={[0, 3.5, isMobile ? 10 : 6.5]}
        />
        <hemisphereLight skyColor={'0xfffafa'} groundColor={0x000000} intensity={1}/>
        <directionalLight color={'0xcdc1c5'} intensity={1} position={[12, 6, -7]} castShadow shadow={{mapSize: [256, 256], camera: {near:  0.5, far:50}}}/>
        <ambientLight color={'0xfffafa'} intensity={1}/>
        <fogExp2 color={0xf0fff0} density={0.14} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} minPolarAngle={1.1} maxPolarAngle={1.1} minAzimuthAngle={-0.2} maxAzimuthAngle={0.2}/>
        <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} />
        <Environment externalRef={rollingGroundRef} isGameOver={isGameOver}/>
        <CharacterRunning1 rotationZ={-60} externalRef={characterRef} isGameOver={isGameOver} />
        <BoxObstacles characterRef={characterRef} isGameOver={isGameOver} setIsGameOver={setisGameOver}/>
        <TreeObstacles characterRef={characterRef} setIsGameOver={setisGameOver} isGameOver={isGameOver}  />
        {isGameOver && <GameOverScreen handleReset={handleReset}/>}
      </Canvas>
    </div>
  );
};

export default Page;

