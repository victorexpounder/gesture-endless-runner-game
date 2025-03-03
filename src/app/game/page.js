'use client'
import Character1 from '@/components/Character1'
import Character2 from '@/components/Character2'
import Environment from '@/components/environment'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div className='w-screen h-screen'>
      <Canvas >
        <ambientLight intensity={7}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <directionalLight position={[10, 10, 10]} intensity={1}/>
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI/2}/>
        <Suspense fallback={<>Loading...</>}>
          <Environment />
          <Character2 position-y={-3} scale={3} />
        </Suspense>
      </Canvas>

    </div>
  )
}

export default page
