import React from 'react';
import { useTimer } from '../../hooks/useTimer';
import { TimerControlButton } from '../TimerControlButton';
import './styles.css';

interface GameTimerProps {
  isComplete: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = ({ isComplete }) => {
  const { time, isPaused, setIsPaused, formatTime } = useTimer({
    isComplete
  });

  return (
    <div className="game-timer-container">
      <span className="game-timer-text">
        {formatTime(time)}
      </span>
      <TimerControlButton isPaused={isPaused} onClick={() => setIsPaused(!isPaused)} />
    </div>
  );
}; 