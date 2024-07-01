'use client';

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";

export default function Feedbacks() {
    return (
        <main>
            <Header />
            <div className="flex flex-col min-h-screen min-w-screen">
            <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">Feedback Forms</div> 
                
                <div className="divider txt-slaete-400">Write a feedback to us on what can be improve on CampuSphere System.</div>
  
                <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
                    <div className="overflow-x-auto">
                       
                    <label className="input input-bordered flex items-center gap-2 mb-4">
                     Name
                    <input type="text" className="grow" placeholder="Student Name" />
                        </label>
                    <label className="input input-bordered flex items-center gap-2 mb-4">
                    Email
                    <input type="text" className="grow" placeholder="campushere@site.com" />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            
                            <div className="label">
                                <span className="label-text">Feedback Title</span>
                            </div>

                            <input type="text" placeholder="Type here" className="input input-bordered text-base w-full max-w-xs flex grow mb-4" />
                        </label>

                        <textarea className="textarea textarea-info w-full h-40 mb-4" placeholder="What is your feedbacks?"></textarea>
                    </div>

                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Submit Feedback</button>

                </div>
            </div>

  </main>
    )
  }