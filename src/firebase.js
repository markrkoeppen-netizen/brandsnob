import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTcD-ZlWn_ZLLYmbMLHc8n1kQFOlOqRM0",
  authDomain: "brandsnobs-37142.firebaseapp.com",
  projectId: "brandsnobs-37142",
  storageBucket: "brandsnobs-37142.firebasestorage.app",
  messagingSenderId: "871954882561",
  appId: "1:871954882561:web:64458b4dab4fed8305e000",
  measurementId: "G-YDR3W1YX0N"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth
export const auth = getAuth(app);
// CRITICAL: Set persistence IMMEDIATELY and AWAIT it
// This ensures auth state persists across sessions (especially mobile)
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('✅ Auth persistence set to LOCAL');
  } catch (error) {
    console.error('❌ Auth persistence failed:', error);
  }
})();
// Monitor auth state restoration (helpful for debugging)
let authInitialized = false;
onAuthStateChanged(auth, (user) => {
  if (!authInitialized) {
    authInitialized = true;
    if (user) {
      console.log('🔐 Auth restored from storage:', user.email);
    } else {
      console.log('⚠️ No persisted auth found');
    }
  }
});
export const googleProvider = new GoogleAuthProvider();
// No custom parameters - allows seamless persistence

// NOTE: Switched from getFirestore(app) to initializeFirestore(app, {...}).
// Capacitor's native WebView (capacitor://localhost) can get stuck using
// Firestore's default connection method. Auto-detecting the right
// connection type doesn't always work correctly inside Capacitor's
// WebView, so we force long polling directly instead — this is the
// more reliable fix for the deals page spinning forever inside the
// iOS Simulator/native app, while still working fine in a normal browser.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export default app;