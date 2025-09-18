import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import audioPlayerService from '../services/audioPlayerService';

// Create context
const AudioPlayerContext = createContext();

// Provider component
export const AudioPlayerProvider = ({ children }) => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // Play a new audio
  const playAudio = (audioData) => {
    console.log('AudioPlayerContext: Playing audio', audioData);

    // Set the new audio data in state
    setCurrentAudio(audioData);
    setIsVisible(true);

    // Use the service to play the audio
    audioPlayerService.playAudio(audioData);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioPlayerService.pauseAudio();
    } else {
      audioPlayerService.resumeAudio();
    }
  };

  // Stop playing
  const stopAudio = () => {
    audioPlayerService.stopAudio();
    setCurrentTime(0);
  };

  // Close the player
  const closePlayer = () => {
    stopAudio();
    setIsVisible(false);
    setCurrentAudio(null);
  };

  // Set the current time
  const seekTo = (time) => {
    audioPlayerService.seekTo(time);
  };

  // Set the volume
  const changeVolume = (newVolume) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioPlayerService.setVolume(clampedVolume);
    setVolume(clampedVolume);
  };

  // Effect to set up event listeners
  useEffect(() => {
    // Handle play event
    const handlePlay = () => {
      console.log('AudioPlayerContext: Play event received');
      setIsPlaying(true);
    };

    // Handle pause event
    const handlePause = () => {
      console.log('AudioPlayerContext: Pause event received');
      setIsPlaying(false);
    };

    // Handle time update event
    const handleTimeUpdate = () => {
      const state = audioPlayerService.getPlayerState();
      setCurrentTime(state.currentTime);
    };

    // Handle ended event
    const handleEnded = () => {
      console.log('AudioPlayerContext: Audio ended');
      setIsPlaying(false);
      setCurrentTime(0);
    };



    // Handle volume change event
    const handleVolumeChange = () => {
      const state = audioPlayerService.getPlayerState();
      setVolume(state.volume);
    };

    // Add event listeners
    audioPlayerService.addEventListener('play', handlePlay);
    audioPlayerService.addEventListener('pause', handlePause);
    audioPlayerService.addEventListener('timeupdate', handleTimeUpdate);
    audioPlayerService.addEventListener('ended', handleEnded);
    audioPlayerService.addEventListener('volumechange', handleVolumeChange);

    // Set up an interval to check the player state
    // This ensures we stay in sync even if events are missed
    const intervalId = setInterval(() => {
      const state = audioPlayerService.getPlayerState();

      // Update current time
      setCurrentTime(state.currentTime);

      // Update duration if it changed
      if (state.duration > 0 && state.duration !== duration) {
        setDuration(state.duration);
      }

      // Update playing state if it changed
      if (state.isPlaying !== isPlaying) {
        setIsPlaying(state.isPlaying);
      }

      // Update current audio if it changed
      if (state.currentAudio && (!currentAudio || state.currentAudio.id !== currentAudio.id)) {
        setCurrentAudio(state.currentAudio);
        setIsVisible(true);
      }
    }, 1000);

    // Cleanup function
    return () => {
      // Remove event listeners
      audioPlayerService.removeEventListener('play', handlePlay);
      audioPlayerService.removeEventListener('pause', handlePause);
      audioPlayerService.removeEventListener('timeupdate', handleTimeUpdate);
      audioPlayerService.removeEventListener('ended', handleEnded);
      audioPlayerService.removeEventListener('volumechange', handleVolumeChange);

      // Clear interval
      clearInterval(intervalId);
    };
  }, [currentAudio, duration, isPlaying]);

  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize the audio player service when the app starts
  useEffect(() => {
    console.log('AudioPlayerContext: Initializing audio player service');

    // This effect runs only once when the provider is first mounted
    // It ensures the audio service is properly initialized

    // Get the initial state from the service
    const initialState = audioPlayerService.getPlayerState();

    // If there's already audio playing (e.g., after a page refresh),
    // update our state to match
    if (initialState.currentAudio) {
      setCurrentAudio(initialState.currentAudio);
      setIsPlaying(initialState.isPlaying);
      setCurrentTime(initialState.currentTime);
      setDuration(initialState.duration);
      setVolume(initialState.volume);
      setIsVisible(true);
    }

    // Log that we're ready
    console.log('AudioPlayerContext: Initialization complete');
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentAudio,
        duration,
        currentTime,
        volume,
        isVisible,
        playAudio,
        togglePlay,
        stopAudio,
        closePlayer,
        seekTo,
        changeVolume,
        formatTime
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

AudioPlayerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use the audio player context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
