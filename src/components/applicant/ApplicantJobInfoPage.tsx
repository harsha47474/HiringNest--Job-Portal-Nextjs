'use client'
import { fetchJobById } from "@/src/lib/actions/applicantJobActions";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const jobData = {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Stripe",
    location: "Remote",
    postedDate: "2026-06-01",
    tags: ["Full-time", "Remote", "Senior", "Bachelor's Degree"],
    salary: "$160,000 – $210,000 per year",
    jobType: "Full-time",
    experience: "5+ years",
    education: "Bachelor's Degree",
    workType: "Remote",
    closes: "2026-08-15",
    status: "Published",
    about:
        "Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.",
    website: "stripe.com",
    size: "1000+ employees",
    founded: "2010",
    responsibilities: [
        "Architect and build scalable frontend solutions using React and TypeScript",
        "Collaborate with designers and backend engineers to deliver seamless user experiences",
        "Mentor junior engineers and lead frontend guild initiatives",
        "Optimize application performance and ensure accessibility standards",
        "Write comprehensive tests and documentation",
    ],
    requirements: [
        "5+ years of experience in frontend development",
        "Deep expertise in React, TypeScript, and modern CSS",
        "Experience with state management (Redux, Zustand, or similar)",
        "Strong understanding of web performance and security best practices",
        "Excellent communication and teamwork skills",
    ],
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
};

type JobSchema = {
    id: number;
    title: string;
    description: string;
    tags: string | null;
    minSalary: number | null;
    maxSalary: number | null;
    experience: string | null;
    education: string | null;
    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance" | null;
    workType: "remote" | "hybrid" | "onsite" | null;
    jobLevel: "entry" | "mid" | "senior" | "lead" | "manager" | null;
    salaryCurrency: "INR" | "USD" | "EUR" | "GBP" | null;
    location: string | null;
    createdAt: Date;
    companyName: string | null;
    companyLogo: string | null;
    websiteUrl: string | null;
    size: string | null;
    employerName: string | null;
    companyLocation: string | null;
    companyDescription: string | null;
}

export default function JobDescriptionPage({ jobId }: { jobId: number }) {
    // const job = jobData;
    const [job, setJob] = useState<JobSchema>()

    useEffect(() => {
        const fetchJobs = async () => {
            const job = await fetchJobById(jobId);
            if (!job) {
                return <>No Jobs Found</>
            }
            setJob(job)
            console.log(job)
        }
        fetchJobs()
    }, [])
    const tagsArray = JSON.parse(job?.tags || "[]");
    return (
        <div className="min-h-screen w-full bg-white p-6">
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-6">
                <Link href="">
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                        ← Back to jobs
                    </button>
                </Link>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        Save
                    </button>
                    <button className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        Share
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Job Header */}
                    <div className="border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900">
                                    {job?.title}
                                </h1>
                                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-md mt-2">
                                    Featured
                                </span>
                                <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
                                    <span>🏢 {job?.companyName}</span>
                                    <span>📍 {job?.location}</span>
                                    <span>📅 Posted July 12</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700">
                                S
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">About this Page</h2>
                        <div 
                            className="text-gray-700 mb-6 prose max-w-none prose-p:leading-relaxed prose-li:list-disc prose-li:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-4 prose-h2:mb-2 prose-h3:text-lg prose-h3:font-medium prose-h3:mt-3 prose-h3:mb-1"
                            dangerouslySetInnerHTML={{ __html: job?.description || "" }} 
                        />

                        <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {tagsArray.map((skill: string) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 shadow-sm">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md mb-4">
                            Apply Now
                        </button>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <p>
                                <strong>Salary:</strong> {job?.minSalary} - {job?.maxSalary}
                            </p>
                            <p>
                                <strong>Job Type:</strong> {job?.jobType}
                            </p>
                            <p>
                                <strong>Experience:</strong> {job?.experience}
                            </p>
                            <p>
                                <strong>Education:</strong> {job?.education}
                            </p>
                            <p>
                                <strong>Work Type:</strong> {job?.workType}
                            </p>
                            <p>
                                <strong>Closes:</strong> 12 july
                            </p>
                            <p>
                                <strong>Job ID:</strong> #{job?.id}
                            </p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">About {job?.companyName}</h3>
                        <p className="text-gray-700 mb-3">{job?.companyDescription}</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                            <li>📍 {job?.companyLocation}</li>
                            <li>🌐 {job?.websiteUrl}</li>
                            <li>🏢 {job?.size}</li>
                            <li>📅 Founded {job?.employerName}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
