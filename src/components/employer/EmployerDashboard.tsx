import React from "react";
import { EmployerProfileCompletionStatus } from "./EmployerProfileStatus";
import Link from "next/link";

function getRelativeTime(dateString: string | Date) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
            const diffInMins = Math.floor(diffInMs / (1000 * 60));
            return diffInMins <= 1 ? "just now" : `${diffInMins}m ago`;
        }
        return `${diffInHours}h ago`;
    }
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const Dashboard = ({ user, jobs = [] }: { user: any, jobs?: any[] }) => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === "published").length;
    const draftJobs = jobs.filter(j => j.status === "draft").length;
    const closedJobs = jobs.filter(j => j.status === "closed").length;

    // Summing applicants if they exist in the schema (currently using 0 fallback)
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);

    return (
        <div className="min-h-screen pb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Overview</h1>
            <p className="text-sm text-gray-600 mb-6">
                Welcome back, {user?.name || "Employer"}. Here's what's happening with your hiring.
            </p>

            <div className="mb-6">
                <EmployerProfileCompletionStatus />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Jobs Posted" value={totalJobs} change="All time" />
                <StatCard title="Active Jobs" value={activeJobs} change="Currently published" />
                <StatCard title="Total Applicants" value={totalApplicants} change="Across all jobs" />
                <StatCard title="Drafts / Closed" value={`${draftJobs} / ${closedJobs}`} change="Needs attention" />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentJobs jobs={jobs} />
                <JobsOverview jobs={jobs} />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-sm font-semibold text-gray-500 mb-2">{title.toUpperCase()}</p>
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        <p className="text-sm text-blue-600 mt-2 font-medium">{change}</p>
    </div>
);

const RecentJobs = ({ jobs }: { jobs: any[] }) => {
    // Sort by newest first
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentJobsList = sortedJobs.slice(0, 5);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 lg:col-span-2 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Job Posts</h3>
                <Link href="/employer/jobs" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                    View all →
                </Link>
            </div>
            
            {recentJobsList.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">No jobs posted yet</p>
                    <Link href="/employer/post-job" className="text-blue-600 hover:underline text-sm font-medium">
                        Post your first job
                    </Link>
                </div>
            ) : (
                <div className="space-y-1">
                    {recentJobsList.map((job, i) => {
                        const postedTime = job.createdAt ? getRelativeTime(job.createdAt) : "recently";
                        
                        let statusColor = "bg-gray-100 text-gray-600";
                        let statusText = job.status;
                        
                        if (job.status === "published") {
                            statusColor = "bg-green-50 text-green-700 border-green-200";
                            statusText = "Active";
                        } else if (job.status === "draft") {
                            statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
                        } else if (job.status === "closed") {
                            statusColor = "bg-red-50 text-red-700 border-red-200";
                        } else if (job.status === "expired") {
                            statusColor = "bg-orange-50 text-orange-700 border-orange-200";
                        }
                        
                        return (
                            <div key={job.id || i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-none border-gray-100">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-base font-medium text-gray-900 line-clamp-1">{job.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span>{job.applicants || 0} applicants</span>
                                        <span>•</span>
                                        <span className="capitalize">{job.location || job.workType}</span>
                                        <span>•</span>
                                        <span>Posted {postedTime}</span>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${statusColor} capitalize whitespace-nowrap self-start sm:self-auto`}>
                                    {statusText}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const JobsOverview = ({ jobs }: { jobs: any[] }) => {
    // Calculate jobs by type
    const fullTime = jobs.filter(j => j.jobType === "full_time").length;
    const partTime = jobs.filter(j => j.jobType === "part_time").length;
    const contract = jobs.filter(j => j.jobType === "contract").length;
    const internship = jobs.filter(j => j.jobType === "internship").length;
    const freelance = jobs.filter(j => j.jobType === "freelance").length;
    
    const total = jobs.length || 1; // Prevent division by zero

    const jobTypes = [
        { type: "Full-Time", count: fullTime, width: `${(fullTime / total) * 100}%`, color: "bg-blue-600" },
        { type: "Part-Time", count: partTime, width: `${(partTime / total) * 100}%`, color: "bg-purple-500" },
        { type: "Contract", count: contract, width: `${(contract / total) * 100}%`, color: "bg-orange-500" },
        { type: "Internship", count: internship, width: `${(internship / total) * 100}%`, color: "bg-green-500" },
        { type: "Freelance", count: freelance, width: `${(freelance / total) * 100}%`, color: "bg-pink-500" },
    ].filter(j => j.count > 0);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs by Type</h3>
            
            {jobs.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic">
                    No data available
                </div>
            ) : (
                <div className="space-y-4">
                    {jobTypes.length > 0 ? jobTypes.map((step, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1.5">
                                <span>{step.type}</span>
                                <span className="bg-gray-100 text-gray-600 px-2 rounded-full text-xs py-0.5">{step.count}</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${step.color} rounded-full transition-all duration-500 ease-out`} 
                                    style={{ width: step.width }}
                                ></div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-sm text-gray-500">All jobs are uncategorized.</div>
                    )}
                </div>
            )}
            
            {jobs.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Work Setting</h4>
                    <div className="flex gap-2 flex-wrap">
                        {["remote", "hybrid", "onsite"].map(setting => {
                            const count = jobs.filter(j => j.workType === setting).length;
                            if (count === 0) return null;
                            return (
                                <div key={setting} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 capitalize">
                                    <div className={`w-2 h-2 rounded-full ${
                                        setting === 'remote' ? 'bg-green-500' : 
                                        setting === 'hybrid' ? 'bg-purple-500' : 'bg-blue-500'
                                    }`}></div>
                                    {setting}: {count}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
