import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextData {
  difficulty: 'easy' | 'medium' | 'hard';
  playerName: string;
  puzzleImage: string;
  isPuzzleComplete: boolean;
  setGameData: (data: { difficulty: 'easy' | 'medium' | 'hard', playerName: string, puzzleImage: string }) => void;
  setIsPuzzleComplete: (isComplete: boolean) => void;
}

const GameContext = createContext<GameContextData>({} as GameContextData);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameData, setGameData] = useState({
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    playerName: '',
    puzzleImage: ''
  });
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);

  const handleSetGameData = (data: { difficulty: 'easy' | 'medium' | 'hard', playerName: string, puzzleImage: string }) => {
    setGameData(data);
  };

  return (
    <GameContext.Provider value={{ 
      ...gameData, 
      isPuzzleComplete,
      setGameData: handleSetGameData,
      setIsPuzzleComplete
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 