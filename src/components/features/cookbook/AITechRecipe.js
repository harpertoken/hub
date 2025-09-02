import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AITechRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium mb-2">AI Integration Techniques</h2>
        <p className="text-sm text-gray-600">
          Machine learning and computer science techniques used throughout the application.
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
          <li>AI as a Service (AIaaS) integration</li>
          <li>Foundation models (Gemini 1.5 Flash, 2.0 Flash)</li>
          <li>Prompt engineering techniques</li>
          <li>Model selection strategy</li>
          <li>Multimodal processing pipelines</li>
          <li>Retrieval-augmented generation (RAG)</li>
          <li>Agent framework for task execution</li>
          <li>Data science techniques (NLP, time series analysis)</li>
          <li>Data visualization methods</li>
          <li>Speech processing capabilities</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Implement AI as a Service (AIaaS) Integration</p>
            <p>Use cloud-based machine learning services through APIs rather than implementing models directly.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Initialize Gemini API
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('ERROR: No Gemini API key found in environment variables');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Example API call
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(prompt);
const response = result.response.text();`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Leverage Foundation Models</p>
            <p>Use pre-trained multimodal large language models (MLLMs) for various tasks.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Using Gemini 1.5 Flash for all AI tasks
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// This model handles all content generation, analysis, and processing
// It's multimodal and supports text, images, video, and audio`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Apply Prompt Engineering Techniques</p>
            <p>Craft structured prompts to get desired outputs from foundation models.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Structured prompt for GitHub repository analysis
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

