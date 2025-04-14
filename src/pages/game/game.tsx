import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./game.css";
import PuzzleGame from "./PuzzleBoard";

export function Game() {
  const location = useLocation();
  const { pieces, playerName, puzzleImage } = location.state;

  useEffect(() => {
    console.log("Dados recebidos na tela de jogo:", {
      quantidadeDePecas: pieces,
      nomeDoJogador: playerName,
      imagemDoPuzzle: puzzleImage
    });
  }, [pieces, playerName, puzzleImage]);

  useEffect(() => {
  
  }, []);
  

  return (
    <div style={{backgroundColor: 'red'}}>
      <div className="board-container">
      <PuzzleGame />
      </div>
    </div>
  );
}