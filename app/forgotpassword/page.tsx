'use client';

import React, {useState} from "react";
import { validEmailHelper } from "@/lib/firebase/helper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, initFirebase } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

type Props = {};

const ForgotPassword = (props: Props) => {
  initFirebase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValidEmail(validEmailHelper(value));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidEmail) {
      <Loading />;
      await sendPasswordResetEmail(auth, email)
        .catch(function (error) {
          if (error.code === "auth/user-not-found") {
            setErrorMessages("User not found, please sign up");
          } else {
            setErrorMessages(error.message);
          }
        })
        .then(() => {
          router.push("/login");
        });
    }
  };

    return (
    <>
<div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">

    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Forgotten your password?</h1>
        <p className="py-6">
            If you've forgotten your password, don't worry! 
            Just enter your email address below and we'll send you instructions on how to reset it. 
            Remember to check your spam folder if you don't see our email in your inbox. 
            If you still have trouble, you can always contact our support team for assistance.
        </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form className="card-body" onSubmit={submit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Student Email</span>
          </label>
          <input 
          onChange={(e) => handleEmailChange(e.target.value)}
          type="email" placeholder="xxx@campusphere.com" className="input input-bordered" required />
          
           {!isValidEmail && email.length > 0 ? (
            <p className="mt-1 text-error text-xs italic text-red-500">
              Enter Valid Email
            </p>
          ) : (
            ""
          )}
        </div>
        <label>
        <a href="/login" className="label-text-alt link link-hover">Go back to login</a>
        </label>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Reset</button>
        </div>
        <div>
          {errorMessages.length > 0 ? (
            <p className="mt-4 text-error text-center text-xl font-bold italic text-red-500">
              {errorMessages}
            </p>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  </div>
</div>
    </>
    );
};

export default ForgotPassword;