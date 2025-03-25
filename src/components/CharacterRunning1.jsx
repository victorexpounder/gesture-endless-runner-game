import React, { useEffect, useRef } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import TWEEN, { Tween, Group } from '@tweenjs/tween.js';
import { AnimationMixer } from 'three';
import { io } from 'socket.io-client';


const CharacterRunning1 = (
  { externalRef, 
    videoRef, 
    canvasRef, 
    setAnimation, 
    isGameOver, 
    character, 
    mode, 
    rotationZ,
    ...props
  }
) => {
  const { nodes, materials } = useGLTF(`/models/humans/${character}/${character}.glb`)
  const { animations: idleAnimation } =  useFBX(`/models/humans/${character}/idle.fbx`)
  const { animations: runningAnimation } =  useFBX(`/models/humans/${character}/running.fbx`)
  const { animations: jumpAnimation } =  useFBX(`/models/humans/${character}/Jump.fbx`)
  const { animations: slideAnimation } =  useFBX(`/models/humans/${character}/slide.fbx`)
  const { animations: fallingAnimation } =  useFBX(`/models/humans/${character}/falling.fbx`)
  
  const group = useRef()
  idleAnimation[0].name = 'idle'
  runningAnimation[0].name = 'running'
  jumpAnimation[0].name = 'jump'
  slideAnimation[0].name = 'slide'
  fallingAnimation[0].name = 'fall'

  const {actions} = useAnimations(
    [
      idleAnimation[0],
      runningAnimation[0],
      jumpAnimation[0],
      slideAnimation[0],
      fallingAnimation[0]
    ], 
    group 
  )
  const tweenGroup = new Group();
  var isJumping = false 
  var isSliding = false
  var currentAnimation = 'running' 
  var touchstartX, touchstartY, touchendX, touchendY
  const socketRef = useRef(null);
  const gestureRef = useRef();
  const SERVER_URL = "http://localhost:5000"

  const moveLeft = () =>{
      if(group.current.position.x !== -18)
        {
            const tweenLeft = new TWEEN.Tween(group.current.position)
            .to({ x: group.current.position.x - 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {

            if (group.current.position.x <= -1) {
                group.current.position.x = -1;
            }
            })
            
            tweenLeft.start();
            tweenGroup.add(tweenLeft);
        }
}

  const moveRight = () =>{
      if(group.current.position.x !== -18)
        {
            const tweenLeft = new TWEEN.Tween(group.current.position)
            .to({ x: group.current.position.x + 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {

            if (group.current.position.x >= 1) {
                group.current.position.x = 1;
            }
            })
            
            tweenLeft.start();
            tweenGroup.add(tweenLeft);
        }
}
  const jump = () =>{
    if(!isJumping)
    {
        isJumping = true;
        actions[currentAnimation].stop()
        currentAnimation = 'jump'
        actions[currentAnimation].reset().setLoop(1,1).play()
        actions[currentAnimation].getMixer().addEventListener('finished', () => {
        actions[currentAnimation].reset().crossFadeTo(actions['running'], 0.1, false).play();
        currentAnimation = 'running'
      })

      const jumpingUp = new Tween(group.current.position).to({ y: group.current.position.y += 0.5 }, 400);
      const jumpingDown = new Tween(group.current.position)
        .to({ y: group.current.position.y -= 0.5 }, 400);
      jumpingUp.chain(jumpingDown);
      jumpingUp.start();
      jumpingDown.onComplete(() => {
        isJumping = false;
        group.current.position.y = 1.8;
      });
      tweenGroup.add(jumpingUp)
      tweenGroup.add(jumpingDown)
    }
  }

  const slide = () =>{
    if (!isSliding) {    
      if (isJumping) {
        actions['jump'].stop()
        group.current.position.y = 1.8;
        isJumping = false;
      }
      isSliding = true;
      
      actions[currentAnimation].stop();
      actions['slide'].reset();
      currentAnimation = 'slide';
      actions[currentAnimation].clampWhenFinished = true;
      actions[currentAnimation].play();
      actions[currentAnimation].crossFadeTo(actions['running'], 1.9, false).play();
      group.current.position.y = 1.6;
      currentAnimation = 'running';
      setTimeout(() => {
        group.current.position.y = 1.8;
        isSliding = false;
      }, 800);
    }
  }

  useEffect(() => {
    if(isGameOver)
      {
        actions['fall'].clampWhenFinished = true;
        actions['fall'].reset().fadeIn(0.5).setLoop(1,1).play();
        currentAnimation = 'fall'
      }else{
        actions[currentAnimation].reset().fadeIn(0.5).play();
      }
      if (nodes.Hips) {
        nodes.Hips.rotation.x = Math.PI / 2; // Rotate the root bone
      }
    }, [isGameOver]); 

    useEffect(() => {
      if (externalRef) {
        externalRef.current = group.current;
      }
    }, [externalRef]);

    useEffect(() => {      
        const handleKeyDown = (event) => {
          if (event.key === 'ArrowLeft') {
            moveLeft()
          } else if (event.key === 'ArrowRight') {
            moveRight()
            
          }else if (event.key === 'ArrowUp') {
            jump()
          }else if (event.key === 'ArrowDown') {
            slide()
          }
        };

        const handleGesture = () => {
          const deltaX = Math.abs(touchendX - touchstartX);
          const deltaY = Math.abs(touchendY - touchstartY);
        
          if (deltaX > deltaY) {
            // Horizontal swipe
            if (touchendX < touchstartX) {
              moveLeft();
            } else if (touchendX > touchstartX) {
              moveRight();
            }
          } else {
            // Vertical swipe
            if (touchendY < touchstartY) {
              jump();
            } else if (touchendY > touchstartY) {
              slide();
            }
          }
        };
        

        window.addEventListener('touchstart', function (event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);
        
        window.addEventListener('touchend', function (event) {
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            handleGesture();
        }, false);
        window.addEventListener('keydown', handleKeyDown);
      
        return () => {
         
          
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

      useEffect(()=>{
        // Receive gesture from server
        if(mode === 'gesture')
          {
          // Initialize WebSocket connection
          socketRef.current = io(SERVER_URL);
          socketRef.current.on("gesture", (data) => {
            if(gestureRef.current !== data.gesture)
            {
              gestureRef.current = data.gesture;
              console.log(data.gesture)
            }
          });
        }
      }, [])

      const sendFrame = () => {
          if (!videoRef.current || !canvasRef.current) return;
      
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
      
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          // Flip the frame horizontally before sending
          ctx.save();
          ctx.translate(canvas.width, 0); // Move origin to right
          ctx.scale(-1, 1); // Flip horizontally
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          const dataUrl = canvas.toDataURL("image/png"); // Convert to base64
          socketRef.current.emit("image", dataUrl);
          
        };
      
        useEffect(() => {
          if(mode === 'gesture')
          {
            const interval = setInterval(sendFrame, 1000); // Send frames every 100ms
            return () => clearInterval(interval);
          }
        }, []);
    
        
    

    useFrame((state, delta) => {
      tweenGroup.update();
      if(gestureRef.current === "handOpen")
        {
          jump()
        }else if(gestureRef.current === "left")
        {
          moveLeft()
        }else if(gestureRef.current === "right")
        {
          moveRight()
        }
    })
   
  return (
    <group  {...props}  scale={0.5}  position={[0, 1.8, 4.8]} dispose={null} castShadow={true} receiveShadow={true} rotation={[-Math.PI / 2, 0, -60]} ref={group}>
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

export default CharacterRunning1
