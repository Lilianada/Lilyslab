import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react";

interface FooterProps {
  prevPost?: { title: string; slug: string };
  nextPost?: { title: string; slug: string };
  contentType?: "garden/essays" | "garden/notes";
}

function formatBuildTimeUTC(buildTime: string) {
  const date = new Date(buildTime);
  if (Number.isNaN(date.getTime())) return buildTime;

  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year} at ${hours}:${minutes} UTC`;
}

export function Footer({ prevPost, nextPost, contentType }: FooterProps = {}) {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

  const formattedDate = buildTime ? formatBuildTimeUTC(buildTime) : null;

  return (
    <footer className="mt-auto w-full font-nitti">
      {(prevPost || nextPost) && (
        <div className="flex flex-row justify-between items-center gap-4 mb-8 w-full">
          {prevPost ? (
            <Link
              href={`/${contentType}/${prevPost.slug}`}
              className="flex items-center text-sm hover:text-primary transition-colors p-2 w-auto justify-start"
            >
              <span className="mr-2">←</span>
              <span className="truncate">Prev</span>
            </Link>
          ) : (
            <div className="w-full sm:w-auto"></div>
          )}

          {nextPost && (
            <Link
              href={`/${contentType}/${nextPost.slug}`}
              className="flex items-center text-sm hover:text-primary transition-colors p-2 w-auto justify-end"
            >
              <span className="truncate">Next</span>
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      )}

      {(prevPost || nextPost) && <Separator className="my-6" />}

      <div className="mt-12 bg-card border-border text-gray-800 dark:text-gray-200 py-6 px-4 sm:px-6">
        <div className="sm:container mx-auto text-center">
          <div className="space-y-2">
            <div className="text-xs">
              <Link href="/webrings" className="hover:text-zinc-400 underline">
                Webrings
              </Link>{" "}
              <span className="mr-2">•</span>
              <Link href="/guestbook" className="hover:text-zinc-400 underline">
                Guestbook
              </Link>{" "}
              <span className="mr-2">•</span>
              <Link href="/colophon" className="hover:text-zinc-400 underline">
                Colophon
              </Link>{" "}
              <span className="mr-2">•</span>
              <Link href="/sitemap" className="hover:text-zinc-400 underline">
                Sitemap
              </Link>{" "}
              <span className="mr-2">•</span>
              <Link href="/changelog" className="hover:text-zinc-400 underline">
                Changelog
              </Link>
            </div>

            {formattedDate && (
              <div className="text-xs text-muted-foreground">
                Last updated on {formattedDate}
              </div>
            )}

            <div className="text-xs">
              © 2025{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                className="hover:text-primary"
              >
                CC BY-NC-SA 4.0 license.
              </a>
            </div>

            <div className="flex justify-center space-x-4">
              <a href="/feed.xml" className="hover:text-zinc-400">
                <Rss className="h-3 w-3" />
              </a>

              <a
                href="mailto:hello.lilysgarden@gmail.com"
                className="hover:text-zinc-400"
              >
                <Mail className="h-3 w-3" />
              </a>

              <a
                href="https://github.com/lilianada"
                className="hover:text-zinc-400"
              >
                <Github className="h-3 w-3" />
              </a>

              <a
                href="https://www.linkedin.com/in/lilianada/"
                className="hover:text-zinc-400"
              >
                <Linkedin className="h-3 w-3" />
              </a>

              <a
                href="https://twitter.com/lilian_ada_"
                className="hover:text-zinc-400"
              >
                <Twitter className="h-3 w-3" />
              </a>
            </div>

            <div className="text-xs">✳︎ ✳︎ ✳︎</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
