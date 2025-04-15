import React from 'react';
import { motion } from 'framer-motion';

interface TimerControlButtonProps {
  isPaused: boolean;
  onClick: () => void;
}

export const TimerControlButton: React.FC<TimerControlButtonProps> = ({ isPaused, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        minWidth: '5rem',
        minHeight: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={isPaused ? '/src/assets/images/btn-start-timer.png' : '/src/assets/images/btn-pause.png'}
        alt={isPaused ? 'Iniciar' : 'Pausar'}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </motion.button>
  );
}; 