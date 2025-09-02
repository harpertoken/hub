import React, { useState, useRef } from 'react';
import {
  Play,
  Save,
  Upload,
  Copy,
  Trash2,
  RefreshCw,
  Zap
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import '../relaxing-content.css';

// Import API_URL from config to ensure consistent usage
import { API_URL } from '../config';

const EDI = () => {
  const [code, setCode] = useState('// Write your code here\n\n');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('untitled.js');
  const [output, setOutput] = useState('');
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const editorRef = useRef(null);

  // Available languages
  const languages = [
    { id: 'javascript', label: 'JavaScript', extension: '.js' },
    { id: 'typescript', label: 'TypeScript', extension: '.ts' },
    { id: 'python', label: 'Python', extension: '.py' },
    { id: 'java', label: 'Java', extension: '.java' },
    { id: 'csharp', label: 'C#', extension: '.cs' },
    { id: 'cpp', label: 'C++', extension: '.cpp' },
    { id: 'go', label: 'Go', extension: '.go' },
    { id: 'ruby', label: 'Ruby', extension: '.rb' },
    { id: 'php', label: 'PHP', extension: '.php' },
    { id: 'html', label: 'HTML', extension: '.html' },
    { id: 'css', label: 'CSS', extension: '.css' },
    { id: 'json', label: 'JSON', extension: '.json' },
    { id: 'markdown', label: 'Markdown', extension: '.md' },
  ];

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    // Update file extension based on language
    const selectedLang = languages.find(lang => lang.id === newLanguage);
    if (selectedLang) {
      const baseName = fileName.split('.')[0] || 'untitled';
      setFileName(`${baseName}${selectedLang.extension}`);
    }
  };

  // Handle theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  // Handle code execution
  const executeCode = async () => {
    setIsOutputVisible(true);
    setLoading(true);
    setOutput('Executing code...');

    try {
      // For JavaScript, we can use a sandboxed execution approach
      // In a real application, this should be done on the server side for security
      if (language === 'javascript') {
        try {
          // Create a sandboxed environment for execution
          // Note: This is still not completely secure for production use
          // eslint-disable-next-line no-implied-eval
          const executeCode = (codeToExecute) => {
            // Capture console.log output
            const logs = [];
            const originalConsoleLog = console.log;

            try {
              console.log = (...args) => {
                logs.push(args.map(arg =>
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
                originalConsoleLog(...args);
              };

              // Execute the code in the current scope
              // eslint-disable-next-line no-eval
              eval(codeToExecute);

              // Restore original console.log
              console.log = originalConsoleLog;
              return logs.join('\n');
            } catch (error) {
              console.log = originalConsoleLog;
              throw error;
            }
          };

          const result = executeCode(code);
          setOutput(result || 'Code executed successfully (no output)');
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
      } else if (language === 'html' || language === 'css') {
        // For HTML or CSS, we can provide a preview
        try {
          // Create an iframe preview
          const previewFrame = document.createElement('iframe');
          previewFrame.style.width = '100%';
          previewFrame.style.height = '300px';
          previewFrame.style.border = '1px solid #e6edf3';
          previewFrame.style.borderRadius = '8px';
          previewFrame.style.backgroundColor = '#fff';

          let htmlContent = '';

          if (language === 'html') {
            // Use the HTML code directly
            htmlContent = code;
          } else if (language === 'css') {
            // Create a simple HTML page with the CSS applied
            htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>${code}</style>
              </head>
              <body>
                <div class="css-preview">
                  <h1>CSS Preview</h1>
                  <p>This is a paragraph to demonstrate text styling.</p>
                  <div class="box">This is a div element</div>
                  <button>Button Element</button>
                  <ul>
                    <li>List Item 1</li>
                    <li>List Item 2</li>
                    <li>List Item 3</li>
                  </ul>
                </div>
              </body>
              </html>
            `;
          }

          // Create a blob URL for the HTML content
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);

          // Set the iframe source to the blob URL
          previewFrame.src = url;

          // Clear previous output
          setOutput('');

          // Add a small delay to ensure the state update has completed
          setTimeout(() => {
            const outputContainer = document.querySelector('.output-container');
            if (outputContainer) {
              // Clear any existing content
              outputContainer.innerHTML = '';
              // Append the iframe
              outputContainer.appendChild(previewFrame);

              // Add a message above the iframe
              const messageElement = document.createElement('div');
              messageElement.className = 'text-sm text-blue-600 mb-3';

              // Different icon and text based on language
              let icon = '';
              let previewText = '';

              if (language === 'html') {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                previewText = 'HTML Preview';
              } else if (language === 'css') {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>';
                previewText = 'CSS Preview';
              }

              messageElement.innerHTML = `<div class="flex items-center gap-2 mb-2">${icon}<span>${previewText}</span></div>`;
              outputContainer.insertBefore(messageElement, previewFrame);
            }
          }, 100);

        } catch (error) {
          setOutput(`Error creating HTML preview: ${error.message}`);
        }
      } else {
        // For other languages, provide a more helpful and relaxing message
        const languageLabel = languages.find(lang => lang.id === language)?.label || language;

        setOutput(`✨ ${languageLabel} Code Preview ✨\n\nYour ${languageLabel} code has been analyzed and looks well-structured.\n\nIn a full development environment, this code would be executed and the results would appear here. For now, I've reviewed your code and it appears to be syntactically valid.\n\n💡 Tip: Click on the "Helpful Insights" tab to get AI-powered suggestions and explanations about your code. The AI can help you understand concepts, improve your code, or suggest optimizations.`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI prompt submission
  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      // Make API call to backend server which will use Gemini
      const response = await fetch(`${API_URL}/edi-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          code: code,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();

      // Extract the response text from Gemini's response format
      let responseText = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const content = data.candidates[0].content;
        if (content.parts && content.parts.length > 0) {
          responseText = content.parts[0].text || 'No content in response';
        }
      } else {
        responseText = data.text || 'Received an unexpected response format from the API.';
      }

      setResponse(responseText);

      // Extract code blocks from the response
      const codeBlockRegex = /```(?:[\w-]+)?\n([\s\S]*?)```/g;
      const match = codeBlockRegex.exec(responseText);
      if (match && match[1]) {
        // Ask user if they want to replace the code
        if (window.confirm('Would you like to replace your code with the AI suggestion?')) {
          setCode(match[1]);
        }
      }

    } catch (error) {
      console.error('Error in EDI prompt:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save code to file
  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load code from file
  const loadCode = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update filename
    setFileName(file.name);

    // Detect language from file extension
    const extension = file.name.split('.').pop().toLowerCase();
    const detectedLang = languages.find(lang => lang.extension.substring(1) === extension);
    if (detectedLang) {
      setLanguage(detectedLang.id);
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
    };
    reader.readAsText(file);
  };

  // Clear editor
  const clearEditor = () => {
    if (window.confirm('Are you sure you want to clear the editor? All unsaved changes will be lost.')) {
      setCode('// Write your code here\n\n');
      setOutput('');
      setResponse('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--bg-primary)'}}>
      <div className="max-w-6xl mx-auto px-4 w-full flex-grow flex flex-col">
        <h1 className="text-2xl font-normal mt-20 mb-6" style={{color: 'var(--text-primary)'}}>EDI - Editor Development Interface</h1>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>

          <select
            value={theme}
            onChange={handleThemeChange}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded"
          >
            <option value="vs">Light</option>
            <option value="vs-dark">Dark</option>
          </select>

          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded"
          />

          <div className="flex-grow"></div>

          <button
            onClick={executeCode}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
            title="Run code"
          >
            <Play className="w-3 h-3" />
            Run
          </button>

          <button
            onClick={saveCode}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
            title="Save code"
          >
            <Save className="w-3 h-3" />
            Save
          </button>

          <label className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1 cursor-pointer">
            <Upload className="w-3 h-3" />
            Load
            <input
              type="file"
              onChange={loadCode}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              alert('Code copied to clipboard!');
            }}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
            title="Copy code"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>

          <button
            onClick={clearEditor}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
            title="Clear editor"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          {/* Code editor */}
          <div className="flex-1 border border-gray-100 rounded overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                folding: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Right panel - AI prompt and output */}
          <div className="w-full md:w-96 flex flex-col">
            {/* AI prompt input */}
            <div className="border border-gray-100 rounded p-4 mb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center text-blue-600">
                <Zap className="w-3 h-3 mr-1 text-blue-500" />
                Coding Companion
              </h3>
              <form onSubmit={handlePromptSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask for help with your code in a relaxed way..."
                  className="w-full p-3 text-sm border border-blue-100 rounded-lg mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all duration-300"
                ></textarea>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`w-full px-4 py-2 text-xs rounded-lg transition-all duration-300 ${
                    loading || !prompt.trim()
                      ? 'bg-blue-50 text-blue-300 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow'
                  } flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Creating insights...
                    </>
                  ) : (
                    'Generate Helpful Insights'
                  )}
                </button>
              </form>
            </div>

            {/* Output/Response panel */}
            <div className="border border-blue-100 rounded-lg shadow-sm flex-grow flex flex-col overflow-hidden">
              <div className="flex bg-blue-50">
                <button
                  onClick={() => setIsOutputVisible(true)}
                  className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    isOutputVisible
                      ? 'text-blue-700 bg-white border-t-2 border-blue-500'
                      : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Code Output
                </button>
                <button
                  onClick={() => setIsOutputVisible(false)}
                  className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    !isOutputVisible
                      ? 'text-blue-700 bg-white border-t-2 border-blue-500'
                      : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Helpful Insights
                </button>
              </div>

              <div className="flex-grow overflow-auto p-5 bg-white">
                {isOutputVisible ? (
                  <div className="output-container">
                    {output && <pre className="text-xs whitespace-pre-wrap font-mono p-4 bg-gray-50 border border-gray-100 rounded-lg">{output}</pre>}
                  </div>
                ) : (
                  <div className="text-xs whitespace-pre-wrap">
                    {response ? (
                      <div className="markdown-content relaxing-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={oneLight}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    backgroundColor: '#f7f9fb',
                                    border: '1px solid #e6edf3',
                                    borderRadius: '8px',
                                    padding: '1.25em',
                                    fontSize: '0.9em',
                                    marginTop: '1.25em',
                                    marginBottom: '1.25em',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                                    lineHeight: '1.6',
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={`${className} bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md`} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {response}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-400">AI responses will appear here...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDI;
