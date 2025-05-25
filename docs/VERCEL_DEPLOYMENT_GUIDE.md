# 🚀 Vercel Deployment Guide for Tolerable

> **Complete guide to deploy Tolerable on Vercel with pnpm and serverless functions**

## 🎯 Deployment Overview

```
Local Development → GitHub → Vercel → Production
     │                │        │         │
     ▼                ▼        ▼         ▼
pnpm dev → git push → Auto Deploy → Live App
```

## 📋 Pre-Deployment Checklist

### **1. Environment Variables**
```bash
# Required environment variables:
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for enhanced features):
# Add any additional API keys if needed
```

### **2. Build Configuration**
```json
// package.json - Verify these scripts exist:
{
  "scripts": {
    "build": "DISABLE_ESLINT_PLUGIN=true react-scripts build",
    "start": "react-scripts start",
    "server": "node consolidated-server.js"
  }
}
```

### **3. File Structure Verification**
```
tolerable/
├── vercel.json                 # Vercel configuration
├── package.json               # Dependencies and scripts
├── consolidated-server.js      # Backend serverless function
├── src/                       # React frontend
├── public/                    # Static assets
└── build/                     # Built application (generated)
```

## ⚙️ Vercel Configuration

### **vercel.json Explanation:**
```json
{
  "version": 2,                    // Vercel platform version
  "name": "tolerable",            // Project name
  "builds": [
    {
      "src": "package.json",      // Frontend build
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "consolidated-server.js", // Backend serverless function
      "use": "@vercel/node"
    }
  ],
  "routes": [
    // API routes → serverless function
    { "src": "/api/(.*)", "dest": "/consolidated-server.js" },
    { "src": "/education-query", "dest": "/consolidated-server.js" },
    { "src": "/shared-video/(.*)", "dest": "/consolidated-server.js" },
    // Frontend routes → React app
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "functions": {
    "consolidated-server.js": {
      "maxDuration": 30           // 30 second timeout for AI processing
    }
  }
}
```

## 🔧 Step-by-Step Deployment

### **Step 1: Prepare Repository**
```bash
# 1. Ensure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"

# 2. Push to GitHub
git push origin main

# 3. Verify repository is public or accessible to Vercel
```

### **Step 2: Vercel Account Setup**
```bash
# 1. Install Vercel CLI (optional but recommended)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project (run in project directory)
vercel link
```

### **Step 3: Environment Variables Setup**
```bash
# Via Vercel CLI:
vercel env add REACT_APP_GEMINI_API_KEY

# Or via Vercel Dashboard:
# 1. Go to project settings
# 2. Environment Variables tab
# 3. Add: REACT_APP_GEMINI_API_KEY = your_api_key
```

### **Step 4: Deploy**
```bash
# Option 1: Auto-deploy (recommended)
# - Connect GitHub repository in Vercel dashboard
# - Auto-deploys on every push to main branch

# Option 2: Manual deploy via CLI
vercel --prod

# Option 3: Preview deploy
vercel
```

## 🌐 Production URLs Structure

### **Frontend Routes:**
```
https://tolerable.vercel.app/                    # Home
https://tolerable.vercel.app/education           # Education
https://tolerable.vercel.app/diagnostics         # Diagnostics
https://tolerable.vercel.app/cookbook            # Cookbook
https://tolerable.vercel.app/settings            # Settings
https://tolerable.vercel.app/about               # About
https://tolerable.vercel.app/changelog           # Changelog
https://tolerable.vercel.app/privacy             # Privacy Policy
https://tolerable.vercel.app/terms               # Terms of Service
https://tolerable.vercel.app/legal               # Company Legal
https://tolerable.vercel.app/ai-policy           # AI Usage Policy
```

### **API Endpoints:**
```
https://tolerable.vercel.app/api/gemini-text     # Text generation
https://tolerable.vercel.app/api/gemini-image    # Image analysis
https://tolerable.vercel.app/api/gemini-video    # Video processing
https://tolerable.vercel.app/api/gemini-audio    # Audio analysis
https://tolerable.vercel.app/api/github-user     # GitHub user analysis
https://tolerable.vercel.app/api/github-repo     # GitHub repo analysis
https://tolerable.vercel.app/education-query     # Education queries
https://tolerable.vercel.app/api/edi             # Code assistance
https://tolerable.vercel.app/api/prompt-suggestions # AI suggestions
```

## 🔍 Testing Production Deployment

### **Frontend Testing:**
```bash
# Test all routes work:
curl https://tolerable.vercel.app/
curl https://tolerable.vercel.app/education
curl https://tolerable.vercel.app/diagnostics

# Check static assets load:
curl https://tolerable.vercel.app/static/css/main.[hash].css
curl https://tolerable.vercel.app/static/js/main.[hash].js
```

