import axios from 'axios';

// Always use the hardcoded URL for development
const API_URL = 'http://localhost:5002';

console.log('API is configured to use:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase() || 'GET'} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response success: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Network error (server not available)
    if (!error.response) {
      console.error('Network error - server may be down:', error.message);
      error.isNetworkError = true;
    } else {
      console.error(`API Response error: ${error.response.status} from ${error.config?.url}`);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Test server connectivity on startup
async function testServerConnection() {
  try {
    const response = await fetch(`${API_URL}/test`);
    if (response.ok) {
      console.log('Server connection test successful');
    } else {
      console.error('Server connection test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Server connection test failed - server may not be running:', error);
  }
}

// Run the test
testServerConnection();

export default api; 