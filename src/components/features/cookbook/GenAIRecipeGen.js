import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * AI Model Orchestration for Recipes component
 *
 * This component explains how Tolerable uses AI model orchestration to create and manage recipes
 */
const GenAIRecipeGen = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        AI Model Orchestration for Recipes
        <p className="text-sm text-gray-600">
          Model orchestration for dynamic recipe content generation and management.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">10 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Ingredients
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>Multiple AI model integrations (Gemini 1.5/2.0 Flash, GPT-4o, Claude 3)</li>
          <li>Model orchestration framework</li>
          <li>Task-based routing system</li>
          <li>Model capability definitions</li>
          <li>Fallback mechanisms</li>
          <li>Response caching system</li>
          <li>Usage tracking and analytics</li>
          <li>Prompt engineering templates</li>
          <li>Content formatting utilities</li>
          <li>Error handling mechanisms</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Define Model Capabilities and Endpoints</p>
            <p>Create a registry of available AI models with their capabilities and endpoints.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Define available models with their capabilities
const models = {
  'gemini-1.5-flash': {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    apiKey: process.env.REACT_APP_GEMINI_API_KEY,
    maxTokens: 4096,
    capabilities: ['text', 'image-analysis', 'code', 'reasoning', 'video-analysis', 'audio-processing']
  }
  // Note: This application uses only Gemini 1.5 Flash for all AI tasks
  // Other models shown here are examples for educational purposes only
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Task Profiles for Recipe Types</p>
            <p>Define task profiles that specify which models are preferred for different recipe types.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Task profiles determine which model to use for each task type
const taskProfiles = {
  'recipe-generation': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['text', 'code', 'reasoning']
  },
  'code-generation': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['code']
  }
};
// Note: Voice crafting functionality has been removed from this application
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Model Selection Logic</p>
            <p>Create a function to select the appropriate model based on task requirements.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Select the appropriate model for a given task
function selectModelForTask(taskType) {
  const profile = taskProfiles[taskType];
  if (!profile) {
    return 'gemini-1.5-flash'; // Default model
  }

  // Find the first available model that meets the requirements
  for (const modelName of profile.priority) {
    const model = models[modelName];
    if (model && profile.requiredCapabilities.every(cap =>
      model.capabilities.includes(cap))) {
      return modelName;
    }
  }

  return 'gemini-1.5-flash'; // Fallback to default
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Recipe Generation Function</p>
            <p>Implement the main function for generating recipe content using the selected model.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Process a recipe generation request
async function generateRecipe(recipeType, userContext) {
  // Select the appropriate model based on the recipe type
  const modelName = selectModelForTask('recipe-generation');
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  console.log(\`Using \${modelName} for recipe generation\`);

  // Initialize the model
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    }
  });

  // Construct the prompt
  const prompt = \`
  Create a detailed recipe for implementing \${recipeType} in a web application.
  Include code examples, best practices, and implementation steps.
  Format the response in markdown.
  \`;

  // Generate the content
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });

  return result.response.text();
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Caching Mechanism</p>
            <p>Add caching to avoid regenerating the same recipes multiple times.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Simple cache implementation for recipe content
const recipeCache = new Map();

// Get recipe with caching
async function getCachedRecipe(recipeType, userContext) {
  const cacheKey = \`\${recipeType}:\${JSON.stringify(userContext)}\`;

  // Check if we have a cached version
  if (recipeCache.has(cacheKey)) {
    console.log(\`Cache hit for recipe: \${recipeType}\`);
    return recipeCache.get(cacheKey);
  }

  // Generate new recipe content
  const recipeContent = await generateRecipe(recipeType, userContext);

  // Cache the result
  recipeCache.set(cacheKey, recipeContent);

  return recipeContent;
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Add Error Handling and Fallbacks</p>
            <p>Implement error handling and fallback mechanisms for recipe generation.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Generate recipe with fallback mechanisms
async function generateRecipeWithFallback(recipeType, userContext) {
  try {
    // Try primary model first
    return await getCachedRecipe(recipeType, userContext);
  } catch (error) {
    console.error(\`Error generating recipe with primary model: \${error.message}\`);

    // This application only uses Gemini 1.5 Flash
    // Fallback logic would retry with the same model
    console.log('Retrying with Gemini 1.5 Flash after a delay...');

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        }
      });

      // Generate with retry
      const prompt = \`
      Create a detailed recipe for implementing \${recipeType} in a web application.
      Include code examples, best practices, and implementation steps.
      Format the response in markdown.
      \`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      return result.response.text();
    } catch (retryError) {
      console.error(\`Retry with Gemini 1.5 Flash failed: \${retryError.message}\`);
    }

    // If all models fail, return a simple error message
    return "We're sorry, but we couldn't generate this recipe at the moment. Please try again later.";
  }
}`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Notes Section - Simplified */}
      <section className="p-6">
        Notes
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>This application uses only Gemini 1.5 Flash for all recipe generation tasks.</li>
          <li>Gemini 1.5 Flash provides excellent balance of speed, quality, and multimodal capabilities.</li>
          <li>The model handles all types of recipes including code generation, documentation, and analysis.</li>
          <li>The caching system significantly improves performance by avoiding regeneration of common recipes.</li>
          <li>All recipe content is dynamically generated, ensuring it stays current with the latest best practices.</li>
          <li>Error handling includes retry logic with delays to handle temporary API issues.</li>
        </ul>
      </section>
    </article>
  );
};

export default GenAIRecipeGen;
