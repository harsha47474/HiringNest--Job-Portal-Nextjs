"use server"

import { jobs } from "@/src/drizzle/schema";
import { db } from "@/src/config/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";
import { log } from "node:console";

type JobForm = {
    title: string;
    description: string;
    tags: string;

    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance";
    workType: "remote" | "hybrid" | "onsite";
    jobLevel: "entry" | "mid" | "senior" | "lead" | "manager";
    minEducation: "high_school" | "diploma" | "bachelors" | "masters" | "phd";

    location: string;
    experience: string;

    minSalary: number;
    maxSalary: number;

    salaryCurrency: "USD" | "INR" | "EUR" | "GBP";
    salaryPeriod: "yearly" | "monthly" | "hourly";

    expiresAt: string;
    isFeatured: boolean;
    isActive: boolean;
};

export const postAJobAction = async (data: JobForm) => {
    try {
        const currentUser = await getCurrentEmployerDetails();

        if (!currentUser) {
            return { success: false, message: "User not authenticated" };
        }

        await db.transaction(async (tx) => {
            const JobData = {
                title: data.title,
                description: data.description,
                tags: data.tags,
                minSalary: data.minSalary,
                maxSalary: data.maxSalary,
                salaryCurrency: data.salaryCurrency,
                salaryPeriod: data.salaryPeriod,
                jobType: data.jobType,
                location: data.location,
                workType: data.workType,
                jobLevel: data.jobLevel,
                experience: data.experience,
                minEducation: data.minEducation,
                isFeatured: data.isFeatured,
                isActive: data.isActive,
                expiresAt: new Date(data.expiresAt),
            }

            await tx.insert(jobs).values({
                employerId: currentUser.id,
                ...JobData,
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