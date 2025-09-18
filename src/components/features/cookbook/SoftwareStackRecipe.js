import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SoftwareStackRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        Software Stack
        <p className="text-sm text-gray-600">
          Instructions details for the Software Stack component.
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
          <li>1 React frontend (v18.2.0)</li>
          <li>1 Express backend server</li>
          <li>1 cup of TailwindCSS for styling</li>
          <li>2 tablespoons of Google Generative AI (Gemini)</li>
          <li>A pinch of React Router for navigation</li>
          <li>Several React hooks for state management</li>
          <li>A handful of utility libraries (uuid, axios, etc.)</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Set up the React frontend</p>
            <p>Create a modern React application with functional components and hooks.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import './animations.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Configure TailwindCSS for styling</p>
            <p>Set up TailwindCSS with custom configuration for consistent styling.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* color values */ },
        coral: { /* color values */ },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          /* other fallbacks */
        ],
      },
      // Other customizations
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
  ],
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Set up the Express backend</p>
            <p>Create a consolidated server that handles API requests and serves the frontend.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// consolidated-server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints
app.post('/api/generate-content', async (req, res) => {
  // Instructions
});

// Serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Integrate Google Generative AI</p>
            <p>Set up the Gemini API for AI-powered features.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// AI integration example
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

async function generateContent(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Set up routing with React Router</p>
            <p>Implement client-side routing for a smooth single-page application experience.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// App.js routing setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/cookbook" element={<Cookbook />} />
        <Route path="/education" element={<Education />} />
        <Route path="/" element={<MainContent />} />
      </Routes>
    </Router>
  );
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
            Our modern web stack provides several advantages:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">React + Hooks:</span> Functional components with hooks provide a clean, maintainable codebase.
            </li>
            <li>
              <span className="font-medium">TailwindCSS:</span> Utility-first CSS framework allows for rapid UI development with consistent styling.
            </li>
            <li>
              <span className="font-medium">Express Backend:</span> Lightweight, flexible Node.js server handles API requests and serves the frontend.
            </li>
            <li>
              <span className="font-medium">AI Integration:</span> Google's Generative AI (Gemini) provides powerful AI capabilities.
            </li>
          </ul>
          <p className="mt-4">
            This stack is optimized for developer productivity and modern web application development. The consolidated server approach simplifies deployment, while the React frontend provides a responsive, interactive user experience.
          </p>
        </div>
      </section>

      {/* Dependencies Section */}
      <section className="p-6 border-b border-gray-100">
        Key Dependencies
        <SyntaxHighlighter
          language="json"
          style={oneLight}
          className="text-xs rounded border border-gray-200"
          showLineNumbers={true}
        >
{`{
  "dependencies": {
    "@google/generative-ai": "^0.2.1",
    "@monaco-editor/react": "^4.7.0",
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/typography": "^0.5.16",
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.5.2",
    "react-markdown": "^9.0.1",
    "react-router-dom": "^6.30.0",
    "react-syntax-highlighter": "^15.6.1",
    "tailwindcss": "^3.3.5",
    "uuid": "^11.1.0"
  }
}`}
        </SyntaxHighlighter>
      </section>
    </article>
  );
};

export default SoftwareStackRecipe;
