// app/employer/(job)/jobs/[jobId]/edit/page.tsx
import EditJobPage from "@/src/components/employer/EditJobPage";

interface JobIdParams {
  params: Promise<{ jobId: string }>; 
}

export default async function Page({ params }: JobIdParams) {
  const { jobId: jobIdStr } = await params;
  const jobId = Number(jobIdStr);

  if (Number.isNaN(jobId)) {
    throw new Error("Invalid Job id");
  }

  return <EditJobPage jobId={jobId} />;
}
