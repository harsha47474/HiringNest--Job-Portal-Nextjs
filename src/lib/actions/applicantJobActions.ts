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