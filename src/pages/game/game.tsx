import { useEffect, useState, useRef } from "react";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";
import { useGame } from "../../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { PauseModal } from "../../components/PauseModal/PauseModal";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";

export function Game() {
  const { difficulty, puzzleImage, setTime, setIsPaused } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);
  const puzzleRef = useRef<{ resetGame: () => void }>(null);

  const navigate = useNavigate();
  const { isPaused } = useGame();

  const handleReset = () => {
    setTime(0);
    setIsPaused(false);
    setIsModalOpen(false);
    if (puzzleRef.current) {
      puzzleRef.current.resetGame();
    }
  };

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
      <PuzzleGame 
        ref={puzzleRef}
        difficulty={difficulty} 
        setIsModalSucessOpen={setIsModalSucessOpen} 
        onReset={handleReset}
      />

      {!isModalSucessOpen && (
        <PauseModal
          isOpen={isModalOpen}
          onClose={handleOnCloseStartTime}
          setIsPaused={setIsPaused}
          onReset={handleReset}
        />
      )}

      <SuccessModal
        isOpen={isModalSucessOpen}
        onClose={handleOnCloseAndNavigate}
      />
    </div>
  );
}
