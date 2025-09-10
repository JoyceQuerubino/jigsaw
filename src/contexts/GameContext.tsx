import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GameContextData {
  difficulty: 'easy' | 'medium' | 'hard';
  playerName: string;
  puzzleImage: string;
  title: string;
  isPuzzleComplete: boolean;
  setPuzzleComplete: (isComplete: boolean) => void;
  setGameData: (data: { difficulty: 'easy' | 'medium' | 'hard', playerName: string, puzzleImage: string, title: string }) => void;
  time: number;
  setTime: (time: number) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  isGameStarted: boolean;
  startGame: () => void;
  resetGame: () => void;
  formatTime: (seconds: number) => string;
}

const GameContext = createContext<GameContextData>({} as GameContextData);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameData, setGameData] = useState({
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    playerName: '',
    puzzleImage: '',
    title: ''
  });
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameStarted && !isPaused && !isPuzzleComplete) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGameStarted, isPaused, isPuzzleComplete]);

  const handleSetGameData = (data: { difficulty: 'easy' | 'medium' | 'hard', playerName: string, puzzleImage: string, title: string }) => {
    setGameData(data);
  };

  const startGame = () => {
    setIsGameStarted(true);
    setIsPaused(false);
  };

  const resetGame = () => {
    setTime(0);
    setIsGameStarted(false);
    setIsPaused(false);
    setIsPuzzleComplete(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <GameContext.Provider value={{ 
      ...gameData, 
      isPuzzleComplete,
      setPuzzleComplete: setIsPuzzleComplete,
      setGameData: handleSetGameData,
      time,
      setTime,
      isPaused,
      setIsPaused,
      isGameStarted,
      startGame,
      resetGame,
      formatTime
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