### **API Testing:**
```bash
# Test text generation:
curl -X POST https://tolerable.vercel.app/api/gemini-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, world!"}'

# Test education query:
curl -X POST https://tolerable.vercel.app/education-query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing", "enableWebSearch": true}'

# Test GitHub analysis:
curl -X POST https://tolerable.vercel.app/api/github-user \
  -H "Content-Type: application/json" \
  -d '{"username": "bniladridas"}'
```

## 🛠️ Serverless Function Optimization

### **consolidated-server.js Modifications for Vercel:**

```javascript
// Add at the top of consolidated-server.js for Vercel compatibility:
const path = require('path');

// Modify static file serving for Vercel:
if (process.env.NODE_ENV === 'production') {
  // Serve static files from build directory
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle React routing in production
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/') ||
        req.path.startsWith('/education-query') ||
        req.path.startsWith('/shared-video')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Export for Vercel serverless functions:
module.exports = app;
```

### **File Upload Handling for Vercel:**
```javascript
// Modify multer configuration for serverless:
const multer = require('multer');

// Use memory storage instead of disk storage for Vercel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Handle file processing in memory:
app.post('/api/gemini-image', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    // Process with Gemini...
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});
```

## 🚨 Troubleshooting Common Issues

### **1. Build Failures:**
```bash
# Issue: Build fails due to ESLint errors
# Solution: Already handled in package.json
"build": "DISABLE_ESLINT_PLUGIN=true react-scripts build"

# Issue: pnpm not recognized
# Solution: Vercel auto-detects pnpm from pnpm-lock.yaml

# Issue: Environment variables not working
# Solution: Check Vercel dashboard → Settings → Environment Variables
```

### **2. Serverless Function Issues:**
```bash
# Issue: Function timeout (default 10s)
# Solution: Increased to 30s in vercel.json
"functions": {
  "consolidated-server.js": {
    "maxDuration": 30
  }
}

# Issue: File upload fails
# Solution: Use memory storage instead of disk storage

# Issue: API routes not working
# Solution: Check route configuration in vercel.json
```

### **3. Frontend Issues:**
```bash
# Issue: React routes return 404
# Solution: Catch-all route in vercel.json
{ "src": "/(.*)", "dest": "/index.html" }

# Issue: Static assets not loading
# Solution: Verify build directory structure
```

## 📊 Performance Optimization

### **1. Bundle Size Optimization:**
```javascript
// Add to package.json for bundle analysis:
{
  "scripts": {
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}

// Run analysis:
pnpm run analyze
```

### **2. Caching Strategy:**
```json
// Add to vercel.json for better caching:
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### **3. Environment-Specific Optimizations:**
```javascript
// Add to src/config.js:
const config = {
  development: {
    apiUrl: 'http://localhost:3030',
    debug: true
  },
  production: {
    apiUrl: '', // Use relative URLs in production
    debug: false
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## 🔄 Continuous Deployment

### **Auto-Deploy Setup:**
```yaml
# Vercel automatically deploys when:
1. Push to main branch → Production deployment
2. Push to other branches → Preview deployment
3. Pull requests → Preview deployment with unique URL

# Custom deployment settings:
- Build Command: pnpm run build
- Output Directory: build
- Install Command: pnpm install
- Development Command: pnpm start
```

### **Deployment Notifications:**
```bash
# Set up notifications in Vercel dashboard:
1. Go to Project Settings
2. Git Integration tab
3. Configure deployment notifications
4. Add Slack/Discord webhooks if needed
```

## 🎯 Production Monitoring

### **Key Metrics to Monitor:**
```bash
# Vercel Analytics (built-in):
- Page views and unique visitors
- Core Web Vitals (LCP, FID, CLS)
- Function execution time
- Error rates

# Custom monitoring:
- API response times
- Gemini API usage
- File upload success rates
- User engagement metrics
```

### **Error Tracking:**
```javascript
// Add error boundary for production:
// src/components/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service in production
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## 🚀 Go Live Checklist

### **Pre-Launch:**
```bash
✅ Environment variables configured
✅ Build process working
✅ All routes tested
✅ API endpoints functional
✅ File uploads working
✅ Mobile responsiveness verified
✅ Performance optimized
✅ Error handling implemented
✅ Analytics configured
```

### **Launch Commands:**
```bash
# Final deployment:
git add .
git commit -m "Production ready - v1.2.0"
git push origin main

# Verify deployment:
vercel ls
vercel inspect tolerable.vercel.app
```

---

> **🎉 Congratulations!** Your Tolerable application is now live on Vercel with full serverless backend support!
