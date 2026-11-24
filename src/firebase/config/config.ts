import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "findit-54810.firebaseapp.com",
  projectId: "findit-54810",
  storageBucket: "findit-54810.firebasestorage.app",
  messagingSenderId: "2214870195",
  appId: "1:2214870195:web:75c1ce1ffc4a739c0284c6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;