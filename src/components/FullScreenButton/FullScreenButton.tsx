import { useState, useEffect } from 'react';
import screenfull from 'screenfull';
import './styles.css';

interface FullScreenButtonProps {
  className?: string;
}

export function FullScreenButton({ className = '' }: FullScreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (screenfull.isEnabled) {
      const handleChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
      };

      screenfull.on('change', handleChange);

      return () => {
        screenfull.off('change', handleChange);
      };
    }
  }, []);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  if (!screenfull.isEnabled) {
    return null;
  }

  return (
    <button 
      className={`fullscreen-button ${className}`}
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
      type="button"
    >
      {isFullscreen ? (
        // Exit fullscreen icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M5 16H8V19H10V14H5V16ZM8 8H5V10H10V5H8V8ZM14 19H16V16H19V14H14V19ZM16 8V5H14V10H19V8H16Z" 
            fill="currentColor"
          />
        </svg>
      ) : (
        // Enter fullscreen icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" 
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}