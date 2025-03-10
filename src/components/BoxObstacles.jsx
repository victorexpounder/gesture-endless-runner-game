import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

const BoxObstacles = ({ characterRef, onGameOver }) => {
  const [boxes, setBoxes] = useState([]);
  const boxesRef = useRef([]);
  let elapsedTime = 0; // Track time for spawning
  const isGameOver = useRef(false); // Track if the game is over

  const addBox = () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: "#B4B4B3" });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    const randomX = [0, 1, -1][Math.floor(Math.random() * 3)];
    box.position.set(randomX, 1.8, -5.8);

    // Update state & ref
    setBoxes((prevBoxes) => [...prevBoxes, box]);
    boxesRef.current.push(box);
  };

  useFrame((state, delta) => {
    if (isGameOver.current) return; // Stop if game is over

    elapsedTime += delta; // Accumulate time

    // Spawn box every 0.5 seconds
    if (elapsedTime > 0.5) {
      addBox();
      elapsedTime = 0; // Reset timer
    }

    // Move boxes forward & check for collision
    boxesRef.current.forEach((box, index) => {
      box.position.z += 0.3;

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
          isGameOver.current = true; // Stop game updates
          onGameOver(); // Call game over function
        }
      }
    });
  });

  return (
    <>
      {boxes.map((box, index) => (
        <primitive object={box} key={index} />
      ))}
    </>
  );
};

export default BoxObstacles;
