"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Header from "../components/Header";
import Loading from "../components/Loading";
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
  subjects: SubjectType[];
};

type CourseType = {
  id: string;
  name: string;
  semesters: SemesterType[];
};

export default function SubjectListing() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
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
    (semesterId: string) => {
      setSelectedSemester(semesterId);
      if (semesterId && selectedCourse) {
        const selectedSemesterData = selectedCourse.semesters.find(
          (semester) => semester.id === semesterId
        );
        if (selectedSemesterData) {
          setSubjects(selectedSemesterData.subjects || []);
        } else {
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
    },
    [selectedCourse]
  );

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setSubjects([]);
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col min-h-screen min-w-screen">
        {user ? (
          <>
            {selectedCourse && (
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                <div className="stat">
                  <h2 className="text-lg font-bold"
                  style={{ marginLeft: "20px" }}>{selectedCourse.name}</h2>
                </div>
                <div className="stat">
                  <label className="form-control w-full max-w-xs">
                    <div className="label"style={{ marginLeft: "190px" }}
                    >
                      <span className="label-text">Select a semester</span>
                    </div>
                    <select
                      className="select select-bordered"
                      value={selectedSemester || ""}
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      style={{ marginRight: "-300px", marginLeft: "190px" }}

                    >
                      <option value="">Pick one</option>
                      {selectedCourse.semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.name}
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
                          <td>{subject.code}</td>
                          <td>{subject.name}</td>
                          <td>{subject.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">No subjects found for this semester.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
}