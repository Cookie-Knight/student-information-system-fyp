"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
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
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [timetable, setTimetable] = useState<Exam[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserCourses(user.uid);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserCourses = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "students", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userCourses = userData.courses || [];
        const coursesList = [];

        for (const courseId of userCourses) {
          const courseDoc = await getDoc(doc(db, "courses", courseId));
          if (courseDoc.exists()) {
            coursesList.push({ id: courseDoc.id, ...courseDoc.data() });
          }
        }

        setCourses(coursesList as CourseType[]);
      }
    } catch (error) {
      console.error("Error fetching user courses: ", error);
    }
  };

  const handleSemesterChange = useCallback(
    (semesterNumber: number) => {
      setSelectedSemester(semesterNumber);
      if (semesterNumber && selectedCourse) {
        fetchTimetable(selectedCourse.id, semesterNumber);
      } else {
        setTimetable([]);
      }
    },
    [selectedCourse]
  );

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setTimetable([]);
  };

  const fetchTimetable = async (courseId: string, semester: number) => {
    try {
      const timetableQuery = query(
        collection(db, "exams"),
        where("courseId", "==", courseId),
        where("semester", "==", semester)
      );
      const querySnapshot = await getDocs(timetableQuery);
      const timetableData = querySnapshot.docs.map(doc => doc.data() as Exam);
      setTimetable(timetableData);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col w-full">
        {user ? (
          <>
            {selectedCourse && (
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                <div className="stat">
                  <h2 className="text-lg font-bold" style={{ marginLeft: "20px" }}>{selectedCourse.name}</h2>
                </div>
                <div className="stat">
                  <label className="form-control w-full max-w-xs">
                    <div className="label" style={{ marginLeft: "190px" }}>
                      <span className="label-text">Select a semester</span>
                    </div>
                    <select
                      className="select select-bordered"
                      value={selectedSemester || ""}
                      onChange={(e) => handleSemesterChange(Number(e.target.value))}
                      style={{ marginRight: "-200px", marginLeft: "190px" }}
                    >
                      <option value="">Pick one</option>
                      {selectedCourse.semesters.map((semester) => (
                        <option key={semester.semesterNumber} value={semester.semesterNumber}>
                          Semester {semester.semesterNumber}
                        </option>
                      ))}
                    </select>
                  </label>
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
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
              <div className="overflow-x-auto">
                {timetable.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Programme Code</th>
                        <th>Name</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((examInfo) => (
                        <tr key={examInfo.programmeCode}>
                          <td>{examInfo.programmeCode}</td>
                          <td>{examInfo.name}</td>
                          <td>{examInfo.time}</td>
                          <td>{examInfo.location}</td>
                          <td>{examInfo.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">No exams found for this semester.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center p-4">Please log in to see your exam timetable.</p>
        )}
      </div>
    </main>
  );
}
