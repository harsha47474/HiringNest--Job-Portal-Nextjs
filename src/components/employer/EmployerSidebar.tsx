"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Briefcase,
  Bookmark,
  CreditCard,
  Globe2,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/src/lib/actions/authActions";
import Link from "next/link";

const EmployerSidebar = ({
  user,
  className = "",
}: {
  user: any;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Hiring Nest</h1>
          <p className="text-xs text-gray-500">Employer Portal</p>
        </div>
      </div>
      <hr className="border-gray-200 mb-5" />

      {/* Workspace Section */}
      <div className="flex flex-col space-y-1 mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">WORKSPACE</p>
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active />
        <SidebarItem icon={<Building2 size={18} />} label="Employer Profile" />
        <SidebarItem icon={<PlusCircle size={18} />} label="Post a Job" />
        <SidebarItem icon={<Briefcase size={18} />} label="My Jobs" />
        <SidebarItem icon={<Bookmark size={18} />} label="Saved Candidates" />
      </div>

      <hr className="border-gray-200 mb-5" />

      {/* Account Section */}
      <div className="flex flex-col space-y-1 mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">ACCOUNT</p>
        <SidebarItem icon={<CreditCard size={18} />} label="Plans & Billing" />
        <SidebarItem icon={<Globe2 size={18} />} label="All Companies" />
        <Link href="/employer/settings">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
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

export default EmployerSidebar;
