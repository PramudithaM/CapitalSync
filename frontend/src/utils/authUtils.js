import { auth } from '../firebase';

/**
 * Get the current user's Firebase ID token
 * @returns {Promise<string|null>} The ID token or null if not authenticated
 */
export const getAuthToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

/**
 * Get current user ID
 * @returns {string|null} User ID or null
 */
export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};
