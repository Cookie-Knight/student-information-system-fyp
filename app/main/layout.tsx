import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CampuSphere",
    description: "Generated by create Koh Sam Kenzo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="navbar bg-base-100">
                <div className="flex-1 z-50">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <label htmlFor="my-drawer" className="btn btn-ghost text-xl">CampuSphere</label>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                            {/* Sidebar content here */}
                            <br></br>
                            <li><a href="/home">Home</a></li>
                            <br></br>
                            <li><a href="/home/sListing">Subject Listing</a></li>
                            <br></br>
                            <li><a href="/home/pHistory">Programme History</a></li>
                            <br></br>
                            <li><a href="/home/timetable">Timetable</a></li>
                            <br></br>
                            <li><a href="/home/examtimetable">Exam Timetable</a></li>
                            <br></br>
                            <li><a href="/home/examresult">Exam Result</a></li>
                            <br></br>
                            <li><a href="/home/attendance">Attendance</a></li>
                            <br></br>
                            <li><a href="/home/perks">Perks</a></li>
                            <br></br>
                            <li><a href="/home/news">Campus News</a></li>
                            <br></br>
                            <li><a href="/home/feedbacks">Feedbacks</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex-none z-50">
            <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
                </button>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a href="/home/settings">Settings</a></li>
                            <li><a href="/">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {children}
        </>
    );
}