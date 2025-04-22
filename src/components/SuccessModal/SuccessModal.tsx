import * as Dialog from '@radix-ui/react-dialog';
import "./SuccessModal.css";
import { Button } from "../Button/Button";
import { useNavigate } from 'react-router';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: PauseModalProps) {
  const navigate = useNavigate();

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
            <Button
              text="Resultados"
              onClick={handleButtonClick}
              imageWidth="280px"
              imageHeight="70px"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 