"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "@/lib/firebase/firebaseConfig"; 
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import Loading from "../components/Loading";
import DateComponent from '../components/Date';
import { Clock } from '@/app/components/Clock';
import { onAuthStateChanged, User } from "firebase/auth"; 
import { useRouter } from 'next/navigation'; 

type Exam = {
  programmeCode: string;
  name: string;
  time: string;
  location: string;
  date: string;
  semester: number;
  courseId: string; 
};

type SemesterType = {
  semesterNumber: number;
  subjects: string[];
};

type CourseType = {
  id: string;
  name: string;
  semesters: SemesterType[];
};

export default function ExamTimetable() {
  const [user, setUser] = useState<User | null>(null); // State to store user information
  const [courses, setCourses] = useState<CourseType[]>([]); // State to store list of courses
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null); // State to store selected course
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null); // State to store selected semester number
  const [timetable, setTimetable] = useState<Exam[]>([]); // State to store exam timetable
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const router = useRouter();
  const now = new Date(); // Current date

  // useEffect hook to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated: ", user.uid); // Debug
        setUser(user);
        fetchUserCourses(user.uid); // Fetch courses for authenticated user
      } else {
        console.log("No user authenticated"); // Debug
        setUser(null);
        router.push('/login'); // Redirect to login page if no user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Function to fetch user courses from Firestore
  const fetchUserCourses = async (userId: string) => {
    try {
      setLoading(true); // Set loading to true while fetching data
      console.log("Fetching courses for user: ", userId); // Debug
      const userDoc = await getDoc(doc(db, "students", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data: ", userData); // Debug
        const userCourses = userData.courses || [];
        const coursesList = [];

        for (const course of userCourses) {
          const courseId = course.courseId;
          const courseDoc = await getDoc(doc(db, "courses", courseId));
          if (courseDoc.exists()) {
            coursesList.push({ id: courseDoc.id, ...courseDoc.data() });
          }
        }

        console.log("Fetched courses: ", coursesList); // Debug
        setCourses(coursesList as CourseType[]);
      }
    } catch (error) {
      console.error("Error fetching user courses: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Callback to handle semester change
  const handleSemesterChange = useCallback(
    (semesterNumber: number) => {
      setSelectedSemester(semesterNumber); // Set selected semester number
      if (semesterNumber && selectedCourse) {
        fetchTimetable(selectedCourse.id, semesterNumber); // Fetch timetable for the selected course and semester
      } else {
        setTimetable([]); // Clear timetable if no semester is selected
      }
    },
    [selectedCourse] // Dependency array
  );

  // Function to handle course selection
  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    console.log("Selected course: ", selected); // Debug
    setSelectedCourse(selected); // Set selected course
    setSelectedSemester(null); // Reset selected semester
    setTimetable([]); // Clear timetable
  };

  // Function to fetch timetable from Firestore
  const fetchTimetable = async (courseId: string, semester: number) => {
    try {
      setLoading(true); // Set loading to true while fetching data
      console.log("Fetching timetable for course: ", courseId, " semester: ", semester); // Debug
      const timetableQuery = query(
        collection(db, "exams"), 
        where("courseId", "==", courseId),
        where("semester", "==", semester)
      );
      const querySnapshot = await getDocs(timetableQuery);
      const timetableData = querySnapshot.docs.map(doc => doc.data() as Exam);
      console.log("Fetched timetable: ", timetableData); // Debug
      setTimetable(timetableData); // Set fetched timetable data
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  return (
    <main>
      <Header /> {/* Render header component */}
      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Timetable</div> 
        <div className="divider"></div> 
        {loading ? (
          <Loading /> // Render loading component while data is being fetched
        ) : (
          user && (
            <>
              {selectedCourse ? (
                <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                  <div className="stat">
                    <h2 className="text-lg font-bold">{selectedCourse.name}</h2> {/* Display selected course name */}
                  </div>
                  <div className="stat">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Select a semester</span>
                      </div>
                      <select
                        className="select select-bordered"
                        value={selectedSemester || ""}
                        onChange={(e) => handleSemesterChange(Number(e.target.value))} // Handle semester change
                      >
                        <option value="">Pick one</option>
                        {selectedCourse.semesters.map((semester) => (
                          <option key={semester.semesterNumber} value={semester.semesterNumber}>
                            Semester {semester.semesterNumber} {/* Display semester number */}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="stat">
                    <div className="stat-value font-bold text-xl">
                      <DateComponent /> {/* Display current date */}
                    </div>
                    <div className="stat-desc font-bold text-xl">
                      <Clock time={now.getTime()} /> {/* Display current time */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                  <div className="stat">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Select a course</span>
                      </div>
                      <select
                        className="select select-bordered"
                        onChange={(e) => handleCourseSelect(e.target.value)} // Handle course selection
                      >
                        <option value="">Pick one</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name} {/* Display course name */}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="stat">
                    <div className="stat-value font-bold text-xl">
                      <DateComponent /> {/* Display current date */}
                    </div>
                    <div className="stat-desc font-bold text-xl">
                      <Clock time={now.getTime()} /> {/* Display current time */}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
                <div className="overflow-x-auto">
                  {timetable.length > 0 ? (
                    <table className="table">
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
                        {timetable.map((examInfo, index) => (
                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{examInfo.programmeCode}</td> {/* Display programme code */}
                            <td>{examInfo.name}</td> {/* Display exam name */}
                            <td>{examInfo.time}</td> {/* Display exam time */}
                            <td>{examInfo.location}</td> {/* Display exam location */}
                            <td>{examInfo.date}</td> {/* Display exam date */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center p-4">No timetable found for this semester.</p> // Display message if no timetable found
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </main>
  );
}
