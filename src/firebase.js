import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// REPLACE THIS WITH YOUR FIREBASE CONFIG
// Get it from: Firebase Console > Project Settings > Your apps > Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Force account selection on every sign-in
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);

export default app;
