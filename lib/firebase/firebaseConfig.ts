// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCpnWTN9gldCcctFplwJe8pHumM08Og6cA",
  authDomain: "final-year-project-cef3f.firebaseapp.com",
  projectId: "final-year-project-cef3f",
  storageBucket: "final-year-project-cef3f.appspot.com",
  messagingSenderId: "244063019761",
  appId: "1:244063019761:web:b71801c59b1f7cb0dc3f50",
  measurementId: "G-HTL26K6Q6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

const storage = getStorage(app);

const initFirebase = () => {
  return app;
};


// Export the initialized services
export { db, auth, storage, initFirebase };