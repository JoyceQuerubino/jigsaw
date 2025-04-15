import "./credits.css";
import unifespLogo from "../../assets/images/unifesp.png";

export function Credits() {
  return (
    <div className="credits-container">
      <div className="credits-content">
        <div className="credits-background">
          <div className="credits-content-wrapper">
            <div className="credits-content-column">
              <div className="credits-content-items">
                <h3>Orientador</h3>
                <p>Dr. Carlos Marcelo Gurjão de Godoy</p>
              </div>

              <div className="credits-content-items">
                <h3>Coorientadoras</h3>
                <p>Dra. Regina Célia Coelho</p>
                <p>Dra. Vanessa Andrade Pereira</p>
              </div>

              <div className="credits-content-items">
                <img src={unifespLogo} alt="Logo UNIFESP" className="unifesp-logo" />
              </div>
            </div>

            <div className="credits-content-column">
              <div className="credits-content-items">
                <h3>Mestranda</h3>
                <p>Geisse Rosane de Faria Dias Costa</p>
              </div>

              <div className="credits-content-items">
                <h3>Desenvolvimento</h3>
                <p>Dra. Regina Célia Coelho</p>
              </div>

              <div className="credits-content-items">
                <h3>Personagem</h3>
                <p>Otavio Pozzebon Scalari</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
