"use server"

import { db } from "@/src/config/db";
import { savedCandidates, applicants, users } from "@/src/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";

export const toggleSaveCandidateAction = async (applicantId: number) => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return { success: false, message: "Unauthorized" };

        const existing = await db.select()
            .from(savedCandidates)
            .where(
                and(
                    eq(savedCandidates.employerId, employer.id),
                    eq(savedCandidates.applicantId, applicantId)
                )
            );

        if (existing.length > 0) {
            // Unsave
            await db.delete(savedCandidates)
                .where(eq(savedCandidates.id, existing[0].id));
            return { success: true, saved: false, message: "Candidate removed from saved list" };
        } else {
            // Save
            await db.insert(savedCandidates).values({
                employerId: employer.id,
                applicantId: applicantId
            });
            return { success: true, saved: true, message: "Candidate saved successfully" };
        }
    } catch (error) {
        console.error("Error toggling saved candidate:", error);
        return { success: false, message: "Failed to update saved status" };
    }
}

export const getSavedCandidatesAction = async () => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return [];

        const candidates = await db.select({
            id: savedCandidates.id,
            applicantId: applicants.id,
            savedAt: savedCandidates.createdAt,
            name: users.name,
            email: users.email,
            profileImageUrl: applicants.profileImageUrl,
            experience: applicants.experience,
            education: applicants.education,
            location: applicants.location,
        })
        .from(savedCandidates)
        .innerJoin(applicants, eq(savedCandidates.applicantId, applicants.id))
        .innerJoin(users, eq(applicants.id, users.id))
        .where(eq(savedCandidates.employerId, employer.id))
        .orderBy(desc(savedCandidates.createdAt));

        return candidates;
    } catch (error) {
        console.error("Error fetching saved candidates:", error);
        return [];
    }
}

export const getSavedCandidateIdsAction = async () => {
    try {
        const employer = await getCurrentEmployerDetails();
        if (!employer) return [];

        const saved = await db.select({ applicantId: savedCandidates.applicantId })
            .from(savedCandidates)
            .where(eq(savedCandidates.employerId, employer.id));

        return saved.map(s => s.applicantId);
    } catch (error) {
        console.error("Error fetching saved candidate IDs:", error);
        return [];
    }
}
