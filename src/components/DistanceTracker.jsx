import { anonkey, supabaseUrl } from '@/lib/supabase'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { createClient } from '@supabase/supabase-js'
import React, { useEffect, useRef, useState } from 'react'

const DistanceTracker = ({isGameOver, isMobile, setScoreSent}) => {
    const [distance, setDistance] = useState(0)
    const distanceRef = useRef(0)
    const player = JSON.parse(localStorage.getItem("player"));
    const supabase = createClient(supabaseUrl, anonkey);

    useFrame((state, delta) => {
        if(!isGameOver){
            setDistance((prev) => prev + 0.01)
            distanceRef.current += 0.01
        }
    })
    
    const sendScore = async () => { 
       if(distanceRef.current.toFixed(1) > player.score){
           const { data, error } = await supabase
               .from('players')
               .update({ score: distanceRef.current.toFixed(1)})
               .eq('id', player.id)
               .select()
           if(error){
               console.log(error)
           }
           setScoreSent(true)
           setTimeout(() => {
            localStorage.setItem("player", JSON.stringify(data[0]));
            }, 0);
       }else{
            setScoreSent(true)
       }
    }

    useEffect(() => {
        console.log('game over:', isGameOver)
        if(isGameOver){
            sendScore()
        }
    },[isGameOver])

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
