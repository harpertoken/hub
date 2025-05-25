import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import audioPlayerService from '../services/audioPlayerService';

/**
 * This component manages audio continuity across route changes.
 * It doesn't render anything visible, but monitors route changes
 * and ensures audio playback continues when navigating.
 */
const AudioContinuityManager = () => {
  // Get the current location from React Router
  const location = useLocation();
  
  // Effect that runs when the route changes
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    
    // Wait a moment for the new route to settle
    const timeoutId = setTimeout(() => {
      // Get the current player state
      const state = audioPlayerService.getPlayerState();
      
      // If we have audio but it's paused, try to resume
      if (state.currentAudio && !state.isPlaying) {
        console.log('Audio paused after route change, attempting to resume via AudioContinuityManager');
        
        if (window.resumeAudioPlayback) {
          window.resumeAudioPlayback();
        } else {
          // Fallback if the global function isn't available
          audioPlayerService.resumeAudio();
        }
      }
    }, 300); // Slightly longer timeout to ensure the route has fully changed
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);
  
  // This component doesn't render anything
  return null;
};

export default AudioContinuityManager;
