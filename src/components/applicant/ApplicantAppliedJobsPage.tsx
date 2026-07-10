"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, MapPin, Building2, CalendarDays, FileText } from "lucide-react";
import { getAppliedJobsAction } from "@/src/lib/actions/applicantApplicationActions";
import Link from "next/link";

interface AppliedJob {
    id: number;
    title: string;
    location: string | null;
    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance" | null;
    tags: string | null;
    createdAt: string;
    status: "pending" | "reviewed" | "accepted" | "rejected";
    resumeName: string | null;
}

export default function AppliedJobsPage({ applicantId }: { applicantId: number }) {
    const [jobs, setJobs] = useState<AppliedJob[]>([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const result = await getAppliedJobsAction({ id: applicantId });
                setJobs(result);
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
            }
        };
        fetchJobs();
    }, [applicantId]);

    const filteredJobs = jobs.filter((job) => {
        const matchesFilter = filter === "all" || job.status === filter;
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen w-full bg-white p-3 relative">
            <h1 className="text-2xl font-bold">Applied Jobs</h1>
            <p className="text-gray-500 mb-4">{jobs.length} applications tracked</p>

            {/* Filter Tabs + Search */}
            <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex space-x-2">
                    {["All", "Pending", "Reviewed", "Accepted", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab.toLowerCase())}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${filter === tab
                                ? "bg-gray-200 text-gray-900"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Search applications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-md px-3 py-1 text-sm w-60 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
                {filteredJobs.map((job) => (
                    <div
                        key={job.id}
                        className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                                {job.title.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-semibold">{job.title}</h2>
                                <div className="flex items-center text-sm text-gray-500 space-x-3">
                                    <span className="flex items-center gap-1">
                                        <Building2 size={14} /> {job.jobType}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays size={14} />{" "}
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText size={14} /> {job.resumeName}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${job.status === "pending"
                                    ? "bg-gray-100 text-gray-700"
                                    : job.status === "reviewed"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : job.status === "accepted"
                                            ? "bg-green-100 text-green-700"
                                            : job.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {job.status}
                            </span>
                            <Link href={`/applicant/jobs/${job.id}`}>
                                <button
                                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 border rounded-md shadow-sm px-3 py-1 transition hover:shadow-md"
                                >
                                    View <ExternalLink size={14} className="ml-1" />
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
