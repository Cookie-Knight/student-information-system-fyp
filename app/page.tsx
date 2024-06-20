export default function Home() {
  return (
    <main>
     <div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 inline-block text-transparent bg-clip-text">CampuSphere</h2>
    <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 inline-block text-transparent bg-clip-text">Student Information System</h2>
    <p className="py-6 text-justify">Welcome to CampuSphere. 
                        This secure portal is your gateway to a wide array of academic and administrative services, 
                        designed to help you manage your educational journey efficiently.</p>

    </div>
    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Student Email</span>
          </label>
          
          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
          <input type="text" className="grow" placeholder="Email" />
        </label>


        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          
          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
          <input type="password" className="grow" placeholder="Password" defaultValue="" />
          </label>


          {/* The button to open modal */}
          <label htmlFor="forgot_password" className="link mt-2 text-xs">Forgot Password?</label>

          {/* Modal prompt form: Forgot Password */}
        
          <input type="checkbox" id="forgot_password" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Forgotten your password?</h3>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5">✕</button>
              <p className="py-2 text-sm">Type your email below! We'll send you a reset link if the email is valid!</p>
             
              <label className="input input-bordered flex items-center gap-2 mt-4">
              Email
              <input type="text" className="grow" placeholder="campusphere@site.com" />
              </label>
            
              <div className="modal-action">
                <button type="submit" value="Submit" className="btn">Submit</button>
              </div>
            
            </div>
          </div>
        

        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</div>

    </main>
  )
}