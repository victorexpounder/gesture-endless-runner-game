'use client'
import Character1 from "@/components/Character1";
import Character2 from "@/components/Character2";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Button, Modal } from "antd";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const isMobile = useMediaQuery({maxWidth: 768})
  const [gestureContolled, setGestureControlled] = useState()
  const [selected, setSelected] = useState(1)
  const [open, setOpen] = useState(true);

  const handleOk = () => {
      setGestureControlled(false)
      setOpen(false);
  };
  const handleCancel = () => {
    setGestureControlled(true)
    setOpen(false);
  };

  useEffect(() => {
    
    if(gestureContolled)
    {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => console.error("Error accessing camera:", err));
      } else {
        console.error("getUserMedia not supported in this browser");
      }
    }
  }, [gestureContolled]);
  
  return (
    <div className="flex flex-col relative items-center min-h-screen p-7 pb-20 gap-12 sm:p-20">
      {gestureContolled &&
        <div className="lg:absolute md:top-0 lg:left-0 max-lg:sticky max-lg:top-0 max-lg:z-50">
          <video ref={videoRef} autoPlay className="border lg:rounded-lg shadow-lg lg:w-60 lg:h-40" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      }
      <div className="min-h-screen w-full flex flex-col items-center gap-20">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold text-center">CHOOSE YOUR AVATAR</h1>
          <div>
            {gestureContolled?
              <>
                <p className="text-center">Use 👍🏻 to proceed</p>
                <p className="text-center">Use ✌🏻 to change avatar</p>
              </>
              :
              <>
                <p className="text-center">Click On The Avatar to Change</p>
                <p className="text-center">Click On Proceed Below</p>
              </>
            }
          </div>
        </div>
        <div className="flex flex-col max-lg:flex-col gap-4 items-center w-full h-[700px] lg:h-[500px]">
            <div 
            className={`w-full border  h-[70%] border-blue-500 shadow-2xl shadow-black`}
            onClick={() => setSelected(selected < 2? selected + 1 : 1)}
            >
                <Canvas>
                  <ambientLight intensity={7}/>
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
                  <directionalLight position={[10, 10, 10]} intensity={1}/>
                  <OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2}/>
                  <Suspense fallback={<>Loading...</>}>
                    <Character1 position-y={-3} scale={selected === 1 ? 3 : 0} />
                    <Character2 position-y={-3} scale={selected === 2 ? 3 : 0} />
                  </Suspense>
                </Canvas>
            </div>

            {!gestureContolled &&
              <Button type="primary" size="large" >Proceed</Button>
            }

            <Modal
            open={open}
            title="Choose Control"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleOk}>
                Device Controls
              </Button>,
              <Button key="submit" type="primary" onClick={handleCancel}>
              Gesture Controls
            </Button>,
            ]}
          >
            <p>Do you want to use hand gesture controls or device controls</p>
          </Modal>
            
        </div>
      </div>
    </div>
  );
}
