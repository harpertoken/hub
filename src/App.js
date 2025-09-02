import { useState, useEffect, useRef } from 'react';
import FirstVisitModal from './pages/FirstVisitModal';
import { Menu, Plus, AlertTriangle, Zap, X } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchPosts, deletePost, initializePostsSystem, updatePostOrder } from './services/postService';
import { Toaster, toast } from 'react-hot-toast';
import './theme.css';
import './animations.css';
import Settings from './pages/Settings';
import Footer from './Footer';
import AuthRemovedBanner from './pages/AuthRemovedBanner';
// import ParticlesBackground from './components/ParticlesBackground'; // Removed as requested
import LoadingAnim from './components/LoadingAnim';
// Removed FloatingActionButton and NewPostButton imports
// Voice Assistant removed as requested

// Import components
import MobileMenu from './pages/MobileMenu';
import PostForm from './pages/PostForm';
import PostList from './pages/PostList';
import PostPreviewModal from './pages/PostPreviewModal';
import AILab from './pages/AILab';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import CompanyLegal from './pages/CompanyLegal';
import AIUsagePolicy from './AIUsagePolicy';
import About from './pages/About';
import Changelog from './pages/Changelog';
import Education from './pages/Education';
import Cookbook from './pages/Cookbook';
import CookbookSimple from './components/CookbookSimple';


import EDI from './pages/EDI';
import Diagnostics from './pages/Diagnostics';
import AIServiceBanner from './pages/AIServiceBanner';
import LogoComponent from './pages/LogoComponent';

// Import Contexts
import { LegalProvider } from './contexts/LegalContext';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider, useModal } from './contexts/ModalContext';
import PersistentAudioPlayer from './components/PersistentAudioPlayer';

