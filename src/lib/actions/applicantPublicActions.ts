"use server"

import { db } from "@/src/config/db";
import { applicants, users, resumes } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";

export const getApplicantPublicProfile = async (applicantId: number) => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return null;

        const [applicantData] = await db.select({
            id: applicants.id,
            profileImageUrl: applicants.profileImageUrl,
            biography: applicants.biography,
            dateOfBirth: applicants.dateOfBirth,
            nationality: applicants.nationality,
            maritalStatus: applicants.maritalStatus,
            gender: applicants.gender,
            education: applicants.education,
            experience: applicants.experience,
            websiteUrl: applicants.websiteUrl,
            location: applicants.location,
            name: users.name,
            email: users.email,
            phoneNumber: users.phoneNumber,
        })
        .from(applicants)
        .innerJoin(users, eq(applicants.id, users.id))
        .where(eq(applicants.id, applicantId));

        if (!applicantData) return null;

        const applicantResumes = await db.select()
            .from(resumes)
            .where(eq(resumes.applicantId, applicantId));

        return { ...applicantData, resumes: applicantResumes };
    } catch (error) {
        console.error("Error fetching applicant public profile:", error);
        return null;
    }
}
