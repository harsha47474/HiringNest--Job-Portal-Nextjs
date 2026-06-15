import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

interface JobFilterTabsProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

export default function JobFilterTabs({ filter, onFilterChange }: JobFilterTabsProps) {
  return (
    <Tabs value={filter} onValueChange={onFilterChange} className="mb-3">
      <TabsList className="bg-white border rounded-lg">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="closed">Closed</TabsTrigger>
        <TabsTrigger value="expired">Expired</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
