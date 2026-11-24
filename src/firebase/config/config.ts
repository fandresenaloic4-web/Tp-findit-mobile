// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCI1qfAvAqms3elLBs7V7NolvnnGiD0kqc",
    authDomain: "findit-54810.firebaseapp.com",
    projectId: "findit-54810",
    storageBucket: "findit-54810.firebasestorage.app",
    messagingSenderId: "2214870195",
    appId: "1:2214870195:web:75c1ce1ffc4a739c0284c6",
    measurementId: "G-HFJWGLKYE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


