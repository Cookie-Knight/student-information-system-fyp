"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/app/components/Header";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation';

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

export default function ExamResult() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [results, setResults] = useState<ExamResultData[]>([]);
  const [gpaData, setGpaData] = useState<GPAData | null>(null);
  const [cgpaData, setCgpaData] = useState<CGPAData | null>(null);
  const [noResultsFound, setNoResultsFound] = useState(false);
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
  }, []);

  const fetchUserCourses = async (userId: string) => {
    try {
      const studentDoc = await getDoc(doc(db, "students", userId));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const userCourses = studentData.courses || [];
        const coursesList: CourseType[] = [];

        for (const courseId of userCourses) {
          const courseDoc = await getDoc(doc(db, "courses", courseId));
          if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            coursesList.push({ id: courseDoc.id, name: courseData.name });
          }
        }

        setCourses(coursesList);
      }
    } catch (error) {
      console.error("Error fetching user courses: ", error);
    }
  };

  const handleSemesterChange = useCallback(
    (semesterNumber: number) => {
      setSelectedSemester(semesterNumber);
      if (semesterNumber && selectedCourse) {
        fetchResults(user!.uid, selectedCourse.id, semesterNumber);
      } else {
        setResults([]);
        setGpaData(null);
        setNoResultsFound(false); // Reset no results state
      }
    },
    [selectedCourse]
  );

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find((course) => course.id === courseId) || null;
    setSelectedCourse(selected);
    setSelectedSemester(null);
    setResults([]);
    setGpaData(null);
    setNoResultsFound(false); // Reset no results state
  };

  const fetchResults = async (studentId: string, courseId: string, semesterNumber: number) => {
    try {
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
          calculateCGPA(resultsData.examResults); // Calculate CGPA using all semesters
          setNoResultsFound(subjects.length === 0); // Set no results state
        } else {
          setResults([]);
          setGpaData(null);
          setNoResultsFound(true); // No data for the selected semester
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setGpaData(null);
      setNoResultsFound(true); // Assume no data on error
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
      gpa: gpa,
    });
  };

  const calculateCGPA = (examResults: any[]) => {
    let totalCredits = 0;
    let totalPoints = 0;
    examResults.forEach((semester: any) => {
      semester.subjects.forEach((subject: any) => {
        totalCredits += subject.creditHours;
        totalPoints += subject.creditHours * getGradePoints(subject.grades);
      });
    });

    const cgpa = totalPoints / totalCredits;

    setCgpaData({
      semesterCredits: 0, // Not relevant for CGPA
      gpa: 0, // Not relevant for CGPA
      totalCreditHoursEarned: totalCredits,
      cgpa: cgpa,
    });
  };

  const getGradePoints = (grade: string) => {
    switch (grade) {
      case "A":
        return 4;
      case "B":
        return 3;
      case "C":
        return 2;
      case "D":
        return 1;
      case "F":
        return 0;
      default:
        return 0;
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
                      {[1, 2, 3, 4, 5].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
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
                  noResultsFound ? (
                    <p className="text-center p-4">No results found for this semester.</p>
                  ) : (
                    <p className="text-center p-4">Select a semester to view results.</p>
                  )
                )}
              </div>
            </div>

            {(gpaData || cgpaData) && (
              <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
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
                        <td>{gpaData ? gpaData.semesterCredits : '-'}</td>
                        <td>{gpaData ? gpaData.gpa : '-'}</td>
                        <td>{cgpaData ? cgpaData.totalCreditHoursEarned : '-'}</td>
                        <td>{cgpaData ? cgpaData.cgpa : '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center p-4">Please log in to see your exam results.</p>
        )}
      </div>
    </main>
  );
}