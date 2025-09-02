import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EduSearchRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">Education Search</h2>
        <p className="text-sm text-gray-600">
          Instructions details for the Education Search component.
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
          <li>1 Google Custom Search API key and search engine ID</li>
          <li>1 ArXiv API integration</li>
          <li>2 cups of React state management</li>
          <li>1 Express backend server</li>
          <li>1 tablespoon of toggle switches for user control</li>
          <li>A pinch of error handling</li>
          <li>Several metadata handlers for search results</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Set up search state in the Education component</p>
            <p>Create state variables to track search preferences and results.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In the Education component
// Search states
const [enableWebSearch, setEnableWebSearch] = useState(true);
const [enableAcademicSearch, setEnableAcademicSearch] = useState(false);
const [enablePromptSuggestions, setEnablePromptSuggestions] = useState(true);
const [webSearchMetadata, setWebSearchMetadata] = useState(null);`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement web search with Google Custom Search</p>
            <p>Create a server-side function to search the web using Google's API.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In the server file
async function searchWeb(query, numResults = 5) {
  try {
    // Get API credentials
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      return {
        results: [],
        error: 'Google Search API not configured'
      };
    }

    // Build the search URL
    const searchUrl = \`https://www.googleapis.com/customsearch/v1?key=\${apiKey}&cx=\${searchEngineId}&q=\${encodeURIComponent(query)}&num=\${numResults}\`;

    // Make the request
    const response = await axios.get(searchUrl);

    // Format the results
    const results = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: extractDomain(item.link),
      date: item.pagemap?.metatags?.[0]?.['article:published_time'] || null
    }));

    return { results, error: null };
  } catch (error) {
    return {
      results: [],
      error: \`Error searching web: \${error.message}\`
    };
  }
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement ArXiv academic paper search</p>
            <p>Create a function to search for academic papers using the ArXiv API.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In a separate module (e.g., arxiv-search.js)
async function searchArxiv(query, numResults = 5) {
  try {
    // Build the ArXiv API URL with proper encoding
    const encodedQuery = encodeURIComponent(query.replace(/\\s+/g, '+AND+'));
    const arxivUrl = \`http://export.arxiv.org/api/query?search_query=all:\${encodedQuery}&start=0&max_results=\${numResults}&sortBy=relevance&sortOrder=descending\`;

    // Make the request
    const response = await axios.get(arxivUrl);

    // Parse the XML response
    const xmlData = response.data;
    const entryMatches = xmlData.match(/<entry>([\\s\\S]*?)<\\/entry>/g);

    if (!entryMatches) {
      return { results: [], error: 'No ArXiv results found' };
    }

    // Process each entry
    const entries = [];
    entryMatches.forEach((entryXml, index) => {
      // Extract title, authors, summary, link, etc.
      const title = entryXml.match(/<title>([\\s\\S]*?)<\\/title>/)?.[1] || '';
      const summary = entryXml.match(/<summary>([\\s\\S]*?)<\\/summary>/)?.[1] || '';
      const link = entryXml.match(/<id>([\\s\\S]*?)<\\/id>/)?.[1] || '';

      entries.push({
        title: title.trim(),
        link,
        snippet: summary.trim().substring(0, 200) + '...',
        source: 'arxiv.org',
        date: null
      });
    });

    return { results: entries, error: null };
  } catch (error) {
    return { results: [], error: \`Error searching ArXiv: \${error.message}\` };
  }
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create an education query endpoint</p>
            <p>Set up an Express endpoint that handles education queries with search options.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// In the server file
app.post('/education-query', express.json(), async (req, res) => {
  try {
    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    // Check if searches are enabled
    const enableWebSearch = req.body.enableWebSearch !== false;
    const enableAcademicSearch = req.body.enableAcademicSearch === true;

    let prompt = educationalContext; // Base context for education
    let webSearchResults = null;
    let arxivResults = null;
    let metadata = {};

    // Perform searches based on user preferences
    if (enableWebSearch) {
      webSearchResults = await searchWeb(req.body.prompt, 5);
      metadata.webSearchResults = webSearchResults.results;
      metadata.webSearchError = webSearchResults.error;
    }

    if (enableAcademicSearch) {
      arxivResults = await searchArxiv(req.body.prompt, 5);
      metadata.arxivResults = arxivResults.results;
      metadata.academicSearchError = arxivResults.error;
    }

    // Add search results to the prompt if available
    if (webSearchResults && webSearchResults.results.length > 0) {
      prompt += "\\n\\nWeb search results:\\n";
      webSearchResults.results.forEach((result, index) => {
        prompt += \`\${index + 1}. \${result.title}\\n\${result.snippet}\\nSource: \${result.source}\\nURL: \${result.link}\\n\\n\`;
      });
    }

    if (arxivResults && arxivResults.results.length > 0) {
      prompt += "\\n\\nAcademic papers from ArXiv:\\n";
      arxivResults.results.forEach((result, index) => {
        prompt += \`\${index + 1}. \${result.title}\\n\${result.snippet}\\nURL: \${result.link}\\n\\n\`;
      });
    }

    // Add the user's query
    prompt += \`\\nUser query: \${req.body.prompt}\\n\\nPlease provide a comprehensive, educational response:\`;

    // Call Gemini API with the enhanced prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Return the response with metadata
    res.json({
      response,
      metadata
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Add toggle switches to the UI</p>
            <p>Create toggle switches for users to control search options.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`{/* Web Search Toggle */}
