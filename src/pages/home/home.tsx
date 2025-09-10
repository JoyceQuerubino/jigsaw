import "./styles.css";
import { useNavigate } from "react-router-dom";
import ButtonImage from "../../components/ButtonImage";
import { RaccoonHome } from "../../components/animations/RaccoonHome";

export function Home() {
  const navigate = useNavigate();

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
