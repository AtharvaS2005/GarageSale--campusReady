/**
 * Utility to check if the server is reachable
 */

// The fixed server URL
const SERVER_URL = 'http://localhost:5002';

/**
 * Check if the server is reachable
 * @returns {Promise<boolean>} True if server is reachable, false otherwise
 */
export const checkServerConnectivity = async () => {
  try {
    console.log('Testing server connectivity to:', SERVER_URL);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${SERVER_URL}/test`, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('Server is reachable');
      return true;
    } else {
      console.error('Server responded with error status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Server connectivity check failed:', error.message);
    return false;
  }
};

/**
 * Check server connectivity and display an error message if unreachable
 * @param {Function} setError Function to set error message
 * @returns {Promise<boolean>} True if server is reachable, false otherwise
 */
export const verifyServerConnectivity = async (setError) => {
  const isConnected = await checkServerConnectivity();
  
  if (!isConnected && setError) {
    setError('Cannot connect to server. Please ensure the server is running at http://localhost:5002');
  }
  
  return isConnected;
};

export default { 
  checkServerConnectivity,
  verifyServerConnectivity,
  SERVER_URL
}; 