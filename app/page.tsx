export default function Home() {
  return (
    <main>
     <div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
    <h1 className="text-5xl font-bold">Student Information System</h1>
    <p className="py-6 text-justify">Welcome to CampuSphere. 
                        This secure portal is your gateway to a wide array of academic and administrative services, 
                        designed to help you manage your educational journey efficiently.</p>

    </div>
    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Student ID</span>
          </label>
          
          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
          <input type="text" className="grow" placeholder="Username" />
          </label>


        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          
          <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .1</svg>46-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
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