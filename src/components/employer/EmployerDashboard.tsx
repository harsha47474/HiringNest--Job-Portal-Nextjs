import React from "react";

const Dashboard = ({ user }: { user: any }) => {
    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Overview</h1>
            <p className="text-sm text-gray-600 mb-6">
                Welcome back, {user.name}. Here's what's happening with your hiring.
            </p>

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard title="Active Jobs" value="12" change="+2 this week" />
                <StatCard title="Total Applicants" value="348" change="+24 today" />
                <StatCard title="Profile Views" value="1,204" change="+8.2%" />
                <StatCard title="Hire Rate" value="18%" change="+1.4%" />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-3 gap-4">
                <RecentJobs />
                <HiringPipeline />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-sm font-semibold text-gray-500 mb-2">{title.toUpperCase()}</p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
        <p className="text-sm text-green-600">{change}</p>
    </div>
);

const RecentJobs = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 col-span-2">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Recent Job Posts</h3>
            <a href="#" className="text-xs text-blue-600 hover:underline">View all →</a>
        </div>
        {[
            { title: "Senior Product Designer", applicants: 42, posted: "2d ago", status: "Active" },
            { title: "Backend Engineer (Node.js)", applicants: 87, posted: "5d ago", status: "Active" },
            { title: "Marketing Manager", applicants: 31, posted: "1w ago", status: "Paused" },
            { title: "Customer Success Lead", applicants: 19, posted: "1w ago", status: "Active" },
        ].map((job, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b last:border-none">
                <div>
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">
                        {job.applicants} applicants • Posted {job.posted}
                    </p>
                </div>
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-md ${job.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {job.status}
                </span>
            </div>
        ))}
    </div>
);

const HiringPipeline = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Hiring Pipeline</h3>
        {[
            { stage: "Applied", count: 348, width: "w-full" },
            { stage: "Screening", count: 142, width: "w-2/3" },
            { stage: "Interview", count: 56, width: "w-1/3" },
            { stage: "Offer", count: 12, width: "w-1/6" },
        ].map((step, i) => (
            <div key={i} className="mb-3">
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>{step.stage}</span>
                    <span>{step.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 bg-blue-600 rounded-full ${step.width}`}></div>
                </div>
            </div>
        ))}
    </div>
);

export default Dashboard;
