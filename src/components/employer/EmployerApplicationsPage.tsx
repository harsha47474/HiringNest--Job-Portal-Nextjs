"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Mail, FileText, Clock, ExternalLink, Bookmark, BookmarkPlus } from "lucide-react";
import { updateApplicationStatusAction } from "@/src/lib/actions/employerApplications";
import { toggleSaveCandidateAction } from "@/src/lib/actions/savedCandidatesActions";
import { toast } from "sonner";

export default function EmployerApplicationsPage({ applications, initialSavedIds = [] }: { applications: any[], initialSavedIds?: number[] }) {
    const [apps, setApps] = useState(applications);
    const [savedIds, setSavedIds] = useState<number[]>(initialSavedIds);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const handleStatusChange = async (appId: number, status: "pending" | "reviewed" | "accepted" | "rejected") => {
        const result = await updateApplicationStatusAction(appId, status);
        if (result.success) {
            toast.success(result.message);
            setApps(prev => prev.map(app => app.id === appId ? { ...app, status } : app));
        } else {
            toast.error(result.message);
        }
    };

    const handleToggleSave = async (applicantId: number) => {
        const result = await toggleSaveCandidateAction(applicantId);
        if (result.success) {
            toast.success(result.message);
            setSavedIds(prev => {
                if (result.saved) return [...prev, applicantId];
                return prev.filter(id => id !== applicantId);
            });
        } else {
            toast.error(result.message);
        }
    };

    const filteredApps = apps.filter(app => {
        const matchesFilter = filter === "all" || app.status === filter;
        const matchesSearch = app.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
                              app.jobTitle?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Applications</h1>
                    <p className="text-gray-500 text-sm">{apps.length} total applications</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {["All", "Pending", "Reviewed", "Accepted", "Rejected"].map(tab => {
                        const tabKey = tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilter(tabKey)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    filter === tabKey ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or job..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 text-sm"
                    />
                </div>
            </div>

            {/* List */}
            {filteredApps.length === 0 ? (
                <div className="text-center py-20 border rounded-xl border-dashed">
                    <p className="text-gray-500">No applications found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApps.map(app => (
                        <div key={app.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                                    {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : "A"}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                        {app.applicantName}
                                    </h3>
                                    <div className="text-sm text-gray-500 mb-2">Applied for <span className="font-medium text-gray-700">{app.jobTitle}</span></div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.applicantEmail}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                                <div className="flex items-center gap-3">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                                        className={`text-sm font-medium px-3 py-1.5 rounded-md border appearance-none cursor-pointer outline-none ${
                                            app.status === 'pending' ? 'bg-gray-50 border-gray-200 text-gray-700' :
                                            app.status === 'reviewed' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                            app.status === 'accepted' ? 'bg-green-50 border-green-200 text-green-700' :
                                            'bg-red-50 border-red-200 text-red-700'
                                        }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    {app.resumeUrl && (
                                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                                            <FileText className="w-4 h-4" />
                                            Resume
                                        </a>
                                    )}
                                    <Link href={`/employer/applicants/${app.applicantId}`}>
                                        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                                            Profile <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleToggleSave(app.applicantId)}
                                        className={`p-1.5 rounded-md border transition-colors ${savedIds.includes(app.applicantId) ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'text-gray-500 hover:bg-gray-50 border-gray-200'}`}
                                        title={savedIds.includes(app.applicantId) ? "Saved Candidate" : "Save Candidate"}
                                    >
                                        {savedIds.includes(app.applicantId) ? <Bookmark className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
