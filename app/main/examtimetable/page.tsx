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
  
export default function ExamTimetable() {
  return (
      <main>
        <Header />
          <div className="flex flex-col w-full">
          <div className="stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">

<div className="stat">
  <div className="stat-title">Semester</div>
  <div className="stat-value text-lg ">5</div>
</div>

<div className="stat">
  <div className="stat-title">Semester Period</div>
  <div className="stat-value text-lg ">15-APR-2024 - 06-AUG-2024</div>
</div>

<div className="stat">
  <div className="stat-title">Printed Date</div>
  <div className="stat-value text-lg ">29-MAY-2024 7:51:30 PM</div>
</div>

</div>
              
              <div className="divider text-slate-400">The following is the scheduled examination information.</div>

              <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
                  <div className="overflow-x-auto">
                      <table className="table table-xs">

                      
                          <thead>
                              <tr>
                                  <th></th>
                                  <th>Programme Code</th>
                                  <th>Name</th>
                                  <th>Time</th>
                                  <th>Location</th>
                                  <th>Day</th>
                              </tr>
                          </thead>
                          <tbody>
                          <tr>
                                  <th>1</th>
                                  <td>ENG101</td>
                                  <td>English Literature</td>
                                  <td>9:00 AM - 10:30 AM</td>
                                  <td>Room 101</td>
                                  <td>Monday</td>
                              </tr>
                              <tr>
                                  <th>2</th>
                                  <td>MTH202</td>
                                  <td>Advanced Calculus</td>
                                  <td>11:00 AM - 12:30 PM</td>
                                  <td>Room 202</td>
                                  <td>Tuesday</td>
                              </tr>
                              <tr>
                                  <th>3</th>
                                  <td>CSC303</td>
                                  <td>Data Structures</td>
                                  <td>2:00 PM - 3:30 PM</td>
                                  <td>Room 303</td>
                                  <td>Wednesday</td>
                              </tr>
                              <tr>
                                  <th>4</th>
                                  <td>PHY404</td>
                                  <td>Quantum Mechanics</td>
                                  <td>4:00 PM - 5:30 PM</td>
                                  <td>Room 404</td>
                                  <td>Friday</td>
                              </tr>
                              <tr>
                                  <th>5</th>
                                  <td>CHE105</td>
                                  <td>Organic Chemistry</td>
                                  <td>9:00 AM - 10:30 AM</td>
                                  <td>Room 105</td>
                                  <td>Saturday</td>
                              </tr>
                              <tr>
                                  <th>6</th>
                                  <td>HIS206</td>
                                  <td>Modern History</td>
                                  <td>11:00 AM - 12:30 PM</td>
                                  <td>Room 206</td>
                                  <td>Sunday</td>
                              </tr>
                          </tbody>
                          <tfoot>
                              <tr>
                                  <th></th>
                                  <th>Programme Code</th>
                                  <th>Name</th>
                                  <th>Time</th>
                                  <th>Location</th>
                                  <th>Day</th>
                              </tr>
                          </tfoot>
                          
                      </table>
                      
                  </div>
              </div>
          </div>
</main>
  )
}