import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBERDsty8BqTiQh4yDXE9SOr9XWo9mG18E",
  authDomain: "emergency-response-syste-eefaa.firebaseapp.com",
  projectId: "emergency-response-syste-eefaa",
  storageBucket: "emergency-response-syste-eefaa.firebasestorage.app",
  messagingSenderId: "1018843277311",
  appId: "1:1018843277311:web:28203736321a1766be69ca",
  measurementId: "G-FXQBXZB690"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();