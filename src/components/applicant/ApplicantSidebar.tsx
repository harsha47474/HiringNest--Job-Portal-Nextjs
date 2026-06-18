"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/src/lib/actions/authActions";

const ApplicantSidebar = ({ user, className = "" }: { user: any; className?: string }) => {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-600 text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Hiring Nest</h1>
          <p className="text-xs text-gray-500">Applicant Portal</p>
        </div>
      </div>
      <hr className="border-gray-200 mb-5" />

      {/* Explore Section */}
      <div className="flex flex-col space-y-1 mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">EXPLORE</p>
        <Link href="/applicant/dashboard">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === "/applicant/dashboard"} />
        </Link>
        <Link href="/applicant/jobs">
          <SidebarItem icon={<Search size={18} />} label="Find Jobs" active={pathname === "/applicant/jobs"} />
        </Link>
        <Link href="/applicant/applied-jobs">
          <SidebarItem icon={<Briefcase size={18} />} label="Applied Jobs" active={pathname === "/applicant/applied-jobs"} />
        </Link>
        <Link href="/applicant/saved-jobs">
          <SidebarItem icon={<Bookmark size={18} />} label="Saved Jobs" active={pathname === "/applicant/saved-jobs"} />
        </Link>
        <Link href="/applicant/resumes">
          <SidebarItem icon={<FileText size={18} />} label="My Resumes" active={pathname === "/applicant/resumes"} />
        </Link>
      </div>

      <hr className="border-gray-200 mb-5" />

      {/* Account Section */}
      <div className="flex flex-col space-y-1 mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">ACCOUNT</p>
        <Link href="/applicant/profile">
          <SidebarItem icon={<User size={18} />} label="Profile" active={pathname === "/applicant/profile"} />
        </Link>
        <Link href="/applicant/settings">
          <SidebarItem icon={<Settings size={18} />} label="Settings" active={pathname === "/applicant/settings"} />
        </Link>
      </div>

      {/* Logout */}
      <div className="mt-auto" onClick={logoutAction}>
        <SidebarItem icon={<LogOut size={18} />} label="Log out" danger />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, danger }: any) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm transition-colors ${active
        ? "bg-gray-100 text-gray-900"
        : danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ApplicantSidebar;
