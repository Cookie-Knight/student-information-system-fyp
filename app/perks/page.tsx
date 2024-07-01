'use client';

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";

export default function Perks() {
  return (
      <main>
        <Header />

<div className="flex flex-col min-h-screen min-w-screen">
<div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">CampuSphere Perks</div> 
<div className="divider"></div> 

<div className="grid card bg-base-300 rounded-box place-items-center p-4 ml-4 mr-4 mb-4 mt-2">
<img className="object-fill h-60 w-80 rounded-box" src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80" alt="perks" />
</div>

</div>

</main>
  )
}