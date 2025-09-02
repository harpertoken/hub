import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

/**
 * AuthRemovedBanner Component
 *
 * A vertical banner on the right side that explains why authentication
 * functionality has been removed from the application.
 * This provides transparency to users about the current state of the software.
 */
const AuthRemovedBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show the banner after a short delay and check if it's been dismissed before
  useEffect(() => {
    // Check if the banner has been dismissed in this session
    const bannerDismissed = sessionStorage.getItem('authBannerDismissed');

    if (bannerDismissed) {
      return; // Don't show the banner if it's been dismissed
    }

    // Show banner immediately on mount (no delay)
    setIsVisible(true);

    // Start animation immediately
    setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    // Stop the animation after it completes but keep the banner visible
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    return () => clearTimeout(animationTimer);
  }, []);

  // Handle banner dismissal
  const handleDismiss = () => {
    // Store in session storage that the banner has been dismissed
    sessionStorage.setItem('authBannerDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 bottom-32 z-40 overflow-hidden">
      <div
        className={`py-3 px-3 rounded-l-md shadow-xs transform ${
          isAnimating ? 'animate-slide-in-right' : ''
        } ${!isAnimating && isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          transition: 'transform 0.5s ease-out',
          backgroundColor: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-color)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div className="flex flex-col items-end">
          <button
            onClick={handleDismiss}
            className="transition-colors duration-200 mb-2"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            aria-label="Close banner"
          >
            <X size={14} />
          </button>
          <div className="flex flex-col items-center gap-2 w-40">
            <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{backgroundColor: 'var(--button-hover)'}}>
              <Info size={10} style={{color: 'var(--text-secondary)'}} />
            </div>
            <p className="text-xs text-center leading-relaxed" style={{color: 'var(--text-secondary)'}}>
              Authentication removed for this early version.
            </p>
            <p className="text-xs text-center mt-1" style={{color: 'var(--text-secondary)', opacity: 0.7}}>
              All features available without login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRemovedBanner;
