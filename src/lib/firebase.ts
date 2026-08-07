import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBM4s7zndX0u-Nefm86DGrfG8K2iRGnF4A",
  authDomain: "gen-lang-client-0207175688.firebaseapp.com",
  projectId: "gen-lang-client-0207175688",
  storageBucket: "gen-lang-client-0207175688.firebasestorage.app",
  messagingSenderId: "544527913762",
  appId: "1:544527913762:web:c1606206459c24fd720b7b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-hurmuudhotel-5cf5b3f2-eb23-4203-96d0-025250282ebc");
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
};
