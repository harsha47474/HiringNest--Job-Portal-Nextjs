"use server";

import { db } from "@/src/config/db";
import { applications, savedJobs, jobs, employers } from "@/src/drizzle/schema";
import { eq, and, desc, isNull, or, gte } from "drizzle-orm";
import { getCurrentApplicantDetails } from "@/src/helper/getCurrentApplicantDetails";

export const getApplicantDashboardStats = async () => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) return { totalApplied: 0, totalSaved: 0, totalAccepted: 0 };

        const applicantId = applicantData.id;

        const appliedResult = await db.select().from(applications).where(eq(applications.applicantId, applicantId));
        const savedResult = await db.select().from(savedJobs).where(eq(savedJobs.applicantId, applicantId));
        const acceptedResult = appliedResult.filter(app => app.status === "accepted");

        return {
            totalApplied: appliedResult.length,
            totalSaved: savedResult.length,
            totalAccepted: acceptedResult.length,
        };
    } catch (error) {
        console.error("Error fetching applicant dashboard stats:", error);
        return { totalApplied: 0, totalSaved: 0, totalAccepted: 0 };
    }
};

export const getRecentApplications = async () => {
    try {
        const applicantData = await getCurrentApplicantDetails();
        if (!applicantData) return [];

        const recentApps = await db.select({
            id: jobs.id,
            title: jobs.title,
            location: jobs.location,
            jobType: jobs.jobType,
            companyName: employers.name,
            createdAt: applications.createdAt,
            status: applications.status,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .leftJoin(employers, eq(jobs.employerId, employers.id))
        .where(eq(applications.applicantId, applicantData.id))
        .orderBy(desc(applications.createdAt))
        .limit(5);

        return recentApps;
    } catch (error) {
        console.error("Error fetching recent applications:", error);
        return [];
    }
};

export const getRecentlyUploadedJobs = async () => {
    try {
        const today = new Date();

        const recentJobs = await db.select({
            id: jobs.id,
            title: jobs.title,
            location: jobs.location,
            jobType: jobs.jobType,
            workType: jobs.workType,
            minSalary: jobs.minSalary,
            maxSalary: jobs.maxSalary,
            salaryCurrency: jobs.salaryCurrency,
            tags: jobs.tags,
            createdAt: jobs.createdAt,
            companyName: employers.name,
            companyLogo: employers.logoUrl,
        })
        .from(jobs)
        .innerJoin(employers, eq(jobs.employerId, employers.id))
        .where(
            and(
                isNull(jobs.deletedAt),
                eq(jobs.status, "published"),
                or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today))
            )
        )
        .orderBy(desc(jobs.createdAt))
        .limit(5);

        return recentJobs;
    } catch (error) {
        console.error("Error fetching recently uploaded jobs:", error);
        return [];
    }
};
