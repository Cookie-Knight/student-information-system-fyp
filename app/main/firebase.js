// Import the necessary Firebase modules
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMm3JIyzm0olBZmsZadWGxIcJLizWg4WE",
  authDomain: "student-hub-e22c1.firebaseapp.com",
  databaseURL: "https://student-hub-e22c1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "student-hub-e22c1",
  storageBucket: "student-hub-e22c1.appspot.com",
  messagingSenderId: "946452848977",
  appId: "1:946452848977:web:1bac754bc97b83d0597370",
  measurementId: "G-K051B7KJ86"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const analytics = getAnalytics(app);

const db = getDatabase(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Export the initialized services
export { db, auth, app };
