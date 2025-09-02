import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import useScrollLock from '../hooks/useScrollLock';

/**
 * DeleteConfirmationModal component
 *
 * A modal dialog that asks for confirmation before deleting a post
 *
 * @param {boolean} isOpen Whether the modal is open
 * @param {function} onClose Function to call when the modal is closed
 * @param {function} onConfirm Function to call when the delete is confirmed
 * @param {object} post The post to be deleted
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, post }) => {
  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-md shadow-md max-w-md w-full overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5" style={{borderBottom: '1px solid var(--border-color)'}}>
          <h3 className="text-base font-normal" style={{color: 'var(--text-primary)'}}>Confirm Removal</h3>
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 leading-relaxed text-sm" style={{color: 'var(--text-secondary)'}}>
            Are you sure you want to remove "{post?.title}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm transition-colors duration-300"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Got it
            </button>
            <button
              onClick={() => {
                onConfirm(post?.id);
                onClose();
              }}
              className="px-4 py-2 text-sm transition-colors duration-300 rounded-sm"
              style={{
                backgroundColor: 'var(--button-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-hover)'}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  post: PropTypes.object
};

export default DeleteConfirmationModal;
