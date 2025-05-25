import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CloudStorageRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        Cloud Storage Integration
        <p className="text-sm text-gray-600">
          Implementing cloud storage solutions for media files using Cloudinary and local storage fallbacks.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">15 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Ingredients
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>Cloudinary account with cloud name and upload preset</li>
          <li>Express server for local file handling</li>
          <li>FormData for file uploads</li>
          <li>Multer middleware for server-side file handling</li>
          <li>localStorage for client-side caching</li>
          <li>Error handling mechanisms</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Set up Cloudinary configuration</p>
            <p>Configure your Cloudinary credentials in environment variables.</p>
            <SyntaxHighlighter
              language="bash"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// .env file
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create a service for Cloudinary uploads</p>
            <p>Implement a service to handle media uploads to Cloudinary.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// src/services/imageUpload.js
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const getCloudinaryUrl = (mediaType = 'image') => {
  const resourceType = mediaType === 'video' ? 'video' : 'auto';
  return \`https://api.cloudinary.com/v1_1/\${cloudName}/\${resourceType}/upload\`;
};

export const uploadPost = async (file, postData = {}, folder = 'post-media', onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', file);

      // Determine media type
      const mediaType = file.type.startsWith('image/') ? 'image' :
                       file.type.startsWith('audio/') ? 'audio' : 'video';

      // Add Cloudinary parameters
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', mediaType === 'image' ? 'post-images' :
                              mediaType === 'audio' ? 'post-audio' : 'post-videos');

      // Add metadata as context
      if (postData.title) {
        formData.append('context', \`caption=\${encodeURIComponent(postData.title)}\`);
      }

      // Send the upload request
      const xhr = new XMLHttpRequest();
      xhr.open('POST', getCloudinaryUrl(mediaType), true);

      // Handle progress events
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      };

      // Handle response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve({
            id: result.public_id,
            mediaUrl: result.secure_url,
            ...postData
          });
        } else {
          reject(new Error(\`Upload failed with status \${xhr.status}\`));
        }
      };

      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Set up local file storage fallback</p>
            <p>Configure the Express server to handle file uploads when Cloudinary is not available.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// consolidated-server.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// API endpoint for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a URL for the uploaded file
    const fileUrl = \`\${req.protocol}://\${req.get('host')}/uploads/\${req.file.filename}\`;

    res.json({
      status: 'success',
      mediaUrl: fileUrl,
      id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Implement client-side caching</p>
            <p>Use localStorage to cache post data for better performance.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
{`// src/services/postService.js
// In-memory cache for posts
let postsCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchPosts = async (forceRefresh = false) => {
  const now = Date.now();

  // Use cache if available and not expired
  if (!forceRefresh && postsCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached posts data');
    return [...postsCache];
  }

  try {
    // Try to get posts from localStorage first
    const storedPosts = localStorage.getItem('cloudinary_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];

    // Update cache
    postsCache = [...posts];
    lastFetchTime = now;

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const initializePostsSystem = () => {
  // Check if we have any posts in localStorage
  const storedPosts = localStorage.getItem('cloudinary_posts');

  // If not, create an empty array
  if (!storedPosts) {
    localStorage.setItem('cloudinary_posts', JSON.stringify([]));
  }
};`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Chef's Notes
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            Key benefits of this cloud storage approach:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Cloudinary Integration:</span> Optimization, transformations, and CDN delivery
            </li>
            <li>
              <span className="font-medium">Local Fallback:</span> Server-side storage when cloud is unavailable
            </li>
            <li>
              <span className="font-medium">Client-side Caching:</span> Reduced API calls for better performance
            </li>
            <li>
              <span className="font-medium">Progressive Enhancement:</span> Functional in all environments
            </li>
          </ul>
        </div>
      </section>

      {/* Implementation Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Implementation Tips
        <div className="text-sm text-gray-600">
          <ul className="list-disc pl-5 space-y-2">
            <li>Implement robust error handling with clear user feedback</li>
            <li>Use XHR progress events to show upload progress</li>
            <li>Use signed uploads with authentication in production</li>
            <li>Implement cleanup for temporary local files</li>
            <li>Store all credentials in environment variables</li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default CloudStorageRecipe;
