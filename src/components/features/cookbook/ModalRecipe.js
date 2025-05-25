import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ModalRecipe = () => {
  return (
    <article className="recipe-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Recipe Header - Simplified */}
      <header className="bg-gray-50 p-6 border-b border-gray-100">
        Modal
        <p className="text-sm text-gray-600">
          Instructions details for the Modal component.
        </p>
        <div className="flex items-center text-xs text-gray-400 mt-3">
          <span className="mr-4">15 minutes</span>
          <span>Medium</span>
        </div>
      </header>

      {/* Ingredients Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Ingredients
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
          <li>1 React Context API for global modal state management</li>
          <li>1 base Modal component with glass morphism styling</li>
          <li>3 specialized modal types (content, confirmation, form)</li>
          <li>2 cups of React state management for modal interactions</li>
          <li>1 tablespoon of accessibility enhancements (focus trapping, keyboard navigation)</li>
          <li>A handful of transition animations</li>
          <li>A pinch of backdrop blur effects</li>
        </ul>
      </section>

      {/* Instructions Section - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-4">
          <li>
            <p className="font-medium mb-1">Create a Base Modal Component</p>
            <p>Start by creating a reusable base modal component with glass morphism styling that can be extended for different use cases.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/components/Modal.js
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeButtonText = 'Got it'
}) => {
  const modalRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    fullscreen: 'w-full h-full rounded-none'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={\`bg-white rounded-md shadow-lg \${sizeClasses[size]} w-full max-h-[90vh] overflow-auto\`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            {title}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="mb-8">
          {children}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors duration-200"
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create a Modal Context</p>
            <p>Set up a context to manage modal state globally across the application.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// src/contexts/ModalContext.js
import React, { createContext, useState, useContext } from 'react';
import Modal from '../components/Modal';

// Create context
const ModalContext = createContext();

// Provider component
export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: null,
    size: 'medium',
    closeButtonText: 'Got it'
  });

  const openModal = ({ title, content, size, closeButtonText }) => {
    setModalState({
      isOpen: true,
      title,
      content,
      size: size || 'medium',
      closeButtonText: closeButtonText || 'Got it'
    });
  };

  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        size={modalState.size}
        closeButtonText={modalState.closeButtonText}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Create Specialized Modal Types</p>
            <p>Implement different modal types for specific use cases.</p>
            <SyntaxHighlighter
              language="javascript"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// Example: Confirmation Modal
const useConfirmationModal = () => {
  const { openModal, closeModal } = useModal();

  const showConfirmation = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  }) => {
    const content = (
      <div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              if (onCancel) onCancel();
              closeModal();
            }}
            className="px-4 py-2 text-gray-500 hover:font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              closeModal();
            }}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded"
          >
            {confirmText}
          </button>
        </div>
      </div>
    );

    openModal({
      title,
      content,
      size: 'small',
      closeButtonText: null // Hide default close button
    });
  };

  return { showConfirmation };
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Add the Modal Provider to Your App</p>
            <p>Wrap your application with the ModalProvider to make modals available throughout the app.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// In App.js
import { ModalProvider } from './contexts/ModalContext';

const App = () => {
  return (
    <ModalProvider>
      {/* Your app components */}
    </ModalProvider>
  );
};`}
            </SyntaxHighlighter>
          </li>

          <li>
            <p className="font-medium mb-1">Use the Modal in Ingredients</p>
            <p>Use the modal hook to open modals from any component in your application.</p>
            <SyntaxHighlighter
              language="jsx"
              style={oneLight}
              className="text-xs rounded border border-gray-200 mt-2"
              showLineNumbers={true}
            >
              {`// Example usage in a component
import { useModal } from '../contexts/ModalContext';
import { useConfirmationModal } from '../hooks/useConfirmationModal';

const MyComponent = () => {
  const { openModal } = useModal();
  const { showConfirmation } = useConfirmationModal();

  const handleOpenInfoModal = () => {
    openModal({
      title: 'Information',
      content: (
        <div>
          <p>This is some important information for the user.</p>
          <img src="/path/to/image.jpg" alt="Information" className="mt-4 rounded" />
        </div>
      )
    });
  };

  const handleDeleteItem = () => {
    showConfirmation({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: () => {
        // Handle deletion logic
        console.log('Item deleted');
      }
    });
  };

  return (
    <div>
      <button onClick={handleOpenInfoModal}>Show Information</button>
      <button onClick={handleDeleteItem}>Delete Item</button>
    </div>
  );
};`}
            </SyntaxHighlighter>
          </li>
        </ol>
      </section>

      {/* Chef's Notes - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Chef's Notes
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            This modal system provides several key benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Centralized Management:</span> Using React Context allows for global modal state management, making it easy to open modals from anywhere in your application.
            </li>
            <li>
              <span className="font-medium">Reusability:</span> The base Modal component can be extended for different use cases, reducing code duplication and ensuring consistent styling.
            </li>
            <li>
              <span className="font-medium">Glass Morphism Styling:</span> The backdrop blur and transparent background create a modern, elegant look that fits well with various design systems.
            </li>
            <li>
              <span className="font-medium">Accessibility:</span> Built-in keyboard navigation, focus management, and proper ARIA attributes ensure the modal is accessible to all users.
            </li>
          </ul>
          <p className="mt-4">
            This approach creates a flexible modal system that can be used for various purposes, from simple information displays to complex forms and confirmations, all with a consistent and modern design.
          </p>
        </div>
      </section>

      {/* Instructions Tips - Simplified */}
      <section className="p-6 border-b border-gray-100">
        Instructions Tips
        <div className="text-sm text-gray-600 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Focus Management:</span> For better accessibility, consider adding focus trapping to keep keyboard focus within the modal when it's open.
            </li>
            <li>
              <span className="font-medium">Animation:</span> Add enter/exit animations using CSS transitions or a library like Framer Motion for a more polished user experience.
            </li>
            <li>
              <span className="font-medium">Stacking Modals:</span> If you need to support multiple modals stacked on top of each other, consider using a modal stack in your context state.
            </li>
            <li>
              <span className="font-medium">Mobile Optimization:</span> Ensure your modals are responsive and work well on mobile devices, possibly using different styles or behaviors for smaller screens.
            </li>
            <li>
              <span className="font-medium">Performance:</span> For modals with complex content, consider using React.lazy and Suspense to load modal content only when needed.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default ModalRecipe;
