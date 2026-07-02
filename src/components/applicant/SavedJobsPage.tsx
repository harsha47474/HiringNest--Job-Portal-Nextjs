"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedJobsAction, toggleSaveJobAction } from "@/src/lib/actions/applicantApplicationActions";
import { toast } from "sonner";
import { Trash2, Building2, MapPin, Briefcase, Clock } from "lucide-react";

export default function SavedJobsPage() {
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        setIsLoading(true);
        const jobs = await getSavedJobsAction();
        setSavedJobs(jobs);
        setIsLoading(false);
    };

    const handleUnsave = async (jobId: number) => {
        const result = await toggleSaveJobAction(jobId);
        if (result.success) {
            toast.success("Job removed from saved list");
            setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        } else {
            toast.error(result.message);
        }
    };

    const filteredJobs = savedJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (job.employerName && job.employerName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatTimeAgo = (date: Date) => {
        const diffInDays = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
        if (diffInDays === 0) return "Saved today";
        if (diffInDays === 1) return "Saved 1d ago";
        if (diffInDays < 7) return `Saved ${diffInDays}d ago`;
        if (diffInDays < 30) return `Saved ${Math.floor(diffInDays / 7)}w ago`;
        return `Saved ${Math.floor(diffInDays / 30)}m ago`;
    };

    const formatSalary = (min: number | null, max: number | null, currency: string | null) => {
        if (!min && !max) return "Not specified";
        const format = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num;
        const cur = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "";
        
        if (min && max) return `${cur}${format(min)} - ${cur}${format(max)}`;
        if (min) return `${cur}${format(min)}+`;
        return `Up to ${cur}${format(max!)}`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
                    <p className="text-gray-500">{savedJobs.length} jobs in your shortlist</p>
                </div>
                <div className="w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search saved..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 text-gray-500">Loading saved jobs...</div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 border rounded-xl border-dashed">
                    <p className="text-gray-500 mb-2">No saved jobs found.</p>
                    <Link href="/applicant/jobs" className="text-blue-600 hover:underline">Browse jobs</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => {
                        const tags = job.tags ? JSON.parse(job.tags) : [];
                        return (
                            <div key={job.id} className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl uppercase">
                                            {job.employerName ? job.employerName.charAt(0) : job.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{job.title}</h3>
                                            <div className="flex items-center text-gray-500 text-sm gap-1">
                                                <Building2 className="w-4 h-4" />
                                                <span>{job.employerName || "Unknown Company"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleUnsave(job.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove from saved"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location || "Remote"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="capitalize">{job.jobType?.replace("_", "-") || "Full-time"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTimeAgo(job.savedAt)}</span>
                                    </div>
                                </div>

                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {tags.slice(0, 3).map((tag: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600 font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                        {tags.length > 3 && (
                                            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600 font-medium">
                                                +{tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                    <div className="font-semibold text-gray-900">
                                        {formatSalary(job.minSalary, job.maxSalary, job.salaryCurrency)}
                                    </div>
                                    <Link href={`/applicant/jobs/${job.id}`}>
                                        <button className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                            View details
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
