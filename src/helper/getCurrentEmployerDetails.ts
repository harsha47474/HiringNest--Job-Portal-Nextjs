import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { db } from "@/src/config/db";
import { employers } from "../drizzle/schema";

export const getCurrentEmployerDetails = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return null;

        // const employerDetails = await db.select().from("employers").where(eq(employers.user_id, currentUser.id));

        const isProfileCompleted = false; // Mocking profile completion for now

        return { ...currentUser, employerDetails: null, isProfileCompleted }; // Mocking profile completion for now
    } catch (error) {
        console.error("Error fetching employer details:", error);
        return null;
    }
};