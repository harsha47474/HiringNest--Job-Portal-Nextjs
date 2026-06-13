import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function JobDetailsModal({ job }: {job: any}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {/* Required for accessibility */}
        <DialogTitle>
          <VisuallyHidden>Job Details</VisuallyHidden>
        </DialogTitle>

        <h2 className="text-xl font-semibold">{job.title}</h2>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Work type:</strong> {job.type}</p>
          <p><strong>Level:</strong> {job.level}</p>
          <p><strong>Education:</strong> {job.education}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Experience:</strong> {job.experience}</p>
          <p><strong>Expires:</strong> {job.expires}</p>
          <p className="mt-2">{job.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
