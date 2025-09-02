import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Send, X, Image, Upload, AlertCircle, Music, Video, MessageSquare } from 'lucide-react';
// Firebase auth import removed as it's no longer used
import { createPost, updatePost } from '../services/postService';

const PostForm = ({ currentPost, onCancel, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('text'); // 'text', 'image', 'audio', or 'video'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize form with existing post data or empty strings
    setTitle(currentPost?.title || '');
    setContent(currentPost?.content || '');
    setMediaPreview(currentPost?.mediaUrl || '');
    setMediaType(currentPost?.mediaType || 'text');
  }, [currentPost]);

  // Function to optimize image before upload
  const optimizeImage = (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      console.log('Starting image optimization for:', file.name, 'type:', file.type, 'size:', file.size);

      // If the file is already small enough, just return it
      if (file.size < 500 * 1024) { // Less than 500KB
        console.log('Image already small enough, skipping optimization');
        return resolve(file);
      }

      // Create an image object
      const img = new Image();

      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Image optimization timed out'));
      }, 10000); // 10 seconds timeout

      img.onload = () => {
        try {
          clearTimeout(timeout);
          console.log('Image loaded for optimization, dimensions:', img.width, 'x', img.height);

          // Create a canvas element
          const canvas = document.createElement('canvas');

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          console.log('Canvas dimensions set to:', width, 'x', height);

          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          console.log('Image drawn on canvas');

          // Determine output format based on input
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const outputQuality = outputType === 'image/png' ? 0.8 : quality;

          console.log('Converting to blob with type:', outputType, 'quality:', outputQuality);

          // Convert to blob with reduced quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error('Canvas to Blob conversion failed');
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }

              try {
                // Create a new file from the blob
                const optimizedFile = new File([blob], file.name, {
                  type: outputType,
                  lastModified: Date.now(),
                });

                console.log(`Image optimized: ${file.size} bytes → ${optimizedFile.size} bytes`);
                resolve(optimizedFile);
              } catch (error) {
                console.error('Error creating File from blob:', error);
                // If we can't create a File, just use the blob
                resolve(blob);
              }
            },
            outputType,
            outputQuality
          );
        } catch (error) {
          console.error('Error in image optimization process:', error);
          clearTimeout(timeout);
          // If optimization fails, return the original file
          resolve(file);
        }
      };

      img.onerror = (error) => {
        console.error('Failed to load image for optimization:', error);
        clearTimeout(timeout);
        // If we can't load the image, just use the original file
        resolve(file);
      };

      // Load image from file
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader loaded image data');
        img.src = e.target.result;
      };
      reader.onerror = (error) => {
        console.error('Failed to read file for optimization:', error);
        clearTimeout(timeout);
        // If we can't read the file, just use the original file
        resolve(file);
      };

      console.log('Starting to read file as data URL');
      reader.readAsDataURL(file);
    });
  };

  const handleMediaChange = async (e) => {
    try {
      const file = e.target.files[0];
      console.log('Selected file:', file);

      if (!file) {
        console.warn('No file selected');
        return;
      }

      // Validate file type based on selected media type
      if (mediaType === 'image' && !file.type.startsWith('image/')) {
        console.warn('Invalid file type selected:', file.type);
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      } else if (mediaType === 'audio' && !file.type.startsWith('audio/')) {
        console.warn('Invalid file type selected:', file.type);
        alert('Please select an audio file (MP3, WAV, etc.)');
        return;
      } else if (mediaType === 'video' && !file.type.startsWith('video/')) {
        console.warn('Invalid file type selected:', file.type);
        alert('Please select a video file (MP4, WebM, etc.)');
        return;
      }

      // Set file size limits based on media type
      let MAX_FILE_SIZE;
      if (mediaType === 'image') {
        MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for images
      } else if (mediaType === 'audio') {
        MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for audio
      } else {
        MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for video
      }

      if (file.size > MAX_FILE_SIZE) {
        console.warn('File too large:', file.size, 'bytes');
        alert(`File is too large. Please select a ${mediaType} smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
        return;
      }

      // Create preview
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
          console.log(`${mediaType} preview created`);
        };
        reader.readAsDataURL(file);
      } catch (previewError) {
        console.error('Error creating preview:', previewError);
        // Continue even if preview fails
      }

      // Optimize image if needed (only for images)
      let fileToUpload = file;
      if (mediaType === 'image') {
        try {
          if (file.size > 500 * 1024) { // Only optimize if larger than 500KB
            console.log('Image needs optimization, processing...');
            fileToUpload = await optimizeImage(file);
          } else {
            console.log('Image small enough, skipping optimization');
          }
        } catch (optimizeError) {
          console.error('Error optimizing image:', optimizeError);
          // If optimization fails, use the original file
          fileToUpload = file;
        }
      }

      // Set the file to upload
      console.log(`Setting ${mediaType} file for upload:`, fileToUpload);
      setMediaFile(fileToUpload);
    } catch (error) {
      console.error(`Unexpected error in handleMediaChange:`, error);
      alert(`Failed to process the selected ${mediaType}. Please try another file.`);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear any previous errors

    try {
      // Validate form
      if (!title.trim()) {
        setError('Please enter a title for your post');
        setIsSubmitting(false);
        return;
      }

      if (!content.trim()) {
        setError('Please enter some content for your post');
        setIsSubmitting(false);
        return;
      }

      if (mediaType !== 'text' && !mediaFile && !currentPost?.mediaUrl) {
        setError(`Please select ${mediaType === 'image' ? 'an image' : mediaType === 'audio' ? 'an audio file' : 'a video'} for your post`);
        setIsSubmitting(false);
        return;
      }

      // Authentication has been removed, so we'll use a default user ID
      const defaultUserId = 'anonymous-user';

      // Prepare post data
      const postData = {
        title,
        content,
        authorId: defaultUserId,
        mediaType: mediaType // Add media type to post data
      };

      // Initialize progress
      setUploadProgress(0);

      // Progress tracking callback
      const progressCallback = (progress) => {
        setUploadProgress(progress);
      };

      // Update existing post or create new one
      let savedPost;
      if (currentPost?.id) {
        // Update existing post
        savedPost = await updatePost(
          currentPost.id,
          postData,
          mediaFile, // Pass the media file (or null if not changed)
          progressCallback
        );
      } else {
        // Create new post
        savedPost = await createPost(
          postData,
          mediaFile,
          progressCallback
        );
      }

      // Ensure we show 100% when complete
      setUploadProgress(100);

      setIsSubmitting(false);

      // Call onSave with the saved post to update the UI immediately
      if (onSave && typeof onSave === 'function') {
        onSave(savedPost);
      }

      onCancel(); // Close the form after successful save
    } catch (error) {
      console.error('Error saving post:', error);
      setIsSubmitting(false);
      setError(`Failed to save post: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 relative overflow-hidden border border-gray-100 shadow-sm">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-black font-medium text-lg">
            {currentPost?.id ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-black transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="post-title" className="block text-sm text-gray-600 mb-1.5">Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full p-2.5 border border-gray-200 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
              required
            />
          </div>
          <div>
            <label htmlFor="post-content" className="block text-sm text-gray-600 mb-1.5">Content</label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="w-full p-2.5 border border-gray-200 rounded-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 h-32"
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Post type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setMediaType('text')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-sm text-sm ${
                    mediaType === 'text' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare size={14} />
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-sm text-sm ${
                    mediaType === 'image' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Image size={14} />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('audio')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-sm text-sm ${
                    mediaType === 'audio' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Music size={14} />
                  <span>Audio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-sm text-sm ${
                    mediaType === 'video' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Video size={14} />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {mediaType !== 'text' && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {mediaType === 'image' ? 'Image' : mediaType === 'audio' ? 'Audio' : 'Video'} upload
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="relative flex items-center justify-center w-full h-12 px-4 py-2 border border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-gray-300 transition-colors duration-200">
                      <input
                        type="file"
                        accept={mediaType === 'image' ? 'image/*' : mediaType === 'audio' ? 'audio/*' : 'video/*'}
                        onChange={handleMediaChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 text-gray-600">
                        <Upload size={16} />
                        <span className="text-sm">Choose {mediaType === 'image' ? 'an image' : mediaType === 'audio' ? 'an audio file' : 'a video'}</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {mediaType !== 'text' && mediaPreview && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-600">Preview</label>
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="p-1 text-gray-400 hover:text-black transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="relative border border-gray-100 rounded-sm bg-gray-50 p-3">
                  {mediaType === 'image' && (
                    <img
                      src={mediaPreview}
                      alt="Post preview"
                      className="w-full max-h-64 object-contain mx-auto"
                    />
                  )}
                  {mediaType === 'audio' && (
                    <audio
                      controls
                      src={mediaPreview}
                      className="w-full"
                    />
                  )}
                  {mediaType === 'video' && (
                    <video
                      controls
                      src={mediaPreview}
                      className="w-full max-h-64 object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            {isSubmitting && uploadProgress > 0 && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Uploading {mediaType}...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-1.5 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-colors duration-200 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white border border-black rounded-sm flex items-center gap-2 disabled:opacity-50 hover:bg-gray-800 transition-colors duration-200 text-sm"
              disabled={isSubmitting}
            >
              <Send size={14} />
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  currentPost: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func
};

export default PostForm;
