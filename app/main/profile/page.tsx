export default function Profile() {
    return (
      <main>
        <div className="flex flex-col p-4 lg:flex-row">


        <div className="card w-96 bg-base-300 shadow-xl ">
          <figure><img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Avatar" /></figure>
          <div className="card-body">
            <p> Student ID</p>
          <input type="text" placeholder="Student ID" className="input input-bordered w-full max-w-xs" disabled /> 
            <p>Course</p>
          <input type="text" placeholder="Current Course" className="input input-bordered w-full max-w-xs" disabled />
            <p>Current Semester</p>
          <input type="text" placeholder="Current Semester" className="input input-bordered w-full max-w-xs" disabled />
          </div>
        </div>

        <div className="card bg-base-300 flex-grow h-fit ml-4 p-5 rounded-box">
          <p>Full Name</p>
          <input type="text" placeholder="Full Name" className="input input-bordered w-full max-w-xs mb-4" disabled /> 
            <p>Personal Email</p>
          <input type="text" placeholder="Personal Email" className="input input-bordered w-full max-w-xs mb-4" /> 
            <p>Permanent Address</p>
          <input type="text" placeholder="Permanent Address" className="input input-bordered w-full max-w-xs mb-4" />
            <p>Identification Number</p>
          <input type="text" placeholder="Identification Number" className="input input-bordered w-full max-w-xs mb-4" disabled />
          <p>Gender</p>
          <input type="text" placeholder="Gender Email" className="input input-bordered w-full max-w-xs mb-4" disabled /> 
            <p>Race</p>
          <input type="text" placeholder="Race" className="input input-bordered w-full max-w-xs mb-4" disabled />
            <p>Date of Birth</p>
          <input type="text" placeholder="Date of Birth" className="input input-bordered w-full max-w-xs mb-4" disabled />

          <input type="Save" value="Submit" className="btn" />
        </div>
        </div>
    
      </main>
    )
}