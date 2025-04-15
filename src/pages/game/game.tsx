import { useEffect } from "react";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";
import { useGame } from "../../contexts/GameContext";
import { useNavigate } from "react-router-dom";

export function Game() {
  const { difficulty, puzzleImage } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!puzzleImage) {
      navigate('/model');
    }
  }, [puzzleImage, navigate]);

  return (
    <div>
      <div className="board-container">
        <PuzzleGame difficulty={difficulty} />
      </div>
    </div>
  );
}