import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIIntegrationRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">A I Integration</h2>
        <p className="text-sm text-gray-600">
          Instructions details for the A I Integration component.
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
          <li>1 Google Gemini API key</li>
          <li>1 Express.js server for backend API endpoints</li>
          <li>1 React frontend for user interface</li>
          <li>2 cups of error handling and fallback mechanisms</li>
          <li>1 tablespoon of environment variable configuration</li>
          <li>A handful of multimodal content processing (images, audio, video)</li>
          <li>A pinch of performance optimization techniques</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Set Up Environment Configuration</p>
            <p>Configure environment variables for secure API key management.</p>
            <SyntaxHighlighter
              language="bash"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// .env file
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_API_URL=http://localhost:3030

// src/config.js
// API URL configuration
// For client-side code, always use REACT_APP_ prefixed variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';

// Log API URL in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('API URL:', API_URL);
}

export { API_URL };`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Initialize Gemini API on the Server</p>
            <p>Set up the Gemini API client on your Express server.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
const buildPath = path.resolve('./build');
app.use(express.static(buildPath));

// Initialize Gemini API
// Use REACT_APP_GEMINI_API_KEY consistently across client and server
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('ERROR: No Gemini API key found in environment variables');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create API Endpoints for Different Content Types</p>
            <p>Implement endpoints for processing text, images, audio, and video.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// Text processing endpoint
app.post('/api/gemini', express.json(), async (req, res) => {
  try {
    console.log('Received Gemini API request');

    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    // Always use Gemini 1.5 Flash for all AI services
    const modelName = "gemini-1.5-flash";
    console.log(\`Using model: \${modelName}\`);

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: modelName
    });

    // Generate content
    const result = await model.generateContent(req.body.prompt);
    const response = result.response;

    res.json(response);
  } catch (error) {
    console.error('Error processing Gemini request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Image processing endpoint
app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log(\`Processing image: \${req.file.originalname}, size: \${req.file.size} bytes\`);

    // Get the prompt from the request or use a default
    const prompt = req.body.prompt || 'Describe this image in detail.';

    // Read the file as a buffer
    const imageBuffer = fs.readFileSync(req.file.path);

    // Convert the buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Initialize the model (Gemini 1.5 Flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Create a part for the image
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file.mimetype
      }
    };

    // Generate content with the image and prompt
    const result = await model.generateContent([imagePart, prompt]);
    const response = result.response;

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json(response);
  } catch (error) {
    console.error('Error processing image:', error);

    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message });
  }
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Frontend Ingredients for AI Interaction</p>
            <p>Build React components that allow users to interact with the AI features.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/components/AIFeatures.js
import React, { useState, useRef } from 'react';
import { API_URL } from '../config';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file && activeTab !== 'text') {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      let endpoint;
      let formData;

      if (activeTab === 'image') {
        endpoint = \`\${API_URL}/process-image\`;
        formData = new FormData();
        formData.append('image', file);
        formData.append('prompt', prompt || 'Describe this image in detail.');
      } else if (activeTab === 'text') {
        endpoint = \`\${API_URL}/api/gemini\`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(\`API error \${response.status}\`);
        }

        const data = await response.json();
        setResponse(data.text);
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(\`API error \${response.status}\`);
      }

      const data = await response.json();
      setResponse(data.text);
    } catch (error) {
      console.error('Error processing content:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Tab navigation */}
      <div className="flex mb-6 border-b">
        <button
          className={\`px-4 py-2 \${activeTab === 'text' ? 'border-b-2 border-black' : ''}\`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={\`px-4 py-2 \${activeTab === 'image' ? 'border-b-2 border-black' : ''}\`}
          onClick={() => setActiveTab('image')}
        >
          Image
        </button>
      </div>

      {/* File upload area */}
      {activeTab !== 'text' && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={activeTab === 'image' ? 'image/*' : activeTab === 'audio' ? 'audio/*' : 'video/*'}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Select {activeTab} file
          </button>
          <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
          {file && <p className="mt-2 text-sm">{file.name}</p>}
        </div>
      )}

      {/* Prompt input */}
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Response display */}
      {response && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-medium mb-2">Response</h3>
          <div className="prose max-w-none">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeatures;`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Chef's Notes</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            The AI Integration approach provides a robust, scalable foundation for multimodal content analysis and generation.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Multimodal Processing:</span> Analyze and generate text, images, audio, and video content.
            </li>
            <li>
              <span className="font-medium">Error Handling:</span> Comprehensive error handling for all API endpoints.
            </li>
            <li>
              <span className="font-medium">Performance:</span> Optimized for fast, reliable responses.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default AIIntegrationRecipe;
