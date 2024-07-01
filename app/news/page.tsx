'use client';

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";

export default function News() {
    return (
        <main>
            <Header />

            <div className="flex flex-col min-h-screen min-w-screen">
            <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">CampuSphere News</div> 
            <div className="divider"></div> 
            </div>
            
            <div className="grid card bg-base-300 rounded-box p-4 ml-4 mr-4 mb-4 mt-2">
            <h1 className="text-2xl font-bold">CampuSphere News</h1>
            <p className="text-justify mt-4">
                    Maybe we can live without libraries, people like you and me. Maybe. Sure, we&apos;re too old to change the world, but what about that kid, sitting down, opening a book, right now, in a branch at the local library and finding drawings of pee-pees and wee-wees on the Cat in the Hat and the Five Chinese Brothers? Doesn&apos;t HE deserve better? Look. If you think this is about overdue fines and missing books, you&apos;d better think again. This is about that kid&apos;s right to read a book without getting his mind warped! Or: maybe that turns you on, Seinfeld; maybe that&apos;s how y&apos;get your kicks. You and your good-time buddies.
            </p>
            </div>

</main>
    )
}