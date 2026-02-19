import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  indexedDBLocalPersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Auth with IndexedDB persistence (works better on mobile)
export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});

// Debug auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('✅ User signed in:', user.email);
    // Store auth hint in localStorage as backup
    localStorage.setItem('auth_user_email', user.email);
  } else {
    console.log('❌ No user signed in');
    localStorage.removeItem('auth_user_email');
  }
});

export const googleProvider = new GoogleAuthProvider();

// Don't force account selection - this might be breaking mobile auth
googleProvider.setCustomParameters({
  prompt: 'consent'
});

export const db = getFirestore(app);

export default app;
