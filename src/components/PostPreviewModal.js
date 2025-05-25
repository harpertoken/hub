import React from 'react';
import { X, Calendar, User, MessageSquare, Play } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import useScrollLock from '../hooks/useScrollLock';

const PostPreviewModal = ({ post, onClose }) => {
  const { playAudio } = useAudio();

  // Lock scroll when modal is open
  useScrollLock(true);
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-30"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="rounded-md shadow-lg max-w-3xl w-full p-0 max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-primary)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 mb-2">
          <h2 className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>
            {post.title}
          </h2>
          <button
            onClick={onClose}
            className="transition-colors duration-200"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-0">
          {post.mediaType === 'text' ? (
            <div className="bg-gray-50 p-4 text-center">
              <div className="inline-block bg-white px-3 py-1 rounded-md text-sm text-gray-500 border border-gray-200">
                <MessageSquare size={14} className="inline-block mr-1" />
                Text Post
              </div>
            </div>
          ) : (post.mediaUrl || post.imageUrl) && (
            <div className="overflow-hidden bg-gray-50">
              {post.mediaType === 'image' || !post.mediaType ? (
                <div className="flex justify-center items-center bg-gray-50 p-2">
                  <img
                    src={post.mediaUrl || post.imageUrl}
                    alt={post.title}
                    className="max-w-full max-h-[40vh] object-contain shadow-sm"
                  />
                </div>
              ) : post.mediaType === 'audio' ? (
                <div className="w-full p-4 bg-gray-50 flex items-center justify-center">
                  <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Audio Content</p>
                      <button
                        onClick={() => playAudio({
                          id: post.id,
                          url: post.mediaUrl || post.imageUrl,
                          title: post.title
                        })}
                        className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded-sm hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Play size={12} />
                        Play in persistent player
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Click the button above to play this audio in the persistent player that will continue playing even when you navigate away.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gray-50 p-2 flex justify-center">
                  <video
                    src={post.mediaUrl || post.imageUrl}
                    controls
                    className="max-w-full max-h-[40vh] object-contain shadow-sm"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>Tolerable</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Recently'}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-black text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal;
