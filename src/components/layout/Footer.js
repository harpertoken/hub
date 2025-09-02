// src/Footer.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useScrollLock from '../../hooks/useScrollLock';
import ThemeToggle from '../../pages/ThemeToggle';
const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Lock scroll when company modal is open
  useScrollLock(modalOpen);

  return (
    <footer className="bg-white py-3 w-full z-10 mt-auto border-t border-gray-50">
      <div className="w-full mx-auto px-0">
        {/* Top navigation row */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center gap-3 mb-1 md:mb-0 md:ml-0">
            <a href="/" className="hover:text-gray-600 transition-colors duration-200">
              Home
            </a>
            <a href="https://github.com/tolerablecamp" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors duration-200">
              GitHub
            </a>
            <a href="https://tolerable.medium.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors duration-200">
              Medium
            </a>
            <a href="/cookbook" className="hover:text-gray-600 transition-colors duration-200">
              Cookbook
            </a>
            <a href="/changelog" className="hover:text-gray-600 transition-colors duration-200">
              Changelog
            </a>
            <a href="/about" className="hover:text-gray-600 transition-colors duration-200">
              About
            </a>
            <a href="/settings" className="hover:text-gray-600 transition-colors duration-200">
              Settings
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Terms
            </a>
            <a href="/legal" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Legal
            </a>
            <a href="/ai-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              AI Policy
            </a>
            <button onClick={() => setModalOpen(true)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Company
            </button>
          </div>
        </div>

        {/* Tagline */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <div
              className="bg-white rounded-md shadow-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Company Information</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-black transition-colors duration-200"
                  aria-label="Close modal"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                <p><b>About Tolerable:</b> Tolerable is an AI-powered platform that makes advanced artificial intelligence accessible and practical for everyday use. We focus on multimodal AI capabilities that can understand and process text, images, videos, and audio content.</p>

                <p><b>Our Mission:</b> To create AI tools that are genuinely useful, reliable, and easy to use. We believe AI should enhance human capabilities without complexity or confusion.</p>

                <p><b>Technology Stack:</b> Built with modern web technologies including React, Node.js, and powered exclusively by Google's Gemini 1.5 Flash model for all AI processing.</p>

                <p><b>Core Features:</b></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Multimodal AI analysis (text, image, video, audio)</li>
                  <li>• Educational content generation with web search</li>
                  <li>• GitHub repository and user analysis</li>
                  <li>• Code assistance and generation</li>
                  <li>• Academic research integration (ArXiv)</li>
                </ul>

                <p><b>AI Integration Example:</b></p>
                <SyntaxHighlighter
                  style={vs}
                  language="javascript"
                  className="rounded border border-gray-200 my-3"
                  showLineNumbers={true}
                >
{`// Tolerable's AI processing approach
const processWithGemini = async (content, type) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: type, data: content } }
  ]);

  return result.response.text();
};`}
                </SyntaxHighlighter>

                <p><b>Open Source:</b> Tolerable is open source and available on GitHub. We believe in transparency and community-driven development.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto text-center mt-2 mb-3 px-4">
          <a href="https://tolerable.ai" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
            Intelligence, reimagined.
          </a>
        </div>

        {/* AI Services */}
        {/*
        <div className="mt-2 text-xs text-gray-400 px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between mb-1">
            <p className="font-normal text-gray-500">AI Services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="mb-1"><span className="font-normal">All AI Services:</span> Google Gemini 1.5 Flash</p>

              <p className="text-xs">Tolerable uses Google's Gemini 1.5 Flash model for all AI services.</p>
            </div>
            <div>
              <p className="mb-1"><span className="font-normal">Voice Features:</span> Google Web Speech API</p>
              <p className="text-xs">All voice recognition and text-to-speech features are powered by Google's Web Speech API.</p>
            </div>
            <div>
              <p className="mb-1"><span className="font-normal">Code Editor (EDI):</span> Gemini 1.5 Flash</p>
              <p className="text-xs">The code editor uses Gemini 1.5 Flash for AI assistance and code suggestions.</p>
            </div>
            <div>
              <p className="mb-1"><span className="font-normal">Brand Writing:</span> Gemini 1.5 Flash</p>
              <p className="text-xs">Our brand writing and content generation is powered by Gemini 1.5 Flash for creative, engaging copy.</p>
            </div>
          </div>
        </div>
        */}

        <div className="relative flex items-center justify-center text-xs text-gray-400 mt-4 px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="text-center">
            &copy; Tolerable 2025
          </div>
          <div className="absolute right-4 md:right-8 lg:right-16 xl:right-24">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
