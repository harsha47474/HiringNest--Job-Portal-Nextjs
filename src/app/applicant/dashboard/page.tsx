import { Button } from "@/src/components/ui/button";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { logoutAction } from "@/src/lib/actions/authActions";
import { redirect } from "next/navigation";

export default async function ApplicantDashboard() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login")
    }
    return (
        <div>
            <h1>Applicant Dashboard</h1>
            <Button variant="outline" onClick={logoutAction}>
                Logout
            </Button>
        </div>
    )
}