import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EducationSuggestionsRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">Education Suggestions</h2>
        <p className="text-sm text-gray-600">
          Instructions details for the Education Suggestions component.
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
          <li>1 React state variable for tracking toggle status</li>
          <li>1 localStorage entry for persisting user preference</li>
          <li>1 toggle switch component</li>
          <li>1 conditional rendering block</li>
          <li>A pinch of event handlers</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Create a state variable for the toggle</p>
            <p>Set up a state variable to track whether suggestions are enabled or disabled.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In your Education component
const [suggestionsEnabled, setSuggestionsEnabled] = useState(
  localStorage.getItem('suggestionsEnabled') !== 'false' // Default to true
);`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create a toggle handler function</p>
            <p>This function will update both the state and localStorage when the toggle is clicked.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`const handleToggleSuggestions = () => {
  const newValue = !suggestionsEnabled;
  setSuggestionsEnabled(newValue);
  localStorage.setItem('suggestionsEnabled', newValue.toString());
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Add the toggle switch to your UI</p>
            <p>Create a simple toggle switch component that users can click to enable/disable suggestions.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`<div className="flex items-center mb-4">
  <span className="text-sm text-gray-600 mr-2">AI Suggestions:</span>
  <button
    onClick={handleToggleSuggestions}
    className={\`relative inline-flex h-6 w-11 items-center rounded-full \${
      suggestionsEnabled ? 'bg-black' : 'bg-gray-200'
    }\`}
  >
    <span
      className={\`inline-block h-4 w-4 transform rounded-full bg-white transition \${
        suggestionsEnabled ? 'translate-x-6' : 'translate-x-1'
      }\`}
    />
  </button>
  <span className="text-xs text-gray-500 ml-2">
    {suggestionsEnabled ? 'On' : 'Off'}
  </span>
</div>`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Conditionally render suggestions based on toggle state</p>
            <p>Only show AI suggestions when the toggle is enabled.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`{suggestionsEnabled && (
  <div className="suggestions-container">
    <h3 className="text-sm font-medium mb-2">AI Suggestions</h3>
    <ul className="list-disc pl-5 text-xs text-gray-600 space-y-2">
      {suggestions.map((suggestion, index) => (
        <li key={index}>{suggestion}</li>
      ))}
    </ul>
  </div>
)}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Add a helper function to generate suggestions</p>
            <p>This function will only be called when suggestions are enabled.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`const generateSuggestions = async (query) => {
  if (!suggestionsEnabled) return []; // Skip API call if suggestions are disabled

  try {
    // Make API call to get suggestions
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
};`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Chef's Notes</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            The toggle feature provides several benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">User Control:</span> Gives users the ability to decide whether they want AI assistance.
            </li>
            <li>
              <span className="font-medium">Performance Optimization:</span> Reduces unnecessary API calls when suggestions aren't needed.
            </li>
            <li>
              <span className="font-medium">Preference Persistence:</span> Using localStorage ensures the user's preference is remembered across sessions.
            </li>
          </ul>
          <p className="mt-4">
            This pattern can be applied to any feature where you want to give users control over AI functionality. It's especially useful for features that might consume API quota or slow down the application.
          </p>
        </div>
      </section>

      {/* Sample Instructions Section */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Complete Instructions Example</h3>
        <SyntaxHighlighter
          language="jsx"
          style={oneLight}
          className="text-xs rounded border border-gray-200"
          showLineNumbers={true}
        >
{`import React, { useState, useEffect } from 'react';

const EducationComponent = () => {
  // Initialize state from localStorage, default to enabled
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(
    localStorage.getItem('suggestionsEnabled') !== 'false'
  );
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Toggle handler
  const handleToggleSuggestions = () => {
    const newValue = !suggestionsEnabled;
    setSuggestionsEnabled(newValue);
    localStorage.setItem('suggestionsEnabled', newValue.toString());
  };

  // Generate suggestions when query changes
  useEffect(() => {
    if (query && suggestionsEnabled) {
      const fetchSuggestions = async () => {
        const newSuggestions = await generateSuggestions(query);
        setSuggestions(newSuggestions);
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, suggestionsEnabled]);

  return (
    <div className="education-container">
      <div className="controls">
        {/* Toggle switch */}
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600 mr-2">AI Suggestions:</span>
          <button
            onClick={handleToggleSuggestions}
            className={\`relative inline-flex h-6 w-11 items-center rounded-full \${
              suggestionsEnabled ? 'bg-black' : 'bg-gray-200'
            }\`}
          >
            <span
              className={\`inline-block h-4 w-4 transform rounded-full bg-white transition \${
                suggestionsEnabled ? 'translate-x-6' : 'translate-x-1'
              }\`}
            />
          </button>
          <span className="text-xs text-gray-500 ml-2">
            {suggestionsEnabled ? 'On' : 'Off'}
          </span>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your research topic..."
          className="w-full p-2 border border-gray-200 rounded"
        />
      </div>

      {/* Conditionally render suggestions */}
      {suggestionsEnabled && suggestions.length > 0 && (
        <div className="suggestions-container mt-4 p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-medium mb-2">AI Suggestions</h3>
          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main content area */}
      <div className="content-area mt-6">
        {/* Education content goes here */}
      </div>
    </div>
  );
};

export default EducationComponent;`}
        </SyntaxHighlighter>
      </section>
    </article>
  );
};

export default EducationSuggestionsRecipe;
