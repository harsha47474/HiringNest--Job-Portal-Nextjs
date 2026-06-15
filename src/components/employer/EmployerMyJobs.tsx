"use client";
import React, { useEffect, useState } from "react";
import JobFilterTabs from "./MyJobsComponent/JobFilterTabs";
import JobSearchBar from "./MyJobsComponent/JobSearchBar";
import JobCard from "./MyJobsComponent/JobCard";
import { getMyJobs, deleteJobAction, updateJobStatusAction, postAJobAction } from "@/src/lib/actions/jobActions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

const EmployerMyJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleDuplicate = async (job: any) => {
    setIsProcessing(true);
    // Remove db specific fields and parse back tags since postAJob expects array
    const { id, employerId, createdAt, updatedAt, status, ...jobData } = job;
    const newJob = {
      ...jobData,
      title: `${jobData.title} (Copy)`,
      expiresAt: jobData.expiresAt.toISOString ? jobData.expiresAt.toISOString() : new Date(jobData.expiresAt).toISOString(),
    };
    
    const result = await postAJobAction(newJob, "draft");
    if (result.success) {
      toast.success("Job duplicated as draft");
      fetchJobs();
    } else {
      toast.error(result.message);
    }
    setIsProcessing(false);
  };

  const handleCloseJob = async (jobId: number) => {
    setIsProcessing(true);
    const result = await updateJobStatusAction(jobId, "closed");
    if (result.success) {
      setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "closed" } : j)));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsProcessing(false);
  };

  const handlePublishJob = async (jobId: number) => {
    setIsProcessing(true);
    const result = await updateJobStatusAction(jobId, "published");
    if (result.success) {
      setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "published" } : j)));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsProcessing(true);
    const result = await deleteJobAction(jobToDelete);
    if (result.success) {
      setJobs(jobs.filter((j) => j.id !== jobToDelete));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setDeleteDialogOpen(false);
    setJobToDelete(null);
    setIsProcessing(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" ? true : job.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-gray-900">My Jobs</h1>
        <p className="text-sm text-gray-600">
          Manage and track every job you've posted.
        </p>
      </div>

      <JobFilterTabs filter={filter} onFilterChange={setFilter} />
      <JobSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="mt-4 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: any) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onDuplicate={handleDuplicate}
              onClose={handleCloseJob}
              onDelete={(id) => { setJobToDelete(id); setDeleteDialogOpen(true); }}
              onPublish={handlePublishJob}
            />
          ))
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job
              listing and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing} className="bg-red-600 text-white hover:bg-red-700 cursor-pointer">
              {isProcessing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerMyJobs;
