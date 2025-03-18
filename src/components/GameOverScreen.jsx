import { Html } from "@react-three/drei";
import TableComponent from "./Table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GameOverScreen = ({ handleReset }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  useEffect(()=>{
    setTimeout(()=>{
      setShow(true)
    }, [500])
  })
  return (
    <Html center>
      {show &&
        <div style={{
          zIndex: 100,
          color: 'white',
          fontSize: '24px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <h1>Game Over</h1>
          <div>
            <p className="text-sm">Leader Board</p>
            <TableComponent />
          </div>
          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #ff00cc, #00ffff)',
            }}
            onClick={() => window.location.reload()}
          >
            Restart
          </button>

          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #ff00cc, #00ffff)',
            }}
            onClick={() => router.push('/')}
          >
            Home
          </button>
        </div>
      }
    </Html>
  );
};


export default GameOverScreen