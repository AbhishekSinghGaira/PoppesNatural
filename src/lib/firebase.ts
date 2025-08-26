import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBn85IAOkoOXiCnAtTgvIehkYwtQDCUTB8",
  authDomain: "poppesnatural-82b4d.firebaseapp.com",
  projectId: "poppesnatural-82b4d",
  storageBucket: "poppesnatural-82b4d.firebasestorage.app",
  messagingSenderId: "1069977353179",
  appId: "1:1069977353179:web:3581070ee61828692105fe",
  measurementId: "G-05NDKJ7MQR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
