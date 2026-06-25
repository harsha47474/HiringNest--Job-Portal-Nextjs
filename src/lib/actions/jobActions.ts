"use server"

import { jobs } from "@/src/drizzle/schema";
import { db } from "@/src/config/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";
import { log } from "node:console";
import { JobSchemaType } from "../validations/jobFormValidations";
import { success } from "zod";

type JobForm = {
    title: string;
    description: string;
    tags: string[];

    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance";
    workType: "remote" | "hybrid" | "onsite";
    jobLevel: "entry" | "mid" | "senior" | "lead" | "manager";
    minEducation: "high_school" | "diploma" | "bachelors" | "masters" | "phd";

    location: string;
    latitude?: number;
    longitude?: number;
    experience: string;

    minSalary: number;
    maxSalary: number;

    salaryCurrency: "USD" | "INR" | "EUR" | "GBP";
    salaryPeriod: "yearly" | "monthly" | "hourly";

    expiresAt: string;
    isFeatured: boolean;
};

export const postAJobAction = async (data: JobSchemaType, status: "draft" | "published" | "expired" | "closed") => {
    try {
        const currentUser = await getCurrentEmployerDetails();

        if (!currentUser) {
            return { success: false, message: "User not authenticated" };
        }

        await db.transaction(async (tx) => {
            const JobData = {
                title: data.title,
                description: data.description,
                tags: JSON.stringify(data.tags),
                minSalary: data.minSalary,
                maxSalary: data.maxSalary,
                salaryCurrency: data.salaryCurrency,
                salaryPeriod: data.salaryPeriod,
                jobType: data.jobType,
                location: data.location,
                latitude:
                    data.latitude != null
                        ? String(data.latitude)
                        : null,

                longitude:
                    data.longitude != null
                        ? String(data.longitude)
                        : null,
                workType: data.workType,
                jobLevel: data.jobLevel,
                experience: data.experience,
                minEducation: data.minEducation,
                isFeatured: data.isFeatured,
                expiresAt: new Date(data.expiresAt),
            }
            await tx.insert(jobs).values({
                employerId: currentUser.id,
                ...JobData,
                status,
            })
        });
        return { success: true, message: "Job Posted Successfully" };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to post the job",
        }

    }
}


export type MyJobType = typeof jobs.$inferSelect;

export const getMyJobs = async () => {
    try {
        const employerDetails = await getCurrentEmployerDetails();
        const employerId = employerDetails?.id;
        if (!employerId) {
            return { success: false, message: "User not authenticated" };
        }

        const myJobs = await db.select().from(jobs).where(eq(jobs.employerId, employerId));
        console.log(myJobs);

        return {
            success: true,
            myJobs: myJobs ?? [],
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to retrieve jobs",
        };
    }
}

export const getJobById = async (id: number): Promise<MyJobType | null> => {
    try {
        if (!id && id !== 0) {
            throw new Error("Enter a valid job id");
        }

        console.log("getJobById: fetching id=", id);
        const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
        console.log("getJobById: db result length=", result.length);

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error fetching job by id:", error);
        return null;
    }
};

export const updateJobAction = async (id: number, data: Partial<MyJobType>) => {
    try {
        const employerDetails = await getCurrentEmployerDetails();
        const employerId = employerDetails?.id;
        if (!employerId) {
            return { success: false, message: "User not authenticated" };
        }

        const [existingJob] = await db.select().from(jobs).where(eq(jobs.id, id));
        if (!existingJob || existingJob.employerId !== employerId) {
            return { success: false, message: "Unauthorized or job not found" };
        }


        const { id: _, employerId: __, createdAt: ___, updatedAt: ____, ...updateData } = data;

        await db.update(jobs).set(updateData).where(eq(jobs.id, id));
        return { success: true, message: "Job updated successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update job" };
    }
}

export const deleteJobAction = async (id: number) => {
    try {
        const employerDetails = await getCurrentEmployerDetails();
        const employerId = employerDetails?.id;
        if (!employerId) {
            return { success: false, message: "User not authenticated" };
        }

        const [existingJob] = await db.select().from(jobs).where(eq(jobs.id, id));
        if (!existingJob || existingJob.employerId !== employerId) {
            return { success: false, message: "Unauthorized or job not found" };
        }

        await db.delete(jobs).where(eq(jobs.id, id));
        return { success: true, message: "Job deleted successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete job" };
    }
}

export const updateJobStatusAction = async (id: number, status: "draft" | "published" | "expired" | "closed") => {
    try {
        const employerDetails = await getCurrentEmployerDetails();
        const employerId = employerDetails?.id;
        if (!employerId) {
            return { success: false, message: "User not authenticated" };
        }

        const [existingJob] = await db.select().from(jobs).where(eq(jobs.id, id));
        if (!existingJob || existingJob.employerId !== employerId) {
            return { success: false, message: "Unauthorized or job not found" };
        }

        await db.update(jobs).set({ status }).where(eq(jobs.id, id));
        return { success: true, message: `Job marked as ${status} successfully` };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update job status" };
    }
}