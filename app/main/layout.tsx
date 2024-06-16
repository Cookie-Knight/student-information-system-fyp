import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CampuSphere",
    description: "A group project created by Koh, Sam and Kenzo.",
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
                        <ul className="menu w-80 min-h-full bg-base-200 text-base-content">
                            {/* Sidebar content here */}
                            
                            <li className="my-4"><a href="/main">Home</a></li>
                            
                            <li className="my-4"><a href="/main/subjectlisting">Subject Listing</a></li>
                            
                            <li className="my-4"><a href="/main/programme">Programme History</a></li>
                            
                            <li className="my-4"><a href="/main/timetable">Timetable</a></li>
                            
                            <li className="my-4"><a href="/main/examtimetable">Exam Timetable</a></li>
                            
                            <li className="my-4"><a href="/main/examresult">Exam Result</a></li>
                            
                            <li className="my-4"><a href="/main/attendance">Attendance</a></li>
                            
                            <li className="my-4"><a href="/home/perks">Perks</a></li>
                            
                            <li className="my-4"><a href="/home/news">Campus News</a></li>
                            
                            <li className="my-4"><a href="/home/feedbacks">Feedbacks</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex-none z-50">
           
                
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="/main/profile">Profile</a></li>
                            <li><a href="/">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>                                                                                      
            {children}
        </>
    );
}
e