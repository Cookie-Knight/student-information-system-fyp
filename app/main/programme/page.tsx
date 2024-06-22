"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "../firebase"; // Ensure firebase is configured correctly
import { ref, get } from "firebase/database"; // Import Realtime Database functions
import { useRouter } from 'next/router'; // Import useRouter from Next.js

const router = useRouter(); // Initialize useRouter

useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/'); // Redirect to homepage if user is not authenticated
        } else {
          console.log("User is authenticated:", user);
          // Handle authenticated user logic here, such as fetching data
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
  
    checkAuth();
  }, [router]); // Include router in dependency array to avoid warnings
  
export default function Programme() {
  return (
    <main>
      <Header />
      
      <div className="flex flex-col w-full">
      <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Programme History</div> 

        <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">

        <div className="overflow-x-auto">
<table className="table">
  {/* head */}
  <thead>
    <tr>
      <th>Subject Code</th>
      <th>Subject Name</th>
    </tr>
  </thead>
  <tbody>
    {/* row 1 */}
    <tr>
      <td>Diploma in Information Technology</td>
      <td>3</td>

    </tr>
    {/* row 2 */}
    <tr className="hover">
      <td>Diploma in Information Technology</td>
      <td>2</td>
    </tr>
    {/* row 3 */}
    <tr>
      <td>Diploma in Information Technology</td>
      <td>1</td>

    </tr>
  </tbody>
</table>
</div>
</div>
      </div>
    </main>
  );
}