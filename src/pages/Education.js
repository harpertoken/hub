/**
 * Component
 *
 * This component provides an interface powered by Google's Gemini 1.5 Flash AI model.
 * It allows users to ask questions, get AI-generated responses, and interact with content
 * through various features like voice search, screen recording, and more.
 *
 * Features:
 * - Text-based Q&A with Gemini 1.5 Flash
 * - Voice search and dictation
 * - Screen recording with optional audio
 * - Topic suggestions and history
 * - Bookmarking favorite topics
 * - Markdown rendering with math support
 * - Code syntax highlighting
 * - Fullscreen mode
 * - GitHub repository analysis
 */

import React, { useState, useRef, useEffect } from 'react';

import EduResponseModal from '../components/ui/EduResponseModal';
import {
  RefreshCw,  // Reset icon
  ArrowUp,    // Scroll to top icon
  TrendingUp, // Trending topics icon
  Bookmark,   // Save topic icon

  Video,      // Screen recording icon
  StopCircle, // Stop recording icon
  Download,   // Download icon
  Mic,        // Microphone on icon
  MicOff,     // Microphone off icon
  Github,     // GitHub icon
  Code        // Code icon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';       // Markdown renderer
import remarkMath from 'remark-math';             // Math notation support
import rehypeKatex from 'rehype-katex';           // KaTeX rendering for math
import remarkGfm from 'remark-gfm';               // GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';               // Raw HTML support
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';  // Code highlighting
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';    // Light theme for code
import 'katex/dist/katex.min.css';                // KaTeX styles

// Import API_URL from config to ensure consistent usage
import { API_URL } from '../lib/config';


/**
 * Education component for AI-powered learning
 * @returns {JSX.Element} The Education component
 */
const Education = () => {
  // User input and AI response states
  /** @type {[string, Function]} User's question or prompt */
  const [prompt, setPrompt] = useState('');
  /** @type {[string, Function]} AI-generated response */
  const [response, setResponse] = useState('');
  /** @type {[boolean, Function]} Loading state during API calls */
  const [loading, setLoading] = useState(false);
  /** @type {[string, Function]} Error message if something goes wrong */
  const [error, setError] = useState('');
  /** @type {[boolean, Function]} Whether to show the response modal */
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Topic suggestion states
  /** @type {[Array, Function]} List of suggested topics */
  const [topicSuggestions, setTopicSuggestions] = useState([]);
  /** @type {[string, Function]} Currently active suggestion category */
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState('trending');
  /** @type {[Array, Function]} User's search history */
  const [searchHistory, setSearchHistory] = useState([]);
  /** @type {[Array, Function]} User's saved/bookmarked topics */
  const [savedTopics, setSavedTopics] = useState([]);
  /** @type {[boolean, Function]} Whether to show the inspirational modal */
  const [showInspirationalModal, setShowInspirationalModal] = useState(false);

  // Voice search states
  /** @type {[boolean, Function]} Whether voice recognition is active */
  const [isListening, setIsListening] = useState(false);
  /** @type {[string, Function]} Transcribed speech from voice recognition */
  const [transcript, setTranscript] = useState('');

  // UI states
  /** @type {[boolean, Function]} Whether response is in fullscreen mode */
  const [isFullscreen, setIsFullscreen] = useState(false);
  /** @type {[Array, Function]} Suggested prompts based on user input */
  const [promptSuggestions, setPromptSuggestions] = useState([]);
  /** @type {[boolean, Function]} Whether to show prompt suggestions */
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);
  /** @type {[number, Function]} Currently selected suggestion index for keyboard navigation */
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Screen recording states
  /** @type {[boolean, Function]} Whether screen recording is active */
  const [isRecording, setIsRecording] = useState(false);
  /** @type {[number, Function]} Duration of current recording in seconds */
  const [recordingTime, setRecordingTime] = useState(0);
  /** @type {[string, Function]} URL of recorded video */
  const [recordedVideo, setRecordedVideo] = useState(null);
  /** @type {[Blob, Function]} Blob of recorded video data */
  const [recordedBlob, setRecordedBlob] = useState(null);
  /** @type {[boolean, Function]} Whether to show microphone prompt */
  const [showMicPrompt, setShowMicPrompt] = useState(false);
  /** @type {[boolean, Function]} Whether to show export options */
  const [showExportOptions, setShowExportOptions] = useState(false);
  /** @type {[boolean, Function]} Whether video is being exported */
  const [isExporting, setIsExporting] = useState(false);
  /** @type {[string, Function]} Shareable link for recorded video */
  const [shareableLink, setShareableLink] = useState(null);

  // GitHub analysis states
  /** @type {[boolean, Function]} Whether to show GitHub modal */
  const [showGithubModal, setShowGithubModal] = useState(false);
  /** @type {[string, Function]} GitHub repository URL to analyze */
  const [githubRepo, setGithubRepo] = useState('');
  /** @type {[string, Function]} GitHub user profile URL to analyze */
  const [githubUser, setGithubUser] = useState('');
  /** @type {[string, Function]} AI analysis of GitHub repository or user */
  const [githubAnalysis, setGithubAnalysis] = useState('');
  /** @type {[boolean, Function]} Whether GitHub repo/user is being analyzed */
  /** @type {[string, Function]} Active tab in GitHub modal (repository or user) */
  const [activeGithubTab, setActiveGithubTab] = useState('repository');
  const [isAnalyzingRepo, setIsAnalyzingRepo] = useState(false);
  const [isAnalyzingUser, setIsAnalyzingUser] = useState(false);



  // Search states
  /** @type {[boolean, Function]} Whether to enable web search for education queries */
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  /** @type {[boolean, Function]} Whether to enable academic search for education queries */
  const [enableAcademicSearch, setEnableAcademicSearch] = useState(false);
  /** @type {[boolean, Function]} Whether to enable prompt suggestions */
  const [enablePromptSuggestions, setEnablePromptSuggestions] = useState(true);
  /** @type {[Object, Function]} Metadata about search results */
  const [webSearchMetadata, setWebSearchMetadata] = useState(null);

  // Refs for DOM elements and objects
  /** @type {React.RefObject} Reference to response container for scrolling */
  const responseContainerRef = useRef(null);
  /** @type {React.RefObject} Reference to speech recognition object */
  const recognitionRef = useRef(null);
  /** @type {React.RefObject} Reference to suggestions container */
  const suggestionsRef = useRef(null);
  /** @type {React.RefObject} Reference to suggestion timeout */
  const suggestionTimeoutRef = useRef(null);
  /** @type {React.RefObject} Reference to MediaRecorder object */
  const mediaRecorderRef = useRef(null);
  /** @type {React.RefObject} Reference to recorded video chunks */
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Default topic suggestions by category
  const defaultSuggestions = {
    trending: [
      { id: 1, text: "Explain quantum computing", label: "Quantum computing" },
      { id: 2, text: "How does photosynthesis work?", label: "Photosynthesis" },
      { id: 3, text: "Explain the significance of the Sermon on the Mount in the Bible", label: "Sermon on the Mount" },
      { id: 4, text: "Help me understand calculus derivatives", label: "Calculus derivatives" }
    ],
    science: [
      { id: 5, text: "What is CRISPR gene editing?", label: "CRISPR" },
      { id: 6, text: "Explain black holes and event horizons", label: "Black holes" },
      { id: 7, text: "How do vaccines work?", label: "Vaccines" },
      { id: 8, text: "What is the theory of relativity?", label: "Relativity" }
    ],
    history: [
      { id: 9, text: "Explain the historical context of the Exodus in the Bible", label: "Biblical Exodus" },
      { id: 10, text: "What was the Renaissance?", label: "Renaissance" },
      { id: 11, text: "How did ancient civilizations develop mathematics?", label: "Ancient math" },
      { id: 12, text: "What was the Silk Road?", label: "Silk Road" }
    ],
    technology: [
      { id: 13, text: "How does blockchain technology work?", label: "Blockchain" },
      { id: 14, text: "Explain machine learning algorithms", label: "Machine learning" },
      { id: 15, text: "What is cloud computing?", label: "Cloud computing" },
      { id: 16, text: "How do neural networks function?", label: "Neural networks" }
    ]
  };

  /**
   * Handles form submission to send the user's prompt to the Gemini API
   *
   * This function:
   * 1. Validates the prompt
   * 2. Updates search history
   * 3. Makes an API call to the backend server
   * 4. Processes the response
   * 5. Handles errors gracefully
   *
   * @param {Event} e - The form submit event (optional)
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission if event is provided
    if (e) e.preventDefault();

    // Validate prompt is not empty
    if (!prompt.trim()) {
      return;
    }

    // Prevent multiple submissions while loading
    if (loading) {
      return;
    }

    // Close prompt suggestions
    setShowPromptSuggestions(false);

    // Update search history with current prompt
    updateSearchHistory(prompt);

    // Set loading state and clear previous response/errors
    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Make API call to backend server which will use Gemini
      const response = await fetch(`${API_URL}/education-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          enableWebSearch: enableWebSearch,
          enableAcademicSearch: enableAcademicSearch
        })
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();

        // Special handling for API quota exceeded errors
        if ((response.status === 500 && errorText.includes('quota')) || errorText.includes('429')) {
          setError(`
## API Quota Limit Reached

I apologize, but we've reached the rate limit for the Gemini 1.5 Flash API. This happens with free API tiers.

### What you can do:

1. **Wait a minute** and try your question again
2. **Try a simpler question** that requires less processing
3. **Try again later** when the quota resets

Thank you for your understanding!
`);
          return;
        }

        // Throw error for other API issues
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract the response text from Gemini's response format
      let responseText = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        // Standard Gemini API response format
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          responseText = content.parts[0].text || 'No content in response';
        }
      } else {
        // Fallback for custom response format
        responseText = data.text || 'Received an unexpected response format from the API.';
      }

      // Extract web search metadata if available
      if (data.metadata) {
        setWebSearchMetadata(data.metadata);
      } else {
        setWebSearchMetadata(null);
      }

      // Update state with the response
      setResponse(responseText);
      setShowResponseModal(true);
    } catch (error) {
      // Log the full error to console for debugging
      console.error('Error in education query:', error);

      // Create a user-friendly error message
      let errorMessage = `Error: ${error.message || 'Something went wrong. Please try again.'}`;

      // Special handling for network errors
      if ((error.message && error.message.includes('NetworkError')) || error.message.includes('Failed to fetch')) {
        errorMessage = `
## Connection Error

There was a problem connecting to the server. Please check your internet connection and try again.

If the problem persists, the server might be down or experiencing issues.
`;
      }

      // Set the error message
      setError(errorMessage);
    } finally {
      // Reset loading state
      setLoading(false);

      // Scroll to the bottom of the response container for better UX
      if (responseContainerRef.current) {
        setTimeout(() => {
          responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }, 100);
      }
    }
  };

  /**
   * Clears all responses and resets the form
   * Used when clicking the reset button in the UI
   */
  const handleReset = () => {
    setResponse('');
    setError('');
    setPrompt('');
  };

  /**
   * Processes an example question by setting it as the prompt and submitting
   * @param {string} exampleText - The example question text to process
   */
  const processExample = (exampleText) => {
    setPrompt(exampleText);
    handleSubmit();
  };

  /**
   * Updates the search history with a new query
   * Stores the history in localStorage for persistence
   * @param {string} query - The search query to add to history
   */
  const updateSearchHistory = (query) => {
    // Create a new history item with truncated label if needed
    const newHistoryItem = {
      id: Date.now(),
      text: query,
      label: query.length > 25 ? query.substring(0, 25) + '...' : query
    };

    // Add to history and limit to 10 items
    const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10);
    setSearchHistory(updatedHistory);

    // Save to localStorage for persistence
    try {
      localStorage.setItem('educationSearchHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Error saving search history to localStorage:', e);
    }
  };

  /**
   * Saves a topic to favorites/bookmarks
   * Stores saved topics in localStorage for persistence
   * @param {Object} topic - The topic object to save
   * @param {number} topic.id - Unique identifier for the topic
   * @param {string} topic.text - Full text of the topic
   * @param {string} topic.label - Display label for the topic
   */
  const saveTopic = (topic) => {
    // Check if topic already exists in saved topics to prevent duplicates
    if (savedTopics.some(saved => saved.id === topic.id)) {
      return;
    }

    // Add new topic to the beginning of the list
    const updatedSavedTopics = [topic, ...savedTopics];
    setSavedTopics(updatedSavedTopics);

    // Save to localStorage for persistence
    try {
      localStorage.setItem('educationSavedTopics', JSON.stringify(updatedSavedTopics));
    } catch (e) {
      console.error('Error saving topics to localStorage:', e);
    }
  };

  /**
   * Removes a topic from saved/bookmarked topics
   * Updates localStorage to persist the change
   * @param {number} topicId - The ID of the topic to remove
   */
  const removeSavedTopic = (topicId) => {
    // Filter out the topic with the matching ID
    const updatedSavedTopics = savedTopics.filter(topic => topic.id !== topicId);
    setSavedTopics(updatedSavedTopics);

    // Update localStorage to persist the change
    try {
      localStorage.setItem('educationSavedTopics', JSON.stringify(updatedSavedTopics));
    } catch (e) {
      console.error('Error updating saved topics in localStorage:', e);
    }
  };

  /**
   * Initializes speech recognition and checks browser compatibility
   * Called during component initialization
   */
  const initializeSpeechRecognition = () => {
    // Check if the browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {

      return;
    }
    // Recognition is initialized on demand in startVoiceSearch
  };

  /**
   * Starts voice search by initializing and activating speech recognition
   * Sets up event handlers for the recognition process
   */
  const startVoiceSearch = () => {
    // Check browser compatibility
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Try Chrome or Edge.');
      return;
    }

    // Initialize the SpeechRecognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    // Configure recognition settings
    recognitionRef.current.continuous = true;      // Don't stop after first result
    recognitionRef.current.interimResults = true;  // Get results as user speaks

    // Event handler for when recognition starts
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    // Event handler for recognition results
    recognitionRef.current.onresult = (event) => {
      // Process the results array to extract transcript
      const transcript = Array.from(event.results)
        .map(result => result[0])        // Get the first alternative for each result
        .map(result => result.transcript) // Extract the transcript text
        .join('');                       // Join all parts together

      // Update state with the transcribed text
      setTranscript(transcript);
      setPrompt(transcript);
    };

    // Event handler for recognition errors
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    // Event handler for when recognition ends
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Start the recognition process
    recognitionRef.current.start();
  };

  /**
   * Stops the voice search/recognition process
   * Called when user clicks stop button or when submitting voice search
   */
  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  /**
   * Submits the transcribed voice input as a search query
   * Called when user confirms their voice input
   */
  const submitVoiceSearch = () => {
    if (transcript.trim()) {
      setPrompt(transcript);
      handleSubmit();
      stopVoiceSearch();
    }
  };

  /**
   * Toggles fullscreen mode for the response container
   * Switches between normal and fullscreen view
   */
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Initiates the screen recording process
   * Shows a prompt to confirm audio inclusion before starting
   */
  const startScreenRecording = () => {
    // Show microphone prompt before starting recording
    setShowMicPrompt(true);
  };

  /**
   * Confirms and starts screen recording with or without audio
   * Sets up MediaRecorder and handles recording process
   *
   * @param {boolean} withAudio - Whether to include audio in the recording
   */
  const confirmRecording = async (withAudio) => {
    // Close the microphone prompt
    setShowMicPrompt(false);

    try {
      // Configure screen capture options
      const displayMediaOptions = {
        video: {
          cursor: "always"  // Always show cursor in recording
        },
        audio: false // We'll handle audio separately for more control
      };

      // Request screen capture permission and get stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      // Start with screen stream
      let combinedStream = screenStream;

      // If audio is enabled, get microphone stream and combine with screen stream
      if (withAudio) {
        try {
          // Request microphone access
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = audioStream.getAudioTracks();

          // Add audio tracks to the combined stream
          if (audioTracks.length > 0) {
            audioTracks.forEach(track => {
              combinedStream.addTrack(track);
            });
          }
        } catch (audioError) {
          console.error('Error accessing microphone:', audioError);
          // Continue without audio if there's an error
        }
      }

      // Configure MediaRecorder with optimal settings for web
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options);

      // Handle data chunks as they become available
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Handle recording completion
      mediaRecorderRef.current.onstop = () => {
        // Create a blob from the recorded chunks
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });

        // Create a URL for the blob for playback
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        setRecordedBlob(blob);

        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;

        // Show export options dialog
        setShowExportOptions(true);

        // Clear the recorded chunks for next recording
        recordedChunksRef.current = [];

        // Stop all tracks to release hardware
        combinedStream.getTracks().forEach(track => track.stop());
      };

      // Start recording with 1-second data collection intervals
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

      // Start timer to track recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting screen recording:', error);
      setIsRecording(false);

      // Show user-friendly error message
      alert('Error starting screen recording. Please make sure you have granted the necessary permissions.');
    }
  };

  /**
   * Stops the current screen recording
   * Triggers the onstop handler of the MediaRecorder
   */
  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  /**
   * Formats recording time from seconds to MM:SS format
   *
   * @param {number} seconds - The recording duration in seconds
   * @returns {string} Formatted time string in MM:SS format
   */
  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Downloads the recorded video in WebM format
   * Creates a temporary download link and triggers it
   */
  const downloadRecording = () => {
    if (recordedVideo) {
      // Create a temporary anchor element for download
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = `education-recording-${new Date().toISOString().slice(0, 10)}.webm`;

      // Add to DOM, trigger click, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  /**
   * Converts and downloads the recorded video in MP4 format
   * Sends the WebM video to the server for conversion
   */
  const downloadMP4 = async () => {
    if (recordedBlob) {
      try {
        // Set exporting state to show loading indicator
        setIsExporting(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('video', recordedBlob, 'recording.webm');
        formData.append('format', 'mp4');

        // Send the file to the server for conversion
        const response = await fetch(`${API_URL}/convert-video`, {
          method: 'POST',
          body: formData
        });

        // Handle server errors
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Get the converted video blob from the response
        const blob = await response.blob();

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a download link and trigger it
        const a = document.createElement('a');
        a.href = url;
        a.download = `education-recording-${new Date().toISOString().slice(0, 10)}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up to prevent memory leaks
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error converting video:', error);
        alert('Error converting video to MP4. Please try again.');
      } finally {
        // Reset exporting state
        setIsExporting(false);
      }
    }
  };

  /**
   * Creates a shareable link for the recorded video
   * Uploads the video to the server and gets a public URL
   */
  const createShareableLink = async () => {
    if (recordedBlob) {
      try {
        // Set exporting state to show loading indicator
        setIsExporting(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('video', recordedBlob, 'recording.webm');

        // Send the file to the server for upload
        const response = await fetch(`${API_URL}/create-shareable-link`, {
          method: 'POST',
          body: formData
        });

        // Handle server errors
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Get the response data containing the URL
        const data = await response.json();

        // Set the shareable link in state
        setShareableLink(data.shareableUrl);
      } catch (error) {
        console.error('Error creating shareable link:', error);
        alert('Error creating shareable link. Please try again.');
      } finally {
        // Reset exporting state
        setIsExporting(false);
      }
    }
  };

  /**
   * Resets all recording state variables
   * Called when user wants to discard the current recording
   */
  const resetRecording = () => {
    setRecordedVideo(null);
    setRecordedBlob(null);
    setShowExportOptions(false);
    setShareableLink(null);
  };

  /**
   * Shows the GitHub repository analysis modal
   * Resets the form fields for a new analysis
   */
  const showGithubAnalysisModal = () => {
    setShowGithubModal(true);
    setGithubRepo('');
    setGithubAnalysis('');
  };

  /**
   * Analyzes a GitHub repository using the Gemini API
   * Extracts repository information and generates an analysis
   */
  const analyzeGithubRepo = async () => {
    // Validate input is not empty
    if (!githubRepo.trim()) {
      return;
    }

    // Validate GitHub URL format using regex
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubRegex.test(githubRepo)) {
      setGithubAnalysis('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)');
      return;
    }

    // Set loading state
    setIsAnalyzingRepo(true);
    setGithubAnalysis('');

    try {
      // Extract username and repo name from URL
      const urlParts = githubRepo.split('/');
      const username = urlParts[urlParts.length - 2];
      const repoName = urlParts[urlParts.length - 1].replace('.git', '');

      // Make API call to backend server for analysis
      const response = await fetch(`${API_URL}/analyze-github-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          repo: repoName
        })
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      // Parse the response
      const data = await response.json();

      // Extract the analysis from Gemini's response format
      let analysisText = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        // Standard Gemini API response format
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          analysisText = content.parts[0].text || 'No content in response';
        }
      } else {
        // Fallback for custom response format
        analysisText = data.text || 'Received an unexpected response format from the API.';
      }

      // Update state with the analysis
      setGithubAnalysis(analysisText);
    } catch (error) {
      // Handle errors
      console.error('Error analyzing GitHub repository:', error);
      setGithubAnalysis(`Error analyzing repository: ${error.message || 'Something went wrong. Please try again.'}`);
    } finally {
      // Reset loading state
      setIsAnalyzingRepo(false);
    }
  };

  /**
   * Analyzes a GitHub user profile using the backend API
   */
  const analyzeGithubUser = async () => {
    // Validate input is not empty
    if (!githubUser.trim()) {
      return;
    }

    // Validate GitHub URL format using regex or extract username
    let username = '';

    // Check if it's a URL or just a username
    if (githubUser.includes('github.com')) {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/;
      if (!githubRegex.test(githubUser)) {
        setGithubAnalysis('Please enter a valid GitHub user URL (e.g., https://github.com/username)');
        return;
      }

      // Extract username from URL
      const urlParts = githubUser.split('/');
      username = urlParts[urlParts.length - 1];
    } else {
      // Assume it's just a username
      const usernameRegex = /^[\w-]+$/;
      if (!usernameRegex.test(githubUser)) {
        setGithubAnalysis('Please enter a valid GitHub username (e.g., username)');
        return;
      }
      username = githubUser;
    }

    // Set loading state
    setIsAnalyzingUser(true);
    setGithubAnalysis('');

    try {
      // Make API call to backend server for analysis
      const response = await fetch(`${API_URL}/analyze-github-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username
        })
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      // Parse the response
      const data = await response.json();

      // Extract the analysis from Gemini's response format
      let analysisText = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        // Standard Gemini API response format
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          analysisText = content.parts[0].text || 'No content in response';
        }
      } else {
        // Fallback for custom response format
        analysisText = data.text || 'Received an unexpected response format from the API.';
      }

      // Update state with the analysis
      setGithubAnalysis(analysisText);
    } catch (error) {
      // Handle errors
      console.error('Error analyzing GitHub user profile:', error);
      setGithubAnalysis(`Error analyzing user profile: ${error.message || 'Something went wrong. Please try again.'}`);
    } finally {
      // Reset loading state
      setIsAnalyzingUser(false);
    }
  };

  /**
   * Generates AI-powered prompt suggestions based on user input
   * Uses the Gemini API to improve and expand user prompts
   *
   * @param {string} input - The user's current input text
   */
  const generatePromptSuggestions = async (input) => {
    // Don't generate suggestions if disabled or for empty/short inputs
    if (!enablePromptSuggestions || !input.trim() || input.length < 3) {
      setShowPromptSuggestions(false);
      return;
    }

    // Show loading state for suggestions
    setPromptSuggestions([`Improving your prompt: "${input}"...`]);
    setShowPromptSuggestions(true);

    try {
      // Call the API to get AI-generated prompt suggestions
      const response = await fetch(`${API_URL}/suggest-prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: input
        })
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      // Parse the response
      const data = await response.json();

      // Extract suggestions from the response
      let suggestions = [];

      // Handle different response formats
      if (data.suggestions && Array.isArray(data.suggestions)) {
        // Direct suggestions array format
        suggestions = data.suggestions;
      } else if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        // Parse suggestions from Gemini's response format
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          const text = content.parts[0].text || '';

          // Parse the text to extract suggestions (assuming one per line)
          suggestions = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('-') && !line.startsWith('*'))
            .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering
            .filter(line => line.length > 10); // Filter out too short suggestions
        }
      }

      // Fallback if no suggestions were found
      if (suggestions.length === 0) {
        suggestions = [
          `Explain in detail: ${input}`,
          `What are the key concepts of ${input}?`,
          `Compare and contrast different perspectives on ${input}`,
          `What is the historical context of ${input}?`,
          `How does ${input} work?`
        ];
      }

      // Limit to 5 suggestions for better UX
      suggestions = suggestions.slice(0, 5);

      // Update state with suggestions
      setPromptSuggestions(suggestions);
      setShowPromptSuggestions(true);
    } catch (error) {
      console.error('Error generating prompt suggestions:', error);

      // Fallback to predefined suggestions on error
      const fallbackSuggestions = [
        `Explain in detail: ${input}`,
        `What are the key concepts of ${input}?`,
        `Compare and contrast different perspectives on ${input}`,
        `What is the historical context of ${input}?`,
        `How does ${input} work?`
      ];

      setPromptSuggestions(fallbackSuggestions);
      setShowPromptSuggestions(true);
    }
  };

  /**
   * Selects a prompt suggestion and sets it as the current prompt
   *
   * @param {string} suggestion - The selected suggestion text
   */
  const selectPromptSuggestion = (suggestion) => {
    setPrompt(suggestion);
    setShowPromptSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  /**
   * Handles input changes with debouncing for prompt suggestions
   * Prevents excessive API calls while typing
   *
   * @param {string} value - The current input value
   */
  const handleInputChange = (value) => {
    // Update prompt state immediately
    setPrompt(value);

    // Reset selected suggestion index when user types
    setSelectedSuggestionIndex(-1);

    // Clear any existing timeout to implement debouncing
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Set a new timeout to generate suggestions after 500ms of inactivity
    suggestionTimeoutRef.current = setTimeout(() => {
      generatePromptSuggestions(value);
    }, 500);
  };

  /**
   * Effect hook to load saved data from localStorage on component mount
   * Initializes topic suggestions, saved topics, and search history
   */
  useEffect(() => {
    // Load saved topics from localStorage
    const savedTopicsFromStorage = localStorage.getItem('educationSavedTopics');
    if (savedTopicsFromStorage) {
      try {
        setSavedTopics(JSON.parse(savedTopicsFromStorage));
      } catch (e) {
        console.error('Error parsing saved topics:', e);
      }
    }

    // Load search history from localStorage
    const historyFromStorage = localStorage.getItem('educationSearchHistory');
    if (historyFromStorage) {
      try {
        setSearchHistory(JSON.parse(historyFromStorage));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }

    // Set initial topic suggestions to trending category
    setTopicSuggestions(defaultSuggestions.trending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect hook to ensure audio continuity when navigating to Education page
   * This is a special fix to prevent audio from stopping during navigation
   */
  useEffect(() => {
    // Special fix for audio continuity
    // This ensures any playing audio continues when navigating to the Education page
    if (window.resumeAudioPlayback) {

      setTimeout(() => {
        window.resumeAudioPlayback();
      }, 500);
    }
  }, []);

  /**
   * Effect hook to update topic suggestions when category changes
   * Displays different suggestions based on the active category
   */
  useEffect(() => {
    if (activeSuggestionCategory === 'history' && searchHistory.length > 0) {
      // Show user's search history
      setTopicSuggestions(searchHistory);
    } else if (activeSuggestionCategory === 'saved' && savedTopics.length > 0) {
      // Show user's saved topics
      setTopicSuggestions(savedTopics);
    } else if (defaultSuggestions[activeSuggestionCategory]) {
      // Show default suggestions for the selected category
      setTopicSuggestions(defaultSuggestions[activeSuggestionCategory]);
    } else {
      // Fallback to trending if category is invalid
      setTopicSuggestions(defaultSuggestions.trending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSuggestionCategory, searchHistory, savedTopics]);

  /**
   * Effect hook to initialize speech recognition on component mount
   * Sets up cleanup function to stop recognition on unmount
   */
  useEffect(() => {
    // Initialize speech recognition
    initializeSpeechRecognition();

    // Cleanup function to stop speech recognition when component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect hook to handle clicks outside the suggestions dropdown
   * Closes the suggestions when user clicks elsewhere
   */
  useEffect(() => {
    // Handler function for click events
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowPromptSuggestions(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Effect hook to clean up suggestion timeout on unmount
   * Prevents memory leaks from lingering timeouts
   */
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative" style={{
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
         <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#111827'}}>Education</h1>
           <p className="text-lg font-medium" style={{color: '#6b7280'}}>AI-Powered Learning Platform</p>
         </div>

        {/* Search box */}
        <div className="w-full mx-auto pb-16">{/* Added padding bottom */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
               <input
                 type="text"
                 value={prompt}
                 onChange={(e) => handleInputChange(e.target.value)}
                 onKeyDown={(e) => {
                   if (!showPromptSuggestions || promptSuggestions.length === 0) return;

                   if (e.key === 'ArrowDown') {
                     e.preventDefault();
                     setSelectedSuggestionIndex(prev =>
                       prev < promptSuggestions.length - 1 ? prev + 1 : 0
                     );
                   } else if (e.key === 'ArrowUp') {
                     e.preventDefault();
                     setSelectedSuggestionIndex(prev =>
                       prev > 0 ? prev - 1 : promptSuggestions.length - 1
                     );
                   } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
                     e.preventDefault();
                     selectPromptSuggestion(promptSuggestions[selectedSuggestionIndex]);
                   } else if (e.key === 'Escape') {
                     setShowPromptSuggestions(false);
                     setSelectedSuggestionIndex(-1);
                   }
                 }}
                 placeholder="What would you like to learn about?"
                 className="w-full p-4 pr-20 text-base border-0 focus:outline-none transition-all duration-300 ease-in-out"
                 style={{
                   backgroundColor: '#f9f9f9',
                   color: '#000000',
                   borderColor: '#e5e5e5',
                   backdropFilter: 'blur(8px)',
                   WebkitBackdropFilter: 'blur(8px)',
                   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                   borderRadius: '12px',
                   border: '2px solid transparent'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = '#ffffff';
                   e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                   e.target.style.borderColor = '#e5e5e5';
                   e.target.style.transform = 'translateY(-1px)';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = '#f9f9f9';
                   e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                   e.target.style.borderColor = 'transparent';
                   e.target.style.transform = 'translateY(0)';
                 }}
                 onFocus={(e) => {
                   e.target.style.backgroundColor = '#ffffff';
                   e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                   e.target.style.borderColor = '#e5e5e5';
                   e.target.style.transform = 'translateY(-2px)';
                   e.target.style.outline = 'none';
                 }}
                 onBlur={(e) => {
                   // Delay hiding suggestions to allow for clicks
                   setTimeout(() => {
                     setShowPromptSuggestions(false);
                     setSelectedSuggestionIndex(-1);
                   }, 150);
                   e.target.style.backgroundColor = '#f9f9f9';
                   e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                   e.target.style.borderColor = 'transparent';
                   e.target.style.transform = 'translateY(0)';
                 }}
                  aria-label="Search input"
                  aria-expanded={showPromptSuggestions}
                  aria-haspopup="listbox"
                  role="combobox"
                  aria-controls="prompt-suggestions"
                  aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
               />

               {/* Enhanced Prompt Suggestions */}
               {showPromptSuggestions && promptSuggestions.length > 0 && (
                  <div
                    id="prompt-suggestions"
                    ref={suggestionsRef}
                    className="absolute z-10 mt-2 w-full border-0 shadow-lg rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{
                      backgroundColor: '#ffffff',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      border: `1px solid #e5e5e5`,
                      maxHeight: '280px'
                    }}
                    role="listbox"
                    aria-label="Prompt suggestions"
                 >
                   <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                     {promptSuggestions.length === 1 && promptSuggestions[0].startsWith('Improving your prompt') ? (
                       <div className="p-4 flex items-center justify-center">
                         <RefreshCw className="w-4 h-4 animate-spin mr-3" style={{color: '#6b7280'}} />
                         <span className="text-sm font-medium" style={{color: '#374151'}}>{promptSuggestions[0]}</span>
                       </div>
                     ) : (
                       promptSuggestions.map((suggestion, index) => (
                         <button
                           key={index}
                           id={`suggestion-${index}`}
                           onClick={() => {
                             selectPromptSuggestion(suggestion);
                             setSelectedSuggestionIndex(-1);
                           }}
                           className="w-full text-left p-4 transition-all duration-200 group relative"
                           style={{
                             borderBottom: index < promptSuggestions.length - 1 ? `1px solid #f3f4f6` : 'none',
                             backgroundColor: selectedSuggestionIndex === index ? '#f9fafb' : 'transparent',
                             outline: 'none'
                           }}
                           onMouseEnter={(e) => {
                             e.target.style.backgroundColor = '#f8fafc';
                             setSelectedSuggestionIndex(index);
                           }}
                           onMouseLeave={(e) => {
                             e.target.style.backgroundColor = selectedSuggestionIndex === index ? '#f9fafb' : 'transparent';
                           }}
                           role="option"
                           aria-selected={selectedSuggestionIndex === index}
                         >
                           <div className="flex items-center">
                             <span className="text-sm font-medium transition-colors duration-200" style={{
                               color: selectedSuggestionIndex === index ? '#111827' : '#374151'
                             }}>
                               {suggestion}
                             </span>
                             {selectedSuggestionIndex === index && (
                               <div className="ml-auto opacity-60">
                                 <ArrowUp className="w-3 h-3 rotate-90" style={{color: '#6b7280'}} />
                               </div>
                             )}
                           </div>
                         </button>
                       ))
                     )}
                   </div>
                   <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                     <div className="flex items-center justify-between text-xs text-gray-500">
                       <span>Use ↑↓ to navigate</span>
                       <span>Enter to select • Esc to close</span>
                     </div>
                   </div>
                 </div>
               )}
            </div>
             <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
               {/* Enhanced Voice Search Button */}
               <button
                 type="button"
                 onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                 className="p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                 style={{
                   color: isListening ? '#ffffff' : '#6b7280',
                   backgroundColor: isListening ? '#ef4444' : 'transparent',
                   border: isListening ? 'none' : '1px solid #e5e5e5'
                 }}
                 onMouseEnter={(e) => {
                   if (!isListening) {
                     e.target.style.backgroundColor = '#f9fafb';
                     e.target.style.color = '#374151';
                     e.target.style.borderColor = '#d1d5db';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (!isListening) {
                     e.target.style.backgroundColor = 'transparent';
                     e.target.style.color = '#6b7280';
                     e.target.style.borderColor = '#e5e5e5';
                   }
                 }}
                 title={isListening ? "Stop listening" : "Voice search"}
                 aria-label={isListening ? "Stop voice search" : "Start voice search"}
               >
                 {isListening ? (
                   <div className="relative">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                       <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                       <line x1="12" x2="12" y1="19" y2="22"></line>
                     </svg>
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                   </div>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                     <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                     <line x1="12" x2="12" y1="19" y2="22"></line>
                   </svg>
                 )}
               </button>

               {/* Enhanced Submit Button */}
               <button
                 type="submit"
                 disabled={!prompt.trim() || loading}
                 className="p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                 style={{
                   color: (!prompt.trim() || loading) ? '#9ca3af' : '#ffffff',
                   backgroundColor: (!prompt.trim() || loading) ? '#f3f4f6' : '#374151',
                   border: 'none',
                   boxShadow: (!prompt.trim() || loading) ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                 }}
                 onMouseEnter={(e) => {
                   if (prompt.trim() && !loading) {
                     e.target.style.backgroundColor = '#111827';
                     e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (prompt.trim() && !loading) {
                     e.target.style.backgroundColor = '#374151';
                     e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                   }
                 }}
                 title={loading ? "Processing your request..." : "Submit search"}
                 aria-label={loading ? "Loading" : "Submit search"}
               >
                 {loading ? (
                   <div className="flex items-center">
                     <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                     <span className="text-xs font-medium">Processing</span>
                   </div>
                 ) : (
                   <ArrowUp className="w-4 h-4" />
                 )}
               </button>
             </div>
          </form>

           {/* Enhanced Voice Transcript Display */}
           {isListening && (
             <div className="mt-3 p-3 rounded-lg border animate-in slide-in-from-top-2 duration-200" style={{
               backgroundColor: '#fef2f2',
               borderColor: '#fecaca',
               color: '#991b1b'
             }}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center flex-1">
                   <div className="relative mr-3">
                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                     <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-30"></div>
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-medium mb-1">Listening...</div>
                     {transcript && (
                       <div className="text-sm opacity-90 italic">"{transcript}"</div>
                     )}
                   </div>
                 </div>
                 <div className="flex gap-1 ml-3">
                   <button
                     onClick={submitVoiceSearch}
                     disabled={!transcript.trim()}
                     className="p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                     style={{
                       color: transcript.trim() ? '#ffffff' : '#9ca3af',
                       backgroundColor: transcript.trim() ? '#10b981' : '#f3f4f6'
                     }}
                     onMouseEnter={(e) => {
                       if (transcript.trim()) {
                         e.target.style.backgroundColor = '#059669';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (transcript.trim()) {
                         e.target.style.backgroundColor = '#10b981';
                       }
                     }}
                     title="Use this transcript"
                     aria-label="Submit voice transcript"
                   >
                     <ArrowUp className="w-3 h-3" />
                   </button>
                   <button
                     onClick={stopVoiceSearch}
                     className="p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
                     style={{
                       color: '#ffffff',
                       backgroundColor: '#ef4444'
                     }}
                     onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                     onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                     title="Stop listening"
                     aria-label="Stop voice search"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M18 6 6 18"></path>
                       <path d="m6 6 12 12"></path>
                     </svg>
                   </button>
                 </div>
               </div>
             </div>
           )}

           {/* Action buttons - organized in grid for better layout */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 max-w-4xl mx-auto">
             {/* Search Options Group */}
             <div className="col-span-2 md:col-span-1 space-y-2">
               <div className="text-xs text-gray-500 mb-2">Search Options</div>

               {/* Web Search Toggle */}
               <button
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{
                   color: webSearchMetadata && webSearchMetadata.webSearchError && webSearchMetadata.webSearchError.includes('API not configured')
                     ? '#eab308'
                     : enableWebSearch
                       ? '#16a34a'
                       : '#666666'
                 }}
                 onMouseEnter={(e) => {
                   if (webSearchMetadata && webSearchMetadata.webSearchError && webSearchMetadata.webSearchError.includes('API not configured')) {
                     e.target.style.color = '#ca8a04';
                   } else if (enableWebSearch) {
                     e.target.style.color = '#15803d';
                   } else {
                     e.target.style.color = '#000000';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (webSearchMetadata && webSearchMetadata.webSearchError && webSearchMetadata.webSearchError.includes('API not configured')) {
                     e.target.style.color = '#eab308';
                   } else if (enableWebSearch) {
                     e.target.style.color = '#16a34a';
                   } else {
                     e.target.style.color = '#666666';
                   }
                 }}
                 onClick={() => setEnableWebSearch(!enableWebSearch)}
                 title={
                   webSearchMetadata && webSearchMetadata.webSearchError && webSearchMetadata.webSearchError.includes('API not configured')
                     ? "Web search API not properly configured"
                     : enableWebSearch
                       ? "Web search enabled"
                       : "Web search disabled"
                 }
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                   <circle cx="11" cy="11" r="8"></circle>
                   <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                 </svg>
                 {webSearchMetadata && webSearchMetadata.webSearchError && webSearchMetadata.webSearchError.includes('API not configured')
                   ? "Web Search: Not Configured"
                   : enableWebSearch
                     ? "Web Search: On"
                     : "Web Search: Off"
                 }
               </button>

               {/* Academic Search Toggle */}
               <button
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{
                   color: webSearchMetadata && webSearchMetadata.academicSearchError && webSearchMetadata.academicSearchError.includes('API not configured')
                     ? '#eab308'
                     : enableAcademicSearch
                       ? '#2563eb'
                       : '#666666'
                 }}
                 onMouseEnter={(e) => {
                   if (webSearchMetadata && webSearchMetadata.academicSearchError && webSearchMetadata.academicSearchError.includes('API not configured')) {
                     e.target.style.color = '#ca8a04';
                   } else if (enableAcademicSearch) {
                     e.target.style.color = '#1d4ed8';
                   } else {
                     e.target.style.color = '#000000';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (webSearchMetadata && webSearchMetadata.academicSearchError && webSearchMetadata.academicSearchError.includes('API not configured')) {
                     e.target.style.color = '#eab308';
                   } else if (enableAcademicSearch) {
                     e.target.style.color = '#2563eb';
                   } else {
                     e.target.style.color = '#666666';
                   }
                 }}
                 onClick={() => setEnableAcademicSearch(!enableAcademicSearch)}
                 title={
                   webSearchMetadata && webSearchMetadata.academicSearchError && webSearchMetadata.academicSearchError.includes('API not configured')
                     ? "Academic search API not properly configured"
                     : enableAcademicSearch
                       ? "Academic search enabled (ArXiv papers)"
                       : "Academic search disabled"
                 }
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                   <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                   <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                 </svg>
                 {webSearchMetadata && webSearchMetadata.academicSearchError && webSearchMetadata.academicSearchError.includes('API not configured')
                   ? "ArXiv: Not Configured"
                   : enableAcademicSearch
                     ? "ArXiv: On"
                     : "ArXiv: Off"
                 }
               </button>

               {/* Prompt Suggestions Toggle */}
               <button
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{
                   color: enablePromptSuggestions ? '#9333ea' : '#666666'
                 }}
                 onMouseEnter={(e) => {
                   if (enablePromptSuggestions) {
                     e.target.style.color = '#7c3aed';
                   } else {
                     e.target.style.color = '#000000';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (enablePromptSuggestions) {
                     e.target.style.color = '#9333ea';
                   } else {
                     e.target.style.color = '#666666';
                   }
                 }}
                 onClick={() => setEnablePromptSuggestions(!enablePromptSuggestions)}
                 title={enablePromptSuggestions ? "Prompt suggestions enabled" : "Prompt suggestions disabled"}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                   <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                 </svg>
                 {enablePromptSuggestions ? "Suggestions: On" : "Suggestions: Off"}
               </button>
             </div>

             {/* Tools Group */}
             <div className="col-span-2 md:col-span-1 space-y-2">
               <div className="text-xs text-gray-500 mb-2">Tools</div>

               {/* Screen Recording Button */}
               {!isRecording && !recordedVideo && (
                 <button
                   className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                   style={{color: '#666666'}}
                   onMouseEnter={(e) => e.target.style.color = '#000000'}
                   onMouseLeave={(e) => e.target.style.color = '#666666'}
                   onClick={startScreenRecording}
                   title="Record your screen"
                 >
                   <Video className="w-3 h-3 mr-2" />
                   Record Screen
                 </button>
               )}

               {/* Recording in Progress */}
               {isRecording && (
                 <button
                   className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                   style={{color: '#ef4444'}}
                   onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                   onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                   onClick={stopScreenRecording}
                   title="Stop recording"
                 >
                   <StopCircle className="w-3 h-3 mr-2" />
                   {formatRecordingTime(recordingTime)}
                 </button>
               )}

               {/* Download Recorded Video */}
               {recordedVideo && !isRecording && (
                 <button
                   className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                   style={{color: '#666666'}}
                   onMouseEnter={(e) => e.target.style.color = '#000000'}
                   onMouseLeave={(e) => e.target.style.color = '#666666'}
                   onClick={() => setShowExportOptions(true)}
                   title="Export options"
                 >
                   <Download className="w-3 h-3 mr-2" />
                   Export Recording
                 </button>
               )}

               {/* GitHub Analysis Button */}
               <button
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{color: '#666666'}}
                 onMouseEnter={(e) => e.target.style.color = '#000000'}
                 onMouseLeave={(e) => e.target.style.color = '#666666'}
                 onClick={showGithubAnalysisModal}
                 title="Analyze GitHub repository or user profile"
               >
                 <Github className="w-3 h-3 mr-2" />
                 GitHub Analysis
               </button>

               {/* EDI Button */}
               <a
                 href="/edi"
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{color: '#666666'}}
                 onMouseEnter={(e) => e.target.style.color = '#000000'}
                 onMouseLeave={(e) => e.target.style.color = '#666666'}
                 title="Open Code Editor"
               >
                 <Code className="w-3 h-3 mr-2" />
                 Code Editor
               </a>
             </div>

             {/* General Actions Group */}
             <div className="col-span-2 md:col-span-1 space-y-2">
               <div className="text-xs text-gray-500 mb-2">Actions</div>

               <button
                 className="w-full px-3 py-2 text-xs transition-colors duration-200 flex items-center justify-start"
                 style={{color: '#666666'}}
                 onMouseEnter={(e) => e.target.style.color = '#000000'}
                 onMouseLeave={(e) => e.target.style.color = '#666666'}
                 onClick={() => {
                   if (response || error) {
                     handleReset();
                   } else {
                     setShowInspirationalModal(true);
                   }
                 }}
               >
                 <RefreshCw className="w-3 h-3 mr-2" />
                 {response || error ? 'Reset' : 'Reimagine'}
               </button>
             </div>
           </div>

          {/* Topic suggestions */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs" style={{color: '#666666'}}>Explore</div>
              <div className="flex text-xs">
                <button
                  className="px-2 transition-colors duration-200"
                  style={{color: activeSuggestionCategory === 'trending' ? '#000000' : '#666666'}}
                  onMouseEnter={(e) => activeSuggestionCategory !== 'trending' && (e.target.style.color = '#000000')}
                  onMouseLeave={(e) => activeSuggestionCategory !== 'trending' && (e.target.style.color = '#666666')}
                  onClick={() => setActiveSuggestionCategory('trending')}
                >
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  Trending
                </button>
                <button
                  className="px-2 transition-colors duration-200"
                  style={{color: activeSuggestionCategory === 'science' ? '#000000' : '#666666'}}
                  onMouseEnter={(e) => activeSuggestionCategory !== 'science' && (e.target.style.color = '#000000')}
                  onMouseLeave={(e) => activeSuggestionCategory !== 'science' && (e.target.style.color = '#666666')}
                  onClick={() => setActiveSuggestionCategory('science')}
                >
                  Science
                </button>
                <button
                  className="px-2 transition-colors duration-200"
                  style={{color: activeSuggestionCategory === 'history' ? '#000000' : '#666666'}}
                  onMouseEnter={(e) => activeSuggestionCategory !== 'history' && (e.target.style.color = '#000000')}
                  onMouseLeave={(e) => activeSuggestionCategory !== 'history' && (e.target.style.color = '#666666')}
                  onClick={() => setActiveSuggestionCategory('history')}
                >
                  History
                </button>
                <button
                  className="px-2 transition-colors duration-200"
                  style={{color: activeSuggestionCategory === 'technology' ? '#000000' : '#666666'}}
                  onMouseEnter={(e) => activeSuggestionCategory !== 'technology' && (e.target.style.color = '#000000')}
                  onMouseLeave={(e) => activeSuggestionCategory !== 'technology' && (e.target.style.color = '#666666')}
                  onClick={() => setActiveSuggestionCategory('technology')}
                >
                  Technology
                </button>
                <button
                  className="px-2 transition-colors duration-200"
                  style={{color: activeSuggestionCategory === 'saved' ? '#000000' : '#666666'}}
                  onMouseEnter={(e) => activeSuggestionCategory !== 'saved' && (e.target.style.color = '#000000')}
                  onMouseLeave={(e) => activeSuggestionCategory !== 'saved' && (e.target.style.color = '#666666')}
                  onClick={() => setActiveSuggestionCategory('saved')}
                >
                  <Bookmark className="w-3 h-3 inline-block mr-1" />
                  Saved
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {topicSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => processExample(suggestion.text)}
                  className="text-left p-2 transition-all duration-200 rounded hover:border-gray-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    const button = e.currentTarget;
                    const span = button.querySelector('span');
                    button.style.borderColor = '#e5e5e5';
                    if (span) {
                      span.style.color = '#000000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const button = e.currentTarget;
                    const span = button.querySelector('span');
                    button.style.borderColor = 'transparent';
                    if (span) {
                      span.style.color = '#666666';
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs transition-colors duration-200" style={{color: '#666666'}}>{suggestion.label}</span>
                    {activeSuggestionCategory === 'saved' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedTopic(suggestion.id);
                        }}
                        className="transition-colors duration-200 ml-1"
                        style={{color: '#e5e5e5'}}
                        onMouseEnter={(e) => e.target.style.color = '#666666'}
                        onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        title="Remove from saved"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveTopic(suggestion);
                        }}
                        className="transition-colors duration-200 ml-1"
                        style={{color: '#e5e5e5'}}
                        onMouseEnter={(e) => e.target.style.color = '#666666'}
                        onMouseLeave={(e) => e.target.style.color = '#e5e5e5'}
                        title="Save topic"
                      >
                        <Bookmark className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Response container */}
          {(response || error || loading) && showResponseModal && (
            <EduResponseModal
              response={response}
              error={error}
              loading={loading}
              onClose={() => setShowResponseModal(false)}
              isOpen={showResponseModal}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />
          )}


      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={toggleFullscreen}
        ></div>
      )}

       {/* Inspirational Modal */}
       {showInspirationalModal && (
         <div
           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
           style={{
             backdropFilter: 'blur(8px)',
             WebkitBackdropFilter: 'blur(8px)'
           }}
         >
           <div
             className="rounded-xl shadow-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
             style={{
               backgroundColor: '#ffffff',
               backdropFilter: 'blur(12px)',
               WebkitBackdropFilter: 'blur(12px)',
               boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
               border: '1px solid #e5e5e5'
             }}
           >
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold" style={{color: '#111827'}}>Education</h2>
               <button
                 onClick={() => setShowInspirationalModal(false)}
                 className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                 style={{
                   color: '#666666',
                   backgroundColor: '#f9fafb',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = '#f3f4f6';
                   e.target.style.color = '#374151';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = '#f9fafb';
                   e.target.style.color = '#666666';
                 }}
                 aria-label="Close modal"
                 title="Close"
               >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>


          </div>
        </div>
      )}

       {/* Microphone Prompt Modal */}
       {showMicPrompt && (
         <div
           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
           style={{
             backdropFilter: 'blur(8px)',
             WebkitBackdropFilter: 'blur(8px)'
           }}
         >
           <div
             className="rounded-xl shadow-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
             style={{
               backgroundColor: '#ffffff',
               backdropFilter: 'blur(12px)',
               WebkitBackdropFilter: 'blur(12px)',
               boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
               border: '1px solid #e5e5e5'
             }}
           >
            <div className="flex justify-between items-center mb-4">
              Microphone
              <button
                onClick={() => setShowMicPrompt(false)}
                className="transition-colors duration-200"
                style={{color: '#666666'}}
                onMouseEnter={(e) => e.target.style.color = '#000000'}
                onMouseLeave={(e) => e.target.style.color = '#666666'}
                aria-label="Close modal"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p className="text-sm mb-4" style={{color: '#666666'}}>
              Include audio from your microphone in the recording?
            </p>

             <div className="flex flex-col space-y-3">
               <button
                 onClick={() => confirmRecording(true)}
                 className="flex items-center justify-start p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                 style={{
                   color: '#ffffff',
                   backgroundColor: '#374151',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
               >
                 <Mic className="w-4 h-4 mr-3" />
                 <span className="font-medium">Yes, enable microphone</span>
               </button>

               <button
                 onClick={() => confirmRecording(false)}
                 className="flex items-center justify-start p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                 style={{
                   color: '#ffffff',
                   backgroundColor: '#374151',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
               >
                 <MicOff className="w-4 h-4 mr-3" />
                 <span className="font-medium">No, record without audio</span>
               </button>

               <button
                 onClick={() => setShowMicPrompt(false)}
                 className="flex items-center justify-center p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                 style={{
                   color: '#666666',
                   backgroundColor: '#f9fafb',
                   border: '1px solid #e5e5e5'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = '#f3f4f6';
                   e.target.style.color = '#374151';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = '#f9fafb';
                   e.target.style.color = '#666666';
                 }}
               >
                 <span className="font-medium">Cancel</span>
               </button>
             </div>

            <p className="text-xs mt-4" style={{color: '#666666', opacity: 0.7}}>
              You'll need to grant browser permissions to record your screen.
            </p>
          </div>
        </div>
      )}

       {/* GitHub Analysis Modal */}
       {showGithubModal && (
         <div
           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
           style={{
             backdropFilter: 'blur(8px)',
             WebkitBackdropFilter: 'blur(8px)'
           }}
         >
           <div
             className="rounded-xl shadow-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
             style={{
               backgroundColor: '#ffffff',
               backdropFilter: 'blur(12px)',
               WebkitBackdropFilter: 'blur(12px)',
               boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
               border: '1px solid #e5e5e5'
             }}
           >
            <div className="flex justify-between items-center mb-4">
              GitHub Analysis
              <button
                onClick={() => setShowGithubModal(false)}
                className="transition-colors duration-200"
                style={{color: '#666666'}}
                onMouseEnter={(e) => e.target.style.color = '#000000'}
                onMouseLeave={(e) => e.target.style.color = '#666666'}
                aria-label="Close modal"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
              <button
                onClick={() => setActiveGithubTab('repository')}
                className="px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  color: activeGithubTab === 'repository' ? '#000000' : '#666666',
                  borderBottom: activeGithubTab === 'repository' ? '2px solid #000000' : 'none'
                }}
                onMouseEnter={(e) => activeGithubTab !== 'repository' && (e.target.style.color = '#000000')}
                onMouseLeave={(e) => activeGithubTab !== 'repository' && (e.target.style.color = '#666666')}
              >
                Repository
              </button>
              <button
                onClick={() => setActiveGithubTab('user')}
                className="px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  color: activeGithubTab === 'user' ? '#000000' : '#666666',
                  borderBottom: activeGithubTab === 'user' ? '2px solid #000000' : 'none'
                }}
                onMouseEnter={(e) => activeGithubTab !== 'user' && (e.target.style.color = '#000000')}
                onMouseLeave={(e) => activeGithubTab !== 'user' && (e.target.style.color = '#666666')}
              >
                User Profile
              </button>
            </div>

            {/* Repository Tab Content */}
            {activeGithubTab === 'repository' && (
              <>
                <p className="text-sm text-gray-400 italic mb-4">
                  Enter a GitHub repository URL to explore its structure, purpose, and key features with clarity.
                </p>

                 <div className="mb-4">
                   <input
                     type="text"
                     value={githubRepo}
                     onChange={(e) => setGithubRepo(e.target.value)}
                     placeholder="https://github.com/username/repository"
                     className="w-full p-3 text-sm border-0 rounded-lg transition-all duration-200"
                     style={{
                       backgroundColor: '#f9fafb',
                       color: '#374151',
                       border: '2px solid #e5e5e5'
                     }}
                     onFocus={(e) => {
                       e.target.style.backgroundColor = '#ffffff';
                       e.target.style.borderColor = '#d1d5db';
                       e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                     }}
                     onBlur={(e) => {
                       e.target.style.backgroundColor = '#f9fafb';
                       e.target.style.borderColor = '#e5e5e5';
                       e.target.style.boxShadow = 'none';
                     }}
                   />
                 </div>

                 <div className="flex justify-between mb-4">
                   <button
                     onClick={() => setShowGithubModal(false)}
                     className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                     style={{
                       color: '#666666',
                       backgroundColor: '#f9fafb',
                       border: '1px solid #e5e5e5'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f3f4f6';
                       e.target.style.color = '#374151';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = '#f9fafb';
                       e.target.style.color = '#666666';
                     }}
                   >
                     Cancel
                   </button>

                   <button
                     onClick={analyzeGithubRepo}
                     disabled={isAnalyzingRepo || !githubRepo.trim()}
                     className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                     style={{
                       color: (isAnalyzingRepo || !githubRepo.trim()) ? '#9ca3af' : '#ffffff',
                       backgroundColor: (isAnalyzingRepo || !githubRepo.trim()) ? '#f3f4f6' : '#374151',
                       border: 'none'
                     }}
                     onMouseEnter={(e) => {
                       if (!isAnalyzingRepo && githubRepo.trim()) {
                         e.target.style.backgroundColor = '#111827';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (!isAnalyzingRepo && githubRepo.trim()) {
                         e.target.style.backgroundColor = '#374151';
                       }
                     }}
                   >
                     {isAnalyzingRepo ? (
                       <>
                         <RefreshCw className="w-4 h-4 inline-block mr-2 animate-spin" />
                         <span className="font-medium">Analyzing...</span>
                       </>
                     ) : (
                       <span className="font-medium">Analyze Repository</span>
                     )}
                   </button>
                 </div>
              </>
            )}

            {/* User Profile Tab Content */}
            {activeGithubTab === 'user' && (
              <>
                <p className="text-sm text-gray-400 italic mb-4">
                  Enter a GitHub username or profile URL to explore their activity, skills, and contributions with clarity.
                </p>

                 <div className="mb-4">
                   <input
                     type="text"
                     value={githubUser}
                     onChange={(e) => setGithubUser(e.target.value)}
                     placeholder="username or https://github.com/username"
                     className="w-full p-3 text-sm border-0 rounded-lg transition-all duration-200"
                     style={{
                       backgroundColor: '#f9fafb',
                       color: '#374151',
                       border: '2px solid #e5e5e5'
                     }}
                     onFocus={(e) => {
                       e.target.style.backgroundColor = '#ffffff';
                       e.target.style.borderColor = '#d1d5db';
                       e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                     }}
                     onBlur={(e) => {
                       e.target.style.backgroundColor = '#f9fafb';
                       e.target.style.borderColor = '#e5e5e5';
                       e.target.style.boxShadow = 'none';
                     }}
                   />
                 </div>

                 <div className="flex justify-between mb-4">
                   <button
                     onClick={() => setShowGithubModal(false)}
                     className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                     style={{
                       color: '#666666',
                       backgroundColor: '#f9fafb',
                       border: '1px solid #e5e5e5'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f3f4f6';
                       e.target.style.color = '#374151';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = '#f9fafb';
                       e.target.style.color = '#666666';
                     }}
                   >
                     Cancel
                   </button>

                   <button
                     onClick={analyzeGithubUser}
                     disabled={isAnalyzingUser || !githubUser.trim()}
                     className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                     style={{
                       color: (isAnalyzingUser || !githubUser.trim()) ? '#9ca3af' : '#ffffff',
                       backgroundColor: (isAnalyzingUser || !githubUser.trim()) ? '#f3f4f6' : '#374151',
                       border: 'none'
                     }}
                     onMouseEnter={(e) => {
                       if (!isAnalyzingUser && githubUser.trim()) {
                         e.target.style.backgroundColor = '#111827';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (!isAnalyzingUser && githubUser.trim()) {
                         e.target.style.backgroundColor = '#374151';
                       }
                     }}
                   >
                     {isAnalyzingUser ? (
                       <>
                         <RefreshCw className="w-4 h-4 inline-block mr-2 animate-spin" />
                         <span className="font-medium">Analyzing...</span>
                       </>
                     ) : (
                       <span className="font-medium">Analyze User Profile</span>
                     )}
                   </button>
                 </div>
              </>
            )}

            {githubAnalysis && (
              <div className="mt-4 border-t border-gray-100 pt-4 flex-1 overflow-auto">
                {/* Copy button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(githubAnalysis);
                      alert('Analysis copied to clipboard!');
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </button>
                </div>

            {/* Analysis content with improved styling */}
            <p className="text-sm text-gray-400 mb-4 italic">Here's a gentle and clear overview of the GitHub repository for your understanding.</p>
            <div className="prose prose-headings:font-medium prose-headings:mt-8 prose-headings:mb-4 prose-p:my-3 prose-p:text-base prose-p:leading-relaxed prose-ul:my-2 prose-li:my-1 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                 components={{
                   h1: ({children}) => <div className="text-xl font-medium mt-0 mb-4">{children}</div>,
                   h2: ({children}) => <div className="text-lg font-medium mt-6 mb-3">{children}</div>,
                   h3: ({children}) => <div className="text-base font-medium mt-5 mb-2">{children}</div>,
                   h4: ({children}) => <div className="text-sm font-medium mt-4 mb-2">{children}</div>,
                  p: ({node, ...props}) => <p className="my-2 text-sm leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                  li: ({node, ...props}) => <li className="my-1 text-sm" {...props} />,
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vs}
                        language={match[1]}
                        PreTag="div"
                        className="rounded border border-gray-200 my-3"
                        showLineNumbers={true}
                        {...props}
                      >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {githubAnalysis}
              </ReactMarkdown>
            </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Export Options Modal */}
      {showExportOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg" style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e5e5'
          }}>
            Export
            <p className="text-sm text-gray-500 mb-4">
              Choose how to export your recording:
            </p>

             <div className="flex flex-col space-y-3">
               <button
                 onClick={downloadRecording}
                 disabled={isExporting}
                 className="flex items-center justify-center px-4 py-3 text-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                 style={{
                   color: isExporting ? '#9ca3af' : '#ffffff',
                   backgroundColor: isExporting ? '#f3f4f6' : '#374151',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#111827';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#374151';
                   }
                 }}
               >
                 <Download className="w-4 h-4 mr-3" />
                 <span className="font-medium">WebM format</span>
               </button>

               <button
                 onClick={downloadMP4}
                 disabled={isExporting}
                 className="flex items-center justify-center px-4 py-3 text-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                 style={{
                   color: isExporting ? '#9ca3af' : '#ffffff',
                   backgroundColor: isExporting ? '#f3f4f6' : '#374151',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#111827';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#374151';
                   }
                 }}
               >
                 {isExporting ? (
                   <>
                     <RefreshCw className="w-4 h-4 mr-3 animate-spin" />
                     <span className="font-medium">Converting...</span>
                   </>
                 ) : (
                   <>
                     <Download className="w-4 h-4 mr-3" />
                     <span className="font-medium">MP4 format</span>
                   </>
                 )}
               </button>

               <button
                 onClick={createShareableLink}
                 disabled={isExporting}
                 className="flex items-center justify-center px-4 py-3 text-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                 style={{
                   color: isExporting ? '#9ca3af' : '#ffffff',
                   backgroundColor: isExporting ? '#f3f4f6' : '#374151',
                   border: 'none'
                 }}
                 onMouseEnter={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#111827';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (!isExporting) {
                     e.target.style.backgroundColor = '#374151';
                   }
                 }}
               >
                 {isExporting ? (
                   <>
                     <RefreshCw className="w-4 h-4 mr-3 animate-spin" />
                     <span className="font-medium">Creating link...</span>
                   </>
                 ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                       <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                       <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                     </svg>
                     <span className="font-medium">Create shareable link</span>
                   </>
                 )}
               </button>

               {shareableLink && (
                 <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#f9fafb', border: '1px solid #e5e5e5'}}>
                   <div className="flex items-center mb-3">
                     <input
                       type="text"
                       value={shareableLink}
                       readOnly
                       className="flex-1 p-2 text-sm border-0 rounded bg-white"
                       style={{color: '#374151'}}
                     />
                     <button
                       onClick={() => {
                         navigator.clipboard.writeText(shareableLink);
                         alert('Link copied to clipboard!');
                       }}
                       className="ml-2 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                       style={{
                         color: '#ffffff',
                         backgroundColor: '#374151',
                         border: 'none'
                       }}
                       onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                       title="Copy to clipboard"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                         <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                       </svg>
                     </button>
                   </div>
                   <div className="flex gap-2">
                     <a
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=Sharing%20this%20educational%20resource%20with%20humility%20and%20respect.%20From%20AI%20Platform%20Education.`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 flex items-center justify-center p-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                       style={{
                         color: '#ffffff',
                         backgroundColor: '#374151',
                         textDecoration: 'none'
                       }}
                       onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                     >
                       Twitter
                     </a>
                     <a
                       href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 flex items-center justify-center p-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                       style={{
                         color: '#ffffff',
                         backgroundColor: '#374151',
                         textDecoration: 'none'
                       }}
                       onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                     >
                       Facebook
                     </a>
                     <a
                       href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 flex items-center justify-center p-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                       style={{
                         color: '#ffffff',
                         backgroundColor: '#374151',
                         textDecoration: 'none'
                       }}
                       onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                     >
                       LinkedIn
                     </a>
                   </div>
                 </div>
               )}

               <button
                 onClick={resetRecording}
                 className="px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 mt-3"
                 style={{
                   color: '#666666',
                   backgroundColor: '#f9fafb',
                   border: '1px solid #e5e5e5'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = '#f3f4f6';
                   e.target.style.color = '#374151';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = '#f9fafb';
                   e.target.style.color = '#666666';
                 }}
               >
                 <span className="font-medium">Discard recording</span>
               </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              MP4 conversion and links are processed on our server with respect for your privacy and data.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};


export default Education;
