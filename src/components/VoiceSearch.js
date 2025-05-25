import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, RefreshCw, Settings, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import '../markdown-styles.css';
import '../latex-styles.css';
import 'katex/dist/katex.min.css';

const VoiceSearch = () => {
  // State for recording and processing
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  // State for voice settings
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceFilter, setVoiceFilter] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Voice customization controls with default values
  const DEFAULT_PITCH = 1.0;
  const DEFAULT_RATE = 1.0;
  const DEFAULT_VOLUME = 1.0;

  const [voicePitch, setVoicePitch] = useState(DEFAULT_PITCH);
  const [voiceRate, setVoiceRate] = useState(DEFAULT_RATE);
  const [voiceVolume, setVoiceVolume] = useState(DEFAULT_VOLUME);

  // Reset voice customization to defaults
  const resetVoiceCustomization = () => {
    setVoicePitch(DEFAULT_PITCH);
    setVoiceRate(DEFAULT_RATE);
    setVoiceVolume(DEFAULT_VOLUME);
  };

  // Animation state
  const [audioLevel, setAudioLevel] = useState(0);
  const [, setBubbles] = useState([]); // Only need the setter
  const [particles, setParticles] = useState([]);
  // We only need the setter functions for these states, not the values themselves
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [, setIsHovering] = useState(false);
  const visualizationAreaRef = useRef(null);

  // Silence detection state
  const [isSilent, setIsSilent] = useState(false);
  const silenceStartTime = useRef(null);
  const SILENCE_THRESHOLD = 0.05; // Audio level below this is considered silence
  const SILENCE_DURATION = 1500; // 1.5 seconds of silence before stopping

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Generate particles in a grid pattern
  const generateParticles = () => {
    const newParticles = [];
    const gridSize = 5; // 5x5 grid
    const spacing = 12; // Spacing between particles

    // Create a grid of particles
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Calculate position based on grid
        const x = 50 - (spacing * (gridSize-1)/2) + (spacing * i);
        const y = 50 - (spacing * (gridSize-1)/2) + (spacing * j);
        const z = 0; // Flat layout

        // No longer need to calculate distance from center
        // const distanceFromCenter = Math.sqrt(
        //   Math.pow(x - 50, 2) +
        //   Math.pow(y - 50, 2)
        // );

        // Uniform size and opacity
        const size = 3;
        const opacity = 0.1;

        newParticles.push({
          id: `particle-${i}-${j}`,
          x,
          y,
          z,
          originalX: x,
          originalY: y,
          originalZ: z,
          size,
          color: `rgba(0, 0, 0, ${opacity})`,
          speed: 1.0, // Consistent speed
        });
      }
    }

    setParticles(newParticles);
  };

  // Simple mouse interaction
  const handleMouseMove = (e) => {
    if (!visualizationAreaRef.current) return;

    const rect = visualizationAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });

    // Simple displacement of particles
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        // Calculate distance from mouse to particle
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Simple movement - only affect particles within a small radius
        const effectRadius = 10;

        if (distance < effectRadius) {
          // Move away from cursor
          const moveX = (dx / distance) * 5;
          const moveY = (dy / distance) * 5;

          return {
            ...particle,
            x: particle.x + moveX,
            y: particle.y + moveY,
          };
        }

        // Return to original position
        return {
          ...particle,
          x: particle.x + (particle.originalX - particle.x) * 0.1,
          y: particle.y + (particle.originalY - particle.y) * 0.1,
        };
      })
    );
  };

  // Fallback function to use browser's Web Speech API
  const fallbackToWebSpeech = useCallback((text) => {
    if (!text || text.trim() === '') {
      console.warn("No text to speak");
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not available");
      setError("Speech synthesis is not supported in this browser. Try Chrome or Edge.");
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      console.log("Falling back to browser speech synthesis...");
      setError("Falling back to browser speech synthesis...");

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Try to resume speech synthesis (fixes issues in some browsers)
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn("Could not resume speech synthesis:", e);
      }

      // Clean up the text for better speech synthesis - use shorter chunks
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Replace markdown links with just the text
        .replace(/```[\s\S]*?```/g, 'Code example omitted.') // Replace code blocks
        .replace(/`(.*?)`/g, '$1')       // Remove inline code formatting
        .replace(/\n\n/g, '. ')          // Replace double newlines with period and space
        .replace(/\n/g, ' ')             // Replace single newlines with space
        .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
        .replace(/https?:\/\/\S+/g, 'URL omitted.'); // Replace URLs

      // Limit text length to avoid errors
      const maxLength = 1000;
      const truncatedText = cleanText.length > maxLength ?
        cleanText.substring(0, maxLength) + "... (text truncated for speech)" :
        cleanText;

      // Create a simple utterance with the response
      const utterance = new SpeechSynthesisUtterance(truncatedText);

      // Get all available voices
      let voices = window.speechSynthesis.getVoices();

      // If no voices are available yet, try to force load them
      if (voices.length === 0) {
        console.log("No voices available on first try, attempting to force load...");

        // Create and speak an empty utterance to trigger voice loading
        const emptyUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(emptyUtterance);
        window.speechSynthesis.cancel();

        // Try again
        voices = window.speechSynthesis.getVoices();
        console.log("After force load, voices available:", voices.length);
      }

      // Log all available voices for debugging
      console.log("All available voices:", voices.map(v => v.name).join(', '));

      // Try multiple voice options in order of preference
      let selectedVoice = null;

      // 1. Try Google voices first
      const googleVoices = voices.filter(voice => voice.name.includes('Google'));
      if (googleVoices.length > 0) {
        // Prefer English Google voices
        const englishGoogleVoice = googleVoices.find(voice =>
          voice.lang.startsWith('en') ||
          voice.name.includes('English')
        );
        selectedVoice = englishGoogleVoice || googleVoices[0];
        console.log("Using Google voice:", selectedVoice.name);
      }
      // 2. Try any English voice
      else {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (englishVoices.length > 0) {
          selectedVoice = englishVoices[0];
          console.log("Using English voice:", selectedVoice.name);
        }
        // 3. Fall back to default voice
        else if (voices.length > 0) {
          selectedVoice = voices.find(voice => voice.default) || voices[0];
          console.log("Using default voice:", selectedVoice.name);
        }
      }

      // Try to use a Google voice if available
      if (selectedVoice && selectedVoice.name.includes('Google')) {
        // Use the selected Google voice
        utterance.voice = selectedVoice;
        console.log("Using selected Google voice:", selectedVoice.name);
      } else {
        // Try to find any Google voice
        const voices = window.speechSynthesis.getVoices();
        const googleVoices = voices.filter(voice => voice.name.includes('Google'));

        if (googleVoices.length > 0) {
          // Prefer English Google voice
          const englishGoogleVoice = googleVoices.find(voice =>
            voice.lang.startsWith('en') ||
            voice.name.includes('English')
          );

          const bestVoice = englishGoogleVoice || googleVoices[0];
          utterance.voice = bestVoice;
          console.log("Using Google voice:", bestVoice.name);

          // Update the selected voice for future use
          if (selectedVoice === null || !selectedVoice.name.includes('Google')) {
            setSelectedVoice(bestVoice);
          }
        } else if (selectedVoice) {
          // Fall back to selected voice if no Google voices
          utterance.voice = selectedVoice;
          console.log("No Google voices available, using selected voice:", selectedVoice.name);
        } else {
          console.log("No Google or selected voice available, using default voice");
        }
      }

      // Use customized voice settings
      utterance.volume = voiceVolume;
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      console.log("Voice settings:", {
        voice: utterance.voice ? utterance.voice.name : "Default",
        volume: utterance.volume,
        rate: utterance.rate,
        pitch: utterance.pitch
      });

      // Add event handlers for better error handling
      utterance.onstart = () => {
        console.log("Speech started successfully");
        setError("");
      };

      utterance.onend = () => {
        console.log("Speech ended successfully");
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);

        // Provide more specific error messages
        if (e.error === 'not-allowed') {
          setError("Speech synthesis permission denied. Check browser settings.");
        } else if (e.error === 'interrupted' || e.error === 'canceled') {
          console.log("Speech was interrupted or canceled - this is normal");
        } else {
          setError("Speech synthesis error. Try a different browser like Chrome.");
        }

        setTimeout(() => setError(''), 3000);
      };

      // Speak the response
      window.speechSynthesis.speak(utterance);

      // Set a timeout to check if speech actually started
      setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          console.log("Speech is in progress");
        } else {
          console.warn("Speech may not have started properly");
          // Try one more time with default settings
          try {
            const fallbackUtterance = new SpeechSynthesisUtterance(truncatedText.substring(0, 100));
            window.speechSynthesis.speak(fallbackUtterance);
          } catch (e) {
            console.error("Fallback speech attempt failed:", e);
          }
        }
      }, 500);

    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setError("Speech synthesis error. Try using Chrome or Edge browser.");
      setTimeout(() => setError(''), 3000);
    }
  }, [voicePitch, voiceRate, voiceVolume]);

  // Function to speak text using Cartesia API
  const speakTextWithCartesia = useCallback(async (text) => {
    if (!text || text.trim() === '') {
      console.warn("No text to speak");
      return;
    }

    try {
      console.log("Attempting to speak response using Cartesia API...");
      setError("Generating audio response...");

      // Clean up the text for better speech synthesis
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Replace markdown links with just the text
        .replace(/```[\s\S]*?```/g, 'Code example omitted.') // Replace code blocks
        .replace(/`(.*?)`/g, '$1')       // Remove inline code formatting
        .replace(/\n\n/g, '. ')          // Replace double newlines with period and space
        .replace(/\n/g, ' ')             // Replace single newlines with space
        .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
        .replace(/https?:\/\/\S+/g, 'URL omitted.'); // Replace URLs

      // Limit text length to avoid errors
      const maxLength = 2000; // Cartesia can handle longer text
      const truncatedText = cleanText.length > maxLength ?
        cleanText.substring(0, maxLength) + "... (text truncated for speech)" :
        cleanText;

      // Create request data
      const requestData = {
        text: truncatedText,
        voiceId: 'bf0a246a-8642-498a-9950-80c35e9276b5' // Default voice ID
      };

      // Send request to our server endpoint
      const response = await fetch('http://localhost:3030/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error || response.status}`);
      }

      // Get the audio blob from the response
      const audioBlob = await response.blob();

      // Create an audio element to play the response
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Set up event handlers
      audio.onplay = () => {
        console.log("Audio playback started");
        setError("");
      };

      audio.onended = () => {
        console.log("Audio playback ended");
        // Clean up the URL object
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setError("Error playing audio response. Please try again.");
        URL.revokeObjectURL(audioUrl);
        setTimeout(() => setError(''), 3000);
      };

      // Play the audio
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        setError("Error playing audio. Please try again or check your audio settings.");
        setTimeout(() => setError(''), 3000);
      });

    } catch (error) {
      console.error("Error in Cartesia text-to-speech:", error);
      setError(`Text-to-speech error: ${error.message}`);
      setTimeout(() => setError(''), 3000);

      // Fall back to browser's speech synthesis
      fallbackToWebSpeech(text);
    }
  }, [fallbackToWebSpeech]);

  // Main speak function that tries Cartesia first, then falls back to Web Speech API
  const speakText = useCallback((text) => {
    speakTextWithCartesia(text).catch(error => {
      console.error("Error with Cartesia TTS, falling back to Web Speech API:", error);
      fallbackToWebSpeech(text);
    });
  }, [speakTextWithCartesia, fallbackToWebSpeech]);

  // Process text function - using useCallback to memoize
  const processText = useCallback(async (text) => {
    try {
      setIsProcessing(true);

      // Create data for API request in a simpler format
      const requestData = {
        text: text
      };

      console.log('Sending request to server:', requestData);

      // First try the test endpoint to see if the server is working
      try {
        const testResponse = await fetch('http://localhost:3030/test');
        console.log('Test endpoint response:', await testResponse.json());
      } catch (testError) {
        console.error('Test endpoint error:', testError);
      }

      // Send to server for processing using the text endpoint
      const response = await fetch('http://localhost:3030/gemini-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from server:', data);

      // Extract response text based on the Gemini API response format
      let resultText = '';

      // Handle the specific Gemini API response format
      if (data && data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          resultText = candidate.content.parts[0].text || '';
          // Clean up the response (remove quotes if present)
          resultText = resultText.replace(/^"|"$/g, '').trim();
        }
      } else if (data && data.text) {
        // Direct text response
        resultText = data.text;
      } else if (data && data.parts && data.parts.length > 0) {
        // Response with parts structure
        resultText = data.parts[0].text || 'No content in response';
      } else {
        // Fallback for unexpected response format
        resultText = 'Could not parse response from server';
        console.error('Unexpected response format:', data);
      }

      setResponse(resultText);

      // Show the response as text and provide speech option
      console.log("Showing response with speech option");

      // Briefly show a message about the speech option
      setError("Click 'Speak Response' to hear the response (works best in Chrome)");
      setTimeout(() => setError(''), 3000);

    } catch (err) {
      console.error('Error processing audio:', err);

      // Provide more helpful error messages based on the error type
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else if (err.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection.');
      } else if (err.message.includes('CORS')) {
        setError('CORS error. The server may not be configured to accept requests from this origin.');
      } else {
        setError(`Error processing audio: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop recording function - using useCallback to memoize
  const stopRecording = useCallback(() => {
    // Reset silence detection state
    silenceStartTime.current = null;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognitionRef.current) {
      try {
        // Add a flag to indicate we're intentionally stopping
        speechRecognitionRef.current.isIntentionalStop = true;
        speechRecognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsRecording(false);
    setIsSilent(false);
    setBubbles([]);

    // Automatically process the transcript if it exists
    if (transcript && transcript.trim() !== '') {
      console.log('Processing transcript on stop:', transcript);
      // Use a small timeout to ensure the final transcript is captured
      setTimeout(() => {
        processText(transcript);
      }, 300);
    }
  }, [transcript, processText]); // Add transcript and processText as dependencies

  // Initialize speech recognition and voice synthesis
  useEffect(() => {
    // Generate initial particles
    generateParticles();

    // Initialize Web Speech API for recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;

      speechRecognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
        console.log('Speech recognition result:', transcript);
      };

      // Add onend handler to ensure we capture the final transcript
      speechRecognitionRef.current.onend = () => {
        console.log('Speech recognition ended');

        // If this wasn't an intentional stop and we're still recording, try to restart
        if (isRecording && speechRecognitionRef.current && !speechRecognitionRef.current.isIntentionalStop) {
          console.log('Speech recognition ended unexpectedly, attempting to restart');
          try {
            speechRecognitionRef.current.start();
            console.log('Successfully restarted speech recognition');
          } catch (err) {
            console.error('Failed to restart speech recognition:', err);
            setError('Speech recognition stopped unexpectedly. Please try again.');
            setIsRecording(false);
          }
        }

        // Reset the intentional stop flag
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.isIntentionalStop = false;
        }
      };

      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        // Handle different error types more gracefully
        if (event.error === 'aborted') {
          // This is a normal abort when stopping recording, don't show as error
          console.log('Speech recognition was aborted - this is normal when stopping');
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'network') {
          setError('Network error occurred. Please check your internet connection.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }

        // Don't call stopRecording for aborted errors to avoid infinite loops
        if (event.error !== 'aborted') {
          stopRecording();
        }
      };
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    // Initialize speech synthesis and load voices
    if ('speechSynthesis' in window) {
      // Pre-load voices with a silent utterance
      try {
        console.log("Pre-loading voices on component mount...");
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Error pre-loading voices:", e);
      }

      // Function to load and update available voices
      const loadAndUpdateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices loaded:", voices.length);

        if (voices.length === 0) {
          console.warn("No voices available yet. This might cause speech synthesis to fail.");

          // Try to force voices to load by creating a silent utterance
          try {
            const silentUtterance = new SpeechSynthesisUtterance('');
            silentUtterance.volume = 0;
            window.speechSynthesis.speak(silentUtterance);
            window.speechSynthesis.cancel();

            // Check again after forcing
            const forcedVoices = window.speechSynthesis.getVoices();
            console.log("After forcing, voices available:", forcedVoices.length);

            if (forcedVoices.length > 0) {
              // Update all available voices
              setAvailableVoices(forcedVoices);

              // Set a default selected voice if none is selected
              if (!selectedVoice) {
                // Try to find a Google voice first
                const googleVoice = forcedVoices.find(voice => voice.name.includes('Google'));

                // If no Google voice, try to find an English voice
                const englishVoice = !googleVoice ?
                  forcedVoices.find(voice => voice.lang.startsWith('en')) :
                  null;

                // Set the best voice we can find
                const bestVoice = googleVoice || englishVoice || forcedVoices[0];

                if (bestVoice) {
                  console.log("Setting default voice:", bestVoice.name);
                  setSelectedVoice(bestVoice);
                }
              }
            }
          } catch (e) {
            console.error("Error forcing voices to load:", e);
          }
        } else {
          // Update all available voices
          setAvailableVoices(voices);

          // Set a default selected voice if none is selected
          if (!selectedVoice) {
            // Try to find a Google voice first
            const googleVoice = voices.find(voice => voice.name.includes('Google'));

            // If no Google voice, try to find an English voice
            const englishVoice = !googleVoice ?
              voices.find(voice => voice.lang.startsWith('en')) :
              null;

            // Set the best voice we can find
            const bestVoice = googleVoice || englishVoice || voices[0];

            if (bestVoice) {
              console.log("Setting default voice:", bestVoice.name);
              setSelectedVoice(bestVoice);
            }
          }

          // Log all available voices for debugging
          console.log("All voices:", voices.map(v => `${v.name} (${v.lang})`).join(', '));

          // Log Google voices specifically
          const googleVoices = voices.filter(voice => voice.name.includes('Google'));
          console.log("Google voices available:", googleVoices.length);

          if (googleVoices.length > 0) {
            console.log("Google voices found:");
            googleVoices.forEach(voice => {
              console.log(`- ${voice.name} (${voice.lang})`);
            });

            // If we have Google voices, make sure we're using one
            if (selectedVoice && !selectedVoice.name.includes('Google')) {
              const bestGoogleVoice = googleVoices.find(v => v.lang.startsWith('en')) || googleVoices[0];
              console.log("Switching to Google voice:", bestGoogleVoice.name);
              setSelectedVoice(bestGoogleVoice);
            }
          } else {
            console.warn("No Google voices found. Will use browser default voices.");

            // Log English voices as fallback
            const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
            if (englishVoices.length > 0) {
              console.log("English voices available as fallback:", englishVoices.length);
              englishVoices.forEach(voice => {
                console.log(`- ${voice.name} (${voice.lang})`);
              });
            }
          }
        }
      };

      // Load voices immediately if available
      loadAndUpdateVoices();

      // Chrome loads voices asynchronously, so we need this event
      window.speechSynthesis.onvoiceschanged = loadAndUpdateVoices;

      // Try multiple times with increasing delays to ensure voices are loaded
      setTimeout(loadAndUpdateVoices, 500);
      setTimeout(loadAndUpdateVoices, 1000);
      setTimeout(loadAndUpdateVoices, 2000);

      // Force voice loading by speaking a silent utterance
      try {
        console.log("Forcing voice loading on component mount...");
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);

        // Cancel after a short delay
        setTimeout(() => {
          window.speechSynthesis.cancel();
          console.log("Forced voice loading complete");

          // Check if voices are available after forcing
          const forcedVoices = window.speechSynthesis.getVoices();
          console.log("Voices after forcing:", forcedVoices.length);

          if (forcedVoices.length > 0) {
            setAvailableVoices(forcedVoices);
          }
        }, 100);
      } catch (e) {
        console.error("Error forcing voice loading:", e);
      }
    } else {
      console.warn("Speech synthesis not supported in this browser");
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      if (speechRecognitionRef.current) {
        try {
          // Set the intentional stop flag to prevent error messages
          speechRecognitionRef.current.isIntentionalStop = true;

          // Try to stop gracefully first
          speechRecognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition during cleanup:', err);
        }

        try {
          // Then abort as a fallback
          speechRecognitionRef.current.abort();
        } catch (err) {
          console.error('Error aborting speech recognition during cleanup:', err);
        }

        // Clear the reference
        speechRecognitionRef.current = null;
      }

      // Cancel any ongoing speech synthesis
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          console.error('Error canceling speech synthesis during cleanup:', err);
        }
      }
    };
  }, [stopRecording, isRecording, selectedVoice]); // Added dependencies to fix ESLint warnings

  // Start recording function
  const startRecording = async () => {
    try {
      // Reset all states
      setError('');
      setTranscript('');
      setResponse('');
      // Audio blob handling removed as requested
      setIsSilent(false);
      silenceStartTime.current = null;
      audioChunksRef.current = [];

      // Speech synthesis test removed as requested

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio context for visualization
      try {
        // Always create a new AudioContext to avoid "context is closed" warnings
        // Close the old one first if it exists
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (err) {
            console.warn('Error closing previous AudioContext:', err);
          }
        }

        // Create a new AudioContext with browser compatibility
        try {
          // Try standard AudioContext first
          audioContextRef.current = new window.AudioContext();
        } catch (e) {
          // Fall back to webkit prefix for older browsers
          try {
            // @ts-ignore
            audioContextRef.current = new window['webkitAudioContext']();
          } catch (e2) {
            throw new Error('AudioContext not supported in this browser');
          }
        }
        console.log('Created new AudioContext, state:', audioContextRef.current.state);

        // Create analyzer for audio visualization
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
      } catch (err) {
        console.error('Error setting up audio context:', err);
        setError(`Audio processing error: ${err.message}`);
      }

      // Start audio visualization
      visualizeAudio();

      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Collect audio chunks
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        // Create blob from audio chunks
        // const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Audio blob handling removed as requested

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());

        // Process the recorded audio
        if (audioChunksRef.current.length > 0 && transcript) {
          // Send the transcript text to the server for processing instead of the audio
          processText(transcript);
        }
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      }

      // Generate random bubbles for animation
      generateBubbles();

    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Error starting recording: ${err.message}`);
    }
  };







  // Audio visualization function
  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const normalizedLevel = avg / 256; // Normalize to 0-1

      setAudioLevel(normalizedLevel);

      // Simple silence detection
      if (normalizedLevel < SILENCE_THRESHOLD) {
        // Silence detected
        if (!isSilent) {
          // Just started silence - mark the time
          setIsSilent(true);
          silenceStartTime.current = Date.now();
        } else if (silenceStartTime.current) {
          // Check if we've been silent long enough
          const silenceDuration = Date.now() - silenceStartTime.current;

          if (silenceDuration >= SILENCE_DURATION) {
            console.log('Silence detected - stopping recording');
            // Stop recording and process the audio
            stopRecording();
            return;
          }
        }
      } else {
        // Speech detected - reset silence detection
        if (isSilent) {
          setIsSilent(false);
          silenceStartTime.current = null;
        }
      }

      // Update bubble positions based on audio level - we'll let framer-motion handle the animations now
      setBubbles(prevBubbles =>
        prevBubbles.filter(bubble => bubble.y > -100) // Just remove bubbles that have gone too far up
      );

      // Add new bubbles occasionally based on audio level - less frequently
      if (Math.random() < normalizedLevel * 0.1) { // Reduced probability
        addBubble();
      }

      // Animate particles based on audio level during recording - more subtle
      if (isRecording) {
        setParticles(prevParticles =>
          prevParticles.map(particle => {
            // Calculate distance from center
            const dx = particle.x - 50;
            const dy = particle.y - 50;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

            // Particles closer to center move more with audio - but with reduced movement
            const moveFactor = Math.max(0, 1 - (distanceFromCenter / 60)) * normalizedLevel * 5; // Reduced movement factor

            // More consistent movement direction - less random
            // Use particle's position to determine angle for more coherent movement
            const baseAngle = Math.atan2(dy, dx);
            // Add slight randomness but maintain general direction
            const angle = baseAngle + (Math.random() * 0.5 - 0.25) * Math.PI;

            const moveX = Math.cos(angle) * moveFactor;
            const moveY = Math.sin(angle) * moveFactor;

            return {
              ...particle,
              x: particle.x + moveX,
              y: particle.y + moveY,
            };
          })
        );
      }

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  // Generate initial bubbles - simplified
  const generateBubbles = () => {
    // No longer generating decorative bubbles
    setBubbles([]);
  };

  // Simplified bubble functions
  const addBubble = () => {
    // No longer adding decorative bubbles
  };

  // No longer need the createBubble function
  // const createBubble = () => {
  //   return {
  //     id: Math.random().toString(36).substring(2, 9),
  //     x: 50,
  //     y: 50,
  //     scale: 0.5,
  //     opacity: 0.2,
  //   };
  // };

  // Helper function to get brand name for a voice
  const getBrandName = (voice) => {
    if (!voice) return 'No Voice Selected';

    // Simply return the voice name - no rebranding needed
    return voice.name;
  };

  // Helper function to check if a voice is a Google voice
  const isTolerableVoice = (voice) => {
    // Filter for Google voices
    return voice && voice.name && voice.name.includes('Google');
  };

  // First filter to only keep Tolerable-branded voices
  const tolerableVoices = availableVoices.filter(voice => isTolerableVoice(voice));

  // Then filter based on search term
  const filteredVoices = tolerableVoices.filter(voice => {
    const brandName = getBrandName(voice);
    return brandName.toLowerCase().includes(voiceFilter.toLowerCase()) ||
           voice.lang.toLowerCase().includes(voiceFilter.toLowerCase());
  });

  // Test selected voice with current customization settings
  const testVoice = () => {
    try {
      // Set testing state to true
      setIsTesting(true);
      console.log("Starting voice test...");

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Force a refresh of the speech synthesis engine
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn("Could not resume speech synthesis:", e);
      }

      // Get all available voices
      const allVoices = window.speechSynthesis.getVoices();
      console.log("Available voices for testing:", allVoices.length);

      // Filter for Google voices
      const googleVoices = allVoices.filter(voice => voice.name.includes('Google'));
      console.log("Google voices for testing:", googleVoices.length);

      // Determine which voice to use for testing
      let voiceToUse = null;

      if (selectedVoice && selectedVoice.name.includes('Google')) {
        // Use the selected Google voice
        voiceToUse = selectedVoice;
        console.log("Using selected Google voice for test:", selectedVoice.name);
      } else if (googleVoices.length > 0) {
        // Use the first Google voice
        voiceToUse = googleVoices[0];
        console.log("Using Google voice for test:", voiceToUse.name);

        // Update the selected voice for future use
        setSelectedVoice(voiceToUse);
      } else if (selectedVoice) {
        // Fall back to selected voice if no Google voices
        voiceToUse = selectedVoice;
        console.log("No Google voices available, using selected voice:", selectedVoice.name);
      } else if (allVoices.length > 0) {
        // Fall back to first available voice
        voiceToUse = allVoices[0];
        console.log("No Google or selected voice available, using first available voice:", voiceToUse.name);

        // Update the selected voice for future use
        setSelectedVoice(voiceToUse);
      } else {
        console.warn("No voices available for testing");
      }

      // Create a simple test utterance
      const utterance = new SpeechSynthesisUtterance("This is a test of the selected voice.");

      // Set voice and parameters
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      utterance.volume = voiceVolume;
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      // If a voice is selected in the UI, use it
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("Testing with selected voice:", selectedVoice.name);
      } else {
        // Otherwise try to find a Google voice
        const voices = window.speechSynthesis.getVoices();
        const googleVoice = voices.find(voice => voice.name.includes('Google'));

        if (googleVoice) {
          utterance.voice = googleVoice;
          console.log("No voice selected, using Google voice:", googleVoice.name);
        } else if (voices.length > 0) {
          utterance.voice = voices[0];
          console.log("No Google voice found, using:", voices[0].name);
        } else {
          console.warn("No voices available for testing");
        }
      }

      // Log test settings
      console.log("Test settings:", {
        voice: utterance.voice ? utterance.voice.name : "Default",
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume
      });

      // Add event handlers
      utterance.onstart = () => {
        console.log("Test speech started");
        setError("Voice test in progress...");
      };

      utterance.onend = () => {
        console.log("Test speech ended");
        setIsTesting(false);
        setError("Voice test completed successfully!");
        setTimeout(() => setError(''), 3000);
      };

      utterance.onerror = (e) => {
        console.error("Test speech error:", e);
        setIsTesting(false);
        setError(`Voice test failed: ${e.error || 'Unknown error'}. Try using Chrome browser.`);
        setTimeout(() => setError(''), 3000);
      };

      // Set a timeout to reset the testing state if the events don't fire
      setTimeout(() => {
        if (isTesting) {
          console.log("Resetting testing state after timeout");
          setIsTesting(false);
        }
      }, 5000);

      // Speak the test utterance
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Error in test voice function:", error);
      setIsTesting(false);
      setError("There was an error testing the voice. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="relative w-full">
      {/* Main interface - Styled to match Education component */}
      <div className="w-full bg-white overflow-hidden transition-all duration-300 border-0 border-b border-gray-100">
        {/* Visualization area - Styled to match Education component */}
        <div
          ref={visualizationAreaRef}
          className="relative w-full h-64 bg-white overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            // Reset particles to original positions when mouse leaves
            setParticles(prevParticles =>
              prevParticles.map(particle => ({
                ...particle,
                x: particle.originalX,
                y: particle.originalY,
              }))
            );
          }}
        >
          {/* Simple grid of dots */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: isRecording ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, background-color 0.3s ease',
                transform: `translate(-50%, -50%)`,
              }}
            />
          ))}

          {/* Simple audio level indicator */}
          {isRecording && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-black/10">
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5"
                style={{
                  width: `${Math.max(20, audioLevel * 100)}px`,
                  height: `${Math.max(20, audioLevel * 100)}px`,
                  transition: 'width 0.2s ease, height 0.2s ease'
                }}
              />
            </div>
          )}

          {/* Simple microphone button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative pointer-events-auto">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-14 h-14 flex flex-col items-center justify-center transition-colors duration-200 rounded-full ${
                  isRecording
                    ? 'bg-white text-red-500 border border-red-100'
                    : 'bg-white text-black border border-gray-100'
                }`}
                title={isRecording ? "Stop recording and process" : "Start recording"}
              >
                {isRecording ? (
                  <>
                    <Mic className="w-6 h-6" />
                    <span className="text-[8px] mt-1">Stop</span>
                  </>
                ) : isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Mic className="w-6 h-6" />
                    <span className="text-[8px] mt-1">Start</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simple audio level indicator */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
              <div
                className="h-0.5 bg-black/10"
                style={{
                  width: `${audioLevel * 100}%`,
                  transition: 'width 0.2s ease-out'
                }}
              />
              {isSilent && silenceStartTime.current && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="text-xs text-gray-400">
                    Pause
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings button removed as requested */}
        </div>

        {/* Transcript area - Styled to match Education component */}
        <div className="p-4">
          {transcript && (
            <div className="mb-3">
              <p className="text-sm text-black">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="mb-3">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {response}
                </ReactMarkdown>

                {/* Replay button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => speakText(response)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Speak response
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded">
              <div className="text-red-500 text-xs mb-2">
                {error}
              </div>
              <button
                onClick={() => {
                  setError('');
                  startRecording();
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}

          {!transcript && !response && !error && !isProcessing && (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Click to start</p>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-4 text-gray-400">
              <div className="flex flex-col items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin mb-2" />
                <p className="text-xs">Processing your request...</p>
              </div>
            </div>
          )}

          {/* Speaking status removed as requested */}

          {/* Response spacing */}
          {response && (
            <div className="text-center py-2">
              <div className="text-xs text-gray-400">
                Powered by Google AI
              </div>
            </div>
          )}

          {/* Action buttons - Matching Education component */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
              onClick={() => {
                // Reset functionality
                setTranscript('');
                setResponse('');
                setError('');
              }}
            >
              Reset
            </button>

            <button
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
              onClick={() => {
                // Force load voices and test speech
                try {
                  setError("Loading voices...");

                  // Cancel any ongoing speech
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }

                  // Force the browser to load voices
                  const voices = window.speechSynthesis.getVoices();
                  console.log("Initial voices:", voices.length);

                  // Create and speak an empty utterance to trigger voice loading
                  const emptyUtterance = new SpeechSynthesisUtterance('');
                  window.speechSynthesis.speak(emptyUtterance);
                  window.speechSynthesis.cancel();

                  // Try again after forcing
                  setTimeout(() => {
                    const loadedVoices = window.speechSynthesis.getVoices();
                    console.log("Loaded voices:", loadedVoices.length);

                    // Log all available voices
                    if (loadedVoices.length > 0) {
                      console.log("Available voices:");
                      loadedVoices.forEach(voice => {
                        console.log(`- ${voice.name} (${voice.lang})`);
                      });

                      // Find Google voices
                      const googleVoices = loadedVoices.filter(voice => voice.name.includes('Google'));

                      if (googleVoices.length > 0) {
                        setError(`Found ${googleVoices.length} Google voices. Testing speech...`);

                        // Test with a short phrase
                        const testUtterance = new SpeechSynthesisUtterance("Voice test successful");
                        testUtterance.voice = googleVoices[0];
                        testUtterance.onend = () => {
                          setError("Voice loaded and tested successfully!");
                          setTimeout(() => setError(''), 3000);
                        };
                        testUtterance.onerror = (e) => {
                          setError(`Speech test failed: ${e.error}. Try using Chrome.`);
                          setTimeout(() => setError(''), 5000);
                        };

                        window.speechSynthesis.speak(testUtterance);
                      } else {
                        setError(`Loaded ${loadedVoices.length} voices, but no Google voices found. Testing default voice...`);

                        // Test with default voice
                        const testUtterance = new SpeechSynthesisUtterance("Voice test with default voice");
                        testUtterance.onend = () => {
                          setError("Default voice loaded and tested successfully!");
                          setTimeout(() => setError(''), 3000);
                        };
                        testUtterance.onerror = (e) => {
                          setError(`Speech test failed: ${e.error}. Try using Chrome.`);
                          setTimeout(() => setError(''), 5000);
                        };

                        window.speechSynthesis.speak(testUtterance);
                      }
                    } else {
                      setError("No voices could be loaded. Try using Chrome browser.");
                      setTimeout(() => setError(''), 5000);
                    }
                  }, 500);

                } catch (error) {
                  console.error("Error loading voices:", error);
                  setError(`Error loading voices: ${error.message}`);
                  setTimeout(() => setError(''), 3000);
                }
              }}
            >
              Load Voices
            </button>

            <button
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={12} />
              <span>Voice Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice settings panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-medium">Voice Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Voice search */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Search Voices</label>
                <input
                  type="text"
                  value={voiceFilter}
                  onChange={(e) => setVoiceFilter(e.target.value)}
                  placeholder="Search by name or language..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Voice list */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Available Voices</label>
                <div className="border border-gray-200 rounded h-40 overflow-y-auto">
                  {filteredVoices.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {filteredVoices.map((voice) => (
                        <li key={voice.name} className="px-3 py-2 hover:bg-gray-50">
                          <button
                            onClick={() => setSelectedVoice(voice)}
                            className={`w-full text-left text-xs ${
                              selectedVoice && selectedVoice.name === voice.name
                                ? 'font-medium text-black'
                                : 'text-gray-600'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{getBrandName(voice)}</span>
                              <span className="text-gray-400 text-[10px]">{voice.lang}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">
                        {availableVoices.length === 0
                          ? 'No voices available. Try using Chrome browser.'
                          : 'No voices match your search.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected voice */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Selected Voice</label>
                <div className="px-3 py-2 border border-gray-200 rounded text-xs">
                  {selectedVoice ? (
                    <div className="flex justify-between items-center">
                      <span>{getBrandName(selectedVoice)}</span>
                      <span className="text-gray-400 text-[10px]">{selectedVoice.lang}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No voice selected</span>
                  )}
                </div>
              </div>

              {/* Voice customization */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs text-gray-500">Pitch</label>
                    <span className="text-[10px] text-gray-400">{voicePitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs text-gray-500">Rate</label>
                    <span className="text-[10px] text-gray-400">{voiceRate.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs text-gray-500">Volume</label>
                    <span className="text-[10px] text-gray-400">{voiceVolume.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceVolume}
                    onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={resetVoiceCustomization}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Reset Settings
                </button>

                <button
                  onClick={testVoice}
                  disabled={isTesting}
                  className="px-3 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? 'Testing...' : 'Test Voice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
