import { notFound } from "next/navigation";
import { getEssayBySlug, getAllEssays } from "@/lib/garden/essays";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import { PrevNext } from "@/components/layout/prev-next";
import { Replies } from "@/components/comments/Replies";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { EssayMarkdownWrapper } from "./markdown-wrapper";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// Pre-render every essay at build time so they're served from the CDN.
export function generateStaticParams() {
  return getAllEssays().map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const essay = await getEssayBySlug(resolvedParams.slug);

  if (!essay) {
    return {
      title: "Essay Not Found",
    };
  }

  return {
    title: essay.title,
    description: essay.excerpt,
  };
}

export default async function EssaySlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const essaysDir = path.join(process.cwd(), "Content/essays");
  const filePath = path.join(essaysDir, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Read the markdown file
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Check if the post is published
  if (data.published !== true) {
    console.log(`Essay with slug '${slug}' found but not published.`); // Optional logging
    notFound(); // Return 404 if not explicitly published
  }

  // Get all essays for prev/next navigation
  const allEssays = getAllEssays();

  // Find the current post index
  const currentIndex = allEssays.findIndex(
    (essay) => essay.slug === slug
  );

  // Get previous and next posts (previous = older, next = newer)
  const prevPost =
    currentIndex > 0
      ? {
          title: allEssays[currentIndex - 1].title,
          href: `/garden/essays/${allEssays[currentIndex - 1].slug}`,
        }
      : undefined;

  const nextPost =
    currentIndex < allEssays.length - 1
      ? {
          title: allEssays[currentIndex + 1].title,
          href: `/garden/essays/${allEssays[currentIndex + 1].slug}`,
        }
      : undefined;

  return (
    <>
      <ScrollProgress
        color="bg-steelBlue"
        height={3}
        glow={true}
        glowColor="rgba(var(--steelBlue), 0.6)"
        glowIntensity="12px"
      />
      <div className="max-w-2xl w-full mx-auto animate-fade-in pt-10 sm:pt-16">
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
          <EssayMarkdownWrapper content={content} />
        </div>

        <Replies page={`essays/${slug}`} title={data.title || slug} />
        <PrevNext prev={prevPost} next={nextPost} />
      </div>
    </>
  );
}
