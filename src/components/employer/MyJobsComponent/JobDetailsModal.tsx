import { useState } from "react";

export default function JobDetailsModal({ job }: { job: any }) {
  const [open, setOpen] = useState(false);

  let currency;

  if (job.salaryCurrency === "INR") {
    currency = "₹"
  } else if (job.salarCurrency === "USD") {
    currency = "$"
  } else if (job.salaryCurrency === "EUR") {
    currency = "€"
  } else {
    currency = "£"
  }

  const postedDate = new Date(job.createdAt);
  const formattedPostedDate = postedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 cursor-pointer"
      >
        View
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh] custom-scrollbar">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900">
              {job.title}
            </h2>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-3">
              {job.isFeatured && (
                <span className="px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-700 border border-orange-300">
                  Featured
                </span>
              )}
              {job.status === "published" && (
                <span className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">
                  Active
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-6 text-sm text-gray-700">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{job.location}</p>
              </div>
              <div>
                <p className="font-medium">Work type</p>
                <p className="text-gray-600">{job.workType}</p>
              </div>
              <div>
                <p className="font-medium">Job type</p>
                <p className="text-gray-600">{job.jobType}</p>
              </div>
              <div>
                <p className="font-medium">Level</p>
                <p className="text-gray-600">{job.jobLevel}</p>
              </div>
              <div>
                <p className="font-medium">Education</p>
                <p className="text-gray-600">{job.minEducation}</p>
              </div>
              <div>
                <p className="font-medium">Salary</p>
                <p className="text-gray-600">
                  {job.minSalary && job.maxSalary
                    ? `${job.minSalary}${currency} – ${job.maxSalary}${currency}`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="font-medium">Experience</p>
                <p className="text-gray-600">{job.experience}</p>
              </div>
              <div>
                <p className="font-medium">Expires</p>
                <p className="text-gray-600">
                  {job.expiresAt
                    ? new Date(job.expiresAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="font-medium text-gray-800">Description</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Tags */}
            {job.tags && Array.isArray(job.tags) && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
              <p>{job.applicantsCount ?? 0} applicants</p>
              <p>Posted {formattedPostedDate ?? "N/A"}</p>
            </div>

            {/* Close button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
