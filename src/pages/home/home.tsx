import "./styles.css";
import btnJogar from "../../assets/images/menu/btn-jogar.png";
import btnMeusJogos from "../../assets/images/menu/btn-meus-jogos.png";
import btnResultados from "../../assets/images/menu/btn-resultados.png";
import btnTutorial from "../../assets/images/menu/btn-tutorial.png";
import btnCreditos from "../../assets/images/menu/btn-creditos.png";
import guaxinin from "../../assets/images/guaxinin-initial.png";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  function handleNavigateTo(screen: string) {
    navigate(screen);
  }

  return (
    <div className="box-container">
      <div className="menu-container">
        <div className="buttons-list">
          <button
            className="menu-button"
            onClick={() => handleNavigateTo("/model")}
          >
            <img src={btnJogar} alt="Jogar" />
          </button>
          <button
            className="menu-button"
            onClick={() => handleNavigateTo("/my-games")}
          >
            <img src={btnMeusJogos} alt="Meus Jogos" />
          </button>
          <button className="menu-button">
            <img
              src={btnResultados}
              alt="Resultados"
              onClick={() => handleNavigateTo("/results")}
            />
          </button>
          <button className="menu-button">
            <img
              src={btnTutorial}
              alt="Tutorial"
              onClick={() => handleNavigateTo("/tutoriais")}
            />
          </button>
          <button className="menu-button">
            <img
              src={btnCreditos}
              alt="Créditos"
              onClick={() => handleNavigateTo("/credits")}
            />
          </button>
        </div>
      </div>

      <div className="home-guaxi-container">
        <img src={guaxinin} alt="Menu Box" />
      </div>
    </div>
  );
}
