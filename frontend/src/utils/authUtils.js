import { auth } from '../firebase';
<<<<<<< Updated upstream
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Waits for Firebase to restore auth session.
 * Fixes auth.currentUser being null on page load.
 */
export const waitForAuth = () => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Get Firebase ID token, waiting for auth to be ready first.
 */
export const getAuthToken = async () => {
  try {
    const user = await waitForAuth();
    if (!user) {
      console.warn('getAuthToken: No authenticated user');
      return null;
    }
    return await user.getIdToken(true); // true = force refresh if expired
=======

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
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

<<<<<<< Updated upstream
export const isAuthenticated = async () => {
  const user = await waitForAuth();
  return user !== null;
};

export const getCurrentUserId = async () => {
  const user = await waitForAuth();
  return user?.uid || null;
};

// import { auth } from '../firebase';

// /**
//  * Get the current user's Firebase ID token
//  * @returns {Promise<string|null>} The ID token or null if not authenticated
//  */
// export const getAuthToken = async () => {
//   try {
//     const user = auth.currentUser;
//     if (user) {
//       const token = await user.getIdToken();
//       return token;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error getting auth token:', error);
//     return null;
//   }
// };

// /**
//  * Check if user is authenticated
//  * @returns {boolean} True if user is logged in
//  */
// export const isAuthenticated = () => {
//   return auth.currentUser !== null;
// };

// /**
//  * Get current user ID
//  * @returns {string|null} User ID or null
//  */
// export const getCurrentUserId = () => {
//   return auth.currentUser?.uid || null;
// };
=======
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
>>>>>>> Stashed changes
