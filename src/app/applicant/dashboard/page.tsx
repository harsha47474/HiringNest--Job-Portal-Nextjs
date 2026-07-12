import ApplicantDashboardPage from "@/src/components/applicant/ApplicantDashboardPage";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { redirect } from "next/navigation";
import { getApplicantDashboardStats, getRecentApplications, getRecentlyUploadedJobs } from "@/src/lib/actions/applicantDashboardActions";

export default async function ApplicantDashboard() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login")
    }

    const stats = await getApplicantDashboardStats();
    const recentApps = await getRecentApplications();
    const recentJobs = await getRecentlyUploadedJobs();

    return (
        <ApplicantDashboardPage 
            user={user}
            stats={stats}
            recentApps={recentApps}
            recentJobs={recentJobs}
        />
    )
}