import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function JobActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Close job</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
