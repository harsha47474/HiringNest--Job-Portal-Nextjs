import Dashboard from "@/src/components/employer/EmployerDashboard";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { getMyJobs } from "@/src/lib/actions/jobActions";

export default async function EmployerDashboard() {
    const user = await getCurrentUser();
    const jobsResponse = await getMyJobs();
    const jobs = jobsResponse.success ? jobsResponse.myJobs : [];

    return (
        <div>
            <Dashboard user={user} jobs={jobs} />
        </div>
    )
}