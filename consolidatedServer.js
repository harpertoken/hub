require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Import the ArXiv search function
const searchArxiv = require('./improved-arxiv-search-regex');

// We'll initialize the client lazily when needed, to avoid crashing the server at startup
// const ytdl = require('ytdl-core'); // Commented out as it's not installed

// Load environment variables
const app = express();
const PORT = process.env.PORT || 3030; // Fixed port for local development

// Ensure uploads directory exists (only in development)
if (process.env.NODE_ENV !== 'production') {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory');
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Configure multer for file uploads - always use memory storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// For memory storage (used by some endpoints)
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
const buildPath = path.resolve('./build');
console.log('Serving static files from:', buildPath);
app.use(express.static(buildPath));

// Initialize Gemini API
// Use REACT_APP_GEMINI_API_KEY consistently across client and server
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('ERROR: No Gemini API key found in environment variables');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Searches the web using Google Custom Search API
 * @param {string} query - The search query
 * @param {number} numResults - Number of results to return (default: 5)
 * @returns {Promise<Object>} - Object with results array and error (if any)
 */
async function searchWeb(query, numResults = 5) {
  try {
    console.log(`Searching the web for: "${query}"`);

    // Get API keys from environment variables
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId || searchEngineId === 'YOUR_SEARCH_ENGINE_ID') {
      console.warn('Google Search API keys not configured properly');
      return {
        results: [],
        error: 'Search API not configured'
      };
    }

    // Build the search URL
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${numResults}`;

    // Make the request
    const response = await axios.get(searchUrl);

    // Check if we have search results
    if (!response.data.items || response.data.items.length === 0) {
      return {
        results: [],
        error: 'No search results found'
      };
    }

    // Format the results
    const results = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: extractDomain(item.link),
      date: item.pagemap?.metatags?.[0]?.['article:published_time'] || null
    }));

    console.log(`Found ${results.length} web search results`);
    return { results, error: null };
  } catch (error) {
    console.error('Error searching the web:', error);
    return {
      results: [],
      error: `Error searching the web: ${error.message}`
    };
  }
}

/**
 * Extracts the domain name from a URL
 * @param {string} url - The URL to extract domain from
 * @returns {string} - The domain name
 */
function extractDomain(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname.replace('www.', '');
  } catch (error) {
    return urlString;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Consolidated server is running' });
});

// Test endpoint
app.get('/test', (_req, res) => {
  console.log('Test endpoint called');
  res.json({ status: 'ok', message: 'Server is running' });
});

// Test endpoint for Gemini API
app.get('/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini API connection...');

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent([
      "Say hello and confirm that you are working correctly."
    ]);

    console.log('Gemini API test successful');
    res.json({
      status: 'success',
      message: 'Gemini API is working correctly',
      response: result.response
    });
  } catch (error) {
    console.error('Gemini API test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gemini API test failed',
      error: error.message
    });
  }
});

// Process video file
app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const prompt = req.body.prompt || 'Analyze this video. Identify key frames, objects, people, and provide a scene classification. Transcribe any speech.';

    console.log(`Processing video file: ${req.file.originalname}, size: ${req.file.size} bytes`);
    console.log(`Using prompt: ${prompt}`);

    // Read the video file (handle both disk and memory storage)
    const videoData = process.env.NODE_ENV === 'production'
      ? req.file.buffer
      : fs.readFileSync(req.file.path);

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: videoData.toString('base64')
        }
      }
    ]);

    // Clean up the uploaded file (only in development with disk storage)
    if (process.env.NODE_ENV !== 'production' && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    // Send the response
    res.json(result.response);
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process video URL
app.post('/process-video-url', express.json(), async (req, res) => {
  try {
    const videoUrl = req.body.videoUrl;
    const prompt = req.body.prompt || 'Analyze this video';

    if (!videoUrl) {
      return res.status(400).json({ error: 'No video URL provided' });
    }

    console.log(`Processing video URL: ${videoUrl}`);
    console.log(`Using prompt: ${prompt}`);

    // Download the video from the URL
    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'arraybuffer'
    });

    // Get the content type
    const contentType = response.headers['content-type'];

    // Check if it's a video
    if (!contentType.startsWith('video/')) {
      return res.status(400).json({ error: 'URL does not point to a video file' });
    }

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: contentType,
          data: Buffer.from(response.data).toString('base64')
        }
      }
    ]);

    // Send the response
    res.json(result.response);
  } catch (error) {
    console.error('Error processing video URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process audio file
app.post('/process-audio', uploadMemory.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`Processing audio file: ${req.file.originalname}, size: ${req.file.size} bytes, type: ${req.file.mimetype}`);

    // Convert file buffer to base64
    const audioBase64 = req.file.buffer.toString('base64');

    // Get the prompt from the request or use a default
    const prompt = req.body.prompt || 'Transcribe this audio. Identify the speaker and any background noises.';

    console.log(`Using prompt: ${prompt}`);

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: audioBase64
        }
      }
    ]);

    // Send the response
    res.json(result.response);
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process YouTube video
app.post('/process-youtube', express.json(), async (req, res) => {
  console.log('YouTube processing endpoint called');
  console.log('Request body:', req.body);

  try {
    const videoId = req.body.videoId;
    const prompt = req.body.prompt || 'Analyze this YouTube video';

    console.log('Processing YouTube video with ID:', videoId);

    // Enhanced validation for video ID
    if (!videoId) {
      console.error('No YouTube video ID provided in request');
      return res.status(400).json({
        error: 'No YouTube video ID provided',
        details: 'The request must include a valid YouTube video ID in the videoId field'
      });
    }

    if (typeof videoId !== 'string' || videoId.trim() === '') {
      console.error('Invalid YouTube video ID format:', videoId);
      return res.status(400).json({
        error: 'Invalid YouTube video ID format',
        details: 'The video ID must be a non-empty string'
      });
    }

    const cleanVideoId = videoId.trim();

    // Validate YouTube video ID format (11 characters, alphanumeric with dashes and underscores)
    if (cleanVideoId.length !== 11 || !/^[a-zA-Z0-9_-]+$/.test(cleanVideoId)) {
      console.error('YouTube video ID has invalid format:', cleanVideoId);
      return res.status(400).json({
        error: 'Invalid YouTube video ID format',
        details: 'YouTube video IDs must be exactly 11 characters long and contain only letters, numbers, dashes, and underscores'
      });
    }

    console.log(`Processing YouTube video ID: ${cleanVideoId}`);

    // Use a direct approach to get YouTube video info without ytdl-core
    try {
      console.log('Attempting to get video info directly...');
      // Construct the YouTube video URL using the cleaned video ID
      const videoUrl = `https://www.youtube.com/watch?v=${cleanVideoId}`;

      // Make a request to get the HTML page
      const response = await axios.get(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      // Extract basic info from HTML (this is a simple approach and might break if YouTube changes their page structure)
      const html = response.data;

      // Extract title (very basic approach)
      let title = 'Unknown Title';
      const titleMatch = html.match(/<title>([^<]*)<\/title>/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(' - YouTube', '');
      }

      console.log('Basic video info retrieved:', title);

      // Try to extract thumbnail URL (very basic approach)
      let thumbnailUrl = null;
      const thumbnailMatch = html.match(/og:image" content="([^"]*)/);
      if (thumbnailMatch && thumbnailMatch[1]) {
        thumbnailUrl = thumbnailMatch[1];
      }

      // Try to get thumbnail if URL was found
      let thumbnailBase64 = null;
      if (thumbnailUrl) {
        try {
          console.log('Attempting to get video thumbnail...');
          // Create a temporary file path for the thumbnail
          const tempThumbnailPath = path.join(__dirname, 'uploads', `thumbnail-${videoId}.jpg`);

          // Use axios to download the thumbnail
          const thumbnailResponse = await axios({
            method: 'GET',
            url: thumbnailUrl,
            responseType: 'arraybuffer'
          });

          // Save the thumbnail
          fs.writeFileSync(tempThumbnailPath, thumbnailResponse.data);

          // Convert to base64
          thumbnailBase64 = Buffer.from(thumbnailResponse.data).toString('base64');

          // Clean up
          fs.unlinkSync(tempThumbnailPath);
          console.log('Thumbnail retrieved successfully');
        } catch (thumbnailError) {
          console.error('Error getting thumbnail:', thumbnailError);
          // Continue without thumbnail
        }
      }

      // Initialize the model - always use Gemini 1.5 Flash
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      // Prepare the content for Gemini
      const contentParts = [];

      // Add the prompt and video details as text
      const textPrompt = `${prompt}\n\nYouTube Video ID: ${cleanVideoId}\nVideo Title: ${title}\nURL: ${videoUrl}\n\nPlease provide an analysis of this YouTube video based on the limited information available. Consider what the title might suggest about the content and purpose of the video.`;

      contentParts.push(textPrompt);

      // Add the thumbnail if available
      if (thumbnailBase64) {
        contentParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: thumbnailBase64
          }
        });
      }

      // Generate content
      console.log('Generating content with Gemini...');
      const result = await model.generateContent(contentParts);

      console.log('Content generated successfully');

      // Send the response
      res.json(result.response);
    } catch (directError) {
      console.error('Error with direct YouTube access:', directError);

      // Final fallback - just use the video ID
      try {
        console.log('Using final fallback with just the video ID...');
        // Construct the YouTube video URL using the cleaned video ID
        const videoUrl = `https://www.youtube.com/watch?v=${cleanVideoId}`;

        // Initialize the model - always use Gemini 1.5 Flash
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash"
        });

        // Generate content based on just the video ID
        const result = await model.generateContent([
          `${prompt}\n\nI'm analyzing YouTube video with ID: ${cleanVideoId}.\nURL: ${videoUrl}\n\nPlease note that I cannot access the actual video content, but I can provide some general information about YouTube videos and what might be in this one based on the video ID.`
        ]);

        res.json(result.response);
      } catch (fallbackError) {
        console.error('Error with fallback YouTube access:', fallbackError);

        // Return a simple error response
        res.status(500).json({
          error: 'Unable to process YouTube video',
          message: 'The server encountered an error while trying to process the YouTube video. Please try again later.'
        });
      }
    }
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze GitHub user profile
app.post('/analyze-github-user', express.json(), async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Missing username' });
    }

    console.log(`Analyzing GitHub user profile: ${username}`);

    // Fetch user information from GitHub API
    try {
      // Get user details
      const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Get user's repositories
      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Get user's organizations
      const orgsResponse = await axios.get(`https://api.github.com/users/${username}/orgs`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Get user's recent activity (events)
      const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events?per_page=30`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Prepare user data
      const userData = {
        login: userResponse.data.login,
        name: userResponse.data.name,
        bio: userResponse.data.bio,
        company: userResponse.data.company,
        location: userResponse.data.location,
        blog: userResponse.data.blog,
        email: userResponse.data.email,
        hireable: userResponse.data.hireable,
        twitterUsername: userResponse.data.twitter_username,
        publicRepos: userResponse.data.public_repos,
        publicGists: userResponse.data.public_gists,
        followers: userResponse.data.followers,
        following: userResponse.data.following,
        createdAt: userResponse.data.created_at,
        updatedAt: userResponse.data.updated_at,
        avatarUrl: userResponse.data.avatar_url,
        htmlUrl: userResponse.data.html_url,

        // Top repositories
        topRepositories: reposResponse.data.map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          updatedAt: repo.updated_at
        })),

        // Organizations
        organizations: orgsResponse.data.map(org => ({
          login: org.login,
          url: org.url,
          avatarUrl: org.avatar_url
        })),

        // Recent activity
        recentActivity: eventsResponse.data.slice(0, 10).map(event => ({
          type: event.type,
          repo: event.repo.name,
          createdAt: event.created_at
        }))
      };

      // Initialize the model - always use Gemini 1.5 Flash
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      // Generate prompt for Gemini
      const prompt = `
Analyze the following GitHub user profile and provide a comprehensive overview:

User: ${userData.login}
Name: ${userData.name || 'Not provided'}
Bio: ${userData.bio || 'Not provided'}
Company: ${userData.company || 'Not provided'}
Location: ${userData.location || 'Not provided'}
Blog/Website: ${userData.blog || 'Not provided'}
Email: ${userData.email || 'Not provided'}
Twitter: ${userData.twitterUsername ? '@' + userData.twitterUsername : 'Not provided'}
Public Repositories: ${userData.publicRepos}
Public Gists: ${userData.publicGists}
Followers: ${userData.followers}
Following: ${userData.following}
GitHub Member Since: ${userData.createdAt}
Profile URL: ${userData.htmlUrl}

Top Repositories:
${userData.topRepositories.map(repo =>
  `- ${repo.name}: ${repo.description || 'No description'} (${repo.language || 'No language specified'}, ⭐ ${repo.stars}, 🍴 ${repo.forks})`
).join('\n')}

Organizations:
${userData.organizations.length > 0 ?
  userData.organizations.map(org => `- ${org.login}`).join('\n') :
  'No organizations found'}

Recent Activity:
${userData.recentActivity.map(activity =>
  `- ${activity.type} on ${activity.repo} (${activity.createdAt})`
).join('\n')}

Please provide:
1. A concise summary of this GitHub user's profile and activity
2. Their apparent technical expertise and skills based on repositories and activity
3. Their main areas of interest or specialization
4. Notable projects or contributions
5. Activity patterns and engagement level in the GitHub community
6. Potential collaboration opportunities or areas where they might be looking to contribute

Format your response in Markdown with clear headings and bullet points where appropriate.
`;

      // Generate content
      const result = await model.generateContent(prompt);

      // Send the response
      res.json(result.response);

    } catch (githubError) {
      console.error('Error fetching GitHub user data:', githubError);

      // If GitHub API fails, still try to analyze with limited information
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const fallbackPrompt = `
Analyze the GitHub user ${username}.

I couldn't fetch detailed information from the GitHub API, but please provide:
1. What you can infer about this GitHub user based on their username
2. Potential areas of expertise or interests they might have
3. General advice for someone looking to connect with this GitHub user
4. Common patterns or activities seen in GitHub profiles

Format your response in Markdown with clear headings and bullet points where appropriate.
`;

      const result = await model.generateContent(fallbackPrompt);
      res.json(result.response);
    }

  } catch (error) {
    console.error('Error analyzing GitHub user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze GitHub repository
app.post('/analyze-github-repo', express.json(), async (req, res) => {
  try {
    const { username, repo } = req.body;

    if (!username || !repo) {
      return res.status(400).json({ error: 'Missing username or repository name' });
    }

    console.log(`Analyzing GitHub repository: ${username}/${repo}`);

    // Fetch repository information from GitHub API
    try {
      // Get repository details
      const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Get repository languages
      const languagesResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/languages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Get README content if available
      let readmeContent = '';
      try {
        const readmeResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Tolerable-App'
          }
        });

        // Decode base64 content
        readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
      } catch (readmeError) {
        console.log('README not found or not accessible');
      }

      // Get contributors
      const contributorsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}/contributors?per_page=10`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Tolerable-App'
        }
      });

      // Prepare repository data
      const repoData = {
        name: repoResponse.data.name,
        fullName: repoResponse.data.full_name,
        description: repoResponse.data.description,
        url: repoResponse.data.html_url,
        homepage: repoResponse.data.homepage,
        stars: repoResponse.data.stargazers_count,
        forks: repoResponse.data.forks_count,
        watchers: repoResponse.data.watchers_count,
        openIssues: repoResponse.data.open_issues_count,
        defaultBranch: repoResponse.data.default_branch,
        createdAt: repoResponse.data.created_at,
        updatedAt: repoResponse.data.updated_at,
        pushedAt: repoResponse.data.pushed_at,
        size: repoResponse.data.size,
        license: repoResponse.data.license ? repoResponse.data.license.name : 'No license',
        languages: languagesResponse.data,
        contributors: contributorsResponse.data.map(contributor => ({
          username: contributor.login,
          contributions: contributor.contributions,
          url: contributor.html_url
        })),
        readme: readmeContent
      };

      // Initialize the model - always use Gemini 1.5 Flash
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      // Generate prompt for Gemini
      const prompt = `
Analyze the following GitHub repository and provide a comprehensive overview:

Repository: ${repoData.fullName}
Description: ${repoData.description || 'No description provided'}
URL: ${repoData.url}
Homepage: ${repoData.homepage || 'None'}
Stars: ${repoData.stars}
Forks: ${repoData.forks}
Open Issues: ${repoData.openIssues}
Created: ${repoData.createdAt}
Last Updated: ${repoData.updatedAt}
Last Pushed: ${repoData.pushedAt}
Size: ${repoData.size} KB
License: ${repoData.license}

Languages: ${Object.keys(repoData.languages).join(', ')}

Top Contributors:
${repoData.contributors.map(c => `- ${c.username} (${c.contributions} contributions)`).join('\n')}

README Content:
${repoData.readme ? repoData.readme.substring(0, 5000) + (repoData.readme.length > 5000 ? '... (truncated)' : '') : 'No README found'}

Please provide:
1. A concise summary of what this repository is about
2. The main technologies and frameworks used
3. The apparent purpose and functionality of the project
4. Notable features or aspects of the codebase
5. Potential use cases for this project
6. Any recommendations for users or contributors

Format your response in Markdown with clear headings and bullet points where appropriate.
`;

      // Generate content
      const result = await model.generateContent(prompt);

      // Send the response
      res.json(result.response);

    } catch (githubError) {
      console.error('Error fetching GitHub repository data:', githubError);

      // If GitHub API fails, still try to analyze with limited information
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const fallbackPrompt = `
Analyze the GitHub repository ${username}/${repo}.

I couldn't fetch detailed information from the GitHub API, but please provide:
1. What you can infer about this repository based on its name
2. Potential technologies that might be used in a repository with this name
3. Possible purposes and applications of a project with this name
4. General advice for someone interested in this type of repository

Format your response in Markdown with clear headings and bullet points where appropriate.
`;

      const result = await model.generateContent(fallbackPrompt);
      res.json(result.response);
    }

  } catch (error) {
    console.error('Error analyzing GitHub repository:', error);
    res.status(500).json({ error: error.message });
  }
});

