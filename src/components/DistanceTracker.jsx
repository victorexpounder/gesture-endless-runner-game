import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'

const DistanceTracker = ({isGameOver, isMobile}) => {
    const [distance, setDistance] = useState(0)
    const distanceRef = useRef(0)

    useFrame((state, delta) => {
        if(!isGameOver){
            setDistance((prev) => prev + 0.01)
            distanceRef.current += 0.01
        }
    })
  return (
    <Html position={[isMobile? 1.5 : 5, isMobile? 4 : 3.5, 0]}>
        <div
        style={{
            zIndex: 1,
            color: "white",
            fontSize: "18px",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
        }}
        >
            Distance: {distanceRef.current.toFixed(1)}m
        </div>
    </Html>
  )
}

export default DistanceTracker
