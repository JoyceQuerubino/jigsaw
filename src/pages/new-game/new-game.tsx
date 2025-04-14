import "./new-game.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router"; 
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Modal } from "../../components/Modal/Modal";
import { ModalContent } from "../../components/ModalContent/ModalContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactQueryConsts } from "../../hooks/reactQueryConstantes";
import { addGame, editGameById } from "../../services/storage-services";
import { GameType } from "../../services/types";

export function NewGame() {
  const location = useLocation();
  const [theme, setTheme] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (location.state?.gameData) {
      const gameData = location.state.gameData as GameType;
      setTheme(gameData.title);
      setSelectedImage(gameData.image);
      setEditingGameId(gameData.id);
    }
  }, [location.state]);

  const { mutateAsync: saveGameFn } = useMutation({
    mutationFn: async (gameData: GameType) => {
      if (editingGameId) {
        editGameById({ 
          id: editingGameId, 
          updatedGameData: {
            title: gameData.title,
            image: gameData.image,
            type: gameData.type
          }
        });
        return { ...gameData, id: editingGameId };
      } else {
        addGame(gameData);
        return gameData;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [reactQueryConsts.LIST_GAMES] });
      navigate("/my-games");
    },
  });

  async function handleNavigateTo() {
    if (!theme || !selectedImage) {
      alert("Selecione a imagem e digite o tema.");
      return;
    }

    await saveGameFn({
      id: editingGameId || uuidv4(),
      title: theme,
      type: "Quebra-cabeça",
      image: selectedImage,
    });
  }

  return (
    <div className="new-game-screen-container">
      <div className="new-game-first-container">
        <div className="new-game-container-image">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagem selecionada"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
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
              text={selectedImage ? "Trocar Imagem" : "Selecionar Imagem"}
              onClick={() => setIsModalOpen(true)}
              imageWidth="268px"
              imageHeight="62px"
            />
          </div>
        </div>

        <div>
          <Button
            text={editingGameId ? "Salvar Alterações" : "Salvar"}
            onClick={handleNavigateTo}
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
