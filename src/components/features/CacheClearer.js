import { useState } from 'react';
import { clearAllCache } from '../utils/cacheManager';
import { toast } from 'react-hot-toast';

/**
 * CacheClearer Component
 *
 * This component provides a user interface for clearing all application cache,
 * including localStorage, sessionStorage, and browser caches.
 *
 * Features:
 * - Clears all types of browser storage
 * - Provides visual feedback during clearing process
 * - Shows success/error notifications using toast messages
 * - Automatically reloads the page after clearing
 *
 * @component
 */
const CacheClearer = () => {
  /**
   * State to track if cache clearing is in progress
   * Used to disable the button and show loading state
   * @type {[boolean, Function]}
   */
  const [isClearing, setIsClearing] = useState(false);

  /**
   * Handles the cache clearing process
   * Uses the clearAllCache utility function to clear all browser storage
   * Shows toast notifications for success/failure
   * Reloads the page after successful clearing
   */
  const handleClearCache = () => {
    // Set clearing state to show loading UI
    setIsClearing(true);

    try {
      // Call the utility function to clear all cache types
      const result = clearAllCache();

      if (result.success) {
        // Show success notification
        toast.success('Cache cleared successfully');

        // Force page reload to ensure all components re-initialize with empty cache
        // Delay slightly to allow the user to see the success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // Show error message from the utility function
        toast.error(result.message);
      }
    } catch (error) {
      // Handle any unexpected errors
      toast.error('Failed to clear cache: ' + error.message);
    } finally {
      // Reset clearing state (only matters if there was an error)
      setIsClearing(false);
    }
  };

  /**
   * Render the cache clearing interface
   * @returns {JSX.Element} The rendered component
   */
  return (
    <div>
      {/* Section heading */}
      Application Cache

      {/* Description text explaining what cache clearing does */}
      <p className="text-sm text-gray-600 mb-4">
        Clearing the cache will remove all locally stored data and reset the application to its initial state.
      </p>

      {/* Clear cache button with loading state */}
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className={`w-full px-4 py-2 text-xs text-red-600 bg-white border border-red-100 hover:bg-red-50 transition-colors duration-200 ${
          isClearing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isClearing ? 'Clearing...' : 'Clear All Cache'}
      </button>
    </div>
  );
};

export default CacheClearer;
