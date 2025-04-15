import { v4 as uuidv4 } from "uuid";
import { defaultGames } from "./data/default";
import { EditGameProps, GameType } from "./types";

const StorageService = {
  savePlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
  },
  getPlayers() {
    return JSON.parse(localStorage.getItem("players")) || [];
  },
  saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games));
  },
  getGames() {
    return JSON.parse(localStorage.getItem("games")) || [];
  },
};

//Funcoes do storage
export function addGame(newGame: GameType) {
  const currentGames = StorageService.getGames();

  const gameWithId = {
    ...newGame,
    id: newGame.id || uuidv4(), // <-- Gerando ID usando uuidv4()
  };

  const updatedGames = [...currentGames, gameWithId];
  StorageService.saveGames(updatedGames);
}

export function editGameById({ id, updatedGameData }: EditGameProps) {
  const currentGames = StorageService.getGames();

  const updatedGames = currentGames.map((game) =>
    game.id === id ? { ...game, ...updatedGameData } : game
  );

  StorageService.saveGames(updatedGames);
}

export function deleteGameById(id: string) {
  const currentGames = StorageService.getGames();

  const updatedGames = currentGames.filter((game) => game.id !== id);

  StorageService.saveGames(updatedGames);
}


export function getGamesReady() {
    try {
      const games = JSON.parse(localStorage.getItem("games"));
  
      if (Array.isArray(games)) {
        return games;
      }
      // Se não tiver jogos, cria um jogo padrão
      const newGanes = localStorage.setItem("games", JSON.stringify(defaultGames));
  
      return newGanes;
    } catch (error) {
      console.error("Erro ao ler jogos:", error);  
      localStorage.setItem("games", JSON.stringify(defaultGames));
  
      return defaultGames;
    }
  }
  

//nao pode editar e nem deletar os jogos padroes. 
