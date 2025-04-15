import { useState, useEffect } from 'react';

interface UseTimerProps {
  isComplete: boolean;
}

export const useTimer = ({ isComplete }: UseTimerProps) => {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setIsPaused(true);
    }
  }, [isComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused && !isComplete) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, isComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    time,
    isPaused,
    setIsPaused,
    formatTime
  };
}; 