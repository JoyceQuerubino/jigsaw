import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';
import { useSoundContext } from '../../contexts/SoundContext';

import sound from "../../assets/images/btn-sound.png";

export const SoundButton: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSoundContext();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="sound-button"
      onClick={toggleSound}
      style={{ 
        opacity: isSoundEnabled ? 1 : 0.5,
        filter: isSoundEnabled ? 'none' : 'grayscale(100%)'
      }}
    >
      <img
        src={sound}
        alt={isSoundEnabled ? "Som ligado" : "Som desligado"}
      />
    </motion.button>
  );
}; 