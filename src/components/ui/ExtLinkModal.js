import React, { useState, useEffect } from 'react';
import { X, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const ExternalLinkModal = ({ url, isOpen, onClose, title }) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Reset error state when modal opens with a new URL
    if (isOpen) {
      setLoadError(false);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  // Check if URL is a social media site that likely won't work in an iframe
  const isSocialMediaSite = (
    url.includes('github.com') ||
    url.includes('x.com') ||
    url.includes('twitter.com') ||
    url.includes('linkedin.com') ||
    url.includes('reddit.com')
  );

  const handleIframeError = () => {
    setLoadError(true);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-[95%] h-[90%] max-w-6xl flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-50">
          <p className="text-black text-base font-normal">{title || 'External Website'}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={openInNewTab}
              className="text-gray-400 hover:text-black transition-colors duration-200"
              aria-label="Open in new tab"
              title="Open in new tab"
            >
              <ExternalLinkIcon size={14} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          {isSocialMediaSite || loadError ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-3 text-sm">
                This website cannot be displayed in an iframe due to security restrictions.
              </p>
              <button
                onClick={openInNewTab}
                className="text-black hover:text-gray-500 transition-colors duration-200 text-sm"
              >
                Open in New Tab
              </button>
            </div>
          ) : (
            <iframe
              src={url}
              title={title || "External content"}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              loading="lazy"
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ExternalLinkModal.propTypes = {
  url: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default ExternalLinkModal;
