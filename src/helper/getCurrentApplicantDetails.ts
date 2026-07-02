import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { db } from "@/src/config/db";
import { applicants, resumes } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getCurrentApplicantDetails = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return null;

        const [applicantDetails] = await db.select().from(applicants).where(eq(applicants.id, currentUser.id));
        
        if (!applicantDetails) return null;

        const applicantResumes = await db.select().from(resumes).where(eq(resumes.applicantId, currentUser.id));

        let isProfileCompleted = false;
        if (
            applicantDetails.biography &&
            applicantDetails.dateOfBirth &&
            applicantDetails.nationality &&
            applicantDetails.gender &&
            applicantDetails.maritalStatus &&
            applicantDetails.education &&
            applicantDetails.experience &&
            applicantDetails.location &&
            applicantResumes.length > 0
        ) {
            isProfileCompleted = true;
        }

        return { ...currentUser, applicantDetails, resumes: applicantResumes, isProfileCompleted };
    } catch (error) {
        console.error("Error fetching applicant details:", error);
        return null;
    }
};
