
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Barrier1 = (props) => {
  const { nodes, materials } = useGLTF('/models/barrier1.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial.geometry}
            material={materials.NewJersey}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_1.geometry}
            material={materials.NewJersey}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_2.geometry}
            material={materials.NewJersey}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/barrier1.glb')

export default Barrier1