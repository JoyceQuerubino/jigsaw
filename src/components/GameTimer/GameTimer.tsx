import React from 'react';
import { TimerControlButton } from '../TimerControlButton';
import { useGame } from '../../contexts/GameContext';
import './styles.css';

interface GameTimerProps {
  isComplete: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = () => {
  const { time, isPaused, setIsPaused, formatTime } = useGame();

  function pause(){
    setIsPaused((value) => !value)
  }

  return (
    <div className="game-timer-container">
      <span className="game-timer-text">
        {formatTime(time)}
      </span>
      <TimerControlButton isPaused={isPaused} onClick={pause} />
    </div>
  );
}; 