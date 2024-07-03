"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Header from "@/app/components/Header";
import Loading from "../components/Loading";

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

interface CGPAData extends GPAData {
  totalCreditHoursEarned: number;
  cgpa: number;
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

const calculateGPA = (subjects: ExamResultData[]): GPAData => {
  let totalCredits = 0;
  let totalPoints = 0;
  subjects.forEach((subject) => {
    totalCredits += subject.creditHours;
    totalPoints += subject.creditHours * getGradePoints(subject.grades);
  });
  const gpa = totalPoints / totalCredits;
  return {
    semesterCredits: totalCredits,
    gpa: parseFloat(gpa.toFixed(2)),
  };
};

const calculateCGPA = (examResults: any[]): CGPAData => {
  let totalCredits = 0;
  let totalPoints = 0;
  examResults.forEach((semester: any) => {
    semester.subjects.forEach((subject: any) => {
      totalCredits += subject.creditHours;
      totalPoints += subject.creditHours * getGradePoints(subject.grades);
    });
  });
  const cgpa = totalPoints / totalCredits;
  return {
    semesterCredits: 0,
    gpa: 0,
    totalCreditHoursEarned: totalCredits,
    cgpa: parseFloat(cgpa.toFixed(2)),
  };
};

export default function ExamResult() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [results, setResults] = useState<ExamResultData[]>([]);
  const [gpaData, setGpaData] = useState<GPAData | null>(null);
  const [cgpaData, setCgpaData] = useState<CGPAData | null>(null);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserCourses(currentUser.uid);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

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
      } else {
        setResults([]);
        setGpaData(null);
        setNoResultsFound(false);
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
          setGpaData(calculateGPA(subjects));
          setCgpaData(calculateCGPA(resultsData.examResults));
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

  return (
    <main>
      <Header />
      <div className="flex flex-col w-full">
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
                      {noResultsFound ? "No exam results found for this semester." : "Please select a course and semester to view results."}
                    </p>
                  )}
                </div>
              </div>

              {(gpaData || cgpaData) && (
                <div className="grid h-95 card bg-base-300 p-4 mx-4 my-4 rounded-box">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Semester Credits</th>
                          <th>GPA</th>
                          <th>Total Credit Hours Earned</th>
                          <th>CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{gpaData?.semesterCredits || '-'}</td>
                          <td>{gpaData?.gpa || '-'}</td>
                          <td>{cgpaData?.totalCreditHoursEarned || '-'}</td>
                          <td>{cgpaData?.cgpa || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </main>
  );
}