import Header from "@/app/components/Header";

export default function SubjectListing() {
    return (
        <main>
          <Header />
 <div className="flex flex-col w-full">



 <div className="stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
  
 <label className="form-control w-full max-w-xs p-4">
  <div className="label">
    <span className="label-text">Select a semester</span>
  </div>
  <select className="select select-bordered">
    <option disabled selected>Pick one</option>
    <option>Semester One</option>
    <option>Semester Two</option>
    <option>Semester Semester Three</option>
  </select>
</label>

  <div className="stat">
    <div className="stat-title">Semester Period</div>
    <div className="stat-value text-lg ">15-APR-2024 - 06-AUG-2024</div>
  </div>
  
  <div className="stat">
    <div className="stat-title">Printed Date</div>
    <div className="stat-value text-lg ">29-MAY-2024 7:51:30 PM</div>
  </div>
  
</div>
          <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">

          <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
      <th>Subject Code</th>
      <th>Subject Name</th>
      <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <td>MTH202</td>
        <td>Linear Algebra</td>
        <td>Finish</td>
      </tr>
      {/* row 2 */}
      <tr className="hover">
        <td>PHY405</td>
        <td>Quantum Mechanics</td>
        <td>Finish</td>
      </tr>
      {/* row 3 */}
      <tr>
        <td>ENG301</td>
        <td>Advanced Writing Techniques</td>
        <td>Finish</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
        </div>
</main>
    )
}