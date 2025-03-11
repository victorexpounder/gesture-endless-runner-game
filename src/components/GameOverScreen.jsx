import { Html } from "@react-three/drei";

const GameOverScreen = ({ handleReset }) => {
  return (
    <Html center>
      <div style={{
        color: 'white',
        fontSize: '24px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h1>Game Over</h1>
        <button 
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            cursor: 'pointer',
            background: 'linear-gradient(to right, #ff00cc, #00ffff)',
          }}
          onClick={handleReset}
        >
          Restart
        </button>
      </div>
    </Html>
  );
};


export default GameOverScreen