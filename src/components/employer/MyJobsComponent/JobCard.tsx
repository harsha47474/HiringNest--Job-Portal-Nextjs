import JobDetailsModal from "./JobDetailsModal";
import JobActionsMenu from "./JobActionsMenu";
import {
    MapPin,
    Briefcase,
    GraduationCap,
    Clock,
    Users
} from "lucide-react";
import Link from "next/link";

interface JobCardProps {
    job: any;
    onDuplicate?: (job: any) => void;
    onClose?: (jobId: number) => void;
    onDelete?: (jobId: number) => void;
    onPublish?: (jobId: number) => void;
}

export default function JobCard({ job, onDuplicate, onClose, onDelete, onPublish }: JobCardProps) {
    let status;
    let currency;
    if (job.status === "published") {
        status = "Active";
    } else {
        status = job.status;
    }

    if (job.salaryCurrency === "INR") {
        currency = "₹"
    } else if (job.salaryCurrency === "USD") {
        currency = "$"
    } else if (job.salaryCurrency === "EUR") {
        currency = "€"
    } else {
        currency = "£"
    }

    const postedDate = new Date(job.createdAt);
    const formattedPostedDate = postedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    const expiredDate = new Date(job.expiresAt);
    const formattedExpiredDate = expiredDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    console.log(formattedExpiredDate)


    return (
        <div className="flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm hover:border-black/30">
            <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <div className="flex gap-2 mt-2">
                    {job.isFeatured && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                            Featured
                        </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        {status}
                    </span>
                </div>
                <div className="space-y-2 mt-2 text-sm text-gray-500">
                    {/* Location + WorkType + JobLevel */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={15} className="text-gray-400" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Briefcase size={15} className="text-gray-400" />
                            <span>
                                {job.workType.charAt(0).toUpperCase() + job.workType.slice(1)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GraduationCap size={15} className="text-gray-400" />
                            <span>
                                {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Education + Salary */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <GraduationCap size={15} className="text-gray-400" />
                            <span>
                                {job.minEducation.charAt(0).toUpperCase() + job.minEducation.slice(1)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={15} className="text-gray-400" />
                            <span>
                                {currency}{job.minSalary} - {currency}{job.maxSalary}
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Applicants + Dates */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-gray-400" />
                            <span>{job.applicants || 0} applicants</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-400" />
                            <span>Posted: {formattedPostedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-400" />
                            <span>Expires: {formattedExpiredDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <JobDetailsModal job={job} />
                <Link href={`jobs/${job.id}/edit`}>
                    <button
                        className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 cursor-pointer"
                    >
                        Edit
                    </button></Link>

                <JobActionsMenu 
                    job={job} 
                    onDuplicate={onDuplicate}
                    onClose={onClose}
                    onDelete={onDelete}
                    onPublish={onPublish}
                />
            </div>
        </div>
    );
}
