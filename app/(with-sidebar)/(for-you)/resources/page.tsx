import type { Metadata } from "next";
import { getHubItems } from "@/lib/resource-hub";
import { ResourceHub } from "./ResourceHub";

export const metadata: Metadata = {
  title: "Resources",
  description: "Everything I've saved around the garden, in one place: resources, bookmarks, tools and sites I love.",
};

export default async function ResourcesPage() {
  const items = await getHubItems();

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Resources</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>Created: May 1, 2025</div>
          <div>Last updated: November 5, 2026</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          My hub for everything worth finding again. Search it all at once, or wander along the shelves.
        </p>
      </header>

      <ResourceHub items={items} />
    </div>
  );
}
