import { Button } from "@/src/components/ui/button";
import { logoutAction } from "@/src/lib/actions/authActions";
import Dashboard from "@/src/components/employer/EmployerDashboard";
import { getCurrentUser } from "@/src/helper/getCurrentUser";


export default async function EmployerDashboard() {
    return (
        <div>
            <Dashboard user={await getCurrentUser()} />
        </div>
    )
}