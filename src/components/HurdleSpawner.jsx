import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Hurlde1 from '@/components/Hurdle1';

const HurdleSpawner = ({ speed = 0.5 }) => {
  const [hurdles, setHurdles] = useState([]);

  // Function to spawn hurdles randomly in front of the player
  const spawnHurdle = () => {
    const newHurdle = {
      id: Math.random(),
      position: [
        (Math.random() - 0.5) * 10, // Random X between -5 and 5
        -10, // Fixed Y
        -50 // Start far ahead
      ]
    };
    setHurdles((prev) => [...prev, newHurdle]);
  };

  // Spawn hurdles every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(spawnHurdle, 1500);
    return () => clearInterval(interval);
  }, []);

  // Move hurdles forward and remove old ones
  useFrame(() => {
    setHurdles((prev) =>
      prev
        .map((hurdle) => ({
          ...hurdle,
          position: [hurdle.position[0], hurdle.position[1], hurdle.position[2] + speed],
        }))
        .filter((hurdle) => hurdle.position[2] < 5) // Remove hurdles past the character
    );
  });

  return (
    <>
      {hurdles.map((hurdle) => (
        <Hurlde1 key={hurdle.id} position={hurdle.position} scale={5.4} />
      ))}
    </>
  );
};

export default HurdleSpawner;
