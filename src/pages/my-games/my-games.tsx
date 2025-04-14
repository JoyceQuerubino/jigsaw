import React from "react";
import { useNavigate } from "react-router";
import { Slider } from "../../components/slider/slider";
import btnQuebraCab from "../../assets/images/my-games/btn-quebra-cab.png";
import "./my-games.css";
import { Button } from "../../components/Button/Button";
import { useGetGames } from "../../hooks/useGetGames";
import { GameType } from "../../services/types";

export function MyGames() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetGames();

  console.log("Chegou", data);

  function handleNavigateTo(screen: string) {
    navigate(screen);
  }

  function handleGameSelect(game: GameType) {
    navigate("/new-game", { 
      state: { 
        gameData: game 
      } 
    });
  }

  return (
    <div className="container-my-games">
      <button className="my-game-quebra-button" disabled>
        <img src={btnQuebraCab} alt="Jogar" />
      </button>

      {data && (
        <div className="slider-container">
          <Slider 
            cardsData={data} 
            onNavigate={handleGameSelect}
          />
        </div>
      )}

      <div className="my-games-new-game-button-container">
        <Button
          text="Novo Jogo"
          onClick={() => handleNavigateTo("/new-game")}
        />
      </div>
    </div>
  );
}
