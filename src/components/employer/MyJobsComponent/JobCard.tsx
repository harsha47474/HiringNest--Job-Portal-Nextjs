import { Button } from "@/src/components/ui/button";
import JobDetailsModal from "./JobDetailsModal";
import EditJobModal from "./EditJobModal";
import JobActionsMenu from "./JobActionsMenu";

export default function JobCard({ job }: { job: any }) {
    return (
        <div className="flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <div className="flex gap-2 mt-2">
                    {job.isFeatured && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                            Featured
                        </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        {job.status}
                    </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    {job.location} • {job.type} • {job.level}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                    {job.education} • {job.salary}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map((tag: any) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                    {job.applicants} applicants • Posted {job.posted} • Expires {job.expires}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <JobDetailsModal job={job} />
                <EditJobModal job={job} />
                <JobActionsMenu />
            </div>
        </div>
    );
}
