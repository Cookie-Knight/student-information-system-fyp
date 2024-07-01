"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";

function Attendance() {

  return (
    <>
      <Header />
      <div className="flex flex-col w-full">
        <div className="stats stats-vertical lg:stats-horizontal p-4 ml-4 mr-4 mb-4 mt-4 shadow">
          <div className="stat">
            <div className="stat-title">Semester</div>
            <div className="stat-value text-lg">5</div>
          </div>
          <div className="stat">
            <div className="stat-title">Semester Period</div>
            <div className="stat-value text-lg">15-APR-2024 - 06-AUG-2024</div>
          </div>
          <div className="stat">
            <div className="stat-title">Printed Date</div>
            <div className="stat-value text-lg">29-MAY-2024 7:51:30 PM</div>
          </div>
        </div>
        <div className="divider text-slate-400">The following is a list of class absentee. If there is a mistake, please contact the prospective class lecturer.</div>
        <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th></th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Session</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th></th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Course Code</th>
                  <th>Course Name</th>
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
    </>
  );
}

export default Attendance;