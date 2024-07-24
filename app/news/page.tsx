'use client';

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import Header from "@/app/components/Header";

export default function News() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch images from Firestore when the component mounts
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "news"));
      // Extract URLs from the documents and update state
      const imageList = querySnapshot.docs.map(doc => doc.data().url as string);
      setImages(imageList);
    };

    fetchImages();
  }, []);

  return (
    <main>
      <Header />

      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">
          CampuSphere News
        </div> 
        <div className="divider"></div> 

        <div className="grid grid-cols-1 gap-4 p-4">
          {/* Render images fetched from Firestore */}
          {images.map((url, index) => (
            <div key={index} className="card bg-base-300 rounded-box p-4">
              <img className="object-cover h-full w-full rounded-box" src={url} alt={`news-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
