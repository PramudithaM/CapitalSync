import { auth } from '../firebase';

const SESSION_KEY = 'loginTime';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get the current user's Firebase ID token
 * @returns {Promise<string|null>} The ID token or null if not authenticated
 */
export const getAuthToken = async () => {
  try {
    // Wait for Firebase to finish restoring the persisted session.
    // auth.authStateReady() resolves once the initial auth state is known,
    // so auth.currentUser is guaranteed to be set (or null) by the time we read it.
    await auth.authStateReady();
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

/**
 * Save the current timestamp as the login time.
 * Call this immediately after a successful login.
 */
export const saveLoginTimestamp = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

/**
 * Check whether the 24-hour session window has expired.
 * @returns {boolean} True if session has expired or timestamp is missing
 */
export const isSessionExpired = () => {
  const loginTime = localStorage.getItem(SESSION_KEY);
  if (!loginTime) return true;
  return Date.now() - parseInt(loginTime, 10) >= SESSION_DURATION_MS;
};

/**
 * Remove the login timestamp from storage.
 * Call this when the user logs out.
 */
export const clearSessionTimestamp = () => {
  localStorage.removeItem(SESSION_KEY);
};
