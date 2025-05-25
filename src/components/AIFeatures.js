/**
 * AI Features Component
 *
 * This component provides a comprehensive interface for AI-powered media analysis,
 * supporting image, audio, and video content. It allows users to upload media files
 * or provide URLs and get AI-generated analysis using Google's Gemini API.
 *
 * Features:
 * - Multi-tab interface for different media types (image, audio, video)
 * - File upload with drag-and-drop support
 * - Video URL input with YouTube support
 * - AI-powered analysis with Gemini 1.5 Flash
 * - Markdown rendering with math support
 * - Screen recording capabilities
 * - Voice input for prompts
 * - Responsive design with minimalist aesthetic
 */

/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import {
  Loader2,      // Loading spinner icon
  Image as ImageIcon,  // Image icon
  Mic,          // Microphone icon
  Video,        // Video icon
  Send,         // Send icon
  X,            // Close/clear icon
  Zap,          // Lightning bolt icon
  ChevronDown   // Dropdown arrow icon
} from 'lucide-react';
import { motion } from 'framer-motion';  // Animation library
import ReactMarkdown from 'react-markdown';  // Markdown renderer
import remarkMath from 'remark-math';       // Math notation support
import rehypeKatex from 'rehype-katex';     // KaTeX rendering for math
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';  // Code highlighting
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';  // Light theme for code
import '../markdown-styles.css';  // Custom markdown styles
import '../latex-styles.css';     // Custom LaTeX styles
import 'katex/dist/katex.min.css';  // KaTeX styles
import { API_URL } from '../config';  // API endpoint configuration
import useScrollLock from '../hooks/useScrollLock';  // Custom hook for locking body scroll
import { useModal } from '../contexts/ModalContext';  // Modal context for header visibility

/**
 * Helper function to convert a file to base64 encoding
 * Used for sending binary data to the Gemini API
 *
 * @param {File} file - The file to convert to base64
 * @returns {Promise<string>} A promise that resolves to the base64 string
 */
// eslint-disable-next-line no-unused-vars
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., 'data:image/jpeg;base64,')
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * AIFeatures component for media analysis with Gemini AI
 * @returns {JSX.Element} The AIFeatures component
 */
