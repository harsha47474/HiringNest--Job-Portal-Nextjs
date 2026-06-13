"use client";
import React, { useEffect, useState } from "react";
import JobFilterTabs from "./MyJobsComponent/JobFilterTabs";
import JobSearchBar from "./MyJobsComponent/JobSearchBar";
import JobCard from "./MyJobsComponent/JobCard";
import { getMyJobs } from "@/src/lib/actions/jobActions";
import { Job } from "@/src/lib/actions/jobActions";


const EmployerMyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getMyJobs();
        const normalizedRes = (res.myJobs ?? []).map((job) => ({
          ...job,
          tags: job.tags ? JSON.parse(job.tags as string) : [],
        }));

        setJobs(normalizedRes);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">My Jobs</h1>
        <p className="text-sm text-gray-600">
          Manage and track every job you've posted.
        </p>
      </div>

      <JobFilterTabs />
      <JobSearchBar />

      <div className="mt-4 space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job: any) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployerMyJobs;
