"use server"

import { db } from "@/src/config/db";
import { applications, savedJobs, jobs, employers, resumes } from "@/src/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

const getAllApplications = async () => {
    try {
        const applicationsResult = await db.select().from(applications);
        return applicationsResult;
    } catch (error) {
        console.error("Error fetching all applications:", error);
        return [];
    }
}