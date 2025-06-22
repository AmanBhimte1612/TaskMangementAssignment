import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

/**
 * Logs in a user using email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ uid: string; sessionId: string }>} User ID and Firebase session ID (ID token)
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ uid: string; sessionId: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const sessionId = await user.getIdToken(); // Firebase ID Token (JWT)
    const uid = user.uid;

    console.log("Logged in as:", user.email);
    return { uid, sessionId };
  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw new Error(error.message);
  }
};
