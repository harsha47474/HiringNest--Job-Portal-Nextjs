import EmployerSidebar from "@/src/components/employer/EmployerSidebar";
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

    if (user.role !== "employee") {
        redirect("/applicant/dashboard");
    }

    return (
        <>
            <div className="flex min-h-screen bg-background">
                <EmployerSidebar user={user} />
                <div className="flex flex-col w-full">
                    <Navbar user={user} />
                    <main className="container mx-auto mt-5 px-5">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
