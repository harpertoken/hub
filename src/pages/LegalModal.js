import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import AIUsagePolicy from './AIUsagePolicy';
import useScrollLock from '../hooks/useScrollLock';

const LegalModal = ({ isOpen, onClose, type }) => {
  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'ai-policy':
        return <AIUsagePolicy />;
      default:
        return <div>Content not found</div>;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'privacy':
        return 'Privacy';
      case 'terms':
        return 'Terms';
      case 'ai-policy':
        return 'AI Policy';
      default:
        return 'Information';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-30"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="w-[95%] h-[90%] max-w-4xl flex flex-col overflow-hidden rounded-md shadow-lg"
        style={{
          backgroundColor: '#ffffff',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e5e5'
        }}
      >
        <div className="flex justify-between items-center p-4 mb-2">
          {getTitle()}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors duration-200"
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4 md:p-6">
          {renderContent()}
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

LegalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['privacy', 'terms', 'ai-policy']).isRequired
};

export default LegalModal;