const AIFeatures = () => {
  // UI state variables
  /** @type {[boolean, Function]} Whether a file is being dragged over the drop zone */
  const [isDragOver, setIsDragOver] = useState(false);
  /** @type {[string, Function]} Currently active media tab (image, audio, video) */
  const [activeTab, setActiveTab] = useState('image');
  /** @type {[boolean, Function]} Whether to show the full analysis modal */
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  // Use modal context to control header visibility
  const { openModal, closeModal } = useModal();

  // Lock body scroll when modal is open
  useScrollLock(showFullAnalysis);
  /** @type {[boolean, Function]} Whether the response is in fullscreen mode */
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Input state variables
  /** @type {[string, Function]} User's prompt/question text */
  const [prompt, setPrompt] = useState('');
  /** @type {[File|null, Function]} Uploaded media file */
  const [file, setFile] = useState(null);
  /** @type {[string, Function]} Preview URL for the uploaded file */
  const [preview, setPreview] = useState('');
  /** @type {[string, Function]} Video URL for remote videos */
  const [videoUrl, setVideoUrl] = useState('');
  /** @type {[boolean, Function]} Whether using a video URL instead of file upload */
  const [isUsingVideoUrl, setIsUsingVideoUrl] = useState(false);

  // Response state variables
  /** @type {[string, Function]} AI-generated response text */
  const [response, setResponse] = useState('');
  /** @type {[boolean, Function]} Whether an API request is in progress */
  const [loading, setLoading] = useState(false);
  /** @type {[string, Function]} Error message if something goes wrong */
  const [error, setError] = useState('');

  // Topic and suggestion state variables
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
  /** @type {[Array, Function]} AI-generated prompt suggestions */
  const [promptSuggestions, setPromptSuggestions] = useState([]);
  /** @type {[boolean, Function]} Whether to show prompt suggestions */
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);

  // Voice input state variables
  /** @type {[boolean, Function]} Whether voice recognition is active */
  const [isListening, setIsListening] = useState(false);
  /** @type {[string, Function]} Transcribed speech from voice recognition */
  const [transcript, setTranscript] = useState('');
  /** @type {[boolean, Function]} Whether to show microphone prompt */
  const [showMicPrompt, setShowMicPrompt] = useState(false);

  // Screen recording state variables
  /** @type {[boolean, Function]} Whether screen recording is active */
  const [isRecording, setIsRecording] = useState(false);
  /** @type {[number, Function]} Duration of current recording in seconds */
  const [recordingTime, setRecordingTime] = useState(0);
  /** @type {[string, Function]} URL of recorded video */
  const [recordedVideo, setRecordedVideo] = useState(null);
  /** @type {[Blob, Function]} Blob of recorded video data */
  const [recordedBlob, setRecordedBlob] = useState(null);
  /** @type {[boolean, Function]} Whether to show export options */
  const [showExportOptions, setShowExportOptions] = useState(false);
  /** @type {[boolean, Function]} Whether video is being exported */
  const [isExporting, setIsExporting] = useState(false);
  /** @type {[string, Function]} Shareable link for recorded video */
  const [shareableLink, setShareableLink] = useState(null);

  // Refs for DOM elements and objects
  /** @type {React.RefObject} Reference to file input element */
  const fileInputRef = useRef(null);
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
  /** @type {React.RefObject} Reference to recording timer interval */
  const recordingTimerRef = useRef(null);

  // Check if Gemini API key is available
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  console.log('Gemini API Key available:', apiKey ? 'Yes' : 'No');

  // Default topic suggestions by category
  const defaultSuggestions = {
    trending: [
      { id: 1, text: "Analyze this image for artistic elements", label: "Art analysis" },
      { id: 2, text: "Identify objects in this photo", label: "Object identification" },
      { id: 3, text: "Describe the scene in this image", label: "Scene description" },
      { id: 4, text: "Analyze the composition of this image", label: "Composition analysis" }
    ],
    science: [
      { id: 5, text: "Identify scientific elements in this image", label: "Scientific analysis" },
      { id: 6, text: "Explain the biological structures shown", label: "Biology" },
      { id: 7, text: "Analyze the chemical compounds visible", label: "Chemistry" },
      { id: 8, text: "Identify the physical principles illustrated", label: "Physics" }
    ],
    history: [
      { id: 9, text: "Analyze the historical context of this image", label: "Historical context" },
      { id: 10, text: "Identify the time period of this scene", label: "Time period" },
      { id: 11, text: "Explain the cultural significance", label: "Cultural significance" },
      { id: 12, text: "Describe the historical artifacts shown", label: "Artifacts" }
    ],
    technology: [
      { id: 13, text: "Identify the technology shown in this image", label: "Tech identification" },
      { id: 14, text: "Analyze the technical components visible", label: "Components" },
      { id: 15, text: "Explain how this technology works", label: "Technical explanation" },
      { id: 16, text: "Describe the technological advancements shown", label: "Advancements" }
    ]
  };

  // Initialize topic suggestions
  useEffect(() => {
    setTopicSuggestions(defaultSuggestions[activeSuggestionCategory]);
  }, [activeSuggestionCategory]);

  // Load search history and saved topics from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('aiSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }

      const savedTopicsList = localStorage.getItem('aiSavedTopics');
      if (savedTopicsList) {
        setSavedTopics(JSON.parse(savedTopicsList));
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [response]);

  // Handle escape key to close full analysis modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showFullAnalysis) {
        setShowFullAnalysis(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showFullAnalysis]);

  // Manage modal state for header visibility
  useEffect(() => {
    if (showFullAnalysis) {
      openModal('aiLab');
    } else {
      closeModal('aiLab');
    }
  }, [showFullAnalysis, openModal, closeModal]);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported in this browser');
      return;
    }
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      setTranscript(transcript);
      setPrompt(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Submit voice search
  const submitVoiceSearch = () => {
    if (transcript.trim()) {
      setPrompt(transcript);
      handleSubmit();
      stopVoiceSearch();
    }
  };

  // Toggle fullscreen mode for the response container
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Start screen recording
  const startScreenRecording = () => {
    // Show microphone prompt before starting recording
    setShowMicPrompt(true);
  };

  // Confirm recording with or without audio
  const confirmRecording = async (withAudio) => {
    setShowMicPrompt(false);

    try {
      // Request screen capture
      const displayMediaOptions = {
        video: {
          cursor: "always"
        },
        audio: false // We'll handle audio separately
      };

      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      // If audio is enabled, get microphone stream and combine with screen stream
      let combinedStream = screenStream;

      if (withAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = audioStream.getAudioTracks();

          if (audioTracks.length > 0) {
            // Add audio track to the screen stream
            audioTracks.forEach(track => {
              combinedStream.addTrack(track);
            });
          }
        } catch (audioError) {
          console.error('Error accessing microphone:', audioError);
          // Continue without audio if there's an error
        }
      }

      // Set up media recorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options);

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        // Create a blob from the recorded chunks
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        setRecordedBlob(blob);

        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;

        // Show export options
        setShowExportOptions(true);

        // Clear the recorded chunks for next recording
        recordedChunksRef.current = [];

        // Stop all tracks
        combinedStream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting screen recording:', error);
      setIsRecording(false);

      // Show error message to user
      alert('Error starting screen recording. Please make sure you have granted the necessary permissions.');
    }
  };

  // Stop screen recording
  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Format recording time (seconds to MM:SS)
  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Download recorded video in WebM format
  const downloadRecording = () => {
    if (recordedVideo) {
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = `tolerable-ai-recording-${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Download recorded video in MP4 format
  const downloadMP4 = async () => {
    if (recordedBlob) {
      try {
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

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Get the blob from the response
        const blob = await response.blob();

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `tolerable-ai-recording-${new Date().toISOString().slice(0, 10)}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error converting video:', error);
        alert('Error converting video to MP4. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }
  };

  // Create a shareable link
  const createShareableLink = async () => {
    if (recordedBlob) {
      try {
        setIsExporting(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('video', recordedBlob, 'recording.webm');

        // Send the file to the server
        const response = await fetch(`${API_URL}/create-shareable-link`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Get the link from the response
        const data = await response.json();
        setShareableLink(data.url);
      } catch (error) {
        console.error('Error creating shareable link:', error);
        alert('Error creating shareable link. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }
  };

  // Update search history
  const updateSearchHistory = (query) => {
    const newHistoryItem = {
      id: Date.now(),
      text: query,
      label: query.length > 25 ? query.substring(0, 25) + '...' : query
    };

    // Add to history and limit to 10 items
    const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10);
    setSearchHistory(updatedHistory);

    // Save to localStorage
    try {
      localStorage.setItem('aiSearchHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Error saving search history to localStorage:', e);
    }
  };

  // Save topic to favorites
  const saveTopic = (topic) => {
    // Check if topic already exists in saved topics
    if (savedTopics.some(saved => saved.id === topic.id)) {
      return;
    }

    const updatedSavedTopics = [topic, ...savedTopics];
    setSavedTopics(updatedSavedTopics);

    // Save to localStorage
    try {
      localStorage.setItem('aiSavedTopics', JSON.stringify(updatedSavedTopics));
    } catch (e) {
      console.error('Error saving topics to localStorage:', e);
    }
  };

  // Remove saved topic
  const removeSavedTopic = (topicId) => {
    const updatedSavedTopics = savedTopics.filter(topic => topic.id !== topicId);
    setSavedTopics(updatedSavedTopics);

    // Update localStorage
    try {
      localStorage.setItem('aiSavedTopics', JSON.stringify(updatedSavedTopics));
    } catch (e) {
      console.error('Error updating saved topics in localStorage:', e);
    }
  };

  /**
   * Handles file selection from the file input or drag-and-drop
   * Creates a preview URL for the selected file
   *
   * @param {Event} e - The change event from the file input
   * @returns {Function} Cleanup function to revoke the object URL
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('handleFileChange called with file:', selectedFile);

    if (!selectedFile) {
      console.warn('No file selected in handleFileChange');
      return;
    }

    // Log file details for debugging
    console.log('Setting file:', selectedFile.name, selectedFile.type, selectedFile.size);
    setFile(selectedFile);

    // Create preview URL for displaying the file
    const previewUrl = URL.createObjectURL(selectedFile);
    console.log('Created preview URL:', previewUrl);
    setPreview(previewUrl);

    // Return cleanup function to prevent memory leaks
    // This will be called when the component unmounts
    return () => URL.revokeObjectURL(previewUrl);
  };

  /**
   * Handles form submission to process the media file with Gemini AI
   * Validates input, processes the file based on media type, and handles errors
   *
   * @param {Event} e - The form submit event (optional)
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission if event is provided
    if (e) e.preventDefault();

    // Log submission details for debugging
    console.log('Submit button clicked');
    console.log('Current state:', {
      activeTab,
      file: file ? file.name : null,
      isUsingVideoUrl,
      videoUrl,
      isYouTubeVideo: window.isYouTubeVideo
    });

    // Validate that we have a file or video URL
    if (!file && !(isUsingVideoUrl && videoUrl)) {
      const errorMsg = activeTab === 'video'
        ? 'Please upload a video file or enter a video URL.'
        : 'Please upload a file first.';
      console.log('Validation error:', errorMsg);
      setResponse(errorMsg);
      return;
    }

    // Prevent multiple submissions
    if (loading) {
      console.log('Already loading, ignoring submit');
      return;
    }

    // Close prompt suggestions if open
    setShowPromptSuggestions(false);

    // Update search history with current prompt
    updateSearchHistory(prompt);

    // Set loading state and clear previous response/errors
    setLoading(true);
    setError('');
    setResponse(''); // Clear previous response

    try {
      // Log what we're processing
      if (file) {
        console.log(`Processing ${activeTab} file:`, file.name);
      } else if (isUsingVideoUrl) {
        console.log(`Processing ${activeTab} URL:`, videoUrl);
      }

      // Process the media based on the active tab
      let result;
      switch (activeTab) {
        case 'image':
          result = await processImage();
          break;
        case 'audio':
          result = await processAudio();
          break;
        case 'video':
          result = await processVideo();
          break;
        default:
          throw new Error('Invalid tab selected');
      }

      // Log completion and update response state
      console.log(`${activeTab} processing complete`);
      setResponse(result);

      // Automatically open the modal when response is received
      setShowFullAnalysis(true);
    } catch (error) {
      // Log the error for debugging
      console.error(`Error processing ${activeTab}:`, error);

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

      // Also open modal for errors so users can see them clearly
      setShowFullAnalysis(true);
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

  // Function to clear all responses and reset the form
  const handleReset = () => {
    setResponse('');
    setError('');
    setPrompt('');
    setShowFullAnalysis(false);
  };

  // Process example questions
  const processExample = (exampleText) => {
    setPrompt(exampleText);
    handleSubmit();
  };

  /**
   * Processes an image file with the Gemini API
   * Sends the image to the backend server for analysis
   *
   * @returns {Promise<string>} The AI-generated analysis of the image
   * @throws {Error} If the image processing fails
   */
  const processImage = async () => {
    try {
      // Verify API key is available
      if (!apiKey) {
        console.warn('API key not found. Please add your API key to the .env file.');
        return `Error: API key not found. Please add your REACT_APP_GEMINI_API_KEY to the .env file.`;
      }

      // Check file size - Gemini has a limit (typically 20MB)
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 20) {
        return `Error: Image file is too large (${fileSizeMB.toFixed(2)} MB). Please use a file smaller than 20 MB.\n\nTip: You can use an image editor or an online image compressor to reduce the file size.`;
      }

      console.log('Processing image with API key');

      // Convert the image file to base64 for API processing
      const base64Image = await convertFileToBase64(file);

      // Make the actual API call to our backend proxy for Gemini
      console.log('Making API call to backend proxy for Gemini');

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', file);

      // Use provided prompt or default to a comprehensive image analysis prompt
      formData.append('prompt', prompt || 'Describe this image in detail. Identify objects, people, scenes, colors, and any other notable elements. Format your response using Markdown and LaTeX for any mathematical expressions or formulas.');

      // Make the API call to our backend server
      const response = await fetch(`${API_URL}/process-image`, {
        method: 'POST',
        body: formData
      });

      // Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log('API response data:', data);

      // Extract the response text from Gemini's response format
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          return content.parts[0].text || 'No content in response';
        }
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', data);
        return 'Received an unexpected response format from the API.';
      }
    } catch (error) {
      // Log and rethrow the error with a user-friendly message
      console.error('Error in processImage:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  };

  const processAudio = async () => {
    try {
      // For Gemini API, we'll use the GEMINI_API_KEY from the environment
      const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!geminiApiKey) {
        console.warn('Gemini API key not found. Please add your API key to the .env file.');
        return `Error: API key not found. Please add your REACT_APP_GEMINI_API_KEY to the .env file.`;
      }

      // Check file size - Gemini has a limit (typically 20MB)
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 20) {
        return `Error: Audio file is too large (${fileSizeMB.toFixed(2)} MB). Please use a file smaller than 20 MB.

Tip: You can use a tool like Audacity or an online audio compressor to reduce the file size.`;
      }

      console.log('Processing audio with Gemini API');

      // Using our backend proxy server to avoid CORS issues
      console.log('Sending audio to backend proxy server');

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('prompt', prompt || 'Transcribe this audio. Identify the speaker if possible and any background noises. Provide a detailed analysis of the audio content. Format your response using Markdown and LaTeX for any mathematical expressions.');

      // Make the API call to our backend server
      console.log('Sending request to process-audio endpoint');
      let response;
      try {
        response = await fetch(`${API_URL}/process-audio`, {
          method: 'POST',
          body: formData
        });
        console.log('Response status:', response.status);
      } catch (fetchError) {
        console.error('Network error during fetch:', fetchError);
        return `Error connecting to the server: ${fetchError.message}\n\nPlease make sure the server is running at ${API_URL}.`;
      }

      if (!response.ok) {
        let errorData;
        let errorText;
        try {
          // Clone the response before reading it
          const responseClone = response.clone();
          try {
            errorData = await responseClone.json();
            console.error('Backend server error (json):', response.status, errorData);
          } catch (jsonError) {
            // If it's not JSON, try to get the text
            errorText = await response.text();
            console.error('Backend server error (text):', response.status, errorText);

            // Check for quota exceeded error
            if (response.status === 429) {
              return `Error: API quota exceeded. The Gemini API has rate limits for free usage.\n\nPlease try again later or consider upgrading to a paid tier for higher quotas.\n\nDetails: ${errorText}`;
            }

            return `Backend server error ${response.status}: ${errorText}`;
          }
        } catch (e) {
          console.error('Error reading response:', e);
          return `Error reading server response: ${e.message}`;
        }

        // If we got JSON error data
        if (errorData) {
          // Check for model overload error
          const isOverloaded =
            (response.status === 503 && typeof errorData.error === 'string' && errorData.error.includes('overloaded')) ||
            (errorData.error?.error?.message && errorData.error.error.message.includes('overloaded'));

          if (isOverloaded) {
            return `Error: The Gemini model is currently overloaded with requests.\n\nThis is a temporary issue that occurs during peak usage times. Please try again in a few minutes.\n\nAlternative options:\n1. Try again with a smaller file\n2. Try again during off-peak hours\n3. Try the image recognition feature which uses a different model`;
          }

          // Check for quota exceeded error
          if (response.status === 429) {
            return `Error: API quota exceeded. The Gemini API has rate limits for free usage.\n\nPlease try again later or consider upgrading to a paid tier for higher quotas.\n\nDetails: ${JSON.stringify(errorData)}`;
          }

          return `Backend server error ${response.status}: ${JSON.stringify(errorData)}`;
        }

        return `Unknown error from server (status ${response.status})`;
      }

      // Clone the response before reading it as JSON
      const responseClone = response.clone();
      let data;
      try {
        data = await responseClone.json();
        console.log('Backend server response:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        // Try to get the text if JSON parsing fails
        const textResponse = await response.text();
        return `Error parsing server response: ${jsonError.message}\n\nRaw response: ${textResponse.substring(0, 100)}...`;
      }

      // Extract the response text from Gemini's response format
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          return content.parts[0].text || 'No content in response';
        }
      }

      console.error('Unexpected response format:', data);
      return 'Received an unexpected response format from the API.';
    } catch (error) {
      console.error('Error in processAudio:', error);
      throw new Error(`Audio processing failed: ${error.message}`);
    }
  };

  const processVideo = async () => {
    try {
      // For Gemini API, we'll use the GEMINI_API_KEY from the environment
      const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!geminiApiKey) {
        console.warn('Gemini API key not found. Please add your API key to the .env file.');
        return `Error: API key not found. Please add your REACT_APP_GEMINI_API_KEY to the .env file.`;
      }

      // Prepare the request based on whether we're using a URL or a file
      let endpoint, formData, requestData, isYouTubeRequest = false;

      if (isUsingVideoUrl && videoUrl) {
        console.log('Processing video URL with Gemini API:', videoUrl);

        // Check if it's a YouTube URL
        const isYoutube = isYouTubeUrl(videoUrl) || window.isYouTubeVideo;
        console.log('Is YouTube video?', isYoutube);

        if (isYoutube) {
          const videoId = extractYouTubeId(videoUrl);
          console.log('Extracted YouTube ID for processing:', videoId);

          // Enhanced validation for video ID
          if (!videoId || videoId.trim() === '' || videoId === 'undefined' || videoId === 'null') {
            console.error('Failed to extract YouTube video ID for processing. VideoId:', videoId, 'VideoUrl:', videoUrl);
            return 'Error: Could not extract YouTube video ID from the provided URL. Please check the URL and try again.\n\nSupported formats:\n- https://www.youtube.com/watch?v=VIDEO_ID\n- https://youtu.be/VIDEO_ID\n- https://www.youtube.com/embed/VIDEO_ID';
          }

          // Additional validation - check if video ID looks valid (11 characters, alphanumeric)
          if (videoId.length !== 11 || !/^[a-zA-Z0-9_-]+$/.test(videoId)) {
            console.error('Invalid YouTube video ID format:', videoId);
            return 'Error: The extracted YouTube video ID appears to be invalid. Please check the URL format and try again.';
          }

          endpoint = `${API_URL}/process-youtube`;
          console.log('Using YouTube processing endpoint:', endpoint, 'with validated video ID:', videoId);

          // For YouTube, prepare JSON data
          isYouTubeRequest = true;
          requestData = {
            videoId: videoId,
            prompt: prompt || 'Analyze this YouTube video. Identify key frames, objects, people, and provide a scene classification. Describe the content in detail and transcribe any speech if possible. Format your response using Markdown and LaTeX for any mathematical expressions or formulas.'
          };

          console.log('YouTube request data:', requestData);
        } else {
          // Regular video URL
          endpoint = `${API_URL}/process-video-url`;
          console.log('Using direct video URL endpoint:', endpoint);

          formData = new FormData();
          formData.append('videoUrl', videoUrl);
          formData.append('prompt', prompt || 'Analyze this video. Identify key frames, objects, people, and provide a scene classification. Describe the content in detail and transcribe any speech if possible. Format your response using Markdown and LaTeX for any mathematical expressions or formulas.');
        }
      } else {
        // Check file size - Gemini has a limit (typically 20MB)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 20) {
          return `Error: Video file is too large (${fileSizeMB.toFixed(2)} MB). Please use a file smaller than 20 MB.

Tip: You can use a tool like HandBrake or an online video compressor to reduce the file size.`;
        }

        console.log('Processing video file with Gemini API');
        endpoint = `${API_URL}/process-video`;

        formData = new FormData();
        formData.append('video', file);
        formData.append('prompt', prompt || 'Analyze this video. Identify key frames, objects, people, and provide a scene classification. Describe the content in detail and transcribe any speech if possible. Format your response using Markdown and LaTeX for any mathematical expressions or formulas.');
      }

      // Make the API call to our backend server
      console.log(`Sending request to ${endpoint}`);

      let response;
      try {
        // Handle different request types based on flag
        if (isYouTubeRequest) {
          // For YouTube, send JSON data
          console.log('Sending JSON request for YouTube:', requestData);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
          });
        } else {
          // For other endpoints, send FormData
          console.log('Sending FormData request:', {
            method: 'POST',
            formData: Array.from(formData.entries()).reduce((obj, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {})
          });
          response = await fetch(endpoint, {
            method: 'POST',
            body: formData
          });
        }
        console.log('Response status:', response.status);
      } catch (fetchError) {
        console.error('Network error during fetch:', fetchError);
        return `Error connecting to the server: ${fetchError.message}\n\nPlease make sure the server is running at ${API_URL}.`;
      }

      // Handle error responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const errorText = await response.text();
          console.error('Backend server error (text):', response.status, errorText);

          if (response.status === 429) {
            return `Error: API quota exceeded. The Gemini API has rate limits for free usage.

Please try again later or consider upgrading to a paid tier for higher quotas.

Details: ${errorText}`;
          }

          throw new Error(`Backend server error ${response.status}: ${errorText}`);
        }

        console.error('Backend server error (json):', response.status, errorData);

        // Check for model overload error
        const isOverloaded =
          (response.status === 503 && typeof errorData.error === 'string' && errorData.error.includes('overloaded')) ||
          (errorData.error?.error?.message && errorData.error.error.message.includes('overloaded'));

        if (isOverloaded) {
          return `Error: The Gemini model is currently overloaded with requests.

This is a temporary issue that occurs during peak usage times. Please try again in a few minutes.

Alternative options:
1. Try again with a smaller file
2. Try again during off-peak hours
3. Try the image recognition feature which uses a different model`;
        }

        if (response.status === 429) {
          return `Error: API quota exceeded. The Gemini API has rate limits for free usage.

Please try again later or consider upgrading to a paid tier for higher quotas.

Details: ${JSON.stringify(errorData)}`;
        }

        throw new Error(`Backend server error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      // Process successful response
      const data = await response.json();
      console.log('Backend server response:', data);

      // Extract the response text from Gemini's response format
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          return content.parts[0].text || 'No content in response';
        }
      }

      console.error('Unexpected response format:', data);
      return 'Received an unexpected response format from the API.';
    } catch (error) {
      console.error('Error in processVideo:', error);
      return `Video processing failed: ${error.message}`;
    }
  };


  /**
   * Clears the currently selected file and resets related state
   * Used when changing tabs or when user clicks the clear button
   */
  const clearFile = () => {
    setFile(null);
    setPreview('');
    setVideoUrl('');
    setIsUsingVideoUrl(false);
    // Reset the file input element to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Extracts YouTube video ID from various YouTube URL formats
   * Supports standard watch URLs, shortened youtu.be links, embed URLs, etc.
   *
   * @param {string} url - The YouTube URL to extract ID from
   * @returns {string|null} The extracted video ID or null if not found
   */
  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') {
      console.log('extractYouTubeId: Invalid URL provided:', url);
      return null;
    }

    // Clean the URL - remove whitespace and ensure it's a string
    const cleanUrl = url.trim();
    console.log('extractYouTubeId: Processing URL:', cleanUrl);

    // Regular expressions for different YouTube URL formats
    // eslint-disable-next-line no-useless-escape
    const regexps = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,  // Standard watch URL and youtu.be (exactly 11 chars)
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,                    // Embed URL (exactly 11 chars)
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,                        // Old-style video URL (exactly 11 chars)
      /youtube\.com\/user\/[^&?\n]+\/?v=([a-zA-Z0-9_-]{11})/,        // User page video URL (exactly 11 chars)
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/                    // YouTube Shorts URL (exactly 11 chars)
    ];

    // Try each regex pattern until we find a match
    for (let i = 0; i < regexps.length; i++) {
      const regex = regexps[i];
      const match = cleanUrl.match(regex);
      if (match && match[1]) {
        const videoId = match[1];
        console.log(`extractYouTubeId: Found match with regex ${i}:`, videoId);

        // Additional validation - YouTube video IDs are always 11 characters
        if (videoId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
          console.log('extractYouTubeId: Valid video ID extracted:', videoId);
          return videoId;
        } else {
          console.log('extractYouTubeId: Invalid video ID format:', videoId);
        }
      }
    }

    console.log('extractYouTubeId: No valid video ID found in URL:', cleanUrl);
    return null;
  };

  /**
   * Checks if a URL is a YouTube URL
   *
   * @param {string} url - The URL to check
   * @returns {boolean} True if the URL is a YouTube URL
   */
  const isYouTubeUrl = (url) => {
    const result = url.includes('youtube.com') || url.includes('youtu.be');
    console.log('Checking if URL is YouTube:', url, result);
    return result;
  };

  /**
   * Handles video URL input for the video tab
   * Processes YouTube URLs and direct video URLs differently
   *
   * @param {string} url - The video URL to process
   */
  const handleVideoUrl = async (url) => {
    if (!url) return;

    console.log('handleVideoUrl called with:', url);

    try {
      // Update state with the new URL
      setVideoUrl(url);
      setIsUsingVideoUrl(true);
      setFile(null);  // Clear any previously selected file

      // Special handling for YouTube URLs
      if (isYouTubeUrl(url)) {
        console.log('Detected YouTube URL');
        const videoId = extractYouTubeId(url);
        console.log('Extracted YouTube ID:', videoId);

        if (videoId) {
          // Create YouTube embed URL for preview
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          setPreview(embedUrl);
          console.log('Using YouTube video:', videoId, 'Embed URL:', embedUrl);

          // Add a flag to indicate this is a YouTube URL (for API processing)
          window.isYouTubeVideo = true;
        } else {
          console.error('Failed to extract YouTube video ID');
          throw new Error('Could not extract YouTube video ID from URL');
        }
      } else {
        // For direct video URLs (non-YouTube)
        setPreview(url);
        console.log('Using direct video URL:', url);
        window.isYouTubeVideo = false;
      }
    } catch (error) {
      console.error('Error handling video URL:', error);
      alert('Failed to process the video URL. Please try a different URL.');
    }
  };

  /**
   * Gets the appropriate icon for each media tab
   *
   * @param {string} tab - The tab name ('image', 'audio', or 'video')
   * @returns {JSX.Element} The icon component for the tab
   */
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'audio':
        return <Mic size={20} />;
      case 'video':
        return <Video size={20} />;
      default:
        return null;
    }
  };

  /**
   * Gets the appropriate file accept attribute for the file input
   * based on the active tab
   *
   * @returns {string} The MIME type filter for the file input
   */
  const getFileAccept = () => {
    switch (activeTab) {
      case 'image':
        return 'image/*';  // Accept all image types
      case 'audio':
        return 'audio/*';  // Accept all audio types
      case 'video':
        return 'video/*';  // Accept all video types
      default:
        return '';
    }
  };

  /**
   * Gets the appropriate placeholder text for the prompt input
   * based on the active tab
   *
   * @returns {string} The placeholder text for the prompt input
   */
  const getPlaceholderText = () => {
    switch (activeTab) {
      case 'image':
        return 'Describe what you want to know about this image...';
      case 'audio':
        return 'What would you like to know about this audio?';
      case 'video':
        return 'Ask something about this video...';
      default:
        return 'Enter your prompt...';
    }
  };

  /**
   * Handles the dragover event for the drop zone
   * Sets visual feedback and specifies the drop effect
   *
   * @param {DragEvent} e - The dragover event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';  // Show copy cursor
    setIsDragOver(true);  // Highlight the drop zone
  };

  /**
   * Handles the dragleave event for the drop zone
   * Removes the visual feedback when drag leaves the zone
   */
  const handleDragLeave = () => {
    setIsDragOver(false);  // Remove highlight from drop zone
  };

  /**
   * Helper function to set the active tab based on content keywords
   * Used when processing dropped posts without explicit media type
   *
   * @param {string} content - The content text to analyze
   */
  const setActiveTabBasedOnContent = (content) => {
    if (content.includes('audio') || content.toLowerCase().includes('listen')) {
      setActiveTab('audio');
    } else if (content.includes('video') || content.toLowerCase().includes('watch')) {
      setActiveTab('video');
    } else {
      // Default to image if no specific keywords are found
      setActiveTab('image');
    }
  };

  /**
   * Handles the drop event for files and post data
   * Processes dropped files or post JSON data with media
   *
   * @param {DragEvent} e - The drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);  // Remove highlight from drop zone

    // First check if files were dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log('File dropped:', file.name, file.type);

      // Determine file type and set the appropriate tab
      if (file.type.startsWith('image/')) {
        setActiveTab('image');
      } else if (file.type.startsWith('audio/')) {
        setActiveTab('audio');
      } else if (file.type.startsWith('video/')) {
        setActiveTab('video');
      }

      // Handle the file upload using the existing file change handler
      handleFileChange({ target: { files: e.dataTransfer.files } });
      return;
    }

    // If no files, try to process as post data (for integration with other components)
    try {
      const postData = e.dataTransfer.getData('application/json');
      console.log('Received drop data:', postData);

      if (postData) {
        // Parse the JSON data
        const post = JSON.parse(postData);
        console.log('Parsed post data:', post, 'Media URL:', post.mediaUrl || post.imageUrl, 'Media Type:', post.mediaType || 'image');

        // Set the post content as the prompt
        setPrompt(post.content || '');

        // Get the media URL (support both mediaUrl and imageUrl for backward compatibility)
        const mediaUrl = post.mediaUrl || post.imageUrl;
        const mediaType = post.mediaType || 'image'; // Default to image for backward compatibility

        // Check if the post has media
        if (mediaUrl) {
          // Set the active tab based on media type
          setActiveTab(mediaType);
          console.log(`Processing post with ${mediaType} at URL: ${mediaUrl}`);

          // Fetch the media from the URL
          fetch(mediaUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
              }
              return response.blob();
            })
            .then(blob => {
              // Determine the file type and name based on media type
              let fileName, fileType;

              if (mediaType === 'image') {
                fileName = `post-image-${post.id}.jpg`;
                fileType = 'image/jpeg';
              } else if (mediaType === 'audio') {
                fileName = `post-audio-${post.id}.mp3`;
                fileType = 'audio/mpeg';
              } else { // video
                fileName = `post-video-${post.id}.mp4`;
                fileType = 'video/mp4';
              }

              console.log(`Creating ${mediaType} file: ${fileName} with type ${fileType}`);

              // Create a File object from the blob
              const mediaFile = new File([blob], fileName, { type: fileType });

              // Directly set the file and preview instead of using DataTransfer API
              // which may not be supported in all browsers
              console.log('Setting media file directly:', mediaFile.name, mediaFile.type, mediaFile.size);
              setFile(mediaFile);
              const previewUrl = URL.createObjectURL(mediaFile);
              console.log('Created preview URL:', previewUrl);
              setPreview(previewUrl);
            })
            .catch(error => {
              console.error(`Error fetching post ${mediaType}:`, error);
              // If fetching the media fails, just set the tab based on content
              setActiveTabBasedOnContent(post.content || '');
            });
        } else {
          // If no media, set the tab based on content
          setActiveTabBasedOnContent(post.content || '');
        }

        // Clear any previous response
        setResponse('');
      }
    } catch (error) {
      console.error('Error processing dropped post:', error);
    }
  };

  return (
    <>
    <div
      className={`bg-white ${isDragOver ? 'ring-2 ring-black' : ''} overflow-hidden max-h-screen flex flex-col`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="border-b border-gray-100">
        <div className="flex">
          {['image', 'audio', 'video'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                clearFile();
                setResponse('');
                setError('');
                setShowFullAnalysis(false);
              }}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 text-xs transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-black border-b border-black bg-white font-medium'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {getTabIcon(tab)}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 relative bg-white">
        {isDragOver && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="text-center p-4 bg-white shadow-sm rounded-sm border border-gray-100">
              <div className="mb-2 bg-black p-2 rounded-full inline-flex">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="text-black font-medium mb-1">Drop File Here</p>
              <p className="text-xs text-gray-500">Drop an image, audio, or video file to analyze</p>
            </div>
          </div>
        )}
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-black">
                Upload {activeTab === 'image' ? 'an image' : activeTab === 'audio' ? 'an audio file' : 'a video'}
              </label>
            {file && (
              <button
                onClick={clearFile}
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Video URL input field (only for video tab) */}
          {activeTab === 'video' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-600">
                  Or enter a video URL
                </label>
                {isUsingVideoUrl && videoUrl && (
                  <button
                    onClick={clearFile}
                    className="text-gray-400 hover:text-black transition-colors duration-200 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="flex-1 p-2.5 border border-gray-200 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => handleVideoUrl(videoUrl)}
                  className="px-4 py-2 bg-black text-white border border-black rounded-sm text-sm hover:bg-gray-800 transition-colors duration-200"
                >
                  Use URL
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Enter a YouTube link or a direct link to a video file (MP4, WebM, etc.)
              </p>
            </div>
          )}

          <div
            className="relative flex items-center justify-center w-full h-32 px-4 py-2 border border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-gray-300 transition-colors duration-200"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileChange({ target: { files: e.dataTransfer.files } });
              }
            }}
          >
            {!file && !(isUsingVideoUrl && videoUrl) ? (
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="bg-gray-50 p-3 rounded-full">
                    {getTabIcon(activeTab)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Drop your {activeTab} file here, or{' '}
                  <label className="text-black cursor-pointer hover:text-gray-700 transition-colors duration-200">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept={getFileAccept()}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  {activeTab === 'image' ? 'PNG, JPG, GIF up to 10MB' :
                   activeTab === 'audio' ? 'MP3, WAV, M4A up to 20MB' :
                   'MP4, MOV, WEBM up to 50MB'}
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="relative border border-gray-100 rounded-sm bg-gray-50 p-3">
                  {activeTab === 'image' && preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain mx-auto"
                    />
                  )}
                  {activeTab === 'audio' && (
                    <audio
                      controls
                      className="w-full"
                    >
                      <source src={preview} type={file.type} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {activeTab === 'video' && (
                    isUsingVideoUrl && isYouTubeUrl(videoUrl) ? (
                      <iframe
                        src={preview}
                        title="YouTube video player"
                        style={{border: 'none'}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64"
                      ></iframe>
                    ) : (
                      <video
                        controls
                        className="w-full max-h-64 object-contain"
                      >
                        <source src={preview} type={isUsingVideoUrl ? 'video/mp4' : file.type} />
                        Your browser does not support the video element.
                      </video>
                    )
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    {isUsingVideoUrl ? videoUrl : `${file.name} (${Math.round(file.size / 1024)} KB)`}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1 text-gray-400 hover:text-black transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Analysis Instructions (optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full p-2.5 border border-gray-200 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
              title="You can use LaTeX math expressions like $E=mc^2$ or $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$"
            />
            <p className="text-xs text-gray-400 mt-1">Specify what you want to know about this {activeTab}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={(!file && !(isUsingVideoUrl && videoUrl)) || loading}
              className={`px-4 py-2 flex items-center gap-2 rounded-sm text-sm ${
                (!file && !(isUsingVideoUrl && videoUrl)) || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white border border-black hover:bg-gray-800 transition-colors duration-200'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Process {activeTab}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-black">
                {error ? 'Analysis Error' : 'Analysis Complete'}
              </h3>
              <button
                onClick={() => setShowFullAnalysis(true)}
                className="px-3 py-1.5 bg-black text-white text-xs rounded-sm hover:bg-gray-800 transition-colors duration-200"
              >
                {error ? 'View Error' : 'View Results'}
              </button>
            </div>
            <div className={`p-4 border rounded-sm ${error ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-sm mb-2" style={{color: error ? '#dc2626' : '#6b7280'}}>
                {error ? '❌ Analysis failed' : '✅ Analysis completed successfully'}
              </p>
              <p className="text-xs" style={{color: error ? '#991b1b' : '#6b7280'}}>
                {error
                  ? 'Click "View Error" to see the error details and troubleshooting information.'
                  : 'Click "View Results" to see the detailed analysis in a modal window.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>

    {/* AI Lab Analysis Results Modal */}
    {showFullAnalysis && (response || error) && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onClick={() => setShowFullAnalysis(false)}
      >
        <div
          className="w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden"
          style={{backgroundColor: 'var(--bg-primary)'}}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header - Fixed height to prevent collapsing */}
          <div
            className="flex items-center justify-between p-6 flex-shrink-0"
            style={{
              borderBottom: '1px solid var(--border-color)',
              minHeight: '80px'
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-full flex-shrink-0" style={{backgroundColor: error ? '#ef4444' : 'var(--text-primary)'}}>
                <Zap className="w-5 h-5" style={{color: 'var(--bg-primary)'}} />
              </div>
              <h2 className="text-xl font-semibold truncate" style={{color: 'var(--text-primary)'}}>
                {error ? 'Analysis Error' : 'AI Analysis Results'}
              </h2>
            </div>
            <button
              onClick={() => setShowFullAnalysis(false)}
              className="p-2 rounded-full transition-all duration-200 hover:scale-105 flex-shrink-0 ml-4"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--button-hover)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-secondary)';
              }}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content - Scrollable area */}
          <div className="overflow-y-auto p-6" style={{maxHeight: 'calc(90vh - 160px)'}}>
            <div className="markdown-content ai-lab-response">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({children}) => (
                    <h1 className="text-2xl font-semibold mb-4" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-xl font-semibold mb-3" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </h3>
                  ),
                  h4: ({children}) => (
                    <h4 className="text-base font-medium mb-2" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </h4>
                  ),
                  p: ({children}) => (
                    <p className="text-base leading-relaxed mb-4" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </p>
                  ),
                  ul: ({children}) => (
                    <ul className="space-y-1 mb-4 ml-4" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="space-y-1 mb-4 ml-4" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-base leading-relaxed" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </li>
                  ),
                  strong: ({children}) => (
                    <strong className="font-semibold" style={{color: 'var(--text-primary)'}}>
                      {children}
                    </strong>
                  ),
                  em: ({children}) => (
                    <em style={{color: 'var(--text-primary)'}}>
                      {children}
                    </em>
                  ),
                  a: ({href, children}) => (
                    <a
                      href={href}
                      className="font-medium underline transition-colors duration-200"
                      style={{color: 'var(--accent-color)'}}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({children}) => (
                    <blockquote
                      className="border-l-4 pl-4 py-2 mb-4 italic"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={oneLight}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '1em',
                            fontSize: '0.9em',
                            marginTop: '1em',
                            marginBottom: '1em',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code
                        className="px-2 py-1 rounded text-sm font-mono"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)'
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {error || response}
              </ReactMarkdown>
            </div>
          </div>

          {/* Modal Footer - Fixed height to prevent collapsing */}
          <div
            className="flex items-center justify-end gap-3 p-6 flex-shrink-0"
            style={{
              borderTop: '1px solid var(--border-color)',
              minHeight: '80px'
            }}
          >
            <button
              onClick={() => setShowFullAnalysis(false)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--button-hover)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default AIFeatures;