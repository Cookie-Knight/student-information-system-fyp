export default function Attendance() {
    return (
        <main>
            <div className="flex flex-col w-full">
            <div className="stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
  
  <div className="stat">
    <div className="stat-title">Semester</div>
    <div className="stat-value text-lg ">5</div>
  </div>
  
  <div className="stat">
    <div className="stat-title">Semester Period</div>
    <div className="stat-value text-lg ">15-APR-2024 - 06-AUG-2024</div>
  </div>
  
  <div className="stat">
    <div className="stat-title">Printed Date</div>
    <div className="stat-value text-lg ">29-MAY-2024 7:51:30 PM</div>
  </div>
  
</div>
                
                <div className="divider text-slate-400">The following is a list of class absentee. If there is a mistake, please contact the prospective class lecturer.</div>

                <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
                    <div className="overflow-x-auto">
                        <table className="table table-xs">

                        
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Programme Code</th>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Session</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                    <th>1</th>
                                    <td>ENG101</td>
                                    <td>English Literature</td>
                                    <td>9:00 AM - 10:30 AM</td>
                                    <td>Room 101</td>
                                    <td>Lecture</td>
                                    <td>5/12/2024</td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>MTH202</td>
                                    <td>Advanced Calculus</td>
                                    <td>11:00 AM - 12:30 PM</td>
                                    <td>Room 202</td>
                                    <td>Lecture</td>
                                    <td>5/12/2024</td>
                                </tr>
                                <tr>
                                    <th>3</th>
                                    <td>CSC303</td>
                                    <td>Data Structures</td>
                                    <td>2:00 PM - 3:30 PM</td>
                                    <td>Room 303</td>
                                    <td>Lecture</td>
                                    <td>5/12/2024</td>
                                </tr>
                                <tr>
                                    <th>4</th>
                                    <td>PHY404</td>
                                    <td>Quantum Mechanics</td>
                                    <td>4:00 PM - 5:30 PM</td>
                                    <td>Room 404</td>
                                    <td>Lecture</td>
                                    <td>5/12/2024</td>
                                </tr>
                                <tr>
                                    <th>5</th>
                                    <td>CHE105</td>
                                    <td>Organic Chemistry</td>
                                    <td>9:00 AM - 10:30 AM</td>
                                    <td>Room 105</td>
                                    <td>Lab</td>
                                    <td>5/13/2024</td>
                                </tr>
                                <tr>
                                    <th>6</th>
                                    <td>HIS206</td>
                                    <td>Modern History</td>
                                    <td>11:00 AM - 12:30 PM</td>
                                    <td>Room 206</td>
                                    <td>Lecture</td>
                                    <td>5/13/2024</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>Programme Code</th>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Session</th>
                                    <th>Date</th>
                                </tr>
                            </tfoot>
                            
                        </table>
                        
                    </div>
                </div>
            </div>
</main>
    )
}