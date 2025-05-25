import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AILabRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        A I Lab
        <p className="text-sm text-gray-600">
          Instructions details for the A I Lab component.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">15 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Ingredients
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>1 React Context API for global audio state</li>
          <li>1 Audio player service for cross-route persistence</li>
          <li>4 media analysis tabs (image, audio, video, YouTube)</li>
          <li>2 cups of Gemini AI integration (1.5 Flash and 2.0 Flash)</li>
          <li>A handful of UI components for media upload and display</li>
          <li>A pinch of error handling and loading states</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Create an Audio Player Context</p>
            <p>Set up a React Context to manage audio state globally across the application.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// src/contexts/AudioPlayerContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import audioPlayerService from '../services/audioPlayerService';

// Create the context
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
    setCurrentAudio(audioData);
    setIsVisible(true);
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

  // Subscribe to audio player service events
  useEffect(() => {
    const unsubscribe = audioPlayerService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
    });

    return () => unsubscribe();
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

// Custom hook to use the audio player context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create the AI Lab Container Component</p>
            <p>Build a container component that provides a consistent UI for the AI features.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// src/components/AILab.js
import { Image as ImageIcon, Mic, Video, Youtube } from 'lucide-react';
import AIFeatures from './AIFeatures';

const AILab = () => {
  return (
    <div
      className="overflow-hidden rounded-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="w-full">
        {/* Header section with title and media type indicators */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          {/* Title with lightning bolt icon */}
          <div className="flex items-center gap-2.5">
            <div className="bg-black p-1.5 rounded-full">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-black">AI Media Analysis</span>
          </div>

          {/* Media type indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Mic className="w-3.5 h-3.5" />
              <span>Audio</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </div>
          </div>
        </div>

        {/* Main content - AIFeatures component */}
        <div className="w-full">
          <AIFeatures />
        </div>
      </div>
    </div>
  );
};

export default AILab;`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Integrate with the Persistent Audio Player</p>
            <p>Connect the audio analysis feature to the persistent audio player.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In AIFeatures.js - Audio analysis submission handler
// Import the audio player hook
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Inside the component
const { playAudio } = useAudioPlayer();

// In the handleSubmit function for audio analysis
if (activeTab === 'audio') {
  try {
    // Call the audio analysis API endpoint
    const response = await fetch(\`\${API_URL}/process-audio\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioFile: audioFile
      }),
    });

    const data = await response.json();

    // Set the response text
    setResponse(\`## Audio Analysis Complete

    **Analysis Results:**
    \${data.analysis}

    You can play the audio directly in this window or use the audio player at the bottom of the screen to continue listening while navigating to other parts of the application.\`);

    // Play the audio using the persistent audio player
    if (data.audioUrl) {
      playAudio({
        id: \`audio-analysis-\${Date.now()}\`,
        url: data.audioUrl,
        title: 'Audio Analysis'
      });
    }
  } catch (error) {
    console.error('Error calling audio analysis API:', error);
    setError(\`Failed to analyze audio: \${error.message}\`);
  }
}`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Chef's Notes
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            The AI Lab with persistent audio playback offers several key benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Multimodal Analysis:</span> Users can analyze images, audio, video, and YouTube content with a single interface, leveraging Gemini's multimodal capabilities.
            </li>
            <li>
              <span className="font-medium">Content Analysis:</span> Gemini 1.5 Flash provides comprehensive analysis capabilities for all media types with consistent quality.
            </li>
            <li>
              <span className="font-medium">Persistent Audio:</span> The React Context-based audio player allows users to continue listening to analyzed audio while navigating to other parts of the application.
            </li>
          </ul>
          <p className="mt-4">
            This approach creates a seamless user experience where AI-analyzed content can be consumed across different parts of the application without interruption, significantly enhancing the usability of media analysis features.
          </p>
        </div>
      </section>

      {/* Instructions Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions Tips
        <div className="text-sm text-gray-600 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Audio Service Architecture:</span> Use a service-based approach for audio playback to maintain state across route changes without relying on global variables.
            </li>
            <li>
              <span className="font-medium">Event-Based Communication:</span> Implement a publish/subscribe pattern in the audio service to allow components to react to audio state changes.
            </li>
            <li>
              <span className="font-medium">Lazy Loading:</span> Consider lazy-loading the AI Lab component to reduce initial bundle size, especially if it's not used on the initial page load.
            </li>
            <li>
              <span className="font-medium">Error Boundaries:</span> Wrap AI components in error boundaries to prevent the entire application from crashing if an AI feature encounters an error.
            </li>
            <li>
              <span className="font-medium">Accessibility:</span> Ensure the audio player has proper keyboard controls and ARIA attributes for accessibility compliance.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default AILabRecipe;
