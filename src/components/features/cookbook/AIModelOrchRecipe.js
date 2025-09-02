import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * AI Integration Techniques Component
 *
 * This recipe demonstrates how to implement AI model orchestration in applications,
 * allowing for intelligent routing of requests to different AI models based on task requirements.
 */
const AIModelOrchRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">Advanced AI Model Orchestration</h2>
        <p className="text-sm text-gray-600">
          Intelligent routing of requests to different AI models based on task requirements.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">30 minutes</span>
          <span>Advanced</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Ingredients</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>Multiple AI model API keys (Gemini, OpenAI, Anthropic, etc.)</li>
          <li>Model capability definitions</li>
          <li>Task profile configurations</li>
          <li>Model selection algorithm</li>
          <li>Caching mechanism</li>
          <li>Fallback implementation</li>
          <li>Usage tracking system</li>
          <li>Error handling utilities</li>
          <li>Budget management tools</li>
          <li>Context size estimation functions</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Define Model Registry</p>
            <p>Create a registry of available AI models with their capabilities and constraints.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// AI Model Orchestrator Service
class AIModelOrchestrator {
  constructor() {
    this.models = {
      'gemini-1.5-flash': {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        apiKey: process.env.REACT_APP_GEMINI_API_KEY,
        maxTokens: 4096,
        costPerToken: 0.0001,
        capabilities: ['text', 'image-analysis', 'code', 'reasoning', 'video-analysis', 'audio-processing']
      }
      // Note: This application uses only Gemini 1.5 Flash
      // Other models shown here are examples for educational purposes only
    };

    this.cache = new Map();
    this.usage = {};
  }
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Task Profiles</p>
            <p>Define task profiles that specify which models are preferred for different task types.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`this.taskProfiles = {
  'simple-query': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['text', 'reasoning'],
    contextSize: 'small',
    costSensitivity: 'high'
  },
  'code-generation': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['code', 'reasoning'],
    contextSize: 'medium',
    costSensitivity: 'medium'
  },
  'image-analysis': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['image-analysis', 'text'],
    contextSize: 'medium',
    costSensitivity: 'low'
  },
  'video-analysis': {
    priority: ['gemini-1.5-flash'],
    requiredCapabilities: ['video-analysis', 'text'],
    contextSize: 'large',
    costSensitivity: 'low'
  }
  // Note: All tasks use Gemini 1.5 Flash in this application
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
{`// Select the best model for a given task
selectModelForTask(taskType, inputLength, budget = 'medium') {
  const taskProfile = this.taskProfiles[taskType];
  if (!taskProfile) {
    throw new Error(\`Unknown task type: \${taskType}\`);
  }

  // Filter models by required capabilities
  const eligibleModels = taskProfile.priority.filter(modelName => {
    const model = this.models[modelName];
    return taskProfile.requiredCapabilities.every(cap =>
      model.capabilities.includes(cap)
    );
  });

  // Filter by context size
  const contextSizeFiltered = eligibleModels.filter(modelName => {
    const model = this.models[modelName];

    if (taskProfile.contextSize === 'large' && model.maxTokens < 100000) return false;
    if (taskProfile.contextSize === 'medium' && model.maxTokens < 8000) return false;
    if (inputLength > model.maxTokens) return false;

    return true;
  });

  // Apply budget constraints
  const budgetFiltered = contextSizeFiltered.filter(modelName => {
    const model = this.models[modelName];

    if (budget === 'low' && model.costPerToken > 0.0002) return false;
    if (budget === 'medium' && model.costPerToken > 0.0003) return false;

    return true;
  });

  // Return the best model or fallback
  return budgetFiltered[0] || taskProfile.priority[0];
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Model API Calls</p>
            <p>Create a function to call the selected AI model with appropriate parameters.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Call the selected AI model
async callModel(modelName, prompt, options = {}) {
  const model = this.models[modelName];
  if (!model) {
    throw new Error(\`Unknown model: \${modelName}\`);
  }

  // Check cache first
  const cacheKey = \`\${modelName}:\${prompt}\`;
  if (this.cache.has(cacheKey)) {
    console.log('Cache hit for:', cacheKey);
    return this.cache.get(cacheKey);
  }

  // Prepare request based on model type
  let response;
  try {
    // This application only uses Gemini models
    if (modelName.includes('gemini')) {
      response = await this.callGeminiModel(model, prompt, options);
    } else {
      throw new Error(\`Unsupported model: \${modelName}. This application only supports Gemini models.\`);
    }

    // Update usage statistics
    this.trackUsage(modelName, prompt.length, response.length);

    // Cache the response
    this.cache.set(cacheKey, response);

    return response;
  } catch (error) {
    console.error(\`Error calling \${modelName}:\`, error);
    throw error;
  }
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Provider-Specific API Calls</p>
            <p>Create helper methods for different AI model providers.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Helper method for Gemini API calls
async callGeminiModel(model, prompt, options) {
  const genAI = new GoogleGenerativeAI(model.apiKey);
  const geminiModel = genAI.getGenerativeModel({
    model: model.name,
    generationConfig: {
      temperature: options.temperature || 0.7,
      topK: options.topK || 40,
      topP: options.topP || 0.95,
      maxOutputTokens: options.maxTokens || model.maxTokens / 2,
    }
  });

  const result = await geminiModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });

  return result.response.text();
}`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Notes Section - Simplified */}
      <section className="p-6">
        <h3 className="text-lg font-medium mb-4">Notes</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li><strong>Benchmark Models:</strong> Regularly test different models on your specific tasks to understand their performance characteristics.</li>
          <li><strong>Implement Retry Logic:</strong> Add exponential backoff for retries when API calls fail due to rate limiting or temporary issues.</li>
          <li><strong>Monitor Costs:</strong> Set up alerts for unusual spending patterns to avoid unexpected bills.</li>
          <li><strong>Cache Strategically:</strong> Cache responses for deterministic queries but avoid caching for personalized or time-sensitive content.</li>
          <li><strong>Provide Transparency:</strong> Let users know which model was used for their request, especially when fallbacks are triggered.</li>
          <li><strong>Optimize Prompts:</strong> Craft efficient prompts for each model to reduce token usage and improve response quality.</li>
          <li><strong>Use Streaming:</strong> For long responses, implement streaming to improve perceived performance.</li>
        </ul>
      </section>
    </article>
  );
};

export default AIModelOrchRecipe;
