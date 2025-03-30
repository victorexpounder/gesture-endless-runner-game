'use client'
import Character1 from "@/components/Character1";
import Character2 from "@/components/Character2";
import Character3 from "@/components/Character3";
import Loading from "@/components/Loading";
import { anonkey, supabaseUrl } from "@/lib/supabase";
import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createClient } from "@supabase/supabase-js";
import { AutoComplete, Button, Form, Input, Modal, Select } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { io } from "socket.io-client";


export default function Home() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const isMobile = useMediaQuery({maxWidth: 768})
  const [gestureContolled, setGestureControlled] = useState()
  const [gesture, setGesture] = useState("None");
  const [selectedCharacter, setSelectedCharacter] = useState("character1");
  const [selectedRef, setSelectedRef] = useState(1)
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);
  const router = useRouter()
  const SERVER_URL = "http://localhost:5000"
  const socketRef = useRef(null);
  const {Option} = Select;
  const [form] = Form.useForm();
  const link = `/game/${gestureContolled? 'gesture' : 'default'}/${selectedCharacter}`;
  const supabase = createClient(supabaseUrl, anonkey);
  const [player, setPlayer] = useState(null);
  const audioRef = useRef(null);


  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const handleOk = () => {
      setGestureControlled(false)
      setOpen(false);
  };
  const handleCancel = () => {
    setGestureControlled(true)
    setOpen(false);
  };

  useEffect(() => {
    setPlayer(JSON.parse(localStorage.getItem("player")));
  }, []);

  useEffect(()=>{
    if(gestureContolled)
    {
      // Initialize WebSocket connection
      socketRef.current = io(SERVER_URL);
      // Receive gesture from server
      socketRef.current.on("gesture", (data) => {
        if(gesture !== data.gesture)
        {
          setGesture(data.gesture);
          console.log(data.gesture)
        }
      });
    }
  }, [])

  useEffect(()=>{
    if(selectedRef === 1)
    {
      setSelectedCharacter("character1")
    }else if(selectedRef === 2) {
      setSelectedCharacter("character2")
    }else if(selectedRef === 3) {
      setSelectedCharacter("character3")
    }
  }, [selectedRef])
  
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

  // Function to send frames to Flask server
  const sendFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png"); // Convert to base64
    socketRef.current.emit("image", dataUrl);
    
  };

  const fetchCountries = async () => {
    const res = await axios.get(process.env.NEXT_PUBLIC_COUNTRIES_API);
    setCountries(res.data)
    localStorage.setItem("countries", JSON.stringify(res.data))
  };

  const handleOpenInfo = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if(player)
    {
      router.push(link)
    }else{
      setOpenInfo(true)
    }
  }

  const onFinish = async({name, country}) => {
    try {
      const res = await supabase.from("players").insert([{ name, country }]).select();
      console.log("player saved:", res.data[0])
      localStorage.setItem("player", JSON.stringify(res.data[0]))
      setOpenInfo(false)
      router.push(link)
    } catch (error) {
      console.error("Error:", error);
      setOpenInfo(false)
    }
  };

  useEffect(() => {
    if(gestureContolled)
    {
      const interval = setInterval(sendFrame, 1000); // Send frames every 100ms
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(()=>{
    if(gesture === "peace")
    {
      setSelectedRef(selectedRef < 3? selectedRef + 1 : 1) 
    }
  }, [gesture])


  useEffect(()=>{
    fetchCountries()
  }, [])

  
  return (
    <div className="flex flex-col relative items-center min-h-screen p-7 pb-20 gap-12 sm:p-20">
      <audio ref={audioRef} src="/sounds/swish.mp3" preload="auto"></audio>
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
            onClick={() => setSelectedRef(selectedRef < 3? selectedRef + 1 : 1)}
            >
                <Canvas>
                  <ambientLight intensity={7}/>
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
                  <directionalLight position={[10, 10, 10]} intensity={1}/>
                  <OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2}/>
                  <Suspense fallback={<Loading />}>
                    <Character1 position-y={-3} scale={selectedRef === 1 ? 3 : 0} />
                    <Character2 position-y={-3} scale={selectedRef === 2 ? 3 : 0} />
                    <Character3 position-y={-3} scale={selectedRef === 3 ? 3 : 0} />
                  </Suspense>
                </Canvas>
            </div>

            {!gestureContolled &&
              <Button type="primary" size="large" onClick={handleOpenInfo} >Proceed</Button>
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

          <Modal
            open={openInfo}
            title="Register Player"
            footer={[null]}
          >
            <Form 
              {...layout}
              form={form}
              name="register"
              style={{
                maxWidth: 600,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="FullName"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
              <Input placeholder="Enter Player Name" type="text"/>
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <AutoComplete
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {countries?.map((country, index) => (
                    <Option key={index} value={country.name.common}>
                      <div className="flex items-center gap-2">
                        <Image src={country.flags.png} alt={country.name.common} width={24} height={24} />
                        <span>{country.name.common}</span>
                      </div>
                    </Option>
                  ))}
                </AutoComplete>
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>

            </Form>
          </Modal>
            
        </div>
      </div>
    </div>
  );
}
