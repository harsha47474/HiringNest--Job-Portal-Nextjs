import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getApplicantProfileAction } from "@/src/lib/actions/applicantProfileActions";
import AppliedJobsPage from "@/src/components/applicant/ApplicantAppliedJobsPage";

export default async function ApplicantAppliedJobs() {
    const user = await getCurrentUser();
    
    if (!user) {
        return <div>Please log in to view your applied jobs.</div>;
    }

    const applicant = await getApplicantProfileAction();

    return (
        <AppliedJobsPage id={applicant?.id} />
    );
}