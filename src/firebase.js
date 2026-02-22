import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
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

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to LOCAL - keeps users signed in even after closing app
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Auth persistence error:', error);
  });

export const googleProvider = new GoogleAuthProvider();

// Remove prompt parameter to allow seamless sign-in persistence
// No custom parameters needed

export const db = getFirestore(app);

export default app;
