import ApplicantJobInfoPage from "@/src/components/applicant/ApplicantJobInfoPage";
import { fetchJobById } from "@/src/lib/actions/applicantJobActions";
import { checkHasAppliedAction, checkHasSavedJobAction } from "@/src/lib/actions/applicantApplicationActions";

interface JobIdParams {
    params: Promise<{ jobId: string }>;
}


export default async function viewJob({ params }: JobIdParams) {
    const { jobId: jobIdStr } = await params;
    const jobId = Number(jobIdStr)
    const job = await fetchJobById(jobId) as any;
    const hasApplied = await checkHasAppliedAction(jobId);
    const isSaved = await checkHasSavedJobAction(jobId);

    return (
        <>
            <ApplicantJobInfoPage 
                jobId={jobId}
                initialJob={job}
                initialHasApplied={hasApplied}
                initialIsSaved={isSaved}
            />
        </>
    )
}