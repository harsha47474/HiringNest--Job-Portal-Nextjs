"use server"

import { db } from "@/src/config/db";
import { applications, jobs, applicants, users, resumes } from "@/src/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";

export const getEmployerApplications = async () => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return [];

        const apps = await db.select({
            id: applications.id,
            status: applications.status,
            createdAt: applications.createdAt,
            jobTitle: jobs.title,
            applicantId: applicants.id,
            applicantName: users.name,
            applicantEmail: users.email,
            resumeName: resumes.name,
            resumeUrl: resumes.url
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(applicants, eq(applications.applicantId, applicants.id))
        .innerJoin(users, eq(applicants.id, users.id))
        .innerJoin(resumes, eq(applications.resumeId, resumes.id))
        .where(eq(jobs.employerId, employer.id))
        .orderBy(desc(applications.createdAt));

        return apps;
    } catch (error) {
        console.error("Error fetching employer applications:", error);
        return [];
    }
}

export const updateApplicationStatusAction = async (applicationId: number, status: "pending" | "reviewed" | "accepted" | "rejected") => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return { success: false, message: "Unauthorized" };

        // Ensure the application belongs to a job posted by this employer
        const [app] = await db.select({ id: applications.id })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(
                and(
                    eq(applications.id, applicationId),
                    eq(jobs.employerId, employer.id)
                )
            );

        if (!app) return { success: false, message: "Application not found or unauthorized" };

        await db.update(applications)
            .set({ status })
            .where(eq(applications.id, applicationId));

        return { success: true, message: `Application marked as ${status}` };
    } catch (error) {
        console.error("Error updating application status:", error);
        return { success: false, message: "Failed to update status" };
    }
}