"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import Loading from "../components/Loading";
import { db, auth } from "@/lib/firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

type AbsentStudent = {
  reason: string;
  date: string;
};

type SubjectData = {
  name: string;
  programmeCode: string;
  time: string;
  location: string;
  absent_students: Record<string, AbsentStudent>;
};

type AttendanceData = {
  subjectName: string;
  programmeCode: string;
  time: string;
  location: string;
  reason: string;
  date: string;
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

export default function Attendance() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserCourses(user.uid);
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserCourses = async (userId: string) => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "students", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userCourses = userData.courses || [];
        const coursesList: CourseType[] = [];

        for (const courseObj of userCourses) {
          if (courseObj.courseId) {
            const courseDoc = await getDoc(doc(db, "courses", courseObj.courseId));
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              coursesList.push({ id: courseDoc.id, ...(courseData as Omit<CourseType, "id">) });
            }
          }
        }

        setCourses(coursesList);
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
        fetchAttendanceData(selectedCourse.id, semesterNumber);
      } else {
        setAttendanceData([]);
      }
    },
    [selectedCourse, user]
  );

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setAttendanceData([]);
  };

  const fetchAttendanceData = async (courseId: string, semesterNumber: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("courseId", "==", courseId),
        where("semesterNumber", "==", semesterNumber)
      );
      const querySnapshot = await getDocs(attendanceQuery);
      const data: AttendanceData[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const subjectData = docSnapshot.data() as SubjectData;
        const absentStudents = subjectData.absent_students || {};

        if (absentStudents[user.uid]) {
          const absentStudentData = absentStudents[user.uid] as AbsentStudent;
          data.push({
            subjectName: subjectData.name,
            programmeCode: subjectData.programmeCode,
            time: subjectData.time,
            location: subjectData.location,
            reason: absentStudentData.reason,
            date: absentStudentData.date,
          });
        }
      }

      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col w-full">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Attendance</div> 
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
                    <div className="divider divider-horizontal mx-4" style={{ marginLeft: "200px" }}></div>
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
                  {attendanceData.length > 0 ? (
                    <table className="table table-xs">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Programme Code</th>
                          <th>Subject Name</th>
                          <th>Time</th>
                          <th>Location</th>
                          <th>Reason</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((item, index) => (
                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{item.programmeCode}</td>
                            <td>{item.subjectName}</td>
                            <td>{item.time}</td>
                            <td>{item.location}</td>
                            <td>{item.reason}</td>
                            <td>{item.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center p-4">No absences found for this semester.</p>
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
