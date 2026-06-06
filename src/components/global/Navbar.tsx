import React from "react";
import { Bell, Search } from "lucide-react";

const Navbar = ({ user }: { user: any }) => {
    return (
        <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
            {/* Search bar */}
            <div className="flex items-center space-x-3 w-1/2">
                <Search size={18} className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search jobs, candidates, companies..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700">
                    Post a Job
                </button>
                <Bell size={18} className="text-gray-500" />
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
