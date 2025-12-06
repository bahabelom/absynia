import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  onAuthStateChanged,
  NextOrObserver,
} from 'firebase/auth';
import { auth, getAuthInstance } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, getDbInstance } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  // Get auth instance (will throw if not initialized)
  const authInstance = getAuthInstance();
  const dbInstance = getDbInstance();

  try {
    // Verify auth instance is valid
    if (!authInstance?.app?.options?.apiKey || !authInstance?.app?.options?.authDomain) {
      throw new Error('Firebase Auth is not properly configured. Please check your Firebase setup.');
    }
    
    // Create user account
    let userCredential: UserCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      );
    } catch (error: any) {
      // Provide helpful error messages for common issues
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/api-key-not-valid') {
        throw new Error(
          'Firebase Authentication is not properly configured. ' +
          'Please enable Email/Password authentication in Firebase Console.'
        );
      }
      throw error;
    }

    // Update user profile
    try {
      await updateProfile(userCredential.user, {
        displayName,
      });
    } catch (profileError) {
      // Don't throw - user is still created
    }

    // Create user document in Firestore (non-blocking)
    try {
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName,
        photoURL: userCredential.user.photoURL ?? undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(dbInstance, 'users', userCredential.user.uid), userProfile);
    } catch (firestoreError: any) {
      // Don't throw - user is still created in Auth
      // Firestore errors are logged but don't block signup
    }

    return userCredential;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const authInstance = getAuthInstance();
  
  // Verify auth has complete config
  if (!authInstance?.app?.options?.apiKey || !authInstance?.app?.options?.authDomain) {
    throw new Error('Firebase Auth is missing configuration. Please check Firebase initialization.');
  }
  
  try {
    return await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    // Provide helpful error messages for common issues
    if (error.code === 'auth/configuration-not-found' || error.code === 'auth/api-key-not-valid') {
      throw new Error(
        'Firebase Authentication is not properly configured. ' +
        'Please enable Email/Password authentication in Firebase Console.'
      );
    }
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const authInstance = getAuthInstance();
  return await firebaseSignOut(authInstance);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const authInstance = getAuthInstance();
  return await sendPasswordResetEmail(authInstance, email);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const authInstance = getAuthInstance();
    return authInstance.currentUser;
  } catch {
    return null;
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: NextOrObserver<User>): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  try {
    const authInstance = getAuthInstance();
    return onAuthStateChanged(authInstance, callback);
  } catch {
    return () => {};
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const dbInstance = getDbInstance();
    const userDoc = await getDoc(doc(dbInstance, 'users', uid));
  
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const dbInstance = getDbInstance();
  const authInstance = getAuthInstance();

  await setDoc(
    doc(dbInstance, 'users', uid),
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Also update Firebase Auth profile if displayName or photoURL changed
  if (authInstance.currentUser && (updates.displayName || updates.photoURL)) {
    await updateProfile(authInstance.currentUser, {
      displayName: updates.displayName || authInstance.currentUser.displayName || undefined,
      photoURL: updates.photoURL || authInstance.currentUser.photoURL || undefined,
    });
  }
}

