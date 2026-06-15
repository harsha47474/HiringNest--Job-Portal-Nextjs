import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface JobActionsMenuProps {
  job: any;
  onDuplicate?: (job: any) => void;
  onClose?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
  onPublish?: (jobId: number) => void;
}

export default function JobActionsMenu({ job, onDuplicate, onClose, onDelete, onPublish }: JobActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {job.status === "draft" && onPublish && (
            <DropdownMenuItem onClick={() => onPublish(job.id)}>Publish</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onDuplicate && onDuplicate(job)}>Duplicate</DropdownMenuItem>
        {job.status !== "closed" && (
            <DropdownMenuItem onClick={() => onClose && onClose(job.id)}>Close job</DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-red-600" onClick={() => onDelete && onDelete(job.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
