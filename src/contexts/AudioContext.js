import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Create the context
const AudioContext = createContext();

// Custom hook to use the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Provider component
export const AudioProvider = ({ children }) => {
  // Audio state
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  // Audio element reference
  const audioRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    // Try to restore from localStorage
    try {
      const savedAudio = localStorage.getItem('persistentAudio');
      if (savedAudio) {
        const audioData = JSON.parse(savedAudio);
        setCurrentAudio(audioData);
        setIsVisible(true);
        audio.src = audioData.url;
        audio.load();
      }
    } catch (e) {
      console.warn('Could not restore audio from localStorage:', e);
    }
    
    // Cleanup function
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [volume]);
  
  // Play a new audio
  const playAudio = (audioData) => {
    if (!audioData || !audioData.url) return;
    
    // If it's the same audio, just toggle play/pause
    if (currentAudio && currentAudio.id === audioData.id) {
      togglePlay();
      return;
    }
    
    // Set the new audio data
    setCurrentAudio(audioData);
    setIsVisible(true);
    
    // Reset time
    setCurrentTime(0);
    
    // Set the source and play
    const audio = audioRef.current;
    audio.src = audioData.url;
    audio.load();
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('persistentAudio', JSON.stringify(audioData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };
  
  // Seek to a specific time
  const seekTo = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };
  
  // Change volume
  const changeVolume = (newVolume) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audio.volume = clampedVolume;
    setVolume(clampedVolume);
  };
  
  // Close the player
  const closePlayer = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    audio.src = '';
    setIsPlaying(false);
    setCurrentTime(0);
    setIsVisible(false);
    setCurrentAudio(null);
    
    // Remove from localStorage
    localStorage.removeItem('persistentAudio');
  };
  
  // Format time (mm:ss)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    
    return `${minutes}:${seconds}`;
  };
  
  // Context value
  const value = {
    currentAudio,
    isPlaying,
    duration,
    currentTime,
    volume,
    isVisible,
    playAudio,
    togglePlay,
    seekTo,
    changeVolume,
    closePlayer,
    formatTime
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