<button
  className={\`px-3 py-1.5 text-xs \${
    webSearchMetadata && webSearchMetadata.webSearchError
      ? 'text-yellow-500 hover:text-yellow-600'
      : enableWebSearch
        ? 'text-green-600 hover:text-green-700'
        : 'text-gray-500 hover:text-black'
  } transition-colors duration-200 flex items-center\`}
  onClick={() => setEnableWebSearch(!enableWebSearch)}
  title={
    webSearchMetadata && webSearchMetadata.webSearchError
      ? "Web search API not properly configured"
      : enableWebSearch
        ? "Web search enabled"
        : "Web search disabled"
  }
>
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
  {webSearchMetadata && webSearchMetadata.webSearchError
    ? "Web Search: Not Configured"
    : enableWebSearch
      ? "Web Search: On"
      : "Web Search: Off"
  }
</button>

{/* Academic Search Toggle */}
<button
  className={\`px-3 py-1.5 text-xs \${
    webSearchMetadata && webSearchMetadata.academicSearchError
      ? 'text-yellow-500 hover:text-yellow-600'
      : enableAcademicSearch
        ? 'text-blue-600 hover:text-blue-700'
        : 'text-gray-500 hover:text-black'
  } transition-colors duration-200 flex items-center\`}
  onClick={() => setEnableAcademicSearch(!enableAcademicSearch)}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
  {webSearchMetadata && webSearchMetadata.academicSearchError
    ? "ArXiv: Not Configured"
    : enableAcademicSearch
      ? "ArXiv: On"
      : "ArXiv: Off"
  }
</button>`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Chef's Notes</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            Our multi-source search approach provides several benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Enhanced AI Responses:</span> By providing the AI with real-time web search results and academic papers, responses are more accurate, up-to-date, and well-referenced.
            </li>
            <li>
              <span className="font-medium">User Control:</span> Toggle switches allow users to decide which search sources to include, giving them control over the AI's knowledge sources.
            </li>
            <li>
              <span className="font-medium">Academic Rigor:</span> ArXiv integration brings scholarly research into responses, making them more suitable for educational purposes.
            </li>
            <li>
              <span className="font-medium">Graceful Degradation:</span> The system works even when search APIs aren't configured, falling back to the AI's built-in knowledge.
            </li>
          </ul>
          <p className="mt-4">
            This approach significantly improves the quality of educational responses by grounding them in current web content and academic research, reducing hallucinations and providing more accurate information.
          </p>
        </div>
      </section>

      {/* Instructions Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions Tips</h3>
        <div className="text-sm text-gray-600 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">API Key Management:</span> Store API keys securely in environment variables and never expose them in client-side code.
            </li>
            <li>
              <span className="font-medium">Rate Limiting:</span> Implement rate limiting for search APIs to avoid exceeding quotas and unexpected costs.
            </li>
            <li>
              <span className="font-medium">Error Handling:</span> Provide clear feedback when search APIs fail or aren't configured properly.
            </li>
            <li>
              <span className="font-medium">Caching:</span> Consider caching search results for common queries to improve performance and reduce API calls.
            </li>
            <li>
              <span className="font-medium">Prompt Engineering:</span> Carefully structure how search results are added to the AI prompt to ensure they're properly utilized in the response.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default EduSearchRecipe;
