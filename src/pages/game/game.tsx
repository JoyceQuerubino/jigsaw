import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";

export function Game() {
  const location = useLocation();
  const { difficulty, playerName, puzzleImage } = location.state;

  useEffect(() => {
    console.log("Dados recebidos na tela de jogo:", {
      dificuldade: difficulty,
      nomeDoJogador: playerName,
      imagemDoPuzzle: puzzleImage
    });
  }, [difficulty, playerName, puzzleImage]);

  return (
    <div>
      <div className="board-container">
        <PuzzleGame difficulty={difficulty} />
      </div>
    </div>
  );
}