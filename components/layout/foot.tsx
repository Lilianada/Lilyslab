import {
    Flower,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Rss,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Foot() {
  return (
    <footer className="bg-card rounded-lg text-gray-800 dark:text-gray-200 py-4 px-6">
      <div className="container mx-auto text-center">
        <Link href="/misc" className="text-xs hover:text-zinc-400 underline">
          Misc
        </Link>{" "}
        <span className="mx-2">|</span>
        <Link href="/guestbook" className="text-xs hover:text-zinc-400 underline">
          Guestbook
        </Link>{" "}
        <span className="mx-2">|</span>
        <Link href="/colophon" className="text-xs hover:text-zinc-400 underline">
          Colophon
        </Link>{" "}
        <span className="mx-2">|</span>
        <Link href="/sitemap" className="text-xs hover:text-zinc-400 underline">
          Sitemap
        </Link>{" "}
        <span className="mx-2">|</span>
        <Link href="/changelog" className="text-xs hover:text-zinc-400 underline">
          Changelog
        </Link>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="/feed.xml" className="hover:text-zinc-400">
            <Rss className="h-3 w-3 inline-block" />   
          </a>
          <a
            href="mailto:hello.lilysgarden@gmail.com"
            className="hover:text-zinc-400"
          >
            <Mail className="h-3 w-3 inline-block" />
          </a>
          <a
            href="https://github.com/lilianada"
            className="hover:text-zinc-400"
          >
            <Github className="h-3 w-3 inline-block" />
          </a>
          <a
            href="https://www.linkedin.com/in/lilianada/"
            className="hover:text-zinc-400"
          >
            <Linkedin className="h-3 w-3 inline-block" />
          </a>
          <a
            href="https://www.instagram.com/defitcreative/"
            className="hover:text-zinc-400"
          >
            <Instagram className="h-3 w-3 inline-block" />
          </a>
          <a
            href="https://twitter.com/lilian_ada_"
            className="hover:text-zinc-4">
            <Twitter className="h-3 w-3 inline-block" />
          </a>
        </div>
        <div className="mt-2 text-xs">
         
           Updated on June 11, 2025 at 13:56 PM
        </div>
        <span>
            <Flower className="inline-block h-3 w-3 text-primary" />
        </span>
      </div>
    </footer>
  );
}
