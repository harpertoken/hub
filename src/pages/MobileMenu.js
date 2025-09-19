import React from 'react';
import PropTypes from 'prop-types';
import { X, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalLink from './LegalLink';
import useScrollLock from '../hooks/useScrollLock';

const MobileMenu = ({ isOpen, onClose, onCreatePost, onToggleAIFeatures }) => {
  // Lock scroll when mobile menu is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-72 bg-white bg-opacity-80 backdrop-blur-md p-5 overflow-y-auto overflow-x-hidden border-l border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors duration-200"
        >
          <X size={14} />
        </button>

        <div className="mb-10 mt-12"></div>

        <nav className="mt-10 space-y-6">
          <div className="flex flex-col space-y-5">
            <button
              onClick={() => {
                onToggleAIFeatures();
                onClose();
              }}
              className="nav-link-wave flex items-center gap-1.5 text-gray-500 text-xs transition-colors duration-200 hover:text-black px-2 py-1 rounded-sm"
            >
              <Zap size={14} className="mr-1" />
              <span>AI Lab</span>
            </button>

             <Link
               to="/ui"
               onClick={onClose}
               className="nav-link-wave flex items-center gap-1.5 text-gray-500 text-xs transition-colors duration-200 hover:text-black px-2 py-1 rounded-sm"
             >
               <span>UI Design</span>
             </Link>

             <button
               onClick={() => {
                 onCreatePost();
                 onClose();
               }}
               className="nav-link-wave flex items-center gap-1.5 text-gray-500 text-xs transition-colors duration-200 hover:text-black px-2 py-1 rounded-sm"
             >
               <Plus size={14} className="mr-1" />
               <span>New Content</span>
             </button>
          </div>

          <div className="space-y-5 py-4 mt-6">
            <div>
              <a
                href="/education"
                className="nav-link-wave block text-gray-500 hover:text-black transition-colors duration-200 text-xs px-2 py-1 rounded-sm"
              >
                <span>Education</span>
              </a>
            </div>

            <div>
              <a
                href="/diagnostics"
                className="nav-link-wave block text-gray-500 hover:text-black transition-colors duration-200 text-xs px-2 py-1 rounded-sm"
              >
                <span>Diagnostics</span>
              </a>
            </div>

            <div>
              <Link
                to="/settings"
                className="nav-link-wave block text-gray-500 hover:text-black transition-colors duration-200 text-xs px-2 py-1 rounded-sm"
                onClick={onClose}
              >
                <span>Settings</span>
              </Link>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-50">
              <div className="space-y-4">
                <LegalLink
                  type="privacy"
                  className="nav-link-wave block text-gray-400 text-xs hover:text-black transition-colors duration-200 px-2 py-1 rounded-sm"
                  onClick={onClose}
                >
                  <span>Privacy</span>
                </LegalLink>
                <LegalLink
                  type="terms"
                  className="nav-link-wave block text-gray-400 text-xs hover:text-black transition-colors duration-200 px-2 py-1 rounded-sm"
                  onClick={onClose}
                >
                  <span>Terms</span>
                </LegalLink>

                <LegalLink
                  type="ai-policy"
                  className="nav-link-wave block text-gray-400 text-xs hover:text-black transition-colors duration-200 px-2 py-1 rounded-sm"
                  onClick={onClose}
                >
                  <span>AI</span>
                </LegalLink>
              </div>
            </div>
          </div>

          {/* Authentication removed */}
          <div className="mt-8 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Authentication has been removed in this version.
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  onToggleAIFeatures: PropTypes.func.isRequired,
};

export default MobileMenu;
