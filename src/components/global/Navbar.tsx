import React from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getCurrentApplicantDetails } from "@/src/helper/getCurrentApplicantDetails";

const Navbar = async ({ user }: { user: any }) => {
    const applicant = await getCurrentApplicantDetails();

    return (
        <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
            {/* Left side - Logo or brand */}
            <div className="text-lg font-semibold text-blue-600">
                
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {user?.role === "employee" && (
                    <Link href="/employer/post">
                        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700">
                            Post a Job
                        </button>
                    </Link>
                )}
                <Bell size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" />
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
