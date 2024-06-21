"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "./firebase"; // Assuming you have auth imported from firebase
import { doc, getDoc } from "firebase/firestore";

interface StudentData {
  name: string;
  studentId: string;
  cgpa: string;
}

export default function Main() {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    studentId: "",
    cgpa: ""
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "students", user.uid); // Assuming your document ID in Firestore is the user's UID
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as StudentData;
            setStudentData(data);
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user logged in!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchStudentData();
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <main>
      <Header />
      <div className="p-5">
        <div className="flex justify-center items-center stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Name</div>
            <div className="stat-value text-primary">{studentData.name}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Student ID</div>
            <div className="stat-value text-secondary">{studentData.studentId}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary static">
            </div>
            <div className="stat-title">CGPA</div>
            <div className="stat-value">{studentData.cgpa}</div>
          </div>
        </div>

        <div className="divider"> Upcoming Lectures</div> 

        <div className="grid h-95 card bg-base-300 p-4 ml-1 mr-1 mb-4 mt-4 rounded-box">
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th></th>
                  <th>Programme Code</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>ENG101</td>
                  <td>English Literature</td>
                  <td>9:00 AM - 10:30 AM</td>
                  <td>Room 101</td>
                  <td>5/12/2024</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>MTH202</td>
                  <td>Advanced Calculus</td>
                  <td>11:00 AM - 12:30 PM</td>
                  <td>Room 202</td>
                  <td>5/12/2024</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>CSC303</td>
                  <td>Data Structures</td>
                  <td>2:00 PM - 3:30 PM</td>
                  <td>Room 303</td>
                  <td>5/12/2024</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>PHY404</td>
                  <td>Quantum Mechanics</td>
                  <td>4:00 PM - 5:30 PM</td>
                  <td>Room 404</td>
                  <td>5/12/2024</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>CHE105</td>
                  <td>Organic Chemistry</td>
                  <td>9:00 AM - 10:30 AM</td>
                  <td>Room 105</td>
                  <td>5/13/2024</td>
                </tr>
                <tr>
                  <th>6</th>
                  <td>HIS206</td>
                  <td>Modern History</td>
                  <td>11:00 AM - 12:30 PM</td>
                  <td>Room 206</td>
                  <td>5/13/2024</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Programme Code</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="divider"> Current Semester Progress</div> 

        <ul className="timeline justify-center ">
          <li>
            <div className="timeline-start timeline-box">Semester 1</div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <hr className="bg-primary"/>
          </li>
          <li>
            <hr className="bg-primary"/>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-end timeline-box">Semester 2</div>
            <hr className="bg-primary"/>
          </li>
          <li>
            <hr className="bg-primary"/>
            <div className="timeline-start timeline-box">Semester 3</div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <hr/>
          </li> 
          <li>
            <hr/>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-end timeline-box">Semester 4</div>
            <hr/>
          </li>
          <li>
            <hr/>
            <div className="timeline-start timeline-box">Semester 5</div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
