import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getApplicantProfileAction } from "@/src/lib/actions/applicantProfileActions";
import ApplicantProfileForm from "@/src/components/applicant/ApplicantProfile";

export default async function ApplicantProfilePage() {
    const user = await getCurrentUser();
    
    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    const applicant = await getApplicantProfileAction();

    return (
        <ApplicantProfileForm user={user} applicant={applicant} />
    );
}