"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "./firebase"; // Ensure firebase is configured correctly
import { ref, get } from "firebase/database"; // Import Realtime Database functions
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

interface StudentData {
  name: string;
  student_id: string;
  cgpa: string;
  programme_code: string;
  group: string;
}

interface TimetableData {
  [programme_code: string]: {
    [group: string]: {
      [day: string]: {
        course_code: string;
        time_start: string;
        time_end: string;
        location: string;
        date: string;
      }[];
    };
  };
}

const Main: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    student_id: "",
    cgpa: "",
    programme_code: "", // Add programme_code to state
    group: "" // Add group to state
  });
  const [timetable, setTimetable] = useState<TimetableData>({});
  
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchStudentData = async (userId: string) => {
      const userRef = ref(db, `Student/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Fetched student data:", data);
        setStudentData({
          name: data.Name,
          student_id: data.student_id,
          cgpa: data.CGPA,
          programme_code: data.Programme_Code,
          group: data.Group
        });

        const timetableRef = ref(db, `Timetable/${data.Programme_Code}`);
        const timetableSnapshot = await get(timetableRef);
        if (timetableSnapshot.exists()) {
          setTimetable(timetableSnapshot.val());
        }
      }
    };

    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/'); // Redirect to '/' if user is not authenticated
        } else {
          await fetchStudentData(user.uid);
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    checkAuth();

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
            <div className="stat-value text-secondary">{studentData.student_id}</div>
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
                  <th>No.</th>
                  <th>Course Code</th>
                  <th>Starting Time</th>
                  <th>Ending Time</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {studentData.programme_code && studentData.group &&
                  Object.keys(timetable[studentData.programme_code]?.[studentData.group] || {}).map((day) => (
                    timetable[studentData.programme_code][studentData.group][day].map((item, idx) => (
                      <tr key={idx}>
                        <th>{idx + 1}</th>
                        <td>{item.course_code}</td>
                        <td>{item.time_start}</td>
                        <td>{item.time_end}</td>
                        <td>{item.location}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))
                  ))
                }
              </tbody>
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
};

export default Main;
