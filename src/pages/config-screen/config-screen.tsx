import { useNavigate, useParams } from "react-router-dom";
import btnJogar from "../../assets/images/menu/btn-jogar.png";
import "./config-screen.css";
import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { useGame } from "../../contexts/GameContext";

type Difficulty = 'easy' | 'medium' | 'hard';

const difficulties = [
  { level: 'easy', label: 'Fácil (6 peças)' },
  { level: 'medium', label: 'Médio (12 peças)' },
  { level: 'hard', label: 'Difícil (24 peças)' }
];

export function ConfigScreen() {
  const { puzzleImage, title } = useParams();
  const navigate = useNavigate();
  const { setGameData } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [playerName, setPlayerName] = useState<string>("");

  function handleNavigateTo(screen: string) {
    if (!playerName.trim()) {
      alert("Por favor, digite o nome do jogador!");
      return;
    }

    setGameData({
      difficulty: selectedDifficulty,
      playerName: playerName,
      puzzleImage: puzzleImage ? decodeURIComponent(puzzleImage) : "",
      title: title ? decodeURIComponent(title) : ""
    });

    navigate(screen);
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
          <p>Número de peças:</p>
          <div className="pieces-options">
            {difficulties.map(({ level, label }) => (
              <button 
                key={level} 
                className={`piece-option ${selectedDifficulty === level ? 'selected' : ''}`}
                onClick={() => setSelectedDifficulty(level as Difficulty)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

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
