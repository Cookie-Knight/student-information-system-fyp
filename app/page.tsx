'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase/firebaseConfig";
import Header from "@/app/components/Header";
import { Clock } from '../app/components/Clock';

interface StudentData {
  name: string;
  studentId: string;
  cgpa: string;
  lectures: string[];
  completedSemesters: number;
}

interface Lecture {
  day: string;
  id: string;
  programmeCode: string;
  name: string;
  time: string;
  location: string;
  date: string;
}


const Main: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    studentId: "",
    cgpa: "",
    lectures: [],
    completedSemesters: 0
  });

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push('/login');
        } else {
          try {
            // Fetch student data
            const docRef = doc(db, "students", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data() as StudentData;
              setStudentData(data);

              // Fetch lectures data using the lectures array in studentData
              const lecturesData: Lecture[] = [];
              for (const lectureId of data.lectures) {
                const lectureDocRef = doc(db, "lectures", lectureId);
                const lectureDocSnap = await getDoc(lectureDocRef);
                if (lectureDocSnap.exists()) {
                  const lecture = { id: lectureDocSnap.id, ...lectureDocSnap.data() } as Lecture;
                  lecturesData.push(lecture);
                } else {
                  console.log(`Lecture document with ID ${lectureId} does not exist`);
                }
              }
              setLectures(lecturesData);
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      });
    };

    checkAuth();
  }, [router]);

  const renderSemester = (semesterNumber: number) => {
    const isCompleted = semesterNumber <= studentData.completedSemesters;
    return (
      <li key={semesterNumber}>
        {semesterNumber !== 1 && (
          <hr className={isCompleted ? "bg-primary progress-bar-completed" : "bg-gray progress-bar"} style={{ margin: "0 auto", width: "200%", marginLeft: "-100%" }}
          />
        )}
        <div className={`timeline-box ${semesterNumber % 2 === 0 ? 'timeline-end' : 'timeline-start'}`}>
          Semester {semesterNumber}
        </div>
        <div className="timeline-middle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${isCompleted ? 'text-primary' : 'text-gray'}`}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {semesterNumber === studentData.completedSemesters && (
          <hr className="bg-primary progress-bar-completed m-auto w-0 ml-auto"/>
        )}
      </li>
    );
  };

  const now = new Date()

  return (
    <main>
      <Header />
      <div className="min-h-screen min-w-screen p-5">
        <div className="flex w-full flex-col lg:flex-row">
          {/* Cards */}
          <div className="card bg-base-300 rounded-box grid h-16 flex-grow place-items-center">          
            <p className="h-16 pl-4 font-bold rounded-box text-3xl content-center bg-gradient-to-l from-indigo-50 to-violet-600 bg-clip-text text-transparent">
              Welcome to CampuSphere Student Information System.
            </p>
          </div>
          <div className="divider lg:divider-horizontal"></div>
          <div className="card bg-base-300 rounded-box grid h-16 flex-grow place-items-center">
          <div className="h-16 pl-4 font-bold rounded-box text-3xl content-center">
          <Clock time={now.getTime()} /></div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Stats Section */}
        <div className="flex justify-center items-center stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              {/* SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div className="stat-title">Name</div>
            <div className="stat-value text-primary">{studentData.name}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              {/* SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
            </div>
            <div className="stat-title">Student ID</div>
            <div className="stat-value text-secondary">{studentData.studentId}</div>
          </div>

          <div className="stat">
            <div className="stat-figure static">
              {/* SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
              </svg>
            </div>
            <div className="stat-title">CGPA</div>
            <div className="stat-value">{studentData.cgpa}</div>
          </div>
        </div>

        <div className="divider"> Upcoming Lectures</div>

        {/* Lectures Table */}
        <div className="grid h-95 card bg-base-300 p-4 ml-1 mr-1 mb-4 mt-4 rounded-box">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {lectures.map((lecture) => (
                  <tr key={lecture.id} className="hover">
                    
                    <td>{lecture.programmeCode}</td>
                    <td>{lecture.name}</td>
                    <td>{lecture.time}</td>
                    <td>{lecture.location}</td>
                    <td>{lecture.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="divider"> Current Semester Progress</div>

        {/* Timeline */}
        <ul className="timeline justify-center">
          {[1, 2, 3, 4, 5, 6].map(semester => renderSemester(semester))}
        </ul>
      </div>
    </main>
  );
};

export default Main;
