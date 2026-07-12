'use client'
import React from "react";
import Link from "next/link";
import { Briefcase, Bookmark, CheckCircle, Building2, MapPin, ExternalLink, Clock } from "lucide-react";

export default function ApplicantDashboardPage({ user, stats, recentApps, recentJobs }: any) {
    return (
        <div className="min-h-screen pb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Applicant Dashboard</h1>
            <p className="text-sm text-gray-600 mb-6">
                Welcome back, {user?.name || "Applicant"}. Here's an overview of your job search.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Jobs Applied</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.totalApplied}</h2>
                    </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                        <Bookmark size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Saved Jobs</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.totalSaved}</h2>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Accepted</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.totalAccepted}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                        <Link href="/applicant/applied" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                            View all →
                        </Link>
                    </div>
                    
                    {recentApps.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-2">No applications yet</p>
                            <Link href="/applicant/jobs" className="text-blue-600 hover:underline text-sm font-medium">
                                Browse jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentApps.map((app: any) => (
                                <div key={app.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700 flex-shrink-0">
                                            {app.companyName ? app.companyName.charAt(0) : app.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 line-clamp-1">{app.title}</h4>
                                            <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2 mt-1">
                                                <span className="flex items-center gap-1"><Building2 size={12} /> {app.companyName || "Unknown"}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {app.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                                            app.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                                            app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                                            app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                        <Link href={`/applicant/jobs/${app.id}`}>
                                            <button className="text-gray-500 hover:text-blue-600 p-1">
                                                <ExternalLink size={16} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently Uploaded Jobs */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recommended Jobs</h3>
                        <Link href="/applicant/jobs" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                            Explore more →
                        </Link>
                    </div>
                    
                    {recentJobs.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No jobs available right now</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentJobs.map((job: any) => {
                                const tagsArray = job.tags ? JSON.parse(job.tags) : [];
                                return (
                                    <div key={job.id} className="p-3 border rounded-lg hover:border-black/30 hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 font-semibold text-gray-700 flex-shrink-0">
                                                    {job.companyName ? job.companyName.charAt(0) : job.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h4>
                                                    <p className="text-xs text-gray-500">{job.companyName || "Unknown Company"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {job.minSalary && job.maxSalary 
                                                        ? `₹${(job.minSalary/1000).toFixed(0)}k - ₹${(job.maxSalary/1000).toFixed(0)}k` 
                                                        : "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || job.workType}</span>
                                            <span className="capitalize px-1.5 py-0.5 bg-gray-100 rounded">{job.jobType?.replace("_", "-")}</span>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex flex-wrap gap-1">
                                                {tagsArray.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="bg-gray-50 border text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {tagsArray.length > 2 && (
                                                    <span className="bg-gray-50 border text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                                                        +{tagsArray.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                            <Link href={`/applicant/jobs/${job.id}`}>
                                                <button className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}