import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    if (user) {
        if (user.role === "employee") {
            redirect("/employer/dashboard");
        } else {
            redirect("/applicant/dashboard");
        }
    }

    return <>{children}</>;
}
