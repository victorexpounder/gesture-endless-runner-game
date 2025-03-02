'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  },[])
  return (
    <div className="flex flex-col relative items-center min-h-screen p-7 pb-20 gap-12 sm:p-20">
      <div className="lg:absolute md:top-0 lg:left-0 max-md:sticky max-md:top-0 max-md:z-50">
        <video ref={videoRef} autoPlay className="border lg:rounded-lg shadow-lg lg:w-60 lg:h-40" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="min-h-screen w-full flex flex-col items-center gap-24">
        <div>
          <h1 className="text-3xl font-bold text-center" >CHOOSE YOUR AVATAR</h1>
          <p className="text-center">Use 👍🏻 to select</p>
          <p className="text-center">Use ✌🏻 to move left</p>
        </div>
        <div>
            hhhdhifkfkffkkffjffgg
        </div>
      </div>
    </div>
  );
}
