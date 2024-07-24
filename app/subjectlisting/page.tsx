"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Header from "../components/Header";
import Loading from "../components/Loading";
import DateComponent from '../components/Date';
import { Clock } from '@/app/components/Clock';
import { db, auth } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

type SubjectType = {
  code: string;
  name: string;
  status: string;
};

type SemesterType = {
  id: string;
  name: string;
  semesterNumber: number;
  subjects: SubjectType[];
};

type CourseType = {
  id: string;
  name: string;
  semesters: SemesterType[];
};

export default function SubjectListing() {
  const [user, setUser] = useState<User | null>(null); // State to store user information
  const [courses, setCourses] = useState<CourseType[]>([]); // State to store list of courses
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null); // State to store the selected course
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null); // State to store the selected semester ID
  const [subjects, setSubjects] = useState<SubjectType[]>([]); // State to store list of subjects
  const router = useRouter();
  const now = new Date();

  // useEffect hook to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user state
        fetchUserCourses(user.uid); // Fetch user courses if logged in
      } else {
        setUser(null); // Clear user state
        router.push('/login'); // Redirect to login page if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Function to fetch user courses from Firestore
  const fetchUserCourses = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "students", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userCourses = userData.courses || [];
        const coursesList = [];

        for (const courseData of userCourses) {
          const courseDoc = await getDoc(doc(db, "courses", courseData.courseId));
          if (courseDoc.exists()) {
            const courseInfo = courseDoc.data();
            const course = {
              id: courseDoc.id,
              name: courseInfo.name,
              semesters: courseInfo.semesters.map((semester: any) => ({
                id: semester.id,
                name: semester.name,
                semesterNumber: semester.semesterNumber,
                subjects: semester.subjects.map((subject: any) => ({
                  ...subject,
                  status: courseData.semesters.find(
                    (userSemester: any) => userSemester.id === semester.id
                  )?.subjects.find(
                    (userSubject: any) => userSubject.code === subject.code
                  )?.status || "Not Enrolled"
                }))
              }))
            };
            coursesList.push(course); // Add course to the list
          }
        }

        setCourses(coursesList as CourseType[]); // Set the courses state
      }
    } catch (error) {
      console.error("Error fetching user courses: ", error); // Handle error
    }
  };

  // Callback to handle semester change
  const handleSemesterChange = useCallback(
    (semesterId: string) => {
      setSelectedSemester(semesterId); // Set the selected semester ID
      if (semesterId && selectedCourse) {
        const selectedSemesterData = selectedCourse.semesters.find(
          (semester) => semester.id === semesterId
        );
        if (selectedSemesterData) {
          setSubjects(selectedSemesterData.subjects || []); // Set the subjects for the selected semester
        } else {
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
    },
    [selectedCourse] // Dependency array
  );

  // Function to handle course selection
  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected); // Set the selected course
    setSelectedSemester(null); // Reset the selected semester
    setSubjects([]); // Clear subjects list
  };

  return (
    <main>
      <Header /> {/* Render header component */}
      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Subject Listing</div>
        <div className="divider"></div>

        {user ? ( // Render if user is logged in
          <>
            {selectedCourse && (
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                <div className="stat">
                  <h2 className="text-lg font-bold">
                    {selectedCourse.name} {/* Display selected course name */}
                  </h2>
                </div>
              
                <div className="stat">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Select a semester</span>
                    </div>
                
                    <select
                      className="select select-bordered"
                      value={selectedSemester || ""}
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      
                    >
                      <option value="">Pick one</option>
                      {selectedCourse.semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.name} {/* Display semester name */}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="stat">
                  <div className="stat-value font-bold text-xl">
                <DateComponent /> {/* Display date */}
                </div>
                <div className="stat-desc font-bold text-xl">
                <Clock time={now.getTime()} /> {/* Display clock */}
                </div>
                </div>

              </div>
            )}


            {!selectedCourse && (
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                <div className="stat">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Select a course</span>
                    </div>
                    <select
                      className="select select-bordered"
                      onChange={(e) => handleCourseSelect(e.target.value)}
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
                <DateComponent /> {/* Display date */}
                </div>
                <div className="stat-desc font-bold text-xl">
                <Clock time={now.getTime()} /> {/* Display clock */}
                </div>
                </div>
                
              </div>
            )}


            <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
              <div className="overflow-x-auto">
                {subjects.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.code}>
                          <td>{subject.code}</td> {/* Display subject code */}
                          <td>{subject.name}</td> {/* Display subject name */}
                          <td>{subject.status}</td> {/* Display subject status */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">No subjects found for this semester.</p> // Display message if no subjects found
                )}
              </div>
            </div>
          </>
        ) : (
          <Loading /> // Render loading component if user is not logged in
        )}
      </div>
    </main>
  );
}
