import "./styles.css";
import boxMenuImage from "../../assets/images/menu/box-menu.png";
import btnJogar from "../../assets/images/menu/btn-jogar.png";
import btnMeusJogos from "../../assets/images/menu/btn-meus-jogos.png";
import btnResultados from "../../assets/images/menu/btn-resultados.png";
import btnTutorial from "../../assets/images/menu/btn-tutorial.png";
import btnCreditos from "../../assets/images/menu/btn-creditos.png";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  function handleNavigateTo(screen: string) {
    navigate(screen);
  }

  return (
    <div className="box-container">
      <div className="menu-container">
        <img src={boxMenuImage} alt="Menu Box" className="menu-image" />
        <div className="buttons-list">
          <button className="menu-button" onClick={() => handleNavigateTo('/model')}>
            <img src={btnJogar} alt="Jogar" />
          </button>
          <button className="menu-button" onClick={() => handleNavigateTo('/my-games')}>
            <img src={btnMeusJogos} alt="Meus Jogos" />
          </button>
          <button className="menu-button">
            <img src={btnResultados} alt="Resultados" />
          </button>
          <button className="menu-button">
            <img src={btnTutorial} alt="Tutorial" onClick={() => handleNavigateTo('/tutoriais')}/> 
          </button>
          <button className="menu-button">
            <img src={btnCreditos} alt="Créditos" onClick={() => handleNavigateTo('/credits')}/>
          </button>
        </div>
      </div>
    </div>
  );
}
