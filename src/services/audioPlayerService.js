/**
 * Global Audio Player Service
 *
 * This service manages a single audio element that persists throughout the application
 * regardless of component mounting/unmounting or route changes.
 */

// Check if we already have an audio element in window
// This ensures we don't create multiple audio elements during hot reloads
if (!window.globalAudioElement) {
  console.log('Creating global audio element');
  window.globalAudioElement = new Audio();
  window.globalAudioElement.volume = 1;
  window.globalAudioElement.autoplay = false;

  // Add this audio element to the document to ensure it's not garbage collected
  document.body.appendChild(window.globalAudioElement);
}

// Use the global audio element
const audioElement = window.globalAudioElement;

// Set default properties (in case they were changed)
audioElement.volume = 1;
audioElement.autoplay = false;

// Store current audio information
let currentAudioInfo = null;

// Store event listeners
const eventListeners = {
  play: [],
  pause: [],
  timeupdate: [],
  ended: [],
  volumechange: [],
  error: []
};

// Add native event listeners to the audio element
audioElement.addEventListener('play', () => notifyListeners('play'));
audioElement.addEventListener('pause', () => notifyListeners('pause'));
audioElement.addEventListener('timeupdate', () => notifyListeners('timeupdate'));
audioElement.addEventListener('ended', () => notifyListeners('ended'));
audioElement.addEventListener('volumechange', () => notifyListeners('volumechange'));
audioElement.addEventListener('error', (e) => notifyListeners('error', e));

// Notify all listeners of a specific event
function notifyListeners(eventName, eventData) {
  eventListeners[eventName].forEach(callback => {
    try {
      callback(eventData);
    } catch (error) {
      console.error(`Error in ${eventName} listener:`, error);
    }
  });
}

/**
 * Play audio from a URL
 * @param {Object} audioInfo - Information about the audio to play
 * @param {string} audioInfo.id - Unique identifier for the audio
 * @param {string} audioInfo.url - URL of the audio file
 * @param {string} audioInfo.title - Title of the audio
 */
function playAudio(audioInfo) {
  if (!audioInfo || !audioInfo.url) {
    console.error('Invalid audio info provided to playAudio');
    return;
  }

  console.log('AudioPlayerService: Playing audio', audioInfo);

  // If it's the same audio that's already playing, just continue
  if (currentAudioInfo && currentAudioInfo.id === audioInfo.id) {
    if (audioElement.paused) {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    return;
  }

  // Store the current audio info
  currentAudioInfo = audioInfo;

  // Also store in localStorage to persist across page refreshes
  try {
    localStorage.setItem('currentAudio', JSON.stringify(audioInfo));
  } catch (e) {
    console.warn('Could not save audio info to localStorage:', e);
  }

  // Set the source and play
  audioElement.src = audioInfo.url;
  audioElement.load();

  // Create a persistent play function that can be called multiple times
  const attemptPlay = () => {
    console.log('Attempting to play audio...');

    // Make sure the audio element is still in the document
    if (!document.contains(audioElement)) {
      console.log('Audio element not in document, re-adding...');
      document.body.appendChild(audioElement);
    }

    // Try to play
    audioElement.play()
      .then(() => {
        console.log('Audio playback started successfully');
        notifyListeners('play');
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        notifyListeners('error', error);

        // If autoplay was blocked, we'll try again when the user interacts with the page
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay blocked, will try again on user interaction');

          const resumePlayback = () => {
            console.log('User interacted with page, trying to play audio again');
            audioElement.play()
              .then(() => {
                console.log('Audio playback resumed after user interaction');
                notifyListeners('play');

                // Remove the event listeners once we've successfully played
                document.removeEventListener('click', resumePlayback);
                document.removeEventListener('keydown', resumePlayback);
              })
              .catch(e => console.error('Still could not play audio after user interaction:', e));
          };

          // Add event listeners for user interaction
          document.addEventListener('click', resumePlayback);
          document.addEventListener('keydown', resumePlayback);
        }
      });
  };

  // Store the play function globally so it can be called from anywhere
  window.resumeAudioPlayback = attemptPlay;

  // Play with a small delay to ensure loading
  setTimeout(attemptPlay, 100);

  // Set up a backup timer to check if audio is playing after navigation
  setTimeout(() => {
    if (audioElement.paused && currentAudioInfo) {
      console.log('Audio still paused after timeout, trying again...');
      attemptPlay();
    }
  }, 1000);
}

