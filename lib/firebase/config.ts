import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration - matches Firebase Console exactly
const firebaseConfig = {
  apiKey: "AIzaSyDIhAd_lkFF6MjU_9uI4sLRMTngyWToS5U",
  authDomain: "brightabyssinia-79439.firebaseapp.com",
  projectId: "brightabyssinia-79439",
  storageBucket: "brightabyssinia-79439.firebasestorage.app",
  messagingSenderId: "488054307118",
  appId: "1:488054307118:web:d372d6259c7298c42ae2bf",
  measurementId: "G-1QZMG6W7Y0"
};

// Initialize Firebase (client-side only)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Initialize Firebase function
function initializeFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      // Initialize new app
      app = initializeApp(firebaseConfig);
    }

    // Verify app has config
    if (!app || !app.options || !app.options.apiKey) {
      throw new Error('Firebase app is missing required configuration');
    }

    // Initialize Auth - always use the app instance
    if (!auth) {
      auth = getAuth(app);
      
      if (!auth || !auth.app) {
        throw new Error('Failed to initialize Firebase Auth');
      }
    }

    // Initialize Firestore
    if (!db) {
      db = getFirestore(app);
    }
  } catch (error: any) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
}

// Initialize immediately if on client
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Export getters that ensure initialization
export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side');
  }
  
  // Ensure app is initialized
  if (!app) {
    initializeFirebase();
  }
  
  if (!app) {
    throw new Error('Firebase app is not initialized');
  }
  
  // Always get fresh auth instance from app
  // This ensures proper linking and avoids stale references
  try {
    const authInstance = getAuth(app);
    
    // Verify it has config
    if (!authInstance.app?.options?.apiKey || !authInstance.app?.options?.authDomain) {
      throw new Error('Auth instance is missing configuration');
    }
    
    // Update cached reference
    auth = authInstance;
    
    return authInstance;
  } catch (error: any) {
    console.error('❌ Failed to get auth instance:', error);
    throw new Error(`Failed to get Firebase Auth: ${error.message}`);
  }
}

export function getDbInstance(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be used on the client side');
  }
  
  if (!app) {
    initializeFirebase();
  }
  
  if (!db || !app) {
    throw new Error('Firestore is not initialized');
  }
  
  return db;
}

export { auth, db, app };
