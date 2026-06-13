import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function EditJobModal({ job }: {job: any}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {/* Required for accessibility */}
        <DialogTitle>
          <VisuallyHidden>Edit Job</VisuallyHidden>
        </DialogTitle>

        <h2 className="text-xl font-semibold mb-4">Edit Job</h2>
        <div className="space-y-3">
          <Input defaultValue={job.title} placeholder="Job title" />
          <textarea
            defaultValue={job.description}
            className="w-full border rounded p-2 text-sm"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input defaultValue={job.location} placeholder="Location" />
            <Input defaultValue={job.experience} placeholder="Experience" />
            <Input defaultValue={job.type} placeholder="Job type" />
            <Input defaultValue={job.education} placeholder="Education" />
            <Input defaultValue={job.salary} placeholder="Salary" />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
