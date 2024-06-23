"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth, storage } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  avatarUrl: string;
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
    avatarUrl: "",
  });

  const [editableData, setEditableData] = useState<Partial<StudentData>>({
    name: "",
    personalEmail: "",
    permanentAddress: "",
    identificationNumber: "",
    gender: "",
    race: "",
    dob: "",
    avatarUrl: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // State for avatar URL

  const router = useRouter();

  useEffect(() => {
    const fetchData = async (uid: string) => {
      try {
        const docRef = doc(db, "students", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as StudentData;
          setStudentData(data);
          setEditableData(data);
          setAvatarUrl(data.avatarUrl || null);
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

  // Function to resize and crop image to 4:5 aspect ratio
  const resizeAndCropImage = async (file: File, targetWidth: number, targetHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate dimensions for the 4:5 aspect ratio
          const aspectRatio = 4 / 5;
          let width = img.width;
          let height = img.height;

          if (width > height * aspectRatio) {
            width = height * aspectRatio;
          } else {
            height = width / aspectRatio;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Centering and drawing the image on the canvas
          ctx?.drawImage(
            img,
            (img.width - width) / 2,
            (img.height - height) / 2,
            width,
            height,
            0,
            0,
            targetWidth,
            targetHeight
          );

          // Convert canvas to Blob and resolve the promise
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert canvas to Blob"));
            }
          }, file.type);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // Resize and crop image to a 4:5 aspect ratio
      const croppedBlob = await resizeAndCropImage(file, 400, 400); 
      
      // Upload the cropped image to Firebase Storage
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, croppedBlob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // Update avatarUrl in Firestore
      const userDocRef = doc(db, "students", user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: downloadUrl // Use type assertion to include avatarUrl
      } as Partial<StudentData>); // Type assertion here to resolve TypeScript error

      setAvatarUrl(downloadUrl);
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      alert("Failed to upload avatar. Please try again.");
    }
  };

  
  return  (
    <main>
      <Header />
      <div className="flex flex-col p-4 lg:flex-row">
        <div className="card w-96 bg-base-300 shadow-xl">
          <figure>
            <img
              src={avatarUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'}
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

          {/* File upload input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />

          <button className="btn mt-4" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
