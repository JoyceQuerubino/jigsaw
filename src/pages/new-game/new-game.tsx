import "./new-game.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Modal } from "../../components/Modal/Modal";
import { ModalContent } from "../../components/ModalContent/ModalContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactQueryConsts } from "../../hooks/reactQueryConstantes";
import { addGame, editGameById, deleteGameById, getGameById } from "../../services/storage-services";
import { GameType } from "../../services/types";
import type { GameLayoutOutletContext } from "../_layouts/game-layout/game-layout";

export function NewGame() {
  const location = useLocation();
  const { setTitleOverride } = useOutletContext<GameLayoutOutletContext>();
  const [theme, setTheme] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const gameAsyncData = getGameById(editingGameId!);

  useEffect(() => {
    if (location.state?.gameData) {
      const gameData = location.state.gameData as GameType;
      setTheme(gameData.title);
      setSelectedImage(gameData.image);
      setEditingGameId(gameData.id);
      setTitleOverride("Editar Jogo");
    } else {
      setTitleOverride("Novo Jogo");
    }
    return () => setTitleOverride(null);
  }, [location.state, setTitleOverride]);

  const { mutateAsync: saveGameFn } = useMutation({
    mutationFn: async (gameData: GameType) => {
      if (editingGameId) {
        editGameById({ 
          id: editingGameId, 
          updatedGameData: {
            title: gameData.title,
            image: gameData.image,
            type: gameData.type,
            isDefault: gameData.isDefault,
          }
        });
        return { ...gameData, id: editingGameId };
      } else {
        addGame(gameData);
        return gameData;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [reactQueryConsts.LIST_GAMES] });
      navigate("/my-games");
    },
  });

  const { mutateAsync: deleteGameFn } = useMutation({
    mutationFn: async (id: string) => {
      deleteGameById(id);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [reactQueryConsts.LIST_GAMES] });
      navigate("/my-games");
    },
  });

  async function handleDelete(){
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este jogo?");
    if (confirmDelete && editingGameId) {
      await deleteGameFn(editingGameId);
    }
  }

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

  function handlePlayGame() {
    if (!theme || !selectedImage) {
      alert("Selecione a imagem e digite o tema para jogar.");
      return;
    }

    const encodedImage = encodeURIComponent(selectedImage);
    const encodedTitle = encodeURIComponent(theme);
    navigate(`/config/${encodedImage}/${encodedTitle}`);
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

      <div className="new-game-second-wrapper">
        <div className="new-game-second-container" style={{ justifyContent: 'space-between' }}>
          <div>
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

            <div style={{ display: 'flex', gap: '1rem', marginTop: 48, justifyContent: "center" }}>
              <Button
                text={editingGameId ? "Salvar Alterações" : "Salvar"}
                onClick={handleNavigateTo}
                imageWidth="268px"
                imageHeight="68px"
              />
              {editingGameId && !gameAsyncData?.isDefault && (
                <Button
                  text="Excluir"
                  onClick={()=> handleDelete()}
                  imageWidth="164px"
                  imageHeight="68px"
                  variant="red"
                />
              )}
            </div>
          </div>

          {editingGameId && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
              <Button
                text="Jogar"
                onClick={handlePlayGame}
                imageWidth="268px"
                imageHeight="68px"
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Selecionar Imagem"
        >
          <ModalContent
            onImageSelect={setSelectedImage}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
