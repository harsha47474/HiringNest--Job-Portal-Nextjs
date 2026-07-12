import EmployerApplicationsPage from "@/src/components/employer/EmployerApplicationsPage";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getEmployerApplications } from "@/src/lib/actions/employerApplications";
import { getSavedCandidateIdsAction } from "@/src/lib/actions/savedCandidatesActions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Applications - Hiring Nest",
};

export default async function Page() {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employee") {
        redirect("/login");
    }

    const applications = await getEmployerApplications();
    const savedCandidateIds = await getSavedCandidateIdsAction();

    return <EmployerApplicationsPage applications={applications} initialSavedIds={savedCandidateIds} />;
}
