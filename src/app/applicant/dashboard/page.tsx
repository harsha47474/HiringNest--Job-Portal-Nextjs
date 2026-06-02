import { Button } from "@/src/components/ui/button";
import { logoutAction } from "@/src/lib/actions/authActions";

export default function ApplicantDashboard() {
    return (
        <div>
            <h1>Applicant Dashboard</h1>
            <Button variant="outline" onClick={logoutAction}>
                Logout
            </Button>
        </div>
    )
}