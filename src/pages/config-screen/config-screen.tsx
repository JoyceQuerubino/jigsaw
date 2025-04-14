import { useNavigate, useParams } from "react-router-dom";
import btnJogar from "../../assets/images/menu/btn-jogar.png";
import "./config-screen.css";
import { useState } from "react";
import { Input } from "../../components/Input/Input";

const qtd = [12, 25, 50, 100, 200];

export function ConfigScreen() {
  const { puzzleImage } = useParams();
  const navigate = useNavigate();
  const [selectedPieces, setSelectedPieces] = useState<number>(12);
  const [playerName, setPlayerName] = useState<string>("");

  function handleNavigateTo(screen: string) {
    if (!playerName.trim()) {
      alert("Por favor, digite o nome do jogador!");
      return;
    }

    const gameData = {
      pieces: selectedPieces,
      playerName: playerName,
      puzzleImage: puzzleImage
    };

    navigate(screen, { state: gameData });
  }

  return (
    <div className="config-screen-container">
      <div className="first-container">
        <div className="container-image">
          <img src={decodeURIComponent(puzzleImage || "")} alt="Puzzle" />
        </div>
      </div>

      <div className="container-texts">
        <div>
          <p>Nº de peças:</p>
          <div className="pieces-options">
            {qtd.map((number) => (
              <button 
                key={number} 
                className={`piece-option ${selectedPieces === number ? 'selected' : ''}`}
                onClick={() => setSelectedPieces(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        <p>Montado:</p>
        <div className="container-player">
          <Input
            label="Jogador:"
            placeholder="Digite o nome do aluno"
            value={playerName}
            onChange={setPlayerName}
          />
        </div>

        <button
          className="start-button"
          onClick={() => handleNavigateTo("/game")}
        >
          <img src={btnJogar} alt="Jogar" />
        </button>
      </div>
    </div>
  );
}
