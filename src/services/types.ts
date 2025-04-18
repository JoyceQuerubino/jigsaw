export interface GameType {
  id: string;
  title: string;
  type: string;
  image: string;
}

export interface EditeGameType {
  id?: string;
  title?: string;
  type?: string;
  image?: string;
}

export type EditGameProps = {
  id: string;
  updatedGameData: EditeGameType;
};

export type userResult = {
  id: string;
  username: string;
  gameTitile: string;
  time: string;
}