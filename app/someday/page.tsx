import { PageCredit } from "@/components/page-credit";
import React from "react";

export default function SomedayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Someday</h1>
        <p className="text-sm text-zinc-500">Somebody, something, somewhere, someday.</p>
      </header>
      <div className="prose prose-sm dark:prose-invert max-w-lg">
        <p>This page is under construction. Check back later for content about future plans and aspirations.</p>
      </div>
      <PageCredit
        inspirationName="Alexander Sandberg"
        inspirationUrl="https://alexandersandberg.com/someday/"
        pageName="my someday page" 
        color="text-extra-peach"
      />
    </div>
  );
}
