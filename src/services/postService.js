/**
 * Service for managing posts stored in Cloudinary
 */

import { uploadPost } from './imageUpload';

// In-memory cache for posts
let postsCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch posts from Cloudinary Admin API
 * Note: This would typically be done through a backend service for security
 * This is a simplified implementation for demonstration purposes
 */
export const fetchPosts = async (forceRefresh = false) => {
  const now = Date.now();

  // Use cache if available and not expired
  if (!forceRefresh && postsCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached posts data');
    return [...postsCache];
  }

  try {
    // In a real implementation, this would be a call to your backend service
    // which would then securely call the Cloudinary Admin API
    // For now, we'll use the posts stored in localStorage as a simulation
    const storedPosts = localStorage.getItem('cloudinary_posts');
    let posts = storedPosts ? JSON.parse(storedPosts) : [];

    // Add order field and mediaType if they don't exist
    posts = posts.map((post, index) => ({
      ...post,
      order: post.order !== undefined ? post.order : index,
      mediaType: post.mediaType || 'image', // Default to image for backward compatibility
      mediaUrl: post.mediaUrl || post.imageUrl // Support both mediaUrl and imageUrl for backward compatibility
    }));

    // Sort by order (ascending) then by createdAt (descending) if order is the same
    posts = posts.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order; // Lower order comes first
      }
      return b.createdAt - a.createdAt; // If same order, newer posts come first
    });

    // Update cache
    postsCache = posts;
    lastFetchTime = now;

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

/**
 * Create a new post with media in Cloudinary or text-only post
 */
export const createPost = async (postData, mediaFile, onProgress) => {
  try {
    // Add timestamps and order
    const now = Date.now();
    const existingPosts = await fetchPosts();

    // Ensure all posts have an order field
    const postsWithOrder = existingPosts.map((p, idx) => ({
      ...p,
      order: p.order !== undefined ? p.order : idx
    }));

    // New posts go to the top (lower order value = higher position)
    const order = postsWithOrder.length > 0
      ? Math.min(...postsWithOrder.map(p => p.order)) - 1
      : 0;

    const newPostData = {
      ...postData,
      createdAt: now,
      updatedAt: now,
      order: order // Add order field (lower number = higher position)
    };

    let result;

    // Handle text-only posts differently
    if (postData.mediaType === 'text') {
      // For text posts, we don't need to upload to Cloudinary
      result = {
        ...newPostData,
        id: `post_${now}`,
        mediaType: 'text',
        mediaUrl: null
      };
    } else {
      // Upload to Cloudinary with post data for media posts
      result = await uploadPost(mediaFile, newPostData, 'post-images', onProgress);
    }

    // Store in local cache
    const updatedPosts = await fetchPosts();
    updatedPosts.unshift(result); // Add to beginning of array
    localStorage.setItem('cloudinary_posts', JSON.stringify(updatedPosts));

    // Update cache
    postsCache = updatedPosts;
    lastFetchTime = Date.now();

    return result;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post: ' + error.message);
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (postId, postData, imageFile, onProgress) => {
  try {
    // Get existing posts
    const posts = await fetchPosts();
    const existingPost = posts.find(post => post.id === postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Prepare updated post data
    const updatedPostData = {
      ...existingPost,
      ...postData,
      id: postId,
      updatedAt: Date.now()
    };

    let result;

    // Handle text-only posts differently
    if (postData.mediaType === 'text') {
      // For text posts, we don't need to upload to Cloudinary
      result = {
        ...updatedPostData,
        mediaType: 'text',
        mediaUrl: null
      };
    }
    // If there's a new media file, upload it with the updated post data
    else if (imageFile) {
      result = await uploadPost(imageFile, updatedPostData, 'post-images', onProgress);
    } else {
      // Otherwise just update the post data
      result = {
        ...updatedPostData,
        mediaUrl: existingPost.mediaUrl || existingPost.imageUrl
      };
    }

    // Update in local storage
    const updatedPosts = posts.map(post =>
      post.id === postId ? result : post
    );
    localStorage.setItem('cloudinary_posts', JSON.stringify(updatedPosts));

    // Update cache
    postsCache = updatedPosts;
    lastFetchTime = Date.now();

    return result;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post: ' + error.message);
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  try {
    // Get existing posts
    const posts = await fetchPosts();

    // Filter out the deleted post
    const updatedPosts = posts.filter(post => post.id !== postId);

    // In a real implementation, you would also delete the image from Cloudinary
    // This would typically be done through a backend service

    // Update local storage
    localStorage.setItem('cloudinary_posts', JSON.stringify(updatedPosts));

    // Update cache
    postsCache = updatedPosts;
    lastFetchTime = Date.now();

    return { success: true, id: postId };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

/**
 * Get a single post by ID
 */
export const getPostById = async (postId) => {
  const posts = await fetchPosts();
  const post = posts.find(post => post.id === postId);

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

/**
 * Update the order of posts
 *
 * @param {string} postId - The ID of the post to move
 * @param {number} newIndex - The new index position for the post
 * @returns {Array} - The updated and sorted posts array
 */
export const updatePostOrder = async (postId, newIndex) => {
  try {
    // Get all posts
    const posts = await fetchPosts(true); // Force refresh

    // Find the post to move
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    // Create a copy of the posts array
    const updatedPosts = [...posts];

    // Remove the post from its current position
    const [movedPost] = updatedPosts.splice(postIndex, 1);

    // Insert it at the new position
    updatedPosts.splice(newIndex, 0, movedPost);

    // Update order values for all posts to ensure they're sequential
    // This prevents order values from getting too close together after many reorderings
    const reorderedPosts = updatedPosts.map((post, index) => ({
      ...post,
      order: index * 10, // Use multiples of 10 to leave room between values
      updatedAt: post.id === postId ? Date.now() : post.updatedAt
    }));

    // Sort by order
    const sortedPosts = reorderedPosts.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return b.createdAt - a.createdAt;
    });

    // Save to localStorage
    localStorage.setItem('cloudinary_posts', JSON.stringify(sortedPosts));

    // Update cache
    postsCache = sortedPosts;
    lastFetchTime = Date.now();

    return sortedPosts;
  } catch (error) {
    console.error('Error updating post order:', error);
    throw new Error('Failed to update post order: ' + error.message);
  }
};

/**
 * Initialize the posts system
 */
export const initializePostsSystem = () => {
  // Check if we have any posts in localStorage
  const storedPosts = localStorage.getItem('cloudinary_posts');

  // If not, create an empty array
  if (!storedPosts) {
    localStorage.setItem('cloudinary_posts', JSON.stringify([]));
  }
};
