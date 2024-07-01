"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation';

type Lecture = {
  programmeCode: string;
  name: string;
  time: string;
  location: string;
  day: string;
  semester: number;
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

export default function Timetable() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [timetable, setTimetable] = useState<Lecture[]>([]);
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
        collection(db, "lectures"),
        where("courseId", "==", courseId),
        where("semester", "==", semester)
      );
      const querySnapshot = await getDocs(timetableQuery);
      const timetableData = querySnapshot.docs.map(doc => doc.data() as Lecture);
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
            {selectedCourse ? (
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                <div className="flex items-center">
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{selectedCourse.name}</h2>
                  </div>
                  <div className="divider divider-horizontal mx-4" style={{ marginLeft: "350px" }}></div>
                  <div className="p-4">
                    <label className="form-control w-full max-w-xs" style={{ marginLeft: "200px" }}>
                      <div className="label">
                        <span className="label-text">Select a semester</span>
                      </div>
                      <select
                        className="select select-bordered"
                        value={selectedSemester || ""}
                        onChange={(e) => handleSemesterChange(Number(e.target.value))}
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
                        <th></th>
                        <th>Programme Code</th>
                        <th>Name</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((classInfo, index) => (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td>{classInfo.programmeCode}</td>
                          <td>{classInfo.name}</td>
                          <td>{classInfo.time}</td>
                          <td>{classInfo.location}</td>
                          <td>{classInfo.day}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">Select a semester to view subjects.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center p-4">Please log in to see your timetable.</p>
        )}
      </div>
    </main>
  );
}
