import ApplicantPublicProfile from "@/src/components/employer/ApplicantPublicProfile";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getApplicantPublicProfile } from "@/src/lib/actions/applicantPublicActions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Applicant Profile - Hiring Nest",
};

interface Params {
    params: Promise<{ applicantId: string }>;
}

export default async function Page({ params }: Params) {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employee") {
        redirect("/login");
    }

    const { applicantId } = await params;
    const profile = await getApplicantPublicProfile(Number(applicantId));

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-gray-800">Applicant Not Found</h2>
                <p className="text-gray-500 mt-2">The applicant you are looking for does not exist or you do not have permission to view their profile.</p>
            </div>
        )
    }

    return <ApplicantPublicProfile profile={profile} />;
}
