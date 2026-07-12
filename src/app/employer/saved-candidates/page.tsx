import SavedCandidatesPage from "@/src/components/employer/SavedCandidatesPage";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getSavedCandidatesAction } from "@/src/lib/actions/savedCandidatesActions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved Candidates - Hiring Nest",
};

export default async function Page() {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employee") {
        redirect("/login");
    }

    const savedCandidates = await getSavedCandidatesAction();

    return <SavedCandidatesPage initialCandidates={savedCandidates} />;
}
