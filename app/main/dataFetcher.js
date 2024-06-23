// Import Firebase Firestore methods and db instance
import { db } from './firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Function to fetch a single document by document ID
export const fetchDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log(`Document with ID ${documentId} does not exist`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error; // Throw the error to handle it in the calling function
  }
};

// Function to fetch all documents in a collection
export const fetchCollection = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error; // Throw the error to handle it in the calling function
  }
};
