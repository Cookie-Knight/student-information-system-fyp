"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { db, auth, storage } from "@/lib/firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Course {
  courseId: string;
  semesters: string[];
}

interface StudentData {
  name: string;
  studentId: string;
  courses: Course[];
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
    courses: [],
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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

          const aspectRatio = 4 / 4;
          let width = img.width;
          let height = img.height;

          if (width > height * aspectRatio) {
            width = height * aspectRatio;
          } else {
            height = width / aspectRatio;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

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
      const croppedBlob = await resizeAndCropImage(file, 400, 400); 
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, croppedBlob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const userDocRef = doc(db, "students", user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: downloadUrl
      } as Partial<StudentData>);

      setAvatarUrl(downloadUrl);
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      alert("Failed to upload avatar. Please try again.");
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen min-w-screen">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Profile Information</div> 
        <div className="divider"></div> 
        
        <div className="flex flex-col p-4 lg:flex-row">
          <div className="card h-fit w-auto bg-base-300 shadow-xl">
            <figure>
              <img className="rounded-box"
                src={avatarUrl || 'https://static.vecteezy.com/system/resources/previews/017/800/528/non_2x/user-simple-flat-icon-illustration-vector.jpg'}
                alt="Avatar"
              />
            </figure>
            <div className="card-body">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt text-sm">Student Identification Number</span>
                </div>
                <input type="text" placeholder="Student ID" className="input input-bordered w-full max-w-xs bg-gray-300 text-gray-700" value={studentData.studentId} disabled/>  
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt text-sm">Course Name</span>
                </div>
                <input type="text" placeholder="Course" className="input input-bordered w-full max-w-xs bg-gray-300 text-gray-700" value={studentData.courses.map(course => course.courseId).join(", ")} disabled/>  
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt text-sm">Current Semester</span>
                </div>
                <input type="text" placeholder="Course" className="input input-bordered w-full max-w-xs bg-gray-300 text-gray-700" value={studentData.currentSemester} disabled/>  
              </label>
            </div>
          </div>

          <div className="divider lg:divider-horizontal"></div>

          <div className="card bg-base-300 flex-grow p-5 rounded-box">

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Full Name</span>
              </div>
              <input type="text" placeholder="Full Name" name="name" value={editableData.name} onChange={handleInputChange}/>  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Personal Email</span>
              </div>
              <input type="text" placeholder="Personal Email" name="personalEmail" value={editableData.personalEmail} onChange={handleInputChange} />  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Permanent Address</span>
              </div>
              <input type="text" placeholder="Permanent Address" name="permanentAddress" value={editableData.permanentAddress} onChange={handleInputChange} />  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Identification Number / Passport ID</span>
              </div>
              <input type="text" placeholder="Identification Number"  name="identificationNumber" value={editableData.identificationNumber} onChange={handleInputChange} />  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Gender</span>
              </div>
              <input type="text" placeholder="Gender"  name="gender" value={editableData.gender} onChange={handleInputChange} />  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Race</span>
              </div>
              <input type="text" placeholder="Race"  name="race" value={editableData.race} onChange={handleInputChange} />  
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <div className="label">
                <span className="label-text-alt text-sm">Date of Birth</span>
              </div>
              <input type="text" placeholder="Date of Birth"  name="dob" value={editableData.dob} onChange={handleInputChange} />  
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-sm">Upload your profile picture</span>
              </div>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileUpload} />
            </label>

            <button className="btn mt-4" onClick={handleSubmit}>
              Confirm Information Update
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