// EDI prompt endpoint
app.post('/edi-prompt', express.json(), async (req, res) => {
  try {
    const { prompt, code, language } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    console.log(`Processing EDI prompt for ${language} code`);

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate prompt for Gemini
    const promptText = `
You are an expert programming assistant. Please help with the following code in ${language}:

\`\`\`${language}
${code}
\`\`\`

User request: ${prompt}

Please provide a helpful, detailed response. If you're suggesting code changes, include them in a properly formatted code block using triple backticks.
If appropriate, explain why your suggested changes improve the code.
`;

    // Generate content
    const result = await model.generateContent(promptText);

    // Send the response
    res.json(result.response);

  } catch (error) {
    console.error('Error processing EDI prompt:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process text endpoint for voice assistant
app.post('/gemini-text', express.json(), async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body));

    if (!req.body) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    let content;

    // Handle different request formats
    if (req.body.contents) {
      // Standard format
      content = req.body.contents;
    } else if (req.body.text) {
      // Simple text format - no formatting instructions
      content = req.body.text;
    } else {
      return res.status(400).json({ error: 'Invalid request format - missing contents or text' });
    }

    console.log('Processing text query with Gemini...', content);

    // Initialize the model - always use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent(content);

    console.log('Received response from Gemini');
    res.json(result.response);
  } catch (error) {
    console.error('Error processing text query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create shareable link for video (disabled in production - requires persistent storage)
app.post('/create-shareable-link', upload.single('video'), async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(501).json({
      error: 'Video sharing is not available in production deployment. This feature requires persistent file storage.'
    });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    console.log(`Creating shareable link for video: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Generate a unique ID for the video
    const videoId = Date.now().toString(36) + Math.random().toString(36).substring(2, 15);

    // Create a permanent path for the video
    const videoFilename = `shared-${videoId}.mp4`;
    const videoPath = path.join(__dirname, 'uploads', videoFilename);

    // Convert to MP4 for better compatibility
    const { spawn } = require('child_process');
    const ffmpeg = spawn('ffmpeg', [
      '-i', req.file.path,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '128k',
      videoPath
    ]);

    ffmpeg.on('error', (err) => {
      console.error('Error spawning ffmpeg process:', err);
      res.status(500).json({ error: 'Error processing video' });
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log(`ffmpeg: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        console.error(`ffmpeg process exited with code ${code}`);
        return res.status(500).json({ error: 'Error processing video' });
      }

      // Clean up the original file
      fs.unlinkSync(req.file.path);

      // Create a shareable URL
      const shareableUrl = `${req.protocol}://${req.get('host')}/shared-video/${videoId}`;

      // Return the shareable URL
      res.json({
        success: true,
        shareableUrl,
        videoId
      });
    });
  } catch (error) {
    console.error('Error creating shareable link:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve shared videos (disabled in production - requires persistent storage)
app.get('/shared-video/:videoId', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(501).send('Video sharing is not available in production deployment.');
  }

  try {
    const videoId = req.params.videoId;
    const videoPath = path.join(__dirname, 'uploads', `shared-${videoId}.mp4`);

    // Check if the video exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video not found');
    }

    // Serve an HTML page with the video embedded
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tolerable Education - Shared Video</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #fff;
          color: #000;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
        }
        h1 {
          font-size: 24px;
          font-weight: 500;
        }
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          margin-bottom: 20px;
        }
        video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
        }
        .download-btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
          margin-right: 10px;
        }
        .download-btn:hover {
          background-color: #333;
        }
        footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .social-share {
          margin-top: 20px;
        }
        .social-btn {
          display: inline-block;
          padding: 8px 15px;
          margin: 0 5px;
          background-color: #f5f5f5;
          color: #333;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <img src="/assets/logo-alt.svg" alt="Logo" class="logo">
          <h1>Education</h1>
          <p style="font-size: 14px; color: #666; margin-top: 5px;">Shared with humility and respect</p>
        </header>

        <div class="video-container">
          <video controls autoplay>
            <source src="/shared-video-file/${videoId}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>

        <div>
          <a href="/shared-video-file/${videoId}?download=true" class="download-btn">Download MP4</a>
        </div>

        <div class="social-share">
          <p>Share this video:</p>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`${req.protocol}://${req.get('host')}/shared-video/${videoId}`)}&text=Sharing%20this%20educational%20resource%20with%20humility%20and%20respect.%20From%20Tolerable%20Education." class="social-btn" target="_blank">Twitter</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${req.protocol}://${req.get('host')}/shared-video/${videoId}`)}" class="social-btn" target="_blank">Facebook</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${req.protocol}://${req.get('host')}/shared-video/${videoId}`)}" class="social-btn" target="_blank">LinkedIn</a>
        </div>

        <footer>
          <p>Intelligence, reimagined with humility and respect</p>
          <p><a href="/">Return to Tolerable Education</a></p>
        </footer>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error serving shared video:', error);
    res.status(500).send('Error serving video');
  }
});

