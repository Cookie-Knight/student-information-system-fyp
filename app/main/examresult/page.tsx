import Header from "@/app/components/Header";

export default function ExamResult() {
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

                <div className="divider text-slate-400">THE RESULTS PUBLISHED ON THIS WEBSITE ARE FOR INFORMATION ONLY.</div>
                <div className="card bg-base-300 rounded-box p-4 ml-4 mr-4 mb-4 mt-4">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Title</th>
                                    <th>Credit Hours</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                <tr>
                                    <td>CS101</td>
                                    <td>Introduction to Computer Science</td>
                                    <td>3</td>
                                    <td>85</td>
                                    <td>A</td>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                    <td>CS201</td>
                                    <td>Data Structures and Algorithms</td>
                                    <td>4</td>
                                    <td>92</td>
                                    <td>A+</td>
                                </tr>
                                {/* row 3 */}
                                <tr>
                                    <td>CS301</td>
                                    <td>Database Management Systems</td>
                                    <td>3</td>
                                    <td>78</td>
                                    <td>B+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card bg-base-300 rounded-box p-4 ml-4 mr-4 mb-4 mt-4">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Semester Credits</th>
                                    <th>GPA</th>
                                    <th>Total Credit Hours Earned</th>
                                    <th>CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                <tr>
                                    <td>15</td>
                                    <td>3.67</td>
                                    <td>10</td>
                                    <td>3.75</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}