import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';

import sound from "../../assets/images/btn-sound.png";

export const SoundButton: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="sound-button"
    >
      <img
        src={sound}
        alt="Som"
      />
    </motion.button>
  );
}; 