import "./credits.css";
import unifespLogo from "../../assets/images/unifesp.png";
import { CreditsCard } from "../../components/CreditsCard";

export function Credits() {
  return (
    <div className="credits-container">
      <CreditsCard>
          <div className="credits-col">
            <div className="credits-col-row">
              <h3>Orientador</h3>
              <p>Dr. Carlos Marcelo Gurjão de Godoy</p>
            </div>
            <div className="credits-col-row">
              <h3>Coorientadoras</h3>
              <p>Dra. Regina Célia Coelho</p>
              <p>Dra. Vanessa Andrade Pereira</p>
            </div>

            <img src={unifespLogo} alt="UNIFESP Logo" className="unifesp-logo" />
          </div>
          <div className="credits-col">
            <div className="credits-col-row">
              <h3>Mestranda</h3>
              <p>Geisse Rosane de Faria Dias Costa</p>
            </div>
            <div className="credits-col-row">
              <h3>Desenvolvimento</h3>
              <p>Joyce Querubino de Oliveira</p>
            </div>
            <div className="credits-col-row">
              <h3>Personagem</h3>
              <p>Otavio Pozzebon Scalari</p>
            </div>
          </div>
        </CreditsCard>
    </div>
  );
}
