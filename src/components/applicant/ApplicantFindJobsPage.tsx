'use client'

import { getAllJobs } from '@/src/lib/actions/applicantJobActions'
import React, { useEffect, useState } from 'react'
import { MapPin, Clock } from "lucide-react";

type jobSchema = {
    id: number;
    title: string;
    description: string;
    tags: string | null;
    minSalary: number | null;
    maxSalary: number | null;
    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance" | null;
    workType: "remote" | "hybrid" | "onsite" | null;
    jobLevel: "entry" | "mid" | "senior" | "lead" | "manager" | null;
    salaryCurrency: "INR" | "USD" | "EUR" | "GBP" | null;
    location: string | null;
    createdAt: Date;
    companyName: string | null;
    companyLogo: string | null;
}

const ApplicantFindJobsPage = () => {
    const [jobs, setJobs] = useState<jobSchema[]>([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchJobs = async () => {
            const allJobs = await getAllJobs();
            if (!allJobs) {
                return <>No Jobs Found</>
            }
            setJobs(allJobs)
            console.log(allJobs)
        }
        fetchJobs()
    }, [])

    const jobsPerPage = 4;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    const currentJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    return (
        <div className="min-h-screen w-full bg-white p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Find your next role</h1>
            <p className="text-sm text-gray-600 mb-6">{jobs.length} jobs matching your filters</p>

            {/* Search and filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Job title, company, or skill"
                    className="flex-1 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select className="border border-gray-200 rounded-md px-3 py-2 text-sm">
                    <option>All locations</option>
                </select>
                <select className="border border-gray-200 rounded-md px-3 py-2 text-sm">
                    <option>All types</option>
                </select>
                <select className="border border-gray-200 rounded-md px-3 py-2 text-sm">
                    <option>All levels</option>
                </select>
            </div>

            {/* Job cards */}
            <div className="space-y-4">
                {currentJobs.map((job) => {
                    const tagsArray = JSON.parse(job.tags || "[]");
                    return (
                        <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm  hover:border-black/30 flex justify-between items-center">
                            <div className="flex items-start space-x-4">
                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gray-100 text-gray-700 font-semibold">
                                    {job.companyName?.charAt(0).toUpperCase() || job.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">{job.title}</h2>
                                    <p className="text-xs text-gray-500 mb-1">{job.companyName}</p>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                                        <span className="flex items-center">
                                            <MapPin size={12} className="mr-1" /> {job.location}
                                        </span>
                                        <span>{job.workType}</span>
                                        <span>{job.jobType}</span>
                                        <span>{job.jobLevel}</span>
                                        <span className="flex items-center">
                                            <Clock size={12} className="mr-1" /> {Math.floor(Math.random() * 5) + 1}d ago
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tagsArray.map((tag: string) => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <p className="text-sm font-medium text-gray-900">
                                    ₹{job.minSalary?.toLocaleString()} – ₹{job.maxSalary?.toLocaleString()}
                                </p>
                                <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md cursor-pointer hover:bg-blue-700 transition">
                                    Apply
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-3 mt-6 text-sm text-gray-700">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="disabled:text-gray-400 hover:text-blue-600"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-2 ${currentPage === i + 1 ? "text-blue-600 font-semibold" : "hover:text-blue-600"}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="disabled:text-gray-400 hover:text-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ApplicantFindJobsPage