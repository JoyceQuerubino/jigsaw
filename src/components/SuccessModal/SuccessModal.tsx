import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import Lottie from "lottie-react";
import useSound from 'use-sound';
import "./SuccessModal.css";
import { Button } from "../Button/Button";
import animationImage from "../../assets/trofeu-animation.json";
import levelCompleteSound from "../../assets/sounds/level-complete.wav";

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: PauseModalProps) {
  const navigate = useNavigate();
  const [playLevelComplete] = useSound(levelCompleteSound);

  useEffect(() => {
    if (isOpen) {
      playLevelComplete();
    }
  }, [isOpen, playLevelComplete]);

  const handleButtonClick = () => {
    navigate("/results");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="sucess-modal-overlay" />
        <Dialog.Content className="sucess-modal-content">
          <Dialog.Close className="sucess-modal-close-button" aria-label="Fechar" />
          <div className="sucess-modal-buttons">
          <div className="animation-lottie">
            <Lottie animationData={animationImage} loop={false} />
          </div>
          <div className="sucess-buttom-container">
            <Button
              text="Resultados"
              onClick={handleButtonClick}
              imageWidth="280px"
              imageHeight="70px"
            />
             </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 