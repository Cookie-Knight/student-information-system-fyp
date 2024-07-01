import { auth } from './firebaseConfig'; // Adjust the path according to your file structure
import { signOut } from "firebase/auth";


export default async function signOutUser() {
    let result = null; // Variable to store the sign-out result
    let error = null; // Variable to store any error that occurs
  
    try {
      await signOut(auth); // Sign out the user
      result = "Sign-out successful"; // You can customize the result message
    } catch (e) {
      error = e; // Catch and store any error that occurs during sign-out
    }
  
    return { result, error }; // Return the sign-out result and error (if any)
  }
