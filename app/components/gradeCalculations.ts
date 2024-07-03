import { db } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const getGradePoints = (grade: string): number => {
    const gradePoints: { [key: string]: number } = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    return gradePoints[grade] || 0;
  };

export async function getCGPA(userId: string): Promise<number> {
    try {
      const resultsDoc = await getDoc(doc(db, "results", userId));
      if (resultsDoc.exists()) {
        const resultsData = resultsDoc.data();
        let totalCredits = 0;
        let totalPoints = 0;
        resultsData.examResults.forEach((semester: any) => {
          semester.subjects.forEach((subject: any) => {
            totalCredits += subject.creditHours;
            totalPoints += subject.creditHours * getGradePoints(subject.grades);
          });
        });
        const cgpa = totalPoints / totalCredits;
        return parseFloat(cgpa.toFixed(2));
      } else {
        throw new Error("No results data found");
      }
    } catch (error) {
      console.error("Error fetching CGPA:", error);
      throw error;
    }
  }