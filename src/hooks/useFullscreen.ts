import { useEffect } from 'react';
import screenfull from 'screenfull';
import { useDeviceOrientation } from './useDeviceOrientation';

export function useFullscreen() {
  const { isMobile, isLandscape } = useDeviceOrientation();

  useEffect(() => {
    if (!screenfull.isEnabled) return;

    const handleOrientationChange = () => {
      // Auto fullscreen when mobile device is rotated to landscape
      if (isMobile && isLandscape && !screenfull.isFullscreen) {
        screenfull.request().catch(console.error);
      }
    };

    // Check on mount
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isMobile, isLandscape]);

  const enterFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request().catch(console.error);
    }
  };

  const exitFullscreen = () => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit().catch(console.error);
    }
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle().catch(console.error);
    }
  };

  return {
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isFullscreenEnabled: screenfull.isEnabled,
  };
}