# 🎯 Tolerable

> **AI-powered media and content analysis platform**

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/bniladridas/tolerable-prod)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb.svg)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-orange.svg)](https://ai.google.dev/)

**Tolerable** is a modern, AI-driven platform that leverages Google's Gemini 1.5 Flash model to provide comprehensive media analysis, content generation, and educational tools. Built with React and Express.js, it offers a seamless experience for processing images, videos, audio, and text content.

## Features

- AI-powered content analysis with Gemini 1.5 Flash
- Image processing and analysis
- Video file processing
- Audio file processing and transcription
- YouTube video analysis
- GitHub user and repository analysis
- Educational content with web search and ArXiv integration
- Code assistance (EDI)
- Recipe generation and cookbook
- Responsive design with mobile support

## Server Architecture

### Main Server
- **`consolidated-server.js`** - Primary Express.js server (port 3030)
  - Handles all API endpoints
  - Serves built React application
  - Manages file uploads and processing
  - Integrates with Google Generative AI (Gemini 1.5 Flash)

### Server Utilities
- **`kill-server.js`** - Server process management utility
- **`improved-arxiv-search-regex.js`** - ArXiv academic paper search module
- **`copy-changelog.js`** - Pre-build script for documentation

### Server Commands
```bash
# Start main server
pnpm run server

# Development server with auto-restart
pnpm run dev-server

# Run both frontend and backend
pnpm run dev

# Kill server processes
pnpm run kill-server
```

## Project Structure

```
tolerable/
├── src/                          # React frontend source code
│   ├── components/               # React components
│   │   ├── recipes/             # Recipe components for cookbook
│   │   ├── Education.js         # Education component with ArXiv integration
│   │   ├── AILab.js            # AI Lab component
│   │   ├── Diagnostics.js      # Browser diagnostics
│   │   └── ...                 # Other components
│   ├── contexts/               # React contexts
│   ├── services/               # Frontend services
│   └── utils/                  # Utility functions
├── public/                      # Static assets
├── build/                       # Built React application
├── logo/                        # Logo assets (em dash style)
├── docs/                        # Documentation
├── uploads/                     # File upload directory
├── consolidated-server.js       # Main Express.js server
├── kill-server.js              # Server management utility
├── improved-arxiv-search-regex.js # ArXiv search module
├── copy-changelog.js           # Documentation script
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bniladridas/tolerable-prod.git
   cd tolerable-prod
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file in root directory
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Build the application:**
   ```bash
   pnpm run build
   ```

## Usage

### Development Mode
```bash
# Run both frontend and backend in development
pnpm run dev

# Or run separately:
pnpm start                    # Frontend only (port 3000)
pnpm run dev-server          # Backend only (port 3030)
```

### Production Mode
```bash
# Build and start production server
pnpm run build
pnpm run server
```

## Deployment

### Vercel Deployment (Recommended)
This application is optimized for deployment on Vercel with serverless functions.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

**Environment Variables Required:**
- `REACT_APP_GEMINI_API_KEY` - Your Google Gemini API key

**Deployment Features:**
- ✅ Serverless backend functions
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ Preview deployments for branches
- ✅ Built-in analytics

For detailed deployment instructions, see [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT_GUIDE.md).

## AI Model

This application uses **Google Gemini 1.5 Flash** exclusively for all AI-powered features:
- Text generation and analysis
- Image processing and analysis
- Video analysis and transcription
- Audio processing
- Code assistance
- Educational content generation

## License

MIT License - see LICENSE file for details.