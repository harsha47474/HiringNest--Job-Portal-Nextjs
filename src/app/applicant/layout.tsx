import EmployerSidebar from "@/src/components/employer/EmployerSidebar";
import ApplicantSidebar from "@/src/components/applicant/ApplicantSidebar";
import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/global/Navbar";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <div className="flex min-h-screen bg-background">
                <ApplicantSidebar user={user} className="fixed left-0 top-0 h-screen w-64" />
                <div className="flex flex-col w-full pl-64">
                    {/* <Navbar user={user} /> */}
                    <main className="mt-5 px-5">
                        {children}
                    </main>
                </div>
            </div>

        </>
    );
}
