/**
 * Cache Manager Utility
 *
 * This utility provides functions for managing the application's cache and storage.
 * It handles clearing localStorage, sessionStorage, and other cached data to help
 * users reset the application to a clean state.
 *
 * @module cacheManager
 */

/**
 * Clears all application cache including localStorage and in-memory caches
 *
 * This function:
 * 1. Clears all localStorage items
 * 2. Re-initializes any required empty structures
 * 3. Removes any legacy items that might still exist
 *
 * @returns {Object} Result object with the following properties:
 * @returns {boolean} result.success - Whether the operation was successful
 * @returns {string} result.message - A message describing the result
 * @returns {Error} [result.error] - The error object if an error occurred
 */
export const clearAllCache = () => {
  try {
    // Step 1: Clear all localStorage items
    // This removes all key-value pairs stored in the browser's localStorage
    localStorage.clear();

    // Step 2: Re-initialize any required empty structures
    // Some components expect certain structures to exist, so we recreate them as empty
    localStorage.setItem('cloudinary_posts', JSON.stringify([]));

    // Step 3: Remove any legacy items that might still exist
    // These are items from older versions of the application that might not be
    // cleared by localStorage.clear() due to different storage mechanisms
    localStorage.removeItem('synthara_memories');
    localStorage.removeItem('cortex_saved_insights');
    localStorage.removeItem('business_analyst_saved_insights');

    // Step 4: Log the successful operation for debugging purposes
    console.log('Cache cleared successfully');

    // Step 5: Return a success result object
    return {
      success: true,
      message: 'All application cache has been cleared successfully'
    };
  } catch (error) {
    // Handle any errors that occur during the cache clearing process
    console.error('Error clearing cache:', error);

    // Return a failure result object with the error details
    return {
      success: false,
      message: 'Failed to clear cache: ' + error.message,
      error // Include the original error object for debugging
    };
  }
};
