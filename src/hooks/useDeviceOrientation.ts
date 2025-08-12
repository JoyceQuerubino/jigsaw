import { useEffect, useState } from 'react';

export function useDeviceOrientation() {
  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const shouldShowRotateWarning = isMobile && isPortrait;

  return { 
    isPortrait, 
    isLandscape: !isPortrait, 
    isMobile,
    shouldShowRotateWarning 
  };
}