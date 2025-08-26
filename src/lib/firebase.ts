import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3WcBxkDnlyhnWFc6dzf_HRbYITn_Ilcc",
  authDomain: "poppes-natural.firebaseapp.com",
  projectId: "poppes-natural",
  storageBucket: "poppes-natural.firebasestorage.app",
  messagingSenderId: "969984032063",
  appId: "1:969984032063:web:1c01bdd8d42f0a602e678a",
  measurementId: "G-ZM0CD81PN2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);