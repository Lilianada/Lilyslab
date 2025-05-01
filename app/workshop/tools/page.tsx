"use client"; // Make this a Client Component

import { useState, useEffect, useMemo } from "react";
import { ToolCard } from "@/components/workshop/tools/ToolCard";
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui Input
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { type Tool } from "@/types"; // Import Tool type
import { ToolCardSkeleton } from "@/components/workshop/tools/ToolCardSkeleton"; 
import ToolSubmissionDialog from "@/components/workshop/tools/ToolSubmissionDialog";

export default function ToolsPage() {
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch data on component mount from the API route
  useEffect(() => {
    async function loadTools() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from the new API route
        const response = await fetch("/api/tools");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch tools data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const toolsData: Tool[] = await response.json();
        setAllTools(toolsData);
      } catch (err) {
        console.error("Failed to load tools:", err);
        // Set specific error message based on error type if possible
        const message = err instanceof Error ? err.message : "Failed to load tools data.";
        setError(message);
      } finally {
        // Simulate loading for slightly longer to see skeleton
        // Remove this setTimeout in production
        setTimeout(() => setIsLoading(false), 500);
      }
    }
    loadTools();
  }, []);

  // Derive categories from the fetched tools
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allTools.map(tool => tool.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [allTools]);

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    setIsSidebarOpen(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">Tools</h1>
        <p className="text-sm text-muted-foreground">
          A curated collection of tools and resources for digital minimalists.
          {!isLoading && ` Showing ${filteredTools.length} of ${allTools.length}.`}
        </p>
      </header>

      {/* Search and Filter UI */}
      <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm" // Limit search bar width
        />
         <Button
            
              variant="default" 
              size="sm"
              onClick={() => handleSubmit()}
              className="text-xs py-0 leading-normal px-4"
            >
             Submit tool
            </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
              className="text-xs py-0 leading-normal px-4"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid or Loading Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Render Skeleton Cards
          Array.from({ length: 6 }).map((_, index) => (
            <ToolCardSkeleton key={index} />
          ))
        ) : error ? (
          // Display error message spanning grid columns
          <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-red-500">{error}</div>
        ) : filteredTools.length === 0 ? (
          // Display no results message spanning grid columns
          <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-muted-foreground">No tools found matching your criteria.</div>
        ) : (
          // Render Actual Tool Cards
          filteredTools.map((tool, i) => (
            <ToolCard
              key={tool.name + i}
              name={tool.name}
              description={tool.description}
              logo={tool.logo}
              platforms={tool.platforms}
              url={tool.url}
            />
          ))
        )}
      </div>
      {/* Overlay for desktop screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="hidden sm:block fixed inset-0 bg-black/50 z-40 transition-opacity animate-fade-in animate-fade-out"
          aria-label="Sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <ToolSubmissionDialog
        open={isSidebarOpen}
        onOpenChange={() => setIsSidebarOpen(false)}
        onSubmit={async (data) => {
          // Get the submissions directory
          const submissionsDir = "/Users/lilian/Desktop/Projects/Lilyslab/Content/tools/submissions";
          // Read existing files to determine next number
          const files = await window.fetch("/api/list-files?dir=" + encodeURIComponent(submissionsDir)).then(res => res.json());
          const numbers = files
            .map((file: string) => parseInt(file.replace(/\.json$/, "")))
            .filter((n: number) => !isNaN(n));
          const nextNum = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
          const paddedNum = String(nextNum).padStart(3, "0");
          // Save the submission
          await window.fetch("/api/save-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: `${submissionsDir}/${paddedNum}.json`,
              content: JSON.stringify(data, null, 2)
            })
          });
        }}
      />
    </div>
  );
}
