export default function Programme() {
    return (
      <main>
        <div className="flex flex-col w-full">
        <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Programme History</div> 

          <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">

          <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Programme</th>
        <th>Semester</th>
        <th>Semester Period</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <td>Diploma in Information Technology</td>
        <td>3</td>
        <td>15-APR-2024 - 06-AUG-2024</td>
        <td>Active</td>
      </tr>
      {/* row 2 */}
      <tr className="hover">
        <td>Diploma in Information Technology</td>
        <td>2</td>
        <td>15-JAN-2024 - 22-MAR-2024</td>
        <td>Finish</td>
      </tr>
      {/* row 3 */}
      <tr>
        <td>Diploma in Information Technology</td>
        <td>1</td>
        <td>21-AUG-2023 - 18-DEC-2023</td>
        <td>Finish</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
        </div>
      </main>
    );
}