/**
 * Pause the currently playing audio
 */
function pauseAudio() {
  audioElement.pause();
}

/**
 * Resume playing the current audio
 */
function resumeAudio() {
  if (audioElement.src) {
    audioElement.play().catch(error => {
      console.error('Error resuming audio:', error);
    });
  }
}

/**
 * Stop the currently playing audio
 */
function stopAudio() {
  audioElement.pause();
  audioElement.currentTime = 0;
  currentAudioInfo = null;
}

/**
 * Seek to a specific time in the audio
 * @param {number} time - Time in seconds
 */
function seekTo(time) {
  if (isNaN(time)) return;

  audioElement.currentTime = Math.max(0, Math.min(time, audioElement.duration));
}

/**
 * Set the volume of the audio
 * @param {number} volume - Volume level (0 to 1)
 */
function setVolume(volume) {
  audioElement.volume = Math.max(0, Math.min(1, volume));
}

/**
 * Get the current state of the audio player
 * @returns {Object} Current state
 */
function getPlayerState() {
  return {
    currentAudio: currentAudioInfo,
    isPlaying: !audioElement.paused,
    currentTime: audioElement.currentTime,
    duration: audioElement.duration || 0,
    volume: audioElement.volume
  };
}

/**
 * Add an event listener
 * @param {string} eventName - Name of the event
 * @param {Function} callback - Callback function
 */
function addEventListener(eventName, callback) {
  if (!eventListeners[eventName]) {
    console.warn(`Unknown event: ${eventName}`);
    return;
  }

  eventListeners[eventName].push(callback);
}

/**
 * Remove an event listener
 * @param {string} eventName - Name of the event
 * @param {Function} callback - Callback function to remove
 */
function removeEventListener(eventName, callback) {
  if (!eventListeners[eventName]) {
    return;
  }

  const index = eventListeners[eventName].indexOf(callback);
  if (index !== -1) {
    eventListeners[eventName].splice(index, 1);
  }
}

/**
 * Initialize the audio player service
 * This should be called when the app starts
 */
function initializeService() {
  console.log('Initializing audio player service');

  // Try to restore audio from localStorage
  try {
    const savedAudio = localStorage.getItem('currentAudio');
    if (savedAudio) {
      const audioInfo = JSON.parse(savedAudio);
      console.log('Restoring audio from localStorage:', audioInfo);

      // Set the current audio info without playing
      currentAudioInfo = audioInfo;

      // Set the source but don't play automatically
      audioElement.src = audioInfo.url;
      audioElement.load();
    }
  } catch (e) {
    console.warn('Could not restore audio from localStorage:', e);
  }

  // Add a special event listener for page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentAudioInfo && audioElement.paused) {
      console.log('Page became visible, checking if we need to resume audio');

      // If we have current audio but it's paused, try to resume
      if (window.resumeAudioPlayback) {
        console.log('Attempting to resume audio playback after visibility change');
        window.resumeAudioPlayback();
      }
    }
  });

  // Add a special event listener for route changes in React
  // This uses the popstate event which fires when history changes
  window.addEventListener('popstate', () => {
    console.log('Route changed (popstate), checking audio playback');

    // Wait a moment for the new route to settle
    setTimeout(() => {
      if (currentAudioInfo && audioElement.paused) {
        console.log('Audio paused after route change, attempting to resume');

        if (window.resumeAudioPlayback) {
          window.resumeAudioPlayback();
        }
      }
    }, 100);
  });

  // Also listen for hashchange events (for hash-based routing)
  window.addEventListener('hashchange', () => {
    console.log('Route changed (hashchange), checking audio playback');

    // Wait a moment for the new route to settle
    setTimeout(() => {
      if (currentAudioInfo && audioElement.paused) {
        console.log('Audio paused after route change, attempting to resume');

        if (window.resumeAudioPlayback) {
          window.resumeAudioPlayback();
        }
      }
    }, 100);
  });

  // Initialize immediately
  if (window.resumeAudioPlayback) {
    console.log('Attempting initial audio playback');
    window.resumeAudioPlayback();
  }

  return true;
}

// Call initialize immediately
initializeService();

// Export the service
export default {
  playAudio,
  pauseAudio,
  resumeAudio,
  stopAudio,
  seekTo,
  setVolume,
  getPlayerState,
  addEventListener,
  removeEventListener,
  initializeService
};
