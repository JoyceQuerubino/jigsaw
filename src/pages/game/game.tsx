import { useEffect, useState } from "react";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";
import { useGame } from "../../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { PauseModal } from "../../components/PauseModal/PauseModal";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";

export function Game() {
  const { difficulty, puzzleImage } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);

  const navigate = useNavigate();
  const { isPaused, setIsPaused } = useGame();

  useEffect(() => {
    if (isPaused && !isModalSucessOpen) {
      setIsModalOpen(true);
    }
  }, [isPaused]);

  function handleOnCloseStartTime(){
    setIsModalOpen(false)
    setIsPaused(false);
  }

  function handleOnCloseAndNavigate(){
    setIsModalSucessOpen(false)
    navigate("/");
  }

  useEffect(() => {
    if (!puzzleImage) {
      navigate("/model");
    }
  }, [puzzleImage, navigate]);

  return (
    <div className="board-container">
      <PuzzleGame difficulty={difficulty} setIsModalSucessOpen={setIsModalSucessOpen} />

      {!isModalSucessOpen && (
        <PauseModal
          isOpen={isModalOpen}
          onClose={handleOnCloseStartTime}
          setIsPaused={setIsPaused}
        />
      )}

      <SuccessModal
        isOpen={isModalSucessOpen}
        onClose={handleOnCloseAndNavigate}
      />
    </div>
  );
}
