import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Board from "../../components/Board";
import "./game.css";

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
    const script = document.createElement("script");
    script.src = "/src/components/jigsaw-puzzle/script.js";
    script.async = true;
    document.body.appendChild(script);
  
    script.onload = () => {
      console.log("Script.js carregado!", window.loadInitialFile);
    };
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  const iniciarJogo = () => {
    if (window.menu && window.menu.items[4]) {
      window.menu.items[4].element.click(); // Simula um clique no botão "12 peças"
    } else {
      console.error("Menu não foi carregado corretamente.");
    }
  };

  return (
    <div style={{backgroundColor: 'red'}}>
      <h1>Tela de Jogo</h1>
      <button 
        onClick={iniciarJogo}
        className="btn-iniciar-jogo"
      >
        Iniciar Jogo
      </button>
      <div className="board-container">
        <Board />
      </div>
    </div>
  );
}