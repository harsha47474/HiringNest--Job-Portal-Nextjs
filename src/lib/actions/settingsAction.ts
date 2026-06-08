"use server"
import { getCurrentUser } from "../../helper/getCurrentUser";
import { db } from "@/src/config/db";
import { users } from "@/src/drizzle/schema";
import { employers } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileInput } from "../validations/employerValidations";

type BrandDetails = {
    name: string;
    websiteUrl: string;
    organisationType: string;
    teamSize: string;
    yearOfEstablishment: number;
    location: string;
    description: string;
    username: string;
    email: string;
}

export const getEmployerProfileAction = async () => {
    const curentUser = await getCurrentUser();
    if (!curentUser) {
        return { success: false, message: "User not authenticated" };
    }

    const [employer] = await db.select()
        .from(employers)
        .where(eq(employers.id, curentUser.id));

    if (!employer) {
        return;
    }

    return employer;
}

export const updateEmployerProfileAction = async (data: EmployerProfileInput) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: "User not authenticated" };
        }

        await db.transaction(async (tx) => {
            const [existingUser] = await tx.select().from(employers).where(eq(employers.id, currentUser.id));

            const employerData = {
                name: data.name,
                description: data.description,
                organizationType: data.organizationType,
                teamSize: data.teamSize,
                yearOfEstablishment: data.yearOfEstablishment,
                websiteUrl: data.websiteUrl,
                location: data.location,
            };

            if (existingUser) {
                console.log("Updating existing employer profile with data:", employerData);
                await tx
                    .update(employers)
                    .set(employerData)
                    .where(eq(employers.id, currentUser.id));
            } else {
                await tx.insert(employers).values({
                    id: currentUser.id,
                    ...employerData,
                });
            }
        });

        return { success: true, message: "Profile updated successfully" };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to update employer profile",
        }

    }
}