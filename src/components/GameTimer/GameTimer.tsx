import React, { useEffect } from 'react';
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

  // useEffect(() => {
  //   console.log("MUDOU", isPaused)
  // },[isPaused] )

  return (
    <div className="game-timer-container">
      <span className="game-timer-text">
        {formatTime(time)}
      </span>
      <TimerControlButton isPaused={isPaused} onClick={pause} />
    </div>
  );
}; 