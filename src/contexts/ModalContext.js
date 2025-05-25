import React, { createContext, useContext, useState } from 'react';

/**
 * Context for managing modal states across the application
 * This allows components to communicate modal visibility to the main App component
 * to control header visibility and other global UI states
 */
const ModalContext = createContext();

/**
 * Custom hook to use the modal context
 * @returns {Object} Modal context value with state and functions
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

/**
 * Modal provider component that wraps the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Modal provider component
 */
export const ModalProvider = ({ children }) => {
  // State to track if any modal is currently open
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to track specific modal types
  const [activeModals, setActiveModals] = useState({
    aiLab: false,
    education: false,
    legal: false,
    preview: false,
    settings: false
  });

  /**
   * Open a specific modal type
   * @param {string} modalType - Type of modal to open
   */
  const openModal = (modalType) => {
    setActiveModals(prev => ({
      ...prev,
      [modalType]: true
    }));
    setIsModalOpen(true);
  };

  /**
   * Close a specific modal type
   * @param {string} modalType - Type of modal to close
   */
  const closeModal = (modalType) => {
    setActiveModals(prev => ({
      ...prev,
      [modalType]: false
    }));
    
    // Check if any other modals are still open
    const updatedModals = {
      ...activeModals,
      [modalType]: false
    };
    const hasOpenModals = Object.values(updatedModals).some(isOpen => isOpen);
    setIsModalOpen(hasOpenModals);
  };

  /**
   * Close all modals
   */
  const closeAllModals = () => {
    setActiveModals({
      aiLab: false,
      education: false,
      legal: false,
      preview: false,
      settings: false
    });
    setIsModalOpen(false);
  };

  const value = {
    isModalOpen,
    activeModals,
    openModal,
    closeModal,
    closeAllModals
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
