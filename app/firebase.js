// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
