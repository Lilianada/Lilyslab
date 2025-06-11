import { notFound } from "next/navigation";
import { getWritingBySlug, getAllWritings } from "@/lib/garden/writings";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { WritingMarkdownWrapper } from "./markdown-wrapper";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const writing = await getWritingBySlug(resolvedParams.slug);

  if (!writing) {
    return {
      title: "Writing Not Found",
    };
  }

  return {
    title: writing.title,
    description: writing.excerpt,
  };
}

export default async function WritingSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const writingsDir = path.join(process.cwd(), "Content/writings");
  const filePath = path.join(writingsDir, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Read the markdown file
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Check if the post is published
  if (data.published !== true) {
    console.log(`Writing with slug '${slug}' found but not published.`); // Optional logging
    notFound(); // Return 404 if not explicitly published
  }

  // Get all writings for prev/next navigation
  const allWritings = getAllWritings();

  // Find the current post index
  const currentIndex = allWritings.findIndex(
    (writing) => writing.slug === slug
  );

  // Get previous and next posts
  const prevPost =
    currentIndex < allWritings.length - 1
      ? allWritings[currentIndex + 1]
      : null;
  const nextPost = currentIndex > 0 ? allWritings[currentIndex - 1] : null;

  return (
    <>
      <ScrollProgress
        color="bg-extra-steelBlue"
        height={3}
        glow={true}
        glowColor="rgba(var(--extra-steelBlue), 0.6)"
        glowIntensity="12px"
      />
      <div className="max-w-2xl w-full mx-auto animate-fade-in">
        <div className="mt-6 sm:mt-12 mb-8 flex items-center ">
          <Link
            href="/garden/writings"
            className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Return</span>
          </Link>
        </div>

        <div>
          <header className="mt-4">
            <div className="flex flex-col gap-2 mb-8">
              <div className="block font-mono text-xs text-muted-foreground">
                <div>
                  Created: {data.createdAt ? formatDate(data.createdAt) : "N/A"}
                </div>
                <div>
                  Updated:{" "}
                  {data.lastUpdated ? formatDate(data.lastUpdated) : "✳︎✳︎✳︎"}
                </div>
                <div className="capitalize">
                  Type: {data.type || "seedling"}
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    Tags:
                    {data.tags.map((tag: string) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-xl font-semibold">{data.title}</h1>
          </header>

          {data.coverImage && (
            <div className="mb-6 rounded-lg overflow-hidden w-full">
              <Image
                src={data.coverImage || "/placeholder.svg"}
                alt={data.title || "Article cover"}
                width={1200}
                height={630}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          )}
          <WritingMarkdownWrapper content={content} />
        </div>

        <Footer
          prevPost={
            prevPost
              ? { title: prevPost.title, slug: prevPost.slug }
              : undefined
          }
          nextPost={
            nextPost
              ? { title: nextPost.title, slug: nextPost.slug }
              : undefined
          }
          contentType="garden/writings"
        />
      </div>
    </>
  );
}
