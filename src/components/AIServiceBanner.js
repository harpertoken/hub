import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

const AIServiceBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenBanner = localStorage.getItem('hasSeenAIServiceBanner');

    if (!hasSeenBanner) {
      setIsVisible(true);
      // Don't set localStorage yet - we'll do that when they dismiss
    }
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenAIServiceBanner', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-md p-4 animate-slideUp" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Zap className="w-5 h-5" style={{color: 'var(--text-primary)'}} />
            </div>
            <div>
              <h3 className="text-sm font-normal mb-1" style={{color: 'var(--text-primary)'}}>Powered by Google's Gemini 1.5 Flash</h3>
              <p className="text-xs mb-2" style={{color: 'var(--text-secondary)'}}>
                Tolerable exclusively uses Google's Gemini 1.5 Flash model for all AI services, including text generation,
                image analysis, video analysis, audio processing, and code assistance.
                Voice recording features use Google's Web Speech API to power voice input.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href="/ai-policy"
                  className="transition-colors duration-200"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  View AI Policy
                </a>
                <a
                  href="https://ai.google/get-started/gemini-ecosystem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Learn about Gemini
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={dismissBanner}
            className="transition-colors duration-200 p-1"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIServiceBanner;
