"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "@/lib/firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import Loading from "../components/Loading";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated: ", user.uid); // Debug
        setUser(user);
        fetchUserCourses(user.uid);
      } else {
        console.log("No user authenticated"); // Debug
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserCourses = async (userId: string) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
    console.log("Selected course: ", selected); // Debug
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setTimetable([]);
  };

  const fetchTimetable = async (courseId: string, semester: number) => {
    try {
      setLoading(true);
      console.log("Fetching timetable for course: ", courseId, " semester: ", semester); // Debug
      const timetableQuery = query(
        collection(db, "exams"),
        where("courseId", "==", courseId),
        where("semester", "==", semester)
      );
      const querySnapshot = await getDocs(timetableQuery);
      const timetableData = querySnapshot.docs.map((doc) => doc.data() as Exam);
      console.log("Fetched timetable: ", timetableData); // Debug
      setTimetable(timetableData);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col w-full">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">
          Exam Timetable
        </div>
        <div className="divider"></div>
        {loading ? (
          <Loading />
        ) : (
          user && (
            <>
              {selectedCourse ? (
                <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
                  <div className="flex items-center">
                    <div className="p-4">
                      <h2 className="text-lg font-bold">{selectedCourse.name}</h2>
                    </div>
                    <div className="divider divider-horizontal mx-4" style={{ marginLeft: "250px" }}></div>
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
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((examInfo, index) => (
                          <tr key={index}>
                            <th>{index + 1}</th>
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
                    <p className="text-center p-4">No timetable found for this semester.</p>
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