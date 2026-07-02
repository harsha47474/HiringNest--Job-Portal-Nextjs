"use server"

import { db } from "@/src/config/db";
import { applications, savedJobs, jobs, employers } from "@/src/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentApplicantDetails } from "@/src/helper/getCurrentApplicantDetails";

export const applyForJobAction = async (jobId: number, resumeId: number, coverLetter?: string) => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        
        if (!applicantData) {
            return { success: false, message: "User not authenticated or applicant profile not found." };
        }

        if (!applicantData.isProfileCompleted) {
            return { success: false, message: "Please complete your profile and upload a resume before applying." };
        }

        // Verify the resume belongs to the applicant
        const ownsResume = applicantData.resumes.some(r => r.id === resumeId);
        if (!ownsResume) {
            return { success: false, message: "Invalid resume selected." };
        }

        // Check if already applied
        const existingApplication = await db.select().from(applications).where(
            and(
                eq(applications.applicantId, applicantData.id),
                eq(applications.jobId, jobId)
            )
        );

        if (existingApplication.length > 0) {
            return { success: false, message: "You have already applied for this job." };
        }

        // Insert application
        await db.insert(applications).values({
            applicantId: applicantData.id,
            jobId,
            resumeId,
            coverLetter: coverLetter || null,
        });

        return { success: true, message: "Successfully applied for the job!" };
    } catch (error) {
        console.error("Error applying for job:", error);
        return { success: false, message: "Failed to apply for the job. Please try again later." };
    }
};

export const checkHasAppliedAction = async (jobId: number) => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) return false;

        const existingApplication = await db.select().from(applications).where(
            and(
                eq(applications.applicantId, applicantData.id),
                eq(applications.jobId, jobId)
            )
        );

        return existingApplication.length > 0;
    } catch (error) {
        console.error("Error checking application status:", error);
        return false;
    }
};

export const toggleSaveJobAction = async (jobId: number) => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) {
            return { success: false, message: "User not authenticated." };
        }

        const existingSaved = await db.select().from(savedJobs).where(
            and(
                eq(savedJobs.applicantId, applicantData.id),
                eq(savedJobs.jobId, jobId)
            )
        );

        if (existingSaved.length > 0) {
            // Unsave
            await db.delete(savedJobs).where(
                and(
                    eq(savedJobs.applicantId, applicantData.id),
                    eq(savedJobs.jobId, jobId)
                )
            );
            return { success: true, saved: false, message: "Job removed from saved jobs." };
        } else {
            // Save
            await db.insert(savedJobs).values({
                applicantId: applicantData.id,
                jobId,
            });
            return { success: true, saved: true, message: "Job saved successfully." };
        }
    } catch (error) {
        console.error("Error toggling saved job:", error);
        return { success: false, message: "Failed to save the job." };
    }
};

export const checkHasSavedJobAction = async (jobId: number) => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) return false;

        const existingSaved = await db.select().from(savedJobs).where(
            and(
                eq(savedJobs.applicantId, applicantData.id),
                eq(savedJobs.jobId, jobId)
            )
        );

        return existingSaved.length > 0;
    } catch (error) {
        console.error("Error checking saved job status:", error);
        return false;
    }
};

export const getSavedJobsAction = async () => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) return [];

        const savedJobsResult = await db.select({
            id: jobs.id,
            title: jobs.title,
            location: jobs.location,
            jobType: jobs.jobType,
            tags: jobs.tags,
            minSalary: jobs.minSalary,
            maxSalary: jobs.maxSalary,
            salaryCurrency: jobs.salaryCurrency,
            salaryPeriod: jobs.salaryPeriod,
            employerName: employers.name,
            employerLogo: employers.logoUrl,
            savedAt: savedJobs.createdAt,
        })
        .from(savedJobs)
        .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
        .leftJoin(employers, eq(jobs.employerId, employers.id))
        .where(eq(savedJobs.applicantId, applicantData.id))
        .orderBy(desc(savedJobs.createdAt));

        return savedJobsResult;
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        return [];
    }
};
