'use server'
import { db } from "@/src/config/db"
import { jobs, users } from "@/src/drizzle/schema"
import { employers } from "@/src/drizzle/schema"
import { and, desc, eq, gte, isNull, or } from "drizzle-orm"

export const getAllJobs = async () => {
    try {
        const today = new Date();

        const jobsData = await db.select({
            id: jobs.id,
            title: jobs.title,
            description: jobs.description,
            tags: jobs.tags,
            minSalary: jobs.minSalary,
            maxSalary: jobs.maxSalary,
            jobType: jobs.jobType,
            workType: jobs.workType,
            jobLevel: jobs.jobLevel,
            salaryCurrency: jobs.salaryCurrency,
            location: jobs.location,
            createdAt: jobs.createdAt,
            companyName: employers.name,
            companyLogo: employers.logoUrl
        }).from(jobs)
            .innerJoin(employers, eq(jobs.employerId, employers.id))
            .innerJoin(users, eq(employers.id, users.id))
            .where(
                and(
                    isNull(jobs.deletedAt),
                    or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today))
                )
            )
            .orderBy(desc(jobs.createdAt));


        return jobsData;
    } catch (error) {
        console.error("Cannot fetch jobs")
    }
}

export const fetchJobById = async (id: number) => {
    try {
        if (!id && id !== 0) {
            throw new Error("Enter a valid job id");
        }

        console.log("getJobById: fetching id=", id);
        const result = await db.select({
            id: jobs.id,
            title: jobs.title,
            description: jobs.description,
            tags: jobs.tags,
            minSalary: jobs.minSalary,
            maxSalary: jobs.maxSalary,
            jobType: jobs.jobType,
            workType: jobs.workType,
            jobLevel: jobs.jobLevel,
            salaryCurrency: jobs.salaryCurrency,
            experience: jobs.experience,
            location: jobs.location,
            education: jobs.minEducation,
            createdAt: jobs.createdAt,
            companyName: employers.name,
            companyLogo: employers.logoUrl,
            companyDescription: employers.description,
            websiteUrl: employers.websiteUrl,
            size: employers.teamSize,
            employerName: employers.name,
            companyLocation: employers.location

        }).from(jobs)
            .innerJoin(employers, eq(employers.id, jobs.employerId))
            .where(eq(jobs.id, id))
            .limit(1);
        console.log("getJobById: db result length=", result.length);

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error fetching job by id:", error);
    }
}