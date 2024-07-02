'use client';

import Particles from "../components/Particles";
import signIn from "@/lib/firebase/signIn";
import { useRouter } from 'next/navigation';
import { useState } from "react";

function Login(): JSX.Element {
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const router = useRouter();

  // Handle form submission
  const handleLogin = async ( event: { preventDefault: () => void } ) => {
    event.preventDefault();

    // Attempt to sign in with provided email and password
    const { result, error } = await signIn( email, password );

    if ( error ) {
      // Display and log any sign-in errors
      console.log( error );
      return;
    }

    // Sign in successful
    console.log( result );

    // create a new page for admin
    router.push( "/" );
  }


  return (
    <main>
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <div className="hero-content flex-col lg:flex-row-reverse">
            <Particles
            className="absolute inset-0 -z-10 animate-fade-in"
            quantity={100}
          />
          <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">CampuSphere.</h1>
            <h1 className="text-5xl font-bold">Student Information System</h1>
          
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-300">
            <form className="card-body" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Student Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    type="email"
                    className="grow"
                    placeholder="xxx@campusphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>

                <label className="label">
                  <a href="/forgotpassword" className="label-text-alt link link-hover" >
                    Forgot password?
                  </a>
                </label>

              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;