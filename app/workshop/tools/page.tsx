import { ToolCard } from "@/components/workshop/tools/ToolCard";
import { parseToolsMarkdown } from "@/lib/toolsParser";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { ToolSubmissionSidebar } from "@/components/workshop/tools/ToolSubmissionSidebar";
// If you want submission or interactivity, move those to a client component

const categories = ["All", "Productivity", "Education", "Utilities", "Health & Fitness"];
// If you want category filtering, move this logic into a client component

export default function ToolsPage() {
  const allTools = parseToolsMarkdown();
  // If you want search/filter, move that to a client component and pass allTools as a prop
  return (
    <div className="max-w-3xl mx-auto sm:px-6 py-12">
      <header className="mb-4">
        <h1 className="mb-1 text-xl font-medium">Tools</h1>
        <p className="text-sm text-muted-foreground">
          A curated collection of {allTools.length} tools and resources for digital minimalists.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allTools.map((tool: any, i: number) => (
          <ToolCard
            key={tool.name + i}
            name={tool.name}
            description={tool.description}
            logo={tool.logo}
            platforms={tool.platforms}
            url={tool.url}
          />
        ))}
      </div>
    </div>
  );
}
