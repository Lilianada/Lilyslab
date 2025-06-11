'use client';

import Link from "next/link";

export function TopicsList() {
  return (
    <div className="py-2">
      <h3 className="text-sm font-medium mb-3">Here are a few of my favourite seedlings:</h3>
      
      <ol className="space-y-1.5 list-decimal pl-6">
        <li className="flex items-start justify-between gap-2">
          <Link href="/garden/writings/digital-minimalism" className="text-primary dark:text-codeRed hover:underline">
            Digital Minimalism
          </Link>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2025-06-11</span>
        </li>
        <li className="flex items-start justify-between gap-2">
          <Link href="/garden/writings/personal-knowledge-management" className="text-primary dark:text-codeRed hover:underline">
            Personal Knowledge Management
          </Link>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2025-06-08</span>
        </li>
        <li className="flex items-start justify-between gap-2">
          <Link href="/garden/writings/digital-garden" className="text-primary dark:text-codeRed hover:underline">
            Digital Garden
          </Link>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2025-05-27</span>
        </li>
        <li className="flex items-start justify-between gap-2">
          <Link href="/garden/writings/how-i-take-my-notes" className="text-primary dark:text-codeRed hover:underline">
            How I Take My Notes
          </Link>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2025-05-15</span>
        </li>
      </ol>
    </div>
  );
}
