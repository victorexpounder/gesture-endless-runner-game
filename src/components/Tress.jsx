import { useFrame } from "@react-three/fiber";
import React, { useState, useRef } from "react";
import Barrier1 from "./Barrirer1";
import Hurlde1 from "./Hurdle1";
import * as THREE from "three";


const Trees = ({characterRef, isGameOver, setIsGameOver}) => {
  const [trees, setTrees] = useState([]);
  const elapsedTime = useRef(0); // Track time for tree spawning
  const totalElapsedTime = useRef(0); 
  const treeRef = useRef();

  const addTree = () => {
    const randomX = [0, 1, -1][Math.floor(Math.random() * 3)];
    const newTree = {
      id: Math.random(),
      position: { x: randomX, y: 1.7, z: -5.8 }, // Store as an object
    };

    setTrees((prevTrees) => [...prevTrees, newTree]);
  };

  useFrame((state, delta) => {
    if (isGameOver) return;
    totalElapsedTime.current += delta;
    if(totalElapsedTime.current > 10) {
      elapsedTime.current += delta;
  
      // Spawn tree every 0.5 seconds
      if (elapsedTime.current > 5.5) {
        addTree();
        elapsedTime.current = 0; // Reset timer
      }

    }

    // Move trees forward on the z-axis
    setTrees((prevTrees) =>
      prevTrees
        .map((tree) => ({
          ...tree,
          position: { ...tree.position, z: tree.position.z + 0.1 },
        }))
        .filter((tree) => tree.position.z <= 6) // Remove trees that go out of bounds
    );

    // **Collision detection**
    trees.forEach((tree) => {
      if (characterRef.current) {
        const boxBoundingBox = new THREE.Box3().setFromObject(treeRef.current);
        const characterBoundingBox = new THREE.Box3().setFromObject(characterRef.current);
        const playerY = characterRef.current.position.y;
        const isSliding = playerY < 1.8;
        const isJumping = playerY > 2.0;
  
        if (!isSliding && !isJumping && boxBoundingBox.intersectsBox(characterBoundingBox)) {
          console.log("Collision detected! Game Over");
          setIsGameOver(true); // Stop game updates
        }
      }
    })
  });

  return (
    <>
      {trees.map((tree) => (
        <Hurlde1
          key={tree.id}
          position={[tree.position.x, tree.position.y, tree.position.z]}
          ref={treeRef}
        />
      ))}
    </>
  );
};

export default Trees;
