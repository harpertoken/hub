import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * 
 * @param {boolean} isLocked - Whether the scroll should be locked
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    // Don't do anything if not in browser environment
    if (typeof document === 'undefined') return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
    
    // Function to lock scroll
    const lockScroll = () => {
      // Get the width of the scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply styles to prevent scrolling but maintain layout
      document.body.style.overflow = 'hidden';
      
      // Add padding right to prevent layout shift when scrollbar disappears
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    };
    
    // Function to unlock scroll
    const unlockScroll = () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
    
    // Apply or remove scroll lock based on isLocked prop
    if (isLocked) {
      lockScroll();
    } else {
      unlockScroll();
    }
    
    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      unlockScroll();
    };
  }, [isLocked]); // Re-run effect when isLocked changes
};

export default useScrollLock;
