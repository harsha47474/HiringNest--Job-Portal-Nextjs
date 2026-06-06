import { Button } from "@/src/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/src/components/ui/item";
import { getCurrentEmployerDetails } from "@/src/helper/getCurrentEmployerDetails";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function EmployerProfileCompletionStatus() {
  const currentEmployer = await getCurrentEmployerDetails();

  if (!currentEmployer) return redirect("/login");

  if (currentEmployer.isProfileCompleted) return null;

  return (
    <div className="flex flex-col gap-6">
      <Item variant="destructive">
        <ItemMedia variant="icon" className="bg-destructive">
          <ShieldAlertIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Incomplete Profile</ItemTitle>
          <ItemDescription className="text-white/80">
            You haven't completed your employer profile yet. Please complete
            your profile to post jobs and access all features.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="destructive" className="bg-destructive text-white hover:bg-destructive/80 border-white">
            <Link href="/employer/settings">Complete Profile</Link>
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}