import { getCurrentUser } from "@/src/helper/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "employee") {
      redirect("/employer/dashboard");
    } else {
      redirect("/applicant/dashboard");
    }
  } else {
    redirect("/login");
  }
}
