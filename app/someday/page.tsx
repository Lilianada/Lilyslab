import { Footer } from "@/components/footer";
import Link from "next/link";
import React from "react";

export default function SomedayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 ">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Someday</h1>
        <p className="text-sm text-zinc-500">Somebody, something, somewhere, someday.</p>
      </header>
      <div className="">
      <div className="prose prose-sm dark:prose-invert max-w-lg">
        <p>This page is still under construction. Check back later for content about future plans and aspirations.</p>

        <p>
          In the mean time, you check out these other pages
          <ul className="text-sm ">
            <li><Link href="/writing">Writing 📝</Link></li>
            <li><Link href="/digital-garden/notes">Notes ❤️</Link></li>
            <li><Link href="/digital-garden/bookmarks">Bookmarks 📚</Link></li>
            <li><Link href="/digital-garden/bucket-list">Bucket List 📝</Link></li>
            <li><Link href="/digital-garden/bookshelf">Bookshelf 📚</Link></li>
            <li><Link href="/workshop/projects">Projects 🏗️</Link></li>
            <li><Link href="/workshop/logs">Logs 📝</Link></li>
            <li><Link href="/workshop/tools">Tools 🛠️</Link></li>
            <li><Link href="/workshop/resources">Resources 📚</Link></li>
            <li><Link href="/playground/calculator">Calculator 📊</Link></li>
            <li><Link href="/playground/note-widgets">Note Widgets 📝</Link></li>
            <li><Link href="/colophon">Colophon 📝</Link></li>
          </ul>
        </p>
      </div>

      </div>

      <Footer
        inspirationName="Alexander Sandberg"
        inspirationUrl="https://alexandersandberg.com/someday/"
        pageName="my someday page" 
        color="text-extra-peach"
      />
    </div>
  );
}
