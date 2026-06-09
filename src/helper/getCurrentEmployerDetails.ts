import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { db } from "@/src/config/db";
import { employers } from "../drizzle/schema";
import { eq } from "drizzle-orm"

export const getCurrentEmployerDetails = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return null;

        const [employerDetails] = await db.select().from(employers).where(eq(employers.id, currentUser.id))

        let isProfileCompleted = false;
        if (
            employerDetails.name &&
            employerDetails.description &&
            employerDetails.organizationType &&
            employerDetails.teamSize &&
            employerDetails.yearOfEstablishment &&
            employerDetails.websiteUrl &&
            employerDetails.location
        ) { isProfileCompleted = true; }

        return { ...currentUser, employerDetails, isProfileCompleted };
    } catch (error) {
        console.error("Error fetching employer details:", error);
        return null;
    }
};