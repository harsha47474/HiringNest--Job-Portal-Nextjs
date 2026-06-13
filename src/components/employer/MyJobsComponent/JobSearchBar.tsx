import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function JobSearchBar() {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search jobs..."
          className="w-64 border-gray-300 focus:ring-0 focus:border-gray-400"
        />
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
        + New Job
      </Button>
    </div>
  );
}
