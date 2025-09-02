import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AdvancedFeaturesRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">Advanced Features</h2>
        <p className="text-sm text-gray-600">
          Instructions details for the Advanced Features component.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">15 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Ingredients</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>1 GitHub API integration for repository and user analysis</li>
          <li>1 Web Speech API implementation for voice recognition</li>
          <li>1 MediaRecorder API setup for screen recording</li>
          <li>2 cups of React state management for UI interactions</li>
          <li>1 tablespoon of modal components for displaying results</li>
          <li>A handful of error handling mechanisms</li>
          <li>A pinch of user permission management</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Implement GitHub Repository Analysis</p>
            <p>Create a feature to analyze GitHub repositories using the GitHub API and Gemini.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Server-side endpoint for GitHub repository analysis
app.post('/analyze-github-repo', express.json(), async (req, res) => {
  try {
    const { username, repo } = req.body;

    if (!username || !repo) {
      return res.status(400).json({ error: 'Username and repository name are required' });
    }

    // Fetch repository data from GitHub API
    try {
      const repoResponse = await axios.get(\`https://api.github.com/repos/\${username}/\${repo}\`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      const languagesResponse = await axios.get(repoResponse.data.languages_url);
      const contributorsResponse = await axios.get(repoResponse.data.contributors_url);

      // Use Gemini to analyze the repository
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const prompt = \`
      Analyze this GitHub repository:

      Repository: \${repoResponse.data.full_name}
      Description: \${repoResponse.data.description || 'No description provided'}
      Stars: \${repoResponse.data.stargazers_count}
      Forks: \${repoResponse.data.forks_count}
      Languages: \${Object.keys(languagesResponse.data).join(', ')}
      Contributors: \${contributorsResponse.data.length}

      Provide a comprehensive analysis including:
      1. The purpose and main features of this project
      2. Technologies used and architecture insights
      3. Project maturity and community engagement
      4. Potential use cases and applications

      Format your response in Markdown with clear headings and bullet points.
      \`;

      const result = await model.generateContent(prompt);
      res.json(result.response);
    } catch (githubError) {
      // Fallback to limited analysis if GitHub API fails
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const fallbackPrompt = \`
      Analyze the GitHub repository \${username}/\${repo} based on its name.
      Provide insights on potential technologies and purposes.
      Format your response in Markdown.
      \`;

      const result = await model.generateContent(fallbackPrompt);
      res.json(result.response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Set up Speech Recognition</p>
            <p>Implement voice search functionality using the Web Speech API.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In VoiceSearch.js component
import React, { useState, useRef, useEffect, useCallback } from 'react';

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const speechRecognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
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
      };

      speechRecognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      speechRecognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-speech functionality
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="voice-search-container">
      <button
        onClick={toggleListening}
        className={\`mic-button \${isListening ? 'listening' : ''}\`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <div className="transcript-container">
        {transcript && <p>{transcript}</p>}
      </div>

      {/* Response display and speak button */}
    </div>
  );
};

export default VoiceSearch;`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Screen Recording Feature</p>
            <p>Create a screen recording feature using the MediaRecorder API.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Screen recording functionality in Education component
const [isRecording, setIsRecording] = useState(false);
const [recordingTime, setRecordingTime] = useState(0);
const [recordedVideo, setRecordedVideo] = useState(null);
const [recordedBlob, setRecordedBlob] = useState(null);
const [showExportOptions, setShowExportOptions] = useState(false);
const [showMicPrompt, setShowMicPrompt] = useState(false);

const mediaRecorderRef = useRef(null);
const recordedChunksRef = useRef([]);
const recordingTimerRef = useRef(null);

// Start screen recording process
const startScreenRecording = () => {
  // Show microphone prompt before starting
  setShowMicPrompt(true);
};

// Confirm and start recording with or without audio
const confirmRecording = async (withAudio) => {
  setShowMicPrompt(false);

  try {
    // Configure screen capture options
    const displayMediaOptions = {
      video: { cursor: "always" },
      audio: false // Handle audio separately
    };

    // Get screen stream
    const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    // Get audio stream if requested
    let audioStream = null;
    if (withAudio) {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    // Combine streams if needed
    let combinedStream;
    if (audioStream) {
      combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
    } else {
      combinedStream = screenStream;
    }

    // Configure MediaRecorder
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    mediaRecorderRef.current = new MediaRecorder(combinedStream, options);

    // Handle data chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    // Handle recording completion
    mediaRecorderRef.current.onstop = () => {
      // Create blob from recorded chunks
      const blob = new Blob(recordedChunksRef.current, {
        type: 'video/webm'
      });

      // Create URL for playback
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
      setRecordedBlob(blob);

      // Reset recording state
      setIsRecording(false);
      setRecordingTime(0);
      clearInterval(recordingTimerRef.current);

      // Show export options
      setShowExportOptions(true);

      // Clear recorded chunks
      recordedChunksRef.current = [];

      // Stop all tracks
      combinedStream.getTracks().forEach(track => track.stop());
    };

    // Start recording
    mediaRecorderRef.current.start(1000);
    setIsRecording(true);

    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);

  } catch (error) {
    console.error('Error starting screen recording:', error);
    setIsRecording(false);
    alert('Error starting screen recording. Please make sure you have granted the necessary permissions.');
  }
};

// Stop screen recording
const stopScreenRecording = () => {
  if (mediaRecorderRef.current && isRecording) {
    mediaRecorderRef.current.stop();
  }
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create UI Ingredients for Feature Access</p>
            <p>Add buttons and UI elements to access these advanced features.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// UI elements in the Education component
<div className="flex flex-wrap gap-2 mt-4">
  {/* GitHub Analysis Button */}
  <button
    className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
    onClick={showGithubAnalysisModal}
    title="Analyze GitHub repository or user profile"
  >
    <Github className="w-3 h-3 inline-block mr-1" />
    GitHub Analysis
  </button>

  {/* Voice Search Link */}

  {/* Screen Recording Button */}
  <button
    className={\`px-3 py-1.5 text-xs \${isRecording ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-black'} transition-colors duration-200\`}
    onClick={isRecording ? stopScreenRecording : startScreenRecording}
    title={isRecording ? 'Stop recording' : 'Record your screen'}
  >
    <Video className="w-3 h-3 inline-block mr-1" />
    {isRecording ? \`Recording (\${formatTime(recordingTime)})\` : 'Record Screen'}
  </button>
</div>

{/* GitHub Analysis Modal */}
{showGithubModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-md shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">GitHub Analysis</h2>
          <button onClick={() => setShowGithubModal(false)} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Tabs for Repository/User */}
        <div className="flex border-b mb-4">
          <button
            className={\`px-4 py-2 text-sm \${activeGithubTab === 'repository' ? 'border-b-2 border-black' : ''}\`}
            onClick={() => setActiveGithubTab('repository')}
          >
            Repository
          </button>
          <button
            className={\`px-4 py-2 text-sm \${activeGithubTab === 'user' ? 'border-b-2 border-black' : ''}\`}
            onClick={() => setActiveGithubTab('user')}
          >
            User Profile
          </button>
        </div>

        {/* Repository Analysis Form */}
        {activeGithubTab === 'repository' && (
          <div>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={analyzeGithubRepo}
              disabled={isAnalyzingRepo}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {isAnalyzingRepo ? 'Analyzing...' : 'Analyze Repository'}
            </button>
          </div>
        )}

        {/* User Analysis Form */}
        {activeGithubTab === 'user' && (
          <div>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="Enter GitHub user URL (e.g., https://github.com/username)"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={analyzeGithubUser}
              disabled={isAnalyzingUser}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {isAnalyzingUser ? 'Analyzing...' : 'Analyze User Profile'}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {githubAnalysis && (
          <div className="mt-6 prose prose-sm max-w-none">
            <ReactMarkdown>{githubAnalysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  </div>
)}`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Chef's Notes</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            These advanced interactive features provide several benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">GitHub Analysis:</span> Helps users understand repositories and developer profiles without leaving the application, providing AI-powered insights into code projects.
            </li>
            <li>
              <span className="font-medium">Speech Recognition:</span> Enables hands-free interaction with the application, making it more accessible and convenient for users who prefer voice input.
            </li>
            <li>
              <span className="font-medium">Screen Recording:</span> Allows users to capture and share their educational sessions, making it easier to document and share knowledge.
            </li>
            <li>
              <span className="font-medium">Multimodal Interaction:</span> By combining these features, the application supports different interaction styles, catering to diverse user preferences and needs.
            </li>
          </ul>
          <p className="mt-4">
            These features significantly enhance the educational experience by providing multiple ways to interact with the application and access information, making learning more engaging and accessible.
          </p>
        </div>
      </section>

      {/* Instructions Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions Tips</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">GitHub API Rate Limiting:</span> Be mindful of GitHub API rate limits (60 requests per hour for unauthenticated requests). Consider implementing authentication for higher limits.
            </li>
            <li>
              <span className="font-medium">Browser Compatibility:</span> The Web Speech API has varying levels of support across browsers. Always include fallbacks and clear error messages for unsupported browsers.
            </li>
            <li>
              <span className="font-medium">Permission Management:</span> Screen recording and microphone access require explicit user permissions. Handle permission denials gracefully with helpful guidance.
            </li>
            <li>
              <span className="font-medium">Resource Management:</span> Properly clean up resources (like MediaRecorder instances and streams) to prevent memory leaks, especially when components unmount.
            </li>
            <li>
              <span className="font-medium">Progressive Enhancement:</span> Design features to degrade gracefully when APIs are unavailable, ensuring the core functionality remains accessible.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default AdvancedFeaturesRecipe;
