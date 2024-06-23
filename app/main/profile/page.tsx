"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

interface StudentData {
  name: string;
  studentId: string;
  course: string;
  currentSemester: string;
  personalEmail: string;
  permanentAddress: string;
  identificationNumber: string;
  gender: string;
  race: string;
  dob: string;
}

const Profile: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    studentId: "",
    course: "",
    currentSemester: "",
    personalEmail: "",
    permanentAddress: "",
    identificationNumber: "",
    gender: "",
    race: "",
    dob: "",
  });

  const [editableData, setEditableData] = useState<Partial<StudentData>>({
    name: "",
    personalEmail: "",
    permanentAddress: "",
    identificationNumber: "",
    gender: "",
    race: "",
    dob: "",
  });
  

  const router = useRouter();

  useEffect(() => {
    const fetchData = async (uid: string) => {
      try {
        const docRef = doc(db, "students", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudentData(docSnap.data() as StudentData);
          setEditableData(docSnap.data() as StudentData); // Set editable data initially
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    const checkAuth = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchData(user.uid);
        } else {
          console.log("User is not authenticated. Redirecting to login page.");
          router.push("/"); // Redirect to '/' if user is not authenticated
        }
      });
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not authenticated");
        router.push("/"); // Redirect to login or home page
        return;
      }

      const docRef = doc(db, "students", user.uid);
      await setDoc(docRef, editableData as StudentData, { merge: true });
      // Update displayed data after successful submission
      setStudentData(editableData as StudentData);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data. Please try again.");
    }
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col p-4 lg:flex-row">
        <div className="card w-96 bg-base-300 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt="Avatar"
            />
          </figure>
          <div className="card-body">
            <p> Student ID</p>
            <input
              type="text"
              placeholder="Student ID"
              className="input input-bordered w-full max-w-xs"
              value={studentData.studentId}
              disabled
            />
            <p>Course</p>
            <input
              type="text"
              placeholder="Current Course"
              className="input input-bordered w-full max-w-xs"
              value={studentData.course}
              disabled
            />
            <p>Current Semester</p>
            <input
              type="text"
              placeholder="Current Semester"
              className="input input-bordered w-full max-w-xs"
              value={studentData.currentSemester}
              disabled
            />
          </div>
        </div>

        <div className="card bg-base-300 flex-grow h-fit ml-4 p-5 rounded-box">
          <p>Full Name</p>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.name}
            onChange={handleInputChange}
          />
          <p>Personal Email</p>
          <input
            type="text"
            name="personalEmail"
            placeholder="Personal Email"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.personalEmail}
            onChange={handleInputChange}
          />
          <p>Permanent Address</p>
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.permanentAddress}
            onChange={handleInputChange}
          />
          <p>Identification Number</p>
          <input
            type="text"
            name="identificationNumber"
            placeholder="Identification Number"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.identificationNumber}
            onChange={handleInputChange}
          />
          <p>Gender</p>
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.gender}
            onChange={handleInputChange}
          />
          <p>Race</p>
          <input
            type="text"
            name="race"
            placeholder="Race"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.race}
            onChange={handleInputChange}
          />
          <p>Date of Birth</p>
          <input
            type="text"
            name="dob"
            placeholder="Date of Birth"
            className="input input-bordered w-full max-w-xs mb-4"
            value={editableData.dob}
            onChange={handleInputChange}
          />

          <button className="btn" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;