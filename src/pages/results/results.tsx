import "./results.css";
import { useState } from "react";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";
import btnQuebraCab from "../../assets/images/my-games/btn-quebra-cab.png";
import { useGetUserResults } from "../../hooks/useGetUserResults";
import { CreditsCard } from "../../components/CreditsCard/CreditsCard";
import type { userResult } from "../../services/types";

function getDifficultyLabel(difficulty?: userResult["difficulty"]): string {
  switch (difficulty) {
    case "easy": return "Fácil";
    case "medium": return "Médio";
    case "hard": return "Difícil";
    default: return "-";
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function Results() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data } = useGetUserResults();

  // Ordenar por data mais recente
  const sortedData = data?.sort((a, b) => {
    // Colocar itens sem data no final
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;

    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Mais recente primeiro
  });

  const totalPages = sortedData ? Math.ceil(sortedData.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedData?.slice(startIndex, endIndex);

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

        <div className="results-credits-card">
          <CreditsCard title="RESULTADOS">
            <div className="results-content-wrapper">
              <div className="theme-header">
                <button className="theme-button" disabled>
                  <img src={btnQuebraCab} alt="Quebra cabeças" />
                </button>
              </div>

              <div className="results-columns">
                <div className="results-column">
                  <h3>Jogador</h3>
                  {currentItems?.map((item, index) => (
                    <p key={`username-${index}`}>{item.username}</p>
                  ))}
                </div>

                <div className="results-column">
                <h3>Tema</h3>
                  {currentItems?.map((item, index) => (
                    <p key={`game-${index}`}>{item.gameTitile}</p>
                  ))}
                </div>

                <div className="results-column">
                  <h3>Dificuldade</h3>
                  {currentItems?.map((item, index) => (
                    <p key={`difficulty-${index}`}>{getDifficultyLabel(item.difficulty)}</p>
                  ))}
                </div>

                <div className="results-column">
                  <h3>Tempo (min:s)</h3>
                  {currentItems?.map((item, index) => (
                    <p key={`time-${index}`}>{item.time}</p>
                  ))}
                </div>

                <div className="results-column">
                  <h3>Data</h3>
                  {currentItems?.map((item, index) => (
                    <p key={`date-${index}`}>{formatDate(item.date)}</p>
                  ))}
                </div>
              </div>

              <div className="pagination-info">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </CreditsCard>
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
