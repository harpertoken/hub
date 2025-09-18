import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Edit2, Trash2, Eye, GripVertical, MessageSquare, Play } from 'lucide-react';

import { useAudio } from '../contexts/AudioContext';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';


/**
 * PostList component
 *
 * @param {array} posts List of posts to display
 * @param {function} onEdit Function to call when a post is edited
 * @param {function} onDelete Function to call when a post is deleted
 * @param {function} onPreview Function to call when a post is previewed
 * @param {function} onReorder Function to call when a post is reordered
 * @param {boolean} loading Whether the component is currently loading
 */
const PostList = ({ posts, onEdit, onDelete, onPreview, onReorder, loading, onCreatePost }) => {
  const [draggedPostId, setDraggedPostId] = useState(null);
  const [dragOverPostId, setDragOverPostId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const dragCounter = useRef({});
  const { playAudio } = useAudio();

  // Handle remove button click
  const handleRemoveClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading posts...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div
        className="text-center py-12 px-6 bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-50 cursor-pointer"
        onClick={onCreatePost}
      >
        <p className="text-black text-lg font-normal mb-4">Create your first post</p>
        <button
          className="mt-8 inline-block px-4 py-2 bg-black bg-opacity-5 hover:bg-opacity-10 rounded-full text-xs text-gray-500 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onCreatePost();
          }}
        >
          Get started
        </button>
      </div>
    );
  }

  // Handle drag start
  const handleDragStart = (e, post) => {
    // Log the post data being dragged
    console.log('Dragging post with media:', {
      id: post.id,
      mediaUrl: post.mediaUrl || post.imageUrl,
      mediaType: post.mediaType || 'image'
    });

    // Set the dragged post ID
    setDraggedPostId(post.id);

    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'post',
      id: post.id,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl || post.imageUrl,
      mediaType: post.mediaType || 'image'
    }));

    // Set the drag image
    if (e.dataTransfer.setDragImage) {
      const dragPreview = document.createElement('div');
      dragPreview.style.width = '100px';
      dragPreview.style.height = '100px';
      dragPreview.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      dragPreview.style.borderRadius = '4px';
      dragPreview.style.display = 'flex';
      dragPreview.style.alignItems = 'center';
      dragPreview.style.justifyContent = 'center';
      dragPreview.style.color = '#000';
      dragPreview.style.fontSize = '12px';
      dragPreview.style.padding = '8px';
      dragPreview.style.boxSizing = 'border-box';
      dragPreview.style.overflow = 'hidden';
      dragPreview.style.whiteSpace = 'nowrap';
      dragPreview.style.textOverflow = 'ellipsis';
      dragPreview.textContent = post.title;
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 50, 50);
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);
    }
  };

  // Handle drag over
  const handleDragOver = (e, postId) => {
    e.preventDefault();

    // Initialize the counter for this post if it doesn't exist
    if (!dragCounter.current[postId]) {
      dragCounter.current[postId] = 0;
    }

    // Increment the counter
    dragCounter.current[postId]++;

    // Set the drag over post ID
    setDragOverPostId(postId);
  };

  // Handle drag leave
  const handleDragLeave = (e, postId) => {
    e.preventDefault();

    // Decrement the counter
    dragCounter.current[postId]--;

    // If the counter is 0, clear the drag over post ID
    if (dragCounter.current[postId] === 0) {
      setDragOverPostId(null);
    }
  };

  // Handle drop
  const handleDrop = (e, targetPostId) => {
    e.preventDefault();

    // Clear the drag over post ID
    setDragOverPostId(null);

    // If the dragged post ID is the same as the target post ID, do nothing
    if (draggedPostId === targetPostId) {
      return;
    }

    // Find the indices of the dragged post and the target post
    const draggedIndex = posts.findIndex(post => post.id === draggedPostId);
    const targetIndex = posts.findIndex(post => post.id === targetPostId);

    if (draggedIndex === -1 || targetIndex === -1) {
      console.error('Could not find post indices for reordering');
      return;
    }

    // Reorder the posts
    onReorder(draggedPostId, targetIndex);

    // Clear the dragged post ID
    setDraggedPostId(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    // Clear the dragged post ID
    setDraggedPostId(null);

    // Clear the drag over post ID
    setDragOverPostId(null);
  };

  return (
    <>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onDelete}
        post={postToDelete}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {posts.map((post) => (
        <div
          key={post.id}
          draggable
          onDragStart={(e) => handleDragStart(e, post)}
          onDragOver={(e) => handleDragOver(e, post.id)}
          onDragLeave={(e) => handleDragLeave(e, post.id)}
          onDrop={(e) => handleDrop(e, post.id)}
          onDragEnd={handleDragEnd}
          className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${
            dragOverPostId === post.id ? 'ring-2 ring-gray-400 shadow-md' : ''
          } ${draggedPostId === post.id ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'}
          h-full flex flex-col transition-all duration-200 cursor-grab active:cursor-grabbing relative group hover:shadow-md`}
        >
          {post.mediaType === 'text' ? (
            <div className="relative overflow-hidden bg-gray-50" style={{ height: '180px' }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <MessageSquare size={24} className="text-gray-500" />
                  </div>
                  <span className="text-gray-500 text-sm">Text Post</span>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Text
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="w-full p-4 flex justify-end gap-1">
                  <button
                    onClick={() => onPreview(post)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Preview post"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Edit post"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveClick(post);
                    }}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Remove post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : post.mediaUrl && (
            <div className="relative overflow-hidden" style={{ height: '180px' }}>
              {post.mediaType === 'image' && (
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              )}
              {post.mediaType === 'video' && (
                <div className="relative w-full h-full">
                  <video
                    src={post.mediaUrl}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Video
                  </div>
                </div>
              )}
              {post.mediaType === 'audio' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio({
                          id: post.id,
                          url: post.mediaUrl,
                          title: post.title
                        });
                      }}
                      className="w-12 h-12 mx-auto bg-black rounded-full flex items-center justify-center mb-2 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </button>
                    <span className="text-gray-500 text-sm">Play Audio</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Audio
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="w-full p-4 flex justify-end gap-1">
                  <button
                    onClick={() => onPreview(post)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Preview post"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Edit post"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveClick(post);
                    }}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Remove post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex items-start gap-2 mb-2">
              <div className="cursor-grab mt-1 p-1 rounded-sm hover:bg-gray-50 transition-colors duration-200">
                <GripVertical size={16} className="text-gray-400 drag-handle group-hover:text-black" />
              </div>
              <div className="flex-1">
                
                  {post.title}
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {post.content}
                </p>
              </div>
            </div>

            {/* We don't need these buttons anymore since we have them in the hover overlay for all post types */}

            <div className="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
               <span>
               </span>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }) : 'Recently'}</span>
            </div>
          </div>


        </div>
      ))}
    </div>
    </>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default PostList;
