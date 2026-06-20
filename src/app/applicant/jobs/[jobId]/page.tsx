import ApplicantJobInfoPage from "@/src/components/applicant/ApplicantJobInfoPage";

interface JobIdParams {
    params: Promise<{ jobId: string }>;
}


export default async function viewJob({ params }: JobIdParams) {
    const { jobId: jobIdStr } = await params;
    const jobId = Number(jobIdStr)
    return (
        <>
            <ApplicantJobInfoPage jobId={jobId} />
        </>
    )
}