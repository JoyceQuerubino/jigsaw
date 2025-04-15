import "./results.css";
import { useState } from "react";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";

export function Results() {
  const [steps, setSteps] = useState(0);

  return (
    <div className="results-container">
      <div className="results-content">
        <button 
          className="nav-button prev" 
          onClick={() => setSteps(prev => Math.max(0, prev - 1))}
          disabled={steps === 0}
        >
          <img src={btnBack} alt="Voltar" />
        </button>

        <div className="results-background">
          <div className="results-content-wrapper">
            
            <div className="results-row">
              <h3>Jogador</h3>
              <h3>Jogo</h3>
              <h3>Tempo</h3>
            </div>


          </div>
        </div>

        <button 
          className="nav-button next" 
          // onClick={() => setSteps(prev => Math.min(tutorialData.length - 1, prev + 1))}
          // disabled={steps === tutorialData.length - 1}
        >
          <img src={btnGo} alt="Avançar" />
        </button>
      </div>
    </div>
  );
}
