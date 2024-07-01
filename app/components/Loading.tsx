'use client';

import React from "react";

export default function Loading() {

    return (
        
            <div className="hero min-h-screen bg-base-200">
                <p className="mb-14">Fetching Data. . .</p>
            <progress className="progress w-56"></progress>
            </div>
        
    );
}