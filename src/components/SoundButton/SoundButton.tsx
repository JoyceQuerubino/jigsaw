import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';

export const SoundButton: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="sound-button"
    >
      <img
        src="/src/assets/images/btn-sound.png"
        alt="Som"
      />
    </motion.button>
  );
}; 