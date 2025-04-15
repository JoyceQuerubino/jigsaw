import { v4 as uuidv4 } from "uuid";
import { defaultGames } from "./data/default";
import { EditGameProps, GameType } from "./types";

const StorageService = {
  savePlayers(players: any[]) {
    localStorage.setItem("players", JSON.stringify(players));
  },
  getPlayers(): any[] {
    const players = localStorage.getItem("players");
    return players ? JSON.parse(players) : [];
  },
  saveGames(games: GameType[]) {
    localStorage.setItem("games", JSON.stringify(games));
  },
  getGames(): GameType[] {
    const games = localStorage.getItem("games");
    return games ? JSON.parse(games) : [];
  },
};

//Funcoes do storage
export function addGame(newGame: GameType) {
  const currentGames = StorageService.getGames();

  const gameWithId = {
    ...newGame,
    id: newGame.id || uuidv4(),
  };

  const updatedGames = [...currentGames, gameWithId];
  StorageService.saveGames(updatedGames);
}

export function editGameById({ id, updatedGameData }: EditGameProps) {
  const currentGames = StorageService.getGames();

  const updatedGames = currentGames.map((game: GameType) =>
    game.id === id ? { ...game, ...updatedGameData } : game
  );

  StorageService.saveGames(updatedGames);
}

export function deleteGameById(id: string) {
  const currentGames = StorageService.getGames();

  const updatedGames = currentGames.filter((game: GameType) => game.id !== id);

  StorageService.saveGames(updatedGames);
}

export function getGamesReady(): GameType[] {
  try {
    const gamesStr = localStorage.getItem("games");
    if (!gamesStr) {
      localStorage.setItem("games", JSON.stringify(defaultGames));
      return defaultGames;
    }

    const games = JSON.parse(gamesStr);
    if (Array.isArray(games)) {
      return games;
    }

    localStorage.setItem("games", JSON.stringify(defaultGames));
    return defaultGames;
  } catch (error) {
    console.error("Erro ao ler jogos:", error);
    localStorage.setItem("games", JSON.stringify(defaultGames));
    return defaultGames;
  }
}

//nao pode editar e nem deletar os jogos padroes. 
