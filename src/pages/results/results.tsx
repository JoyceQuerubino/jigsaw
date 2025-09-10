import "./results.css";
import { useState } from "react";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";
import { useGetUserResults } from "../../hooks/useGetUserResults";

export function Results() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data } = useGetUserResults();

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data?.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="results-container">
      <div className="results-content">
        <button 
          className="nav-button prev" 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <img src={btnBack} alt="Voltar" />
        </button>

        <div className="results-background">
          <div className="results-content-wrapper">
            <div className="results-columns">
              <div className="results-column">
                <h3>Jogador</h3>
                {currentItems?.map((item, index) => (
                  <p key={`username-${index}`}>{item.username}</p>
                ))}
              </div>

              <div className="results-column">
                <h3>Jogo</h3>
                {currentItems?.map((item, index) => (
                  <p key={`game-${index}`}>{item.gameTitile}</p>
                ))}
              </div>

              <div className="results-column">
                <h3>Tempo (min/s)</h3>
                {currentItems?.map((item, index) => (
                  <p key={`time-${index}`}>{item.time}</p>
                ))}
              </div>
            </div>

            <div className="pagination-info">
              Página {currentPage} de {totalPages}
            </div>
          </div>
        </div>

        <button 
          className="nav-button next" 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <img src={btnGo} alt="Avançar" />
        </button>
      </div>
    </div>
  );
}
