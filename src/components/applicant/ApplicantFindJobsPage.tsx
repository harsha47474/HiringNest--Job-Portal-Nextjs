'use client'

import { getAllJobs } from '@/src/lib/actions/applicantJobActions'
import React, { useEffect, useState } from 'react'
import { MapPin, Clock } from "lucide-react";
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

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
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchQuery = searchParams.get('q') || '';
    const typeFilter = searchParams.get('type') || '';
    const levelFilter = searchParams.get('level') || '';

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

    const filteredJobs = jobs.filter((job) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const titleMatch = job.title?.toLowerCase().includes(q);
            const companyMatch = job.companyName?.toLowerCase().includes(q);
            const tagsMatch = job.tags?.toLowerCase().includes(q);
            if (!titleMatch && !companyMatch && !tagsMatch) return false;
        }

        if (typeFilter && job.jobType !== typeFilter) {
            return false;
        }

        if (levelFilter && job.jobLevel !== levelFilter) {
            return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set('q', e.target.value);
        } else {
            params.delete('q');
        }
        setCurrentPage(1);
        router.replace(`${pathname}?${params.toString()}`);
    }

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setCurrentPage(1);
        router.replace(`${pathname}?${params.toString()}`);
    };


    return (
        <div className="min-h-screen w-full bg-white p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Find your next role</h1>
            <p className="text-sm text-gray-600 mb-6">{filteredJobs.length} jobs matching your filters</p>

            {/* Search and filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Job title, company, or skill"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="flex-1 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select 
                    value={typeFilter}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm"
                >
                    <option value="">All types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                </select>
                <select 
                    value={levelFilter}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm"
                >
                    <option value="">All levels</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="manager">Manager</option>
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
                                <Link href = {`/applicant/jobs/${job.id}`}>
                                    <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md cursor-pointer hover:bg-blue-700 transition">
                                        View
                                    </button>
                                </Link>
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