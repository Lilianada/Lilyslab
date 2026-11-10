import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NoteRouteParams, SlugParams } from "@/lib/types/route-params";
import { NotesClientWrapper } from "./client-wrapper";
import { NotesMarkdownWrapper } from "./markdown-wrapper";
import { PrevNext } from "@/components/layout/prev-next";
import { Replies } from "@/components/comments/Replies";
import { getAllNotesData } from "@/lib/notes";
import { ScrollProgress } from "@/components/ui/scroll-progress";

/**
 * Get note content by slug
 *
 * @param slug The note slug to retrieve
 * @returns The note content or null if not found
 */
async function getNotesContent(slug: string) {
  try {
    const notesDir = path.join(process.cwd(), "Content/notes");
    const filePath = path.join(notesDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      content,
      title: data.title || slug,
      createdAt: data.createdAt ? formatDate(data.createdAt) : null,
      lastUpdated: data.lastUpdated ? formatDate(data.lastUpdated) : null,
      type: data.type || "seedling",
      tags: data.tags || [],
      excerpt: data.excerpt || null,
    };
  } catch (error) {
    console.error(`Error getting note content for ${slug}:`, error);
    return null;
  }
}

/**
 * Generate metadata for the note page
 */
export async function generateMetadata({ params }: NoteRouteParams) {
  // Params is already a Promise in the updated type definition
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const note = await getNotesContent(slug);

  if (!note) {
    return {
      title: "Notes Not Found",
    };
  }

  return {
    title: note.title,
    description: note.excerpt,
  };
}

/**
 * Generate static paths for all markdown files in the notes directory
 * This follows Next.js's convention for static site generation with dynamic routes
 */
export function generateStaticParams(): SlugParams[] {
  try {
    const notesDir = path.join(process.cwd(), "Content/notes");
    const files = fs.readdirSync(notesDir);

    return files
      .filter((file) => file.endsWith(".md") && file !== "README.md")
      .map((file) => ({
        slug: file.replace(/\.md$/, ""),
      }));
  } catch (error) {
    console.error("Error generating static params for notes:", error);
    return [];
  }
}

/**
 * Notes page component
 */
export default async function NotesPage({ params }: NoteRouteParams) {
  // Params is already a Promise in the updated type definition
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const note = await getNotesContent(slug);

  if (!note) {
    notFound();
  }

  // Get all notes for navigation
  const allNotes = getAllNotesData();

  // Find current note index
  const currentIndex = allNotes.findIndex((note) => note.slug === slug);

  // Get previous and next notes for navigation
  const previousPost =
    currentIndex > 0
      ? {
          title: allNotes[currentIndex - 1].frontmatter.title,
          href: `/garden/notes/${allNotes[currentIndex - 1].slug}`,
        }
      : undefined;

  const nextPost =
    currentIndex < allNotes.length - 1
      ? {
          title: allNotes[currentIndex + 1].frontmatter.title,
          href: `/garden/notes/${allNotes[currentIndex + 1].slug}`,
        }
      : undefined;

  return (
    <NotesClientWrapper>
      <ScrollProgress
        color="bg-siteGreen"
        height={3}
        glow={true}
        glowColor="rgba(var(--siteGreen), 0.6)"
        glowIntensity="12px"
      />
      <div className="max-w-2xl w-full mx-auto animate-fade-in pt-10 sm:pt-16">
        <div>
          <header className="mt-4">
            <div className="flex flex-col gap-2 mb-8">
              <div className="block font-mono text-xs text-muted-foreground">
                <div>
                  Created: {note.createdAt ? formatDate(note.createdAt) : "✳︎✳︎✳︎"}
                </div>
                <div>
                  Updated:{" "}
                  {note.lastUpdated ? formatDate(note.lastUpdated) : "✳︎✳︎✳︎"}
                </div>
                <div className="capitalize">
                  Type: {note.type || "Seedling"}
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    Tags:
                    {note.tags.map((tag: string) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-xl font-semibold">{note.title}</h1>
          </header>

          <NotesMarkdownWrapper content={note.content} />
        </div>
        <Replies page={`notes/${slug}`} title={note.title} />
        <PrevNext prev={previousPost} next={nextPost} />
      </div>
    </NotesClientWrapper>
  );
}
