import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

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
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5" style={{borderBottom: '1px solid #e5e5e5'}}>
          Confirm Removal
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{color: '#666666'}}
            onMouseEnter={(e) => e.target.style.color = '#000000'}
            onMouseLeave={(e) => e.target.style.color = '#666666'}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 leading-relaxed text-sm" style={{color: '#666666'}}>
            Are you sure you want to remove "{post?.title}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm transition-colors duration-300"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.target.style.color = '#000000'}
              onMouseLeave={(e) => e.target.style.color = '#666666'}
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
                backgroundColor: '#f0f0f0',
                color: '#000000',
                border: '1px solid #e5e5e5'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
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
