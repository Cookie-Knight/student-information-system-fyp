// pages/examResults.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getCGPA } from "@/app/components/gradeCalculations";
import Header from "@/app/components/Header";
import Loading from "@/app/components/Loading";
import { Clock } from "../components/Clock";
import DateComponent from "../components/Date";

// Types
interface ExamResultData {
  subjectCode: string;
  subjectTitle: string;
  creditHours: number;
  marks: number;
  grades: string;
}

interface GPAData {
  semesterCredits: number;
  gpa: number;
}

interface CourseType {
  id: string;
  name: string;
}

// Utility functions
const getGradePoints = (grade: string): number => {
  const gradePoints: { [key: string]: number } = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  return gradePoints[grade] || 0;
};

export default function ExamResult() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [results, setResults] = useState<ExamResultData[]>([]);
  const [gpaData, setGpaData] = useState<GPAData | null>(null);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCGPA, setShowCGPA] = useState(false);
  const router = useRouter();
  const now = new Date();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserCourses(currentUser.uid);
        fetchCGPA(currentUser.uid);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchCGPA = async (userId: string) => {
    try {
      const fetchedCGPA = await getCGPA(userId);
      setCGPA(fetchedCGPA);
    } catch (error) {
      console.error("Error fetching CGPA:", error);
      setCGPA(null);
    }
  };

  const fetchUserCourses = async (userId: string) => {
    try {
      setLoading(true);
      const studentDoc = await getDoc(doc(db, "students", userId));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const userCourses = studentData.courses || [];
        const coursesList: CourseType[] = [];

        for (const courseObj of userCourses) {
          if (courseObj.courseId) {
            const courseDoc = await getDoc(doc(db, "courses", courseObj.courseId));
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              coursesList.push({ id: courseDoc.id, name: courseData.name });
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
      if (semesterNumber && selectedCourse && user) {
        fetchResults(user.uid, selectedCourse.id, semesterNumber);
        setShowCGPA(true);
      } else {
        setResults([]);
        setGpaData(null);
        setNoResultsFound(false);
        setShowCGPA(false);
      }
    },
    [selectedCourse, user]
  );

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setResults([]);
    setGpaData(null);
    setNoResultsFound(false);
    setShowCGPA(false);
  };

  const fetchResults = async (studentId: string, courseId: string, semesterNumber: number) => {
    try {
      setLoading(true);
      const resultsDoc = await getDoc(doc(db, "results", studentId));
      if (resultsDoc.exists()) {
        const resultsData = resultsDoc.data();
        const semester = resultsData.examResults.find((sem: any) => sem.courseId === courseId && sem.semesterNumber === semesterNumber);

        if (semester) {
          const subjects = semester.subjects.map((subject: any) => ({
            subjectCode: subject.code,
            subjectTitle: subject.name,
            creditHours: subject.creditHours,
            marks: subject.marks,
            grades: subject.grades,
          }));

          setResults(subjects);
          calculateGPA(subjects);
          setNoResultsFound(subjects.length === 0);
        } else {
          setResults([]);
          setGpaData(null);
          setNoResultsFound(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setGpaData(null);
      setNoResultsFound(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = (subjects: ExamResultData[]) => {
    let totalCredits = 0;
    let totalPoints = 0;
    subjects.forEach((subject) => {
      totalCredits += subject.creditHours;
      totalPoints += subject.creditHours * getGradePoints(subject.grades);
    });

    const gpa = totalPoints / totalCredits;

    setGpaData({
      semesterCredits: totalCredits,
      gpa: parseFloat(gpa.toFixed(2)),
    });
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 mx-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Exam Results</div> 
        <div className="divider"></div> 

        {loading ? (
          <Loading />
        ) : (
          user && (
            <>
              <div className="flex justify-between items-center stats stats-vertical lg:stats-horizontal p-4 mx-4 my-4 shadow">
                <div className="stat">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Select a course</span>
                    </div>
                    <select
                      className="select select-bordered"
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      value={selectedCourse?.id || ""}
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
                <div className="stat">
                  <div className="stat-value font-bold text-xl">
                <DateComponent />
                </div>
                <div className="stat-desc font-bold text-xl">
                <Clock time={now.getTime()} />
                </div>
                </div>
                {selectedCourse && (
                  <div className="stat flex justify-end w-full">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Select a semester</span>
                      </div>
                      <select
                        className="select select-bordered"
                        value={selectedSemester || ""}
                        onChange={(e) => handleSemesterChange(Number(e.target.value))}
                      >
                        <option value="">Pick one</option>
                        {[1, 2, 3, 4, 5].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              </div>

              {selectedSemester && (
                <div className="grid h-95 card bg-base-300 p-4 mx-4 my-4 rounded-box">
                  <div className="overflow-x-auto">
                    {results.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Subject Code</th>
                            <th>Subject Title</th>
                            <th>Credit Hours</th>
                            <th>Marks</th>
                            <th>Grades</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, index) => (
                            <tr key={index}>
                              <td>{result.subjectCode}</td>
                              <td>{result.subjectTitle}</td>
                              <td>{result.creditHours}</td>
                              <td>{result.marks}</td>
                              <td>{result.grades}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center p-4">
                        {noResultsFound ? "No exam results found for this semester." : "Loading results..."}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {showCGPA && (
                <div className="stats shadow mx-4 my-2">
                  {gpaData && (
                    <div className="stat">
                      <div className="stat-title">Semester GPA</div>
                      <div className="stat-value">{gpaData.gpa.toFixed(2)}</div>
                      <div className="stat-desc">Credits: {gpaData.semesterCredits}</div>
                    </div>
                  )}
                  {cgpa !== null && (
                    <div className="stat">
                      <div className="stat-title">Overall CGPA</div>
                      <div className="stat-value">{cgpa.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )
        )}
      </div>
    </main>
  );
}