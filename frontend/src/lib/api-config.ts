// API configuration
const API_CONFIG = {
  // Use environment variable for backend URL, fallback to localhost for development
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001',
  SHAP_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001',
};

export default API_CONFIG;


