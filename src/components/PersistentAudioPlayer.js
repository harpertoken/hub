import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, Volume2, Volume1, VolumeX, Minimize, Maximize } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

const PersistentAudioPlayer = () => {
  const {
    currentAudio,
    isPlaying,
    duration,
    currentTime,
    volume,
    isVisible,
    togglePlay,
    seekTo,
    changeVolume,
    closePlayer,
    formatTime
  } = useAudio();

  const [isMinimized, setIsMinimized] = useState(false);

  // If the player is not visible, don't render anything
  if (!isVisible || !currentAudio) {
    return null;
  }

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    seekTo(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  // Get volume icon based on current volume
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  // Toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      // Store the current volume before muting
      changeVolume(0);
    } else {
      // Restore to default volume
      changeVolume(1);
    }
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Create the player component
  const player = (
    <div
      className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ${
        isMinimized
          ? 'w-64 h-12 rounded-tl-md'
          : 'w-80 rounded-tl-md'
      }`}
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Header with title and controls */}
      <div className="flex items-center justify-between p-2" style={{ borderBottom: '1px solid rgba(229, 231, 235, 0.3)' }}>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-black bg-opacity-10 backdrop-blur-sm rounded-full flex items-center justify-center mr-2">
            <span className="text-xs">🎵</span>
          </div>
          <div className="truncate text-sm font-medium text-gray-800">
            {currentAudio.title || 'Audio Playing'}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleMinimize}
            className="p-1 text-gray-500 hover:text-black transition-colors duration-200"
            title={isMinimized ? 'Expand' : 'Minimize'}
            style={{ backdropFilter: 'blur(4px)' }}
          >
            {isMinimized ? <Maximize size={14} /> : <Minimize size={14} />}
          </button>
          <button
            onClick={closePlayer}
            className="p-1 text-gray-500 hover:text-black transition-colors duration-200 ml-1"
            title="Close"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Minimized view only shows play/pause */}
      {isMinimized ? (
        <div className="flex items-center justify-between px-2 h-full">
          <button
            onClick={togglePlay}
            className="p-1 text-gray-700 hover:text-black transition-colors duration-200"
            title={isPlaying ? 'Pause' : 'Play'}
            style={{ backdropFilter: 'blur(4px)' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div className="flex-grow mx-2">
            <div className="w-full bg-black bg-opacity-10 h-1 rounded-full overflow-hidden">
              <div
                className="bg-black bg-opacity-50 h-full rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {formatTime(currentTime)}
          </div>
        </div>
      ) : (
        /* Full player view */
        <div className="p-3">
          {/* Progress bar */}
          <div
            className="w-full bg-black bg-opacity-10 h-2 rounded-full overflow-hidden cursor-pointer mb-2"
            onClick={handleProgressClick}
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <div
              className="bg-black bg-opacity-50 h-full rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Time display */}
          <div className="flex justify-between text-xs text-gray-600 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full transition-colors duration-200"
              title={isPlaying ? 'Pause' : 'Play'}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                color: 'white'
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div className="flex items-center">
              <button
                onClick={toggleMute}
                className="p-1 text-gray-600 hover:text-black transition-colors duration-200"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {getVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 ml-2"
                style={{
                  accentColor: 'rgba(0, 0, 0, 0.6)',
                  opacity: 0.8
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Use React Portal to render the player at the root level
  return createPortal(player, document.body);
};

export default PersistentAudioPlayer;