const MainContent = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [previewPost, setPreviewPost] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Use modal context to track modal states
  const { isModalOpen } = useModal();

  const postFormRef = useRef(null);
  const aiLabRef = useRef(null);

  // Initialize posts system
  useEffect(() => {
    initializePostsSystem();
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch posts from Cloudinary via our service
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
        setError('');
      } catch (error) {
        setError('Failed to fetch posts.');
        console.error("Error fetching posts: ", error);
      }
    };

    loadPosts();

    // Set up a refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      loadPosts();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAIFeatures = () => {
    const willShow = !showAIFeatures;
    setShowAIFeatures(willShow);
    // No scrolling - just toggle the visibility
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setEditingId(post.id);
  };

  const handlePreview = (post) => {
    setPreviewPost(post);
  };

  const handleClosePreview = () => {
    setPreviewPost(null);
  };

  const handleCreatePost = () => {
    setCurrentPost({}); // Change from null to empty object
    setEditingId(null);
    setIsMenuOpen(false); // Close mobile menu if open

    // Focus on the first input field without scrolling
    setTimeout(() => {
      if (postFormRef.current) {
        // Focus on the first input field without scrolling
        const firstInput = postFormRef.current.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };

  const handleSave = async (savedPost) => {
    // If we received a saved post, add it to the posts list immediately
    if (savedPost) {
      // For a new post, add it to the beginning of the list
      if (!posts.find(p => p.id === savedPost.id)) {
        setPosts([savedPost, ...posts]);
        toast.success('Post created successfully!');
      } else {
        // For an updated post, replace the existing one
        setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
        toast.success('Post updated successfully!');
      }
    }

    // Also refresh the posts list from storage
    try {
      const refreshedPosts = await fetchPosts(true); // Force refresh
      setPosts(refreshedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      toast.error('Error refreshing posts');
    }

    setCurrentPost(null);
    setEditingId(null);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(postId);
      // Update the local posts state to remove the deleted post
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post.');
      toast.error('Failed to delete post');
    }
  };

  const handleReorder = async (postId, newIndex) => {
    try {
      // Optimistically update the UI
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex === -1 || postIndex === newIndex) return;

      // Create a copy of the posts array
      const newPosts = [...posts];
      // Remove the post from its current position
      const [movedPost] = newPosts.splice(postIndex, 1);
      // Insert it at the new position
      newPosts.splice(newIndex, 0, movedPost);

      // Update the state immediately for a responsive UI
      setPosts(newPosts);

      // Update the order in the backend
      try {
        const updatedPosts = await updatePostOrder(postId, newIndex);

        // Update the state with the actual order from the backend
        setPosts(updatedPosts);

        toast.success('Post order updated');
      } catch (error) {
        console.error('Error updating post order in backend:', error);
        // Keep the optimistic UI update but log the error
        toast.success('Post order updated locally');
      }
    } catch (error) {
      console.error('Error reordering posts:', error);
      // Refresh posts to get the correct order
      try {
        const refreshedPosts = await fetchPosts(true);
        setPosts(refreshedPosts);
      } catch (refreshError) {
        console.error('Error refreshing posts:', refreshError);
      }
      toast.error('Failed to reorder posts');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
        <LoadingAnim />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{backgroundColor: 'var(--bg-primary)'}}>
      {/* Header - Hidden when modals are open */}
      {!isModalOpen && !isMenuOpen && (
        <div
          className="fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 border-b"
          style={{
            backgroundColor: scrollPosition > 20 ? 'var(--bg-primary)' : 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            opacity: scrollPosition > 20 ? 0.95 : 0.98,
            boxShadow: scrollPosition > 50 ? '0 1px 3px rgba(0,0,0,0.03)' : 'none'
          }}
        >
        <div className="w-full mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <header className="py-3">
            <div className="relative flex items-center justify-center">
              {/* Logo and Brand - Centered */}
              <div className="flex items-center">
                <LogoComponent className="h-12 w-auto" />
              </div>

              {/* Navigation - Absolute positioned on the right */}
              <div className="absolute right-0 hidden md:flex items-center gap-4">
                <a
                  href="/education"
                  className="nav-link-wave transition-colors duration-200 text-xs px-3 py-1 rounded-sm"
                  style={{
                    color: scrollPosition > 20 ? 'var(--text-secondary)' : 'var(--text-secondary)',
                    opacity: scrollPosition > 20 ? 0.9 : 1
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <span>Education</span>
                </a>
                <a
                  href="/diagnostics"
                  className="nav-link-wave transition-colors duration-200 text-xs px-3 py-1 rounded-sm"
                  style={{
                    color: scrollPosition > 20 ? 'var(--text-secondary)' : 'var(--text-secondary)',
                    opacity: scrollPosition > 20 ? 0.7 : 0.7
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <span>Diagnostics</span>
                </a>
                <button
                  onClick={toggleAIFeatures}
                  className={`nav-link-wave flex items-center gap-1.5 hover:text-black transition-colors duration-200 text-xs px-3 py-1 rounded-sm ${
                    scrollPosition > 20 ? 'text-gray-500/90' : 'text-gray-500'
                  }`}
                >
                  <Zap size={14} className="mr-1" />
                  <span>AI Lab</span>
                </button>
                <button
                  onClick={handleCreatePost}
                  className={`nav-link-wave flex items-center gap-1.5 hover:text-black transition-colors duration-200 text-xs px-3 py-1 rounded-sm ${
                    scrollPosition > 20 ? 'text-gray-500/90' : 'text-gray-500'
                  }`}
                >
                  <Plus size={14} className="mr-1" />
                  <span>New</span>
                </button>
              </div>

              {/* Mobile Menu Button - Absolute positioned on the right */}
              <button
                onClick={toggleMenu}
                className={`absolute right-0 nav-link-wave md:hidden hover:text-black transition-colors duration-200 px-2 py-1 rounded-sm ${
                  scrollPosition > 20 ? 'text-gray-500/90' : 'text-gray-500'
                }`}
                aria-label="Toggle menu"
              >
                <Menu size={14} />
              </button>
            </div>
          </header>
        </div>
        </div>
      )}

      <div className="w-full mx-auto px-4 md:px-8 lg:px-16 xl:px-24 relative z-10 flex flex-col pb-4" style={{ marginTop: isModalOpen ? "0px" : "80px", backgroundColor: 'var(--bg-primary)' }}>
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onCreatePost={handleCreatePost}
          onToggleAIFeatures={toggleAIFeatures}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <main className="py-4 space-y-6" style={{backgroundColor: 'var(--bg-primary)'}}>
          {/* Mobile create post button removed to avoid duplication */}

          {currentPost !== null && ( // Change condition to check for null specifically
            <div ref={postFormRef}>
              <PostForm
                currentPost={currentPost}
                onSave={handleSave}
                onCancel={() => {
                  setCurrentPost(null);
                  setEditingId(null);
                }}
              />
            </div>
          )}

          {showAIFeatures && (
            <div className="mb-8" ref={aiLabRef}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-lg font-medium text-black">AI Lab</h2>
                  <p className="text-xs text-gray-600 mt-1">Advanced AI tools for media analysis</p>
                </div>
                <button
                  onClick={toggleAIFeatures}
                  className="p-1.5 text-gray-400 hover:text-black transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>
              <AILab />
            </div>
          )}

          <PostList
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
            onReorder={handleReorder}
            onCreatePost={handleCreatePost}
            loading={false}
          />
        </main>

        {previewPost && (
          <PostPreviewModal
            post={previewPost}
            onClose={handleClosePreview}
          />
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove old theme classes that might be set
    document.documentElement.classList.remove('dark', 'dim', 'gold', 'blue');

    // Add meta tag for theme-color if it doesn't exist
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#ffffff';
      document.head.appendChild(meta);
    }

    const visited = localStorage.getItem('hasVisited');
    if (!visited) {
      setIsFirstVisit(true);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCloseModal = () => {
    localStorage.setItem('hasVisited', 'true');
    setIsFirstVisit(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
        <LoadingAnim />
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider>
        <LegalProvider>
          <AudioProvider>
            <ModalProvider>
              <div className="flex flex-col min-h-screen relative m-0 p-0 overflow-x-hidden w-full" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
                <PersistentAudioPlayer />
                <FirstVisitModal isOpen={isFirstVisit} onClose={handleCloseModal} />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#ffffff',
                      color: '#000000',
                      borderRadius: '0',
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                      fontSize: '0.75rem',
                    },
                    success: {
                      iconTheme: {
                        primary: '#000000',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#000000',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
                <AIServiceBanner />
                <AuthRemovedBanner />
                <div className="flex-grow" style={{backgroundColor: 'var(--bg-primary)'}}>
                  <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/legal" element={<CompanyLegal />} />
                    <Route path="/ai-policy" element={<AIUsagePolicy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/brand" element={<Navigate to="/about" replace />} />
                    <Route path="/cookbook" element={<Cookbook />} />
                    <Route path="/cookbook-simple" element={<CookbookSimple />} />
                    <Route path="/changelog" element={<Changelog />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/diagnostics" element={<Diagnostics />} />
                    <Route path="/edi" element={<EDI />} />
                    <Route path="/" element={<MainContent />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </ModalProvider>
          </AudioProvider>
        </LegalProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
