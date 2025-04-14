import "./new-game.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Modal } from "../../components/Modal/Modal";
import { ModalContent } from "../../components/ModalContent/ModalContent";

export function NewGame() {
  const [theme, setTheme] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleNavigateTo(screen: string) {
    if(!theme || !selectedImage){
      alert("Selecione a imagem e digite o tema.");
      return;
    }

    

    //salvar e att o estado
    navigate(screen);
  }

  return (
    <div className="new-game-screen-container">
      <div className="new-game-first-container">
        <div className="new-game-container-image">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Imagem selecionada" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
        </div>
      </div>

      <div className="new-game-second-container">
        <div className="new-game-second-top">
          <Input
            label="Tema:"
            placeholder="Digite o tema"
            value={theme}
            onChange={setTheme}
          />

          <div>
            <Button
              text={selectedImage ? "Trocar Imagem": "Selecionar Imagem"}
              onClick={() => setIsModalOpen(true)}
              imageWidth="268px"
              imageHeight="62px"
            />
          </div>
        </div>

        <div>
          <Button
            text="Salvar"
            onClick={() => handleNavigateTo("/my-games")}
            imageWidth="268px"
            imageHeight="68px"
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Selecionar Imagem"
      >
        <ModalContent 
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
