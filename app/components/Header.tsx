"use client";

import React from 'react';
import { auth } from '@/app/firebase'; // Adjust the path according to your file structure
import { useRouter } from 'next/navigation';

export default function Header() {
  const navigation = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out successfully');
      navigation.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1 z-50">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <label htmlFor="my-drawer" className="btn btn-ghost text-xl">CampuSphere</label>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu w-80 min-h-full bg-base-200 text-base-content">
              <li className="my-4"><a href="/main">Home</a></li>
              <li className="my-4"><a href="/main/subjectlisting">Subject Listing</a></li>
              <li className="my-4"><a href="/main/programme">Programme History</a></li>
              <li className="my-4"><a href="/main/timetable">Timetable</a></li>
              <li className="my-4"><a href="/main/examtimetable">Exam Timetable</a></li>
              <li className="my-4"><a href="/main/examresult">Exam Result</a></li>
              <li className="my-4"><a href="/main/attendance">Attendance</a></li>
              <li className="my-4"><a href="/main/perks">Perks</a></li>
              <li className="my-4"><a href="/main/news">Campus News</a></li>
              <li className="my-4"><a href="/main/feedbacks">Feedbacks</a></li>
            </ul>
          </div>
        </div>
        <div className="flex-none z-50">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="/main/profile">Profile</a></li>
              <li><a onClick={handleLogout}>Log Out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

