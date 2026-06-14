import { useState } from "react";
import { useForm } from "react-hook-form";

type JobFormData = {
  title: string;
  description: string;
  location: string;
  experience: string;
  jobType: string;
  workType: string;
  jobLevel: string;
  minEducation: string;
  minSalary: string;
  maxSalary: string;
};

export default function EditJobModal({ job }: { job: any }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: {
      title: job.title,
      description: job.description,
      location: job.location,
      experience: job.experience,
      jobType: job.jobType,
      workType: job.workType,
      jobLevel: job.jobLevel,
      minEducation: job.minEducation,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
    },
  });

  const onSubmit = (data: JobFormData) => {
    console.log("Updated job:", data);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 cursor-pointer"
      >
        Edit
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900">Edit Job</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update the details for this listing.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
              {/* Job title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job title
                </label>
                <input
                  {...register("title", { required: "Job title is required" })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    {...register("experience")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job type
                  </label>
                  <input
                    {...register("jobType")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work type
                  </label>
                  <input
                    {...register("workType")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job level
                  </label>
                  <input
                    {...register("jobLevel")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum education
                  </label>
                  <input
                    {...register("minEducation")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min salary
                  </label>
                  <input
                    {...register("minSalary")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max salary
                  </label>
                  <input
                    {...register("maxSalary")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
