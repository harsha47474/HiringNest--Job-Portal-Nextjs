"use client"
import { fetchJobById } from "@/src/lib/actions/applicantJobActions";
import { checkHasAppliedAction, checkHasSavedJobAction, toggleSaveJobAction, applyForJobAction } from "@/src/lib/actions/applicantApplicationActions";
import { checkApplicantProfileCompletionAction } from "@/src/lib/actions/applicantProfileActions";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [job, setJob] = useState<JobSchema | null>(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const fetchedJob = await fetchJobById(jobId);
            if (fetchedJob) setJob(fetchedJob as any);
            
            const applied = await checkHasAppliedAction(jobId);
            setHasApplied(applied);

            const saved = await checkHasSavedJobAction(jobId);
            setIsSaved(saved);
            
            setIsLoading(false);
        };
        fetchDetails();
    }, [jobId]);

    const handleSaveToggle = async () => {
        const result = await toggleSaveJobAction(jobId);
        if (result.success) {
            setIsSaved(result.saved);
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job?.title || "Job Listing",
                    text: `Check out this job: ${job?.title} at ${job?.companyName}`,
                    url,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleApplyClick = async () => {
        if (hasApplied) return;
        
        const profileCheck = await checkApplicantProfileCompletionAction();
        
        if (!profileCheck.success) {
            toast.error(profileCheck.message);
            return;
        }

        if (!profileCheck.isComplete) {
            toast.error("Please set up your profile and provide all required details, including at least one resume.", {
                action: {
                    label: "Go to Settings",
                    onClick: () => router.push("/applicant/profile")
                }
            });
            return;
        }

        setResumes(profileCheck.resumes || []);
        // select primary resume by default if available
        const primary = profileCheck.resumes?.find((r: any) => r.isPrimary);
        if (primary) setSelectedResumeId(primary.id);
        else if (profileCheck.resumes?.length > 0) setSelectedResumeId(profileCheck.resumes[0].id);

        setShowApplyModal(true);
    };

    const submitApplication = async () => {
        if (!selectedResumeId) {
            toast.error("Please select a resume.");
            return;
        }

        setIsSubmitting(true);
        const result = await applyForJobAction(jobId, selectedResumeId, coverLetter);
        setIsSubmitting(false);

        if (result.success) {
            toast.success(result.message);
            setHasApplied(true);
            setShowApplyModal(false);
        } else {
            toast.error(result.message);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!job) {
        return <div className="min-h-screen flex items-center justify-center">No Job Found</div>;
    }

    const tagsArray = job.tags ? JSON.parse(job.tags) : [];

    return (
        <div className="min-h-screen w-full bg-white p-6 relative">
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-6">
                <Link href="/applicant/jobs">
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                        ← Back to jobs page
                    </button>
                </Link>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSaveToggle}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${isSaved ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                        {isSaved ? "Saved" : "Save"}
                    </button>
                    <button 
                        onClick={handleShare}
                        className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
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
                                    {job.title}
                                </h1>
                                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-md mt-2">
                                    Featured
                                </span>
                                <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
                                    <span>🏢 {job.companyName}</span>
                                    <span>📍 {job.location}</span>
                                    <span>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 uppercase">
                                {job.companyName ? job.companyName.charAt(0) : "C"}
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">About this Job</h2>
                        <div 
                            className="text-gray-700 mb-6 prose max-w-none prose-p:leading-relaxed prose-li:list-disc prose-li:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-4 prose-h2:mb-2 prose-h3:text-lg prose-h3:font-medium prose-h3:mt-3 prose-h3:mb-1"
                            dangerouslySetInnerHTML={{ __html: job.description || "" }} 
                        />

                        {tagsArray.length > 0 && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 shadow-sm">
                        <button 
                            onClick={handleApplyClick}
                            disabled={hasApplied}
                            className={`w-full font-medium py-2 rounded-md mb-4 ${hasApplied ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                        >
                            {hasApplied ? "Already Applied" : "Apply Now"}
                        </button>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <p>
                                <strong>Salary:</strong> {job.minSalary} - {job.maxSalary} {job.salaryCurrency}
                            </p>
                            <p>
                                <strong>Job Type:</strong> {job.jobType?.replace("_", " ")}
                            </p>
                            <p>
                                <strong>Experience:</strong> {job.experience}
                            </p>
                            <p>
                                <strong>Education:</strong> {job.education?.replace("_", " ")}
                            </p>
                            <p>
                                <strong>Work Type:</strong> {job.workType}
                            </p>
                            <p>
                                <strong>Job ID:</strong> #{job.id}
                            </p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">About {job.companyName}</h3>
                        <p className="text-gray-700 mb-3">{job.companyDescription}</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                            <li>📍 {job.companyLocation}</li>
                            <li>🌐 <a href={job.websiteUrl || "#"} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{job.websiteUrl}</a></li>
                            <li>🏢 {job.size}</li>
                            <li>📅 {job.employerName}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
                            {resumes.length === 0 ? (
                                <div className="text-sm text-red-600 mb-2">No resumes found. Please upload one in your profile.</div>
                            ) : (
                                <div className="space-y-2">
                                    {resumes.map(resume => (
                                        <label key={resume.id} className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedResumeId === resume.id ? "border-blue-500 bg-blue-50" : ""}`}>
                                            <input 
                                                type="radio" 
                                                name="resume" 
                                                value={resume.id} 
                                                checked={selectedResumeId === resume.id}
                                                onChange={() => setSelectedResumeId(resume.id)}
                                                className="mr-3 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                            />
                                            <span className="flex-1 font-medium text-gray-900">{resume.name}</span>
                                            {resume.isPrimary && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Primary</span>}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
                            <textarea 
                                rows={4} 
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Why are you a good fit for this role?"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowApplyModal(false)}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitApplication}
                                disabled={isSubmitting || !selectedResumeId}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
