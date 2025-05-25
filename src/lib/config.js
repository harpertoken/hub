// API URL configuration
// For client-side code, always use REACT_APP_ prefixed variables
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : (process.env.REACT_APP_API_URL || 'http://localhost:3030');

// Log API URL in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('API URL:', API_URL);
}

export { API_URL };
