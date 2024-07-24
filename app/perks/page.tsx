'use client'; // Directive indicating this component will run on the client side

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebase/firebaseConfig"; // Import Firebase configuration
import Header from "@/app/components/Header"; // Import Header component

export default function Perks() {
  const [images, setImages] = useState<string[]>([]); // State to store image URLs

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch documents from 'perks' collection in Firestore
      const querySnapshot = await getDocs(collection(db, "perks"));
      const imageList = querySnapshot.docs.map(doc => doc.data().url as string); // Extract image URLs
      setImages(imageList); // Update state with image URLs
    };

    fetchImages(); // Call the function to fetch images
  }, []); // Empty dependency array to run effect once on component mount

  return (
    <main>
      <Header /> {/* Render Header component */}
      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">
          CampuSphere Perks {/* Title of the section */}
        </div>
        <div className="divider"></div> {/* Divider line */}
        <div className="grid grid-cols-1 gap-4 p-4">
          {images.map((url, index) => (
            <div key={index} className="card bg-base-300 rounded-box p-4">
              <img className="object-cover h-full w-full rounded-box" src={url} alt={`perk-${index}`} /> {/* Render each image */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
