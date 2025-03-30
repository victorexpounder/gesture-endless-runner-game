import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const splatSound = new Audio('/sounds/splat.mp3');
const splatFemaleSound = new Audio('/sounds/splatfemale.mp3');
splatSound.load();
splatFemaleSound.load();

const BoxObstacles = ({ characterRef, character, isGameOver, setIsGameOver }) => {
  const [boxes, setBoxes] = useState([]);
  const boxesRef = useRef([]);
  let elapsedTime = 0; // Track time for spawning
  let [spawnFrequency, setSpawnFrequency] = useState(1.5)
  let [spawnObstacles, setSpawnObstacles] = useState(false)
  
  const addBox = () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: "red" });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    const randomX = [0, 1, -1][Math.floor(Math.random() * 3)];
    box.position.set(randomX, 1.8, -5.8);

    // Update state & ref
    setBoxes((prevBoxes) => [...prevBoxes, box]);
    boxesRef.current.push(box);
  };

  useFrame((state, delta) => {
    if (isGameOver) return; // Stop if game is over
    if (!spawnObstacles) return

    elapsedTime += delta; // Accumulate time
    
    // Spawn box every 0.5 seconds
    if (elapsedTime > spawnFrequency) {
      addBox();
      if(spawnFrequency > 0.5)
      {
        setSpawnFrequency((prev) => prev - 0.05)
        console.log(spawnFrequency)
      }
      elapsedTime = 0; // Reset timer
    }

    // Move boxes forward & check for collision
    boxesRef.current.forEach((box, index) => {
      box.position.z += 0.2;

      if (box.position.z > 6) {
        boxesRef.current.splice(index, 1); // Remove from ref
        setBoxes((prev) => prev.filter((_, i) => i !== index)); // Remove from state
      }

      // **Collision detection**
      if (characterRef.current) {
        const boxBoundingBox = new THREE.Box3().setFromObject(box);
        const characterBoundingBox = new THREE.Box3().setFromObject(characterRef.current);
        const playerY = characterRef.current.position.y;

        if (boxBoundingBox.intersectsBox(characterBoundingBox) && playerY < 2.0) {
          console.log("Collision detected! Game Over");
          if(character === 'character1' || character === 'character2')
          {
            splatSound.play();
          }else{
            splatFemaleSound.play();
          }
          setIsGameOver(true); // Stop game updates
         
        }
      }
    });
  });

  useEffect(()=>{
    setTimeout(()=>{
      setSpawnObstacles(true)
    }, 1000)
  }, [])

  return (
    <>
      {boxes.map((box, index) => (
        <primitive object={box} key={index} />
      ))}
    </>
  );
};

export default BoxObstacles;
