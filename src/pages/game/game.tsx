import { useEffect } from "react";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";
import { useGame } from "../../contexts/GameContext";

export function Game() {
  const { difficulty, playerName, puzzleImage } = useGame();

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