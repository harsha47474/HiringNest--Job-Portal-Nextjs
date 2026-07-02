"use server"

import { getCurrentUser } from "../../helper/getCurrentUser";
import { db } from "@/src/config/db";
import { applicants, resumes } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { ApplicantProfileInput } from "../validations/applicantValidations";
import cloudinary from "@/src/utils/cloudinary";

export const getApplicantProfileAction = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return { success: false, message: "User not authenticated" };
    }

    const [applicant] = await db.select()
        .from(applicants)
        .where(eq(applicants.id, currentUser.id));

    if (!applicant) {
        return null;
    }

    const applicantResumes = await db.select()
        .from(resumes)
        .where(eq(resumes.applicantId, currentUser.id));

    return {
        ...applicant,
        resumes: applicantResumes,
    };
};

export const updateApplicantProfileAction = async (data: ApplicantProfileInput) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: "User not authenticated" };
        }

        await db.transaction(async (tx) => {
            const [existingApplicant] = await tx.select().from(applicants).where(eq(applicants.id, currentUser.id));

            const applicantData = {
                profileImageUrl: data.profileImageUrl || null,
                biography: data.biography || null,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                nationality: data.nationality || null,
                gender: (data.gender === "male" || data.gender === "female" || data.gender === "other") ? data.gender : null,
                maritalStatus: (data.maritalStatus === "single" || data.maritalStatus === "married" || data.maritalStatus === "divorced") ? data.maritalStatus : null,
                education: (data.education === "none" || data.education === "high school" || data.education === "undergraduate" || data.education === "masters" || data.education === "phd") ? data.education : null,
                experience: data.experience || null,
                websiteUrl: data.websiteUrl || null,
                location: data.location || null,
            };

            if (existingApplicant) {
                await tx
                    .update(applicants)
                    .set(applicantData)
                    .where(eq(applicants.id, currentUser.id));
            } else {
                await tx.insert(applicants).values({
                    id: currentUser.id,
                    ...applicantData,
                });
            }

            // Sync resumes
            // Get existing resumes
            const existingResumes = await tx.select().from(resumes).where(eq(resumes.applicantId, currentUser.id));
            
            // Delete resumes not in data.resumes
            const newResumeUrls = data.resumes.map(r => r.url);
            for (const existing of existingResumes) {
                if (!newResumeUrls.includes(existing.url)) {
                    await tx.delete(resumes).where(eq(resumes.id, existing.id));
                }
            }

            // Insert new resumes
            const existingUrls = existingResumes.map(r => r.url);
            for (const resume of data.resumes) {
                if (!existingUrls.includes(resume.url)) {
                    await tx.insert(resumes).values({
                        applicantId: currentUser.id,
                        name: resume.name,
                        url: resume.url,
                        size: resume.size || null,
                        isPrimary: resume.isPrimary || false,
                    });
                }
            }
        });

        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to update applicant profile",
        };
    }
};

export async function uploadApplicantFileAction(file: File, folder: string = "applicant-files") {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            )
            .end(buffer);
    });

    return result.secure_url;
}

export const uploadResumeAction = async (fileUrl: string, name: string, size: number) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, message: "Not authenticated" };

        const existingResumes = await db.select().from(resumes).where(eq(resumes.applicantId, currentUser.id));
        if (existingResumes.length >= 5) {
            return { success: false, message: "Maximum 5 resumes allowed." };
        }

        const isFirst = existingResumes.length === 0;

        await db.insert(resumes).values({
            applicantId: currentUser.id,
            name,
            url: fileUrl,
            size,
            isPrimary: isFirst,
        });

        return { success: true, message: "Resume uploaded successfully." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to upload resume." };
    }
};

export const deleteResumeAction = async (resumeId: number) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, message: "Not authenticated" };

        // Check if used in applications
        const { applications } = await import("@/src/drizzle/schema");
        const usedInApps = await db.select().from(applications).where(eq(applications.resumeId, resumeId));
        if (usedInApps.length > 0) {
            return { success: false, message: "Cannot delete resume used in applications." };
        }

        await db.delete(resumes).where(eq(resumes.id, resumeId));
        return { success: true, message: "Resume deleted successfully." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete resume." };
    }
};

export const setPrimaryResumeAction = async (resumeId: number) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, message: "Not authenticated" };

        await db.transaction(async (tx) => {
            // reset all
            await tx.update(resumes).set({ isPrimary: false }).where(eq(resumes.applicantId, currentUser.id));
            // set one
            await tx.update(resumes).set({ isPrimary: true }).where(eq(resumes.id, resumeId));
        });

        return { success: true, message: "Primary resume updated." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update primary resume." };
    }
};

export const checkApplicantProfileCompletionAction = async () => {
    try {
        const { getCurrentApplicantDetails } = await import("@/src/helper/getCurrentApplicantDetails");
        const details = await getCurrentApplicantDetails();
        if (!details) return { success: false, isComplete: false, message: "Not authenticated", resumes: [] };
        return { success: true, isComplete: details.isProfileCompleted, resumes: details.resumes };
    } catch (error) {
        console.error(error);
        return { success: false, isComplete: false, message: "Error checking profile", resumes: [] };
    }
};
