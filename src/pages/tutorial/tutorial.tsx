import "./tutorial.css";
import { useState } from "react";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";
import { tutorialData } from "./tutorial-data";
import { CreditsCard } from "../../components/CreditsCard";

export function Tutorial() {
  const [steps, setSteps] = useState(0);

  return (
    <div className="tutorial-container">
      <div className="tutorial-content">
        <button 
          className="nav-button prev" 
          onClick={() => setSteps(prev => Math.max(0, prev - 1))}
          disabled={steps === 0}
        >
          <img src={btnBack} alt="Voltar" />
        </button>

        <div className="tutorial-credits-card">
          <CreditsCard title="TUTORIAL">
            <div className="tutorial-content-wrapper">
            <h2 className="tutorial-step-title">{tutorialData[steps].title}</h2>
            {tutorialData[steps]?.text && (
              <p className="tutorial-background-texts">{tutorialData[steps].text}</p>
            )}
            {tutorialData[steps]?.image && (
              <div className="tutorial-step-image-wrapper">
                <img
                  src={tutorialData[steps]?.image}
                  alt=""
                  className="tutorial-step-image"
                />
              </div>
            )}
            {tutorialData[steps]?.images && tutorialData[steps].images!.length > 0 && (
              <div className="tutorial-step-images-row">
                {tutorialData[steps].images!.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt=""
                    className="tutorial-step-image"
                  />
                ))}
              </div>
            )}
            {tutorialData[steps].list && (
              <ul className="tutorial-list">
                {tutorialData[steps].list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            </div>
          </CreditsCard>
        </div>

        <button 
          className="nav-button next" 
          onClick={() => setSteps(prev => Math.min(tutorialData.length - 1, prev + 1))}
          disabled={steps === tutorialData.length - 1}
        >
          <img src={btnGo} alt="Avançar" />
        </button>
      </div>
    </div>
  );
}
