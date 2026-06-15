import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";

interface JobSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function JobSearchBar({ searchQuery, onSearchChange }: JobSearchBarProps) {
  return (
    <div className="flex justify-between items-center mt-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-90 border-gray-300 focus:ring-0 focus:border-gray-400 h-10"
        />
        <Button variant={"blue"} className="h-10 hover:bg-blue-700 text-white cursor-pointer">
          Search
        </Button>
      </div>
      <Link href="/employer/post" >
        <Button variant={"blue"} className="bg-blue-600 hover:bg-blue-700 h-10 text-white cursor-pointer">
          + New Job
        </Button>
      </Link>
    </div>
  );
}
