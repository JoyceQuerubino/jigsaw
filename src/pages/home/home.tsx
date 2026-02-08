import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSound from 'use-sound';
import ButtonImage from "../../components/ButtonImage";
import { RaccoonHome } from "../../components/animations/RaccoonHome";
import ambienteSound from "../../assets/sounds/ambiente.wav";
import { SoundButton } from "../../components/SoundButton/SoundButton";
import { useSoundContext } from "../../contexts/SoundContext";
import logoAutilearn from "../../assets/images/logo-autilearn.png";

export function Home() {
  const navigate = useNavigate();
  const { isSoundEnabled } = useSoundContext();
  const [playAmbiente, { stop }] = useSound(ambienteSound, {
    loop: true,
    volume: 0.45
  });

  useEffect(() => {
    if (isSoundEnabled) {
      playAmbiente();
    } else {
      stop();
    }
    
    return () => {
      stop();
    };
  }, [playAmbiente, stop, isSoundEnabled]);

  function handleNavigateTo(screen: string) {
    navigate(screen);
  }

  const getButtonStyles = () => {
    if (window.innerWidth >= 1400) {
      return { width: '350px', height: '95px', fontSize: '28px' };
    }
    if (window.innerWidth >= 1200) {
      return { width: '320px', height: '85px', fontSize: '26px' };
    }
    return {};
  };

  return (
    <div className="box-container">
      <div className="sound-button-wrapper">
        <SoundButton />
      </div>
      <div className="logo-container">
        <img src={logoAutilearn} alt="AutiLearn Logo" className="logo-autilearn" />
      </div>
      <div className="menu-container">
        <div className="buttons-list">
          <ButtonImage
            text="Jogar"
            onClick={() => handleNavigateTo("/model")}
            style={getButtonStyles()}
          />
          <ButtonImage
            text="Meus Jogos"
            onClick={() => handleNavigateTo("/my-games")}
            style={getButtonStyles()}
          />
          <ButtonImage
            text="Resultados"
            onClick={() => handleNavigateTo("/results")}
            style={getButtonStyles()}
          />
          <ButtonImage
            text="Tutoriais"
            onClick={() => handleNavigateTo("/tutoriais")}
            style={getButtonStyles()}
          />
          <ButtonImage
            text="Créditos"
            onClick={() => handleNavigateTo("/credits")}
            style={getButtonStyles()}
          />
        </div>
      </div>

      <div className="home-guaxi-container">
      <RaccoonHome initialState={1}/>
      </div>
    </div>
  );
}