// Serve the actual video file for shared videos (disabled in production)
app.get('/shared-video-file/:videoId', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(501).send('Video file serving is not available in production deployment.');
  }

  try {
    const videoId = req.params.videoId;
    const videoPath = path.join(__dirname, 'uploads', `shared-${videoId}.mp4`);

    // Check if the video exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video not found');
    }

    // Set headers for download if requested
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename=education-video-${videoId}.mp4`);
    }

    // Stream the video
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests (streaming)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      });

      file.pipe(res);
    } else {
      // Send the entire file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      });

      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video file:', error);
    res.status(500).send('Error streaming video');
  }
});

// Convert video format (disabled in production - requires ffmpeg)
app.post('/convert-video', upload.single('video'), async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(501).json({
      error: 'Video conversion is not available in production deployment. This feature requires ffmpeg.'
    });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    console.log(`Processing video conversion: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Get the desired format from the request
    const format = req.body.format || 'mp4';
    console.log(`Converting to format: ${format}`);

    // Create a unique filename for the output
    const outputFilename = `converted-${Date.now()}.${format}`;
    const outputPath = path.join(__dirname, 'uploads', outputFilename);

    // Use ffmpeg to convert the video
    const { spawn } = require('child_process');
    const ffmpeg = spawn('ffmpeg', [
      '-i', req.file.path,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '128k',
      outputPath
    ]);

    // Handle ffmpeg process events
    ffmpeg.on('error', (err) => {
      console.error('Error spawning ffmpeg process:', err);
      res.status(500).json({ error: 'Error converting video' });
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log(`ffmpeg: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        console.error(`ffmpeg process exited with code ${code}`);
        return res.status(500).json({ error: 'Error converting video' });
      }

      // Read the converted file
      fs.readFile(outputPath, (err, data) => {
        if (err) {
          console.error('Error reading converted file:', err);
          return res.status(500).json({ error: 'Error reading converted file' });
        }

        // Set the appropriate content type
        const contentType = format === 'mp4' ? 'video/mp4' : 'video/webm';

        // Send the file
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);
        res.send(data);

        // Clean up the files
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (error) {
    console.error('Error converting video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate prompt suggestions
app.post('/suggest-prompts', express.json(), async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim().length < 3) {
      return res.status(400).json({ error: 'Input too short' });
    }

    console.log(`Generating prompt suggestions for: ${input}`);

    // Initialize the model (Gemini 1.5 Flash for faster response)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent(`
      I'm trying to ask an AI assistant about "${input}".
      Please suggest 5 well-formed, specific questions or prompts that would help me get the most useful and detailed information about this topic.
      Make the suggestions diverse, covering different aspects or approaches to the topic.
      Each suggestion should be clear, specific, and designed to elicit a detailed response.
      Format your response as a simple list with one suggestion per line, without numbering or bullet points.
    `);

    // Extract suggestions from the response
    const text = result.response.text();
    const suggestions = text.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.startsWith('*'))
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering
      .filter(line => line.length > 10); // Filter out too short suggestions

    // Return the suggestions
    res.json({ suggestions: suggestions.slice(0, 5) });
  } catch (error) {
    console.error('Error generating prompt suggestions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Education query endpoint
app.post(['/api/education-query', '/education-query'], express.json(), async (req, res) => {
  try {
    console.log('Received education query:', req.body.prompt);

    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    // Check if web search is enabled (default to true)
    const enableWebSearch = req.body.enableWebSearch !== false;

    // Check if academic search is enabled (default to false)
    const enableAcademicSearch = req.body.enableAcademicSearch === true;

    // Add educational context to the prompt
    const educationalContext = 'You are an educational assistant helping users learn about various topics with humility and respect. Approach each question with the understanding that knowledge is a journey we take together. Provide detailed, accurate, and educational responses that are useful, sustainable, and meaningful. Format your answers using Markdown with proper headings, lists, and code blocks where appropriate. For mathematical or scientific content, use LaTeX notation. Include examples, analogies, and explanations suitable for learning. Acknowledge different perspectives where appropriate, and if relevant, suggest further reading or related topics the user might be interested in. Remember that it\'s not just about information—it\'s about impact.\n\n';

    let prompt = educationalContext;
    let webSearchResults = null;
    let arxivResults = null;

    // Perform searches based on user preferences
    if (enableWebSearch || enableAcademicSearch) {
      try {
        // Perform web search if enabled
        if (enableWebSearch) {
          console.log('Web search enabled, searching for:', req.body.prompt);
          webSearchResults = await searchWeb(req.body.prompt, 5);
        }

        // Perform ArXiv search if enabled
        if (enableAcademicSearch) {
          console.log('Academic search enabled, searching ArXiv for:', req.body.prompt);
          arxivResults = await searchArxiv(req.body.prompt, 5);
        }

        // Combine results from both sources
        let hasResults = false;

        // Add web search results to the prompt if available
        if (enableWebSearch && webSearchResults && webSearchResults.results && webSearchResults.results.length > 0) {
          hasResults = true;
          prompt += "I've searched the web for the most current information about this topic. Here are the search results:\n\n";

          webSearchResults.results.forEach((result, index) => {
            prompt += `[Web ${index + 1}] "${result.title}" (${result.source})\n`;
            prompt += `${result.snippet}\n`;
            prompt += `URL: ${result.link}\n\n`;
          });
        }

        // Add ArXiv results to the prompt if available
        if (enableAcademicSearch && arxivResults && arxivResults.results && arxivResults.results.length > 0) {
          hasResults = true;
          prompt += "I've also searched ArXiv for academic research papers on this topic. Here are the research papers:\n\n";

          arxivResults.results.forEach((result, index) => {
            prompt += `[ArXiv ${index + 1}] "${result.title}"\n`;
            prompt += `Authors: ${result.authors || 'Not specified'}\n`;
            prompt += `Published: ${result.date || 'Date not specified'}\n`;
            prompt += `Summary: ${result.snippet}\n`;
            prompt += `URL: ${result.link}\n\n`;
          });
        }

        if (hasResults) {
          prompt += "Using the above search results and your knowledge, please provide a comprehensive answer to the following question:\n\n";
          prompt += req.body.prompt;

          // Add instruction to cite sources
          prompt += "\n\nPlease cite the search results when you use information from them in your answer. Include a 'Sources' section at the end listing the relevant sources.";
        } else {
          // If no search results or error, just use the original prompt
          console.log('No search results found or search failed, using base knowledge only');
          prompt += req.body.prompt;

          // If there were errors, add a note about them
          if (webSearchResults && webSearchResults.error) {
            console.log('Web search error:', webSearchResults.error);
          }
          if (arxivResults && arxivResults.error) {
            console.log('ArXiv search error:', arxivResults.error);
          }
        }
      } catch (error) {
        // Handle any unexpected errors in the search process
        console.error('Unexpected error during search:', error);
        prompt += req.body.prompt;
      }
    } else {
      // All searches disabled, use original prompt
      console.log('All searches disabled, using base knowledge only');
      prompt += req.body.prompt;
    }

    console.log('Processing educational query with Gemini...');

    // Use only Gemini 1.5 Flash model
    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Generate content
    const result = await model.generateContent(prompt);
    console.log('Received educational response from Gemini 1.5 Flash');

    // Add metadata about web search and academic search to the response
    const response = {
      ...result.response,
      metadata: {
        webSearchEnabled: enableWebSearch,
        webSearchPerformed: enableWebSearch && webSearchResults !== null,
        webSearchResultsCount: webSearchResults?.results?.length || 0,
        webSearchError: webSearchResults?.error || null,
        academicSearchEnabled: enableAcademicSearch,
        academicSearchPerformed: enableAcademicSearch && arxivResults !== null,
        academicSearchResultsCount: arxivResults?.results?.length || 0,
        academicSearchError: arxivResults?.error || null
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing educational query:', error);

    // Check if it's a quota error for better error messaging
    if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later when the quota resets.',
        details: error.message
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// Process image with Gemini
app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log(`Processing image: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Get the prompt from the request or use a default
    const prompt = req.body.prompt || 'Describe this image in detail. Identify objects, people, scenes, colors, and any other notable elements.';

    // Read the file as a buffer (handle both disk and memory storage)
    const imageBuffer = process.env.NODE_ENV === 'production'
      ? req.file.buffer
      : fs.readFileSync(req.file.path);

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

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    console.log('Received image analysis response from Gemini');

    // Clean up the uploaded file (only in development with disk storage)
    if (process.env.NODE_ENV !== 'production' && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    // Send the response
    res.json(result.response);
  } catch (error) {
    console.error('Error processing image:', error);

    // Check if it's a quota error for better error messaging
    if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later when the quota resets.',
        details: error.message
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// General Gemini API endpoint for text-based queries
app.post('/api/gemini', express.json(), async (req, res) => {
  try {
    console.log('Received Gemini API request:', req.body.prompt ? req.body.prompt.substring(0, 100) + '...' : 'No prompt');

    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    // Always use Gemini 1.5 Flash for all AI services
    const modelName = "gemini-1.5-flash";
    console.log(`Using model: ${modelName}`);

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: modelName
    });

    // Generate content
    const result = await model.generateContent(req.body.prompt);
    console.log('Received response from Gemini API');

    // Send the response
    res.json({
      status: 'success',
      response: result.response.text()
    });
  } catch (error) {
    console.error('Error processing Gemini API request:', error);

    // Check if it's a quota error for better error messaging
    if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later when the quota resets.',
        details: error.message
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Export the Express app for Vercel
module.exports = app;

// Only start the server if we're in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
