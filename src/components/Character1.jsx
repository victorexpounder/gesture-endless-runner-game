/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'

const Character1 = ({animationName = 'idle', setAnimation, rotationZ, ...props}) => {
  const { nodes, materials } = useGLTF('/models/humans/character1/character1.glb')
  const { animations: idleAnimation } =  useFBX('/models/humans/character1/idle.fbx')
  const { animations: runningAnimation } =  useFBX('/models/humans/character1/running.fbx')
  const { animations: jumpAnimation } =  useFBX('/models/humans/character1/Jump.fbx')
  console.log(idleAnimation)
  const group = useRef()
  idleAnimation[0].name = 'idle'
  runningAnimation[0].name = 'running'
  jumpAnimation[0].name = 'jump'
  const {actions} = useAnimations(
    [
      idleAnimation[0],
      runningAnimation[0],
      jumpAnimation[0],

    ], 
    group 
  )
  console.log(actions)

  useEffect(() => {
      if (nodes.Hips) {
        nodes.Hips.rotation.x = Math.PI / 2; // Rotate the root bone
      }
    }, []); 

  useEffect(()=>{
    actions[animationName].reset().fadeIn(0.5).play()
    if(animationName == 'jump'){
      setTimeout(() => setAnimation('running'), 1000);
      console.log(animationName)
    }
    group.current.rotation.set(-Math.PI / 2, 0, rotationZ? rotationZ : 0);
    return () =>{
      if (actions && actions[animationName]) { // Ensure actions is defined in cleanup
          actions[animationName].fadeOut(0.5);
      }
    }
    
  },[actions, animationName])

  return (
    <group {...props} dispose={null} castShadow={true} receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]}  ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
    </group>
  )
}

useGLTF.preload('/models/humans/character1/character1.glb')

export default Character1
