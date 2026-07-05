import ApplicantFindJobsPage from "@/src/components/applicant/ApplicantFindJobsPage"
import { getAllJobs } from "@/src/lib/actions/applicantJobActions";

export default async function findJobs() {
    const jobs = await getAllJobs();
    
    return <>
        <ApplicantFindJobsPage initialJobs={jobs || []} />
    </>
}