// Model selection helper function - an example of conditional computation
const selectGeminiModel = (task, content) => {
  // Default to Gemini 1.5 Flash for all tasks
  let modelName = "gemini-1.5-flash";

  // This application uses only Gemini 1.5 Flash for all tasks
  console.log(\`Using model \${modelName} for task: \${task}\`);
  return modelName;
};

// Usage example
const modelName = selectGeminiModel('content-analysis');
const model = genAI.getGenerativeModel({
  model: modelName
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Model Selection Strategy (Conditional Computation)</p>
            <p>Select different models based on task requirements and complexity.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Model selection helper function - an example of conditional computation
const selectGeminiModel = (task, content) => {
  // Default to Gemini 1.5 Flash for all tasks
  let modelName = "gemini-1.5-flash";

  // This application uses only Gemini 1.5 Flash for all tasks
  console.log(\`Using model \${modelName} for task: \${task}\`);
  return modelName;
};

// Usage example
const modelName = selectGeminiModel('content-analysis');
const model = genAI.getGenerativeModel({
  model: modelName
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Multimodal Processing Pipelines</p>
            <p>Handle different types of data (text, images, audio) with appropriate processing.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Image processing pipeline
if (activeTab === 'image') {
  // Read the file as a buffer
  const imageBuffer = fs.readFileSync(req.file.path);

  // Convert the buffer to base64
  const base64Image = imageBuffer.toString('base64');

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
}`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Retrieval-Augmented Generation (RAG)</p>
            <p>Enhance AI responses by combining search results with model-generated content.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Retrieval-Augmented Generation for education queries
// First, retrieve information from external sources
if (enableWebSearch) {
  webSearchResults = await searchWeb(req.body.prompt, 5);
  metadata.webSearchResults = webSearchResults.results;
}

if (enableAcademicSearch) {
  arxivResults = await searchArxiv(req.body.prompt, 5);
  metadata.arxivResults = arxivResults.results;
}

// Add retrieved information to the prompt
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

// Generate content with the enhanced prompt
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(prompt);
const response = result.response.text();`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Agent Framework</p>
            <p>Create an autonomous agent system for task execution and workflow automation.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Agent framework for autonomous task execution
class AIAgent {
  constructor(config) {
    this.name = config.name || 'Tolerable Agent';
    this.capabilities = config.capabilities || [];
    this.model = genAI.getGenerativeModel({
      model: config.modelName || "gemini-1.5-flash"
    });
    this.memory = [];
    this.maxMemoryItems = config.maxMemoryItems || 10;
    this.taskQueue = [];
  }

  // Add a task to the agent's queue
  async addTask(task) {
    this.taskQueue.push(task);
    console.log(\`Task added to \${this.name}'s queue: \${task.name}\`);

    if (this.taskQueue.length === 1) {
      // If this was the only task, start processing
      this.processNextTask();
    }
  }

  // Process the next task in the queue
  async processNextTask() {
    if (this.taskQueue.length === 0) {
      console.log(\`\${this.name} has completed all tasks\`);
      return;
    }

    const task = this.taskQueue[0];
    console.log(\`\${this.name} is processing task: \${task.name}\`);

    try {
      // Create context from memory and task details
      const context = this.createContextFromMemory(task);

      // Execute the task
      const result = await this.executeTask(task, context);

      // Store the result in memory
      this.addToMemory({
        taskName: task.name,
        result: result,
        timestamp: new Date().toISOString()
      });

      // Task completed successfully
      console.log(\`\${this.name} completed task: \${task.name}\`);
      task.onComplete && task.onComplete(result);
    } catch (error) {
      console.error(\`\${this.name} encountered an error processing task \${task.name}:, error\`);
      task.onError && task.onError(error);
    }

    // Remove the completed task
    this.taskQueue.shift();

    // Process the next task
    this.processNextTask();
  }

  // Execute a specific task
  async executeTask(task, context) {
    // Create a prompt that includes the context and task instructions
    const prompt = \`
    Context:
    \${context}

    Task: \${task.description}

    Instructions: \${task.instructions}
    \`;

    // Generate content using the AI model
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  // Create context from agent's memory
  createContextFromMemory(task) {
    let context = \`You are \${this.name}, an AI agent with the following capabilities: \${this.capabilities.join(', ')}.\`;

    if (this.memory.length > 0) {
      context += \`\\n\\nRecent memory (most recent first):\\n\`;

      // Add relevant memories to the context
      const relevantMemories = this.memory
        .filter(item => item.taskName === task.name || task.relatedTasks.includes(item.taskName))
        .slice(0, 5);

      relevantMemories.forEach((item, index) => {
        context += \`\${index + 1}. Task: \${item.taskName}, Result: \${item.result.substring(0, 200)}\${item.result.length > 200 ? '...' : ''}\\n\`;
      });
    }

    return context;
  }

  // Add an item to the agent's memory
  addToMemory(item) {
    this.memory.unshift(item); // Add to the beginning

    // Trim memory if it exceeds the maximum size
    if (this.memory.length > this.maxMemoryItems) {
      this.memory.pop();
    }
  }
}

// Example usage
const researchAgent = new AIAgent({
  name: 'Research Assistant',
  capabilities: ['web search', 'academic paper analysis', 'content summarization'],
  modelName: 'gemini-1.5-flash',
  maxMemoryItems: 20
});

// Add a task to the agent
researchAgent.addTask({
  name: 'research_quantum_computing',
  description: 'Research recent advances in quantum computing',
  instructions: 'Search for recent papers on quantum computing advances from the last 2 years. Summarize the key findings and breakthroughs.',
  relatedTasks: [],
  onComplete: (result) => {
    console.log('Research completed:', result.substring(0, 100) + '...');
    // Update UI with research results
    setResearchResults(result);
  },
  onError: (error) => {
    console.error('Research task failed:', error);
    setError('Failed to complete research task');
  }
});`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Apply Data Science Techniques</p>
            <p>Implement natural language processing and time series analysis for data insights.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Natural Language Processing for sentiment analysis
const analyzeSentiment = async (text) => {
  try {
    // Use Gemini model for sentiment analysis
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = \`
    Analyze the sentiment of the following text. Classify it as positive, negative, or neutral.
    Also provide a sentiment score from -1.0 (very negative) to 1.0 (very positive).

    Text: "\${text}"

    Respond in JSON format with the following structure:
    {
      "sentiment": "positive|negative|neutral",
      "score": 0.0,
      "explanation": "brief explanation of the sentiment analysis"
    }
    \`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\\{[\\s\\S]*\\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse sentiment analysis result');
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      score: 0,
      explanation: 'Error during sentiment analysis'
    };
  }
};

// Time series analysis for user engagement data
const analyzeEngagementTrends = (engagementData) => {
  // Simple moving average calculation
  const calculateMovingAverage = (data, window) => {
    const result = [];

    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        // Not enough data points yet
        result.push(null);
      } else {
        // Calculate average of the window
        let sum = 0;
        for (let j = 0; j < window; j++) {
          sum += data[i - j].value;
        }
        result.push({
          date: data[i].date,
          value: sum / window
        });
      }
    }

    return result;
  };

  // Calculate growth rate between periods
  const calculateGrowthRate = (currentPeriod, previousPeriod) => {
    if (!previousPeriod || previousPeriod === 0) return 0;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  };

  // Group data by week
  const groupByWeek = (data) => {
    const weeklyData = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          totalEngagement: 0,
          count: 0
        };
      }

      weeklyData[weekKey].totalEngagement += item.value;
      weeklyData[weekKey].count += 1;
    });

    // Convert to array and calculate averages
    return Object.values(weeklyData).map(week => ({
      week: week.week,
      averageEngagement: week.totalEngagement / week.count
    }));
  };

  // Calculate engagement metrics
  const weeklyData = groupByWeek(engagementData);
  const movingAverage = calculateMovingAverage(engagementData, 7); // 7-day moving average

  // Calculate week-over-week growth
  const growthRates = [];
  for (let i = 1; i < weeklyData.length; i++) {
    growthRates.push({
      week: weeklyData[i].week,
      growthRate: calculateGrowthRate(
        weeklyData[i].averageEngagement,
        weeklyData[i-1].averageEngagement
      )
    });
  }

  return {
    weeklyData,
    movingAverage,
    growthRates
  };
};

// Data visualization setup
const createEngagementChart = (engagementData, container) => {
  // Use D3.js or Chart.js for visualization
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Format data for visualization
  const formattedData = engagementData.map(d => ({
    date: new Date(d.date),
    value: d.value
  }));

  // Create SVG container
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

  // Create scales
  const x = d3.scaleTime()
    .domain(d3.extent(formattedData, d => d.date))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(formattedData, d => d.value)])
    .range([height, 0]);

  // Create line generator
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  // Add axes
  svg.append('g')
    .attr('transform', \`translate(0,\${height})\`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .call(d3.axisLeft(y));

  // Add line path
  svg.append('path')
    .datum(formattedData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement Speech Processing</p>
            <p>Use speech-to-text and text-to-speech capabilities with fallback mechanisms.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// Speech Recognition (Speech-to-Text)
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
}

// Text-to-Speech with fallback mechanism
const speakText = useCallback((text) => {
  speakTextWithCloudTTS(text).catch(error => {
    console.error("Error with Cloud TTS, falling back to Web Speech API:", error);
    fallbackToWebSpeech(text);
  });
}, [speakTextWithCloudTTS, fallbackToWebSpeech]);

// Web Speech API fallback
const fallbackToWebSpeech = useCallback((text) => {
  try {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance with customized settings
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;
    utterance.volume = voiceVolume;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Error in speech synthesis:", error);
  }
}, [voicePitch, voiceRate, voiceVolume]);`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Notes Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Chef's Notes</h3>
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            The AI integration approach combines several advanced machine learning and computer science techniques:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">AI as a Service:</span> Cloud-based ML services via APIs
            </li>
            <li>
              <span className="font-medium">Foundation Models:</span> Pre-trained MLLMs like Gemini
            </li>
            <li>
              <span className="font-medium">Prompt Engineering:</span> Structured inputs for controlled outputs
            </li>
            <li>
              <span className="font-medium">Conditional Computation:</span> Task-specific model selection
            </li>
            <li>
              <span className="font-medium">Retrieval-Augmented Generation:</span> External knowledge integration
            </li>
            <li>
              <span className="font-medium">Agent Framework:</span> Task queuing and memory management
            </li>
            <li>
              <span className="font-medium">NLP:</span> Sentiment analysis and text classification
            </li>
            <li>
              <span className="font-medium">Time Series Analysis:</span> Statistical trend identification
            </li>
            <li>
              <span className="font-medium">Data Visualization:</span> D3.js for interactive representations
            </li>
          </ul>
        </div>
      </section>

      {/* Instructions Tips Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium mb-4">Implementation Tips</h3>
        <div className="text-sm text-gray-600">
          <ul className="list-disc pl-5 space-y-2">
            <li>Store API keys in environment variables</li>
            <li>Implement fallback mechanisms for all AI features</li>
            <li>Continuously refine prompts based on observed outputs</li>
            <li>Implement robust error handling for all API calls</li>
            <li>Track API response times and error rates</li>
            <li>Manage agent memory efficiently</li>
            <li>Prioritize tasks in the agent queue</li>
            <li>Clean and normalize data before analysis</li>
            <li>Ensure visualizations are responsive</li>
            <li>Regularly evaluate NLP task performance</li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default AITechRecipe;
