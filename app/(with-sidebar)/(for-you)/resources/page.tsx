import type { Metadata } from "next";
import { COURSE, getTracks } from "@/lib/learn";
import { getHubItems } from "@/lib/resource-hub";
import { ResourceHub, type HubTrack } from "./ResourceHub";

export const metadata: Metadata = {
  title: "Resources",
  description: "Build Your Own Website, my free lessons for non-tech people, plus the courses, videos and tools I recommend.",
};

export default function ResourcesPage() {
  // Only what the page needs, so lesson text stays out of the browser bundle.
  const tracks: HubTrack[] = getTracks().map(({ slug, title, description, href, lessons }) => ({
    slug,
    title,
    description,
    href,
    lessons: lessons.map(({ title, description, href }) => ({ title, description, href })),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Resources</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>Created: May 1, 2025</div>
          <div>Last updated: November 10, 2026</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Things to help you learn, including my free lessons on building your own website. Search it all at once, or pick a topic.
        </p>
      </header>

      <ResourceHub items={getHubItems()} tracks={tracks} courseTitle={COURSE.title} courseHref={COURSE.href} />
    </div>
  );
}
