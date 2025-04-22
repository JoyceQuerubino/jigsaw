import * as Dialog from '@radix-ui/react-dialog';
import "./PauseModal.css";
import { Button } from "../Button/Button";
import { useNavigate } from 'react-router';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsPaused: (value: boolean) => void;
}

export function PauseModal({ isOpen, onClose, setIsPaused }: PauseModalProps) {
  const navigate = useNavigate();
  const handleButton1Click = () => {
    onClose();
    setIsPaused(false);
  };

  const handleButton2Click = () => {
    console.log("Botão 2 clicado");
  };

  const handleButton3Click = () => {
    navigate("/");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="pause-modal-overlay" />
        <Dialog.Content className="pause-modal-content">
          <Dialog.Close className="pause-modal-close-button" aria-label="Fechar" />
          <div className="pause-modal-buttons">
            <Button
              text="Continuar"
              onClick={handleButton1Click}
              imageWidth="280px"
              imageHeight="70px"
            />
            <Button
              text="Reiniciar"
              onClick={handleButton2Click}
              imageWidth="280px"
              imageHeight="70px"
            />
            <Button
              text="Menu"
              onClick={handleButton3Click}
              imageWidth="280px"
              imageHeight="70px"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 