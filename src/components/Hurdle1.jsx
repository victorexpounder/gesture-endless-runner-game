

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Hurlde1 = (props) => {
  const { nodes, materials } = useGLTF('/models/hurdle1.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0.004, -0.836, 0.832]} rotation={[-Math.PI, Math.PI / 2, 0]}>
        <group rotation={[0, 0, -Math.PI / 2]} scale={0.01}>
          <group rotation={[-Math.PI, Math.PI / 2, 0]} scale={100}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Hurdle_HurdleBase_0.geometry}
              material={materials.HurdleBase}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.HurdleBar_HurdleBar_0.geometry}
              material={materials.HurdleBar}
              position={[-0.001, 0.041, 1.579]}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/hurdle1.glb')

export default Hurlde1