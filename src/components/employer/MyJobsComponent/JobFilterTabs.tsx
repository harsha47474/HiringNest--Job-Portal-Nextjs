import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function JobFilterTabs() {
  return (
    <Tabs defaultValue="all" className="mb-4">
      <TabsList className="bg-white border rounded-lg">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
        <TabsTrigger value="featured">Featured</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
