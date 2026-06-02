import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { redirect } from "next/navigation";

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
            {children}
        </>
    );
}
