"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, FileText, BookOpen, Filter } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Button } from "@/components/ui/button";

// Interface for the archive item data
interface ArchiveItem {
  slug: string;
  title: string;
  category: "writings" | "notes";
  createdAt?: string;
}

export default function ArchivesPage() {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "writings" | "notes">("all");

  useEffect(() => {
    async function loadArchiveItems() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/archives");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArchiveItems(data.items);
      } catch (err) {
        console.error("Failed to load archive items:", err);
        const message = err instanceof Error ? err.message : "Failed to load archive items.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadArchiveItems();
  }, []);

  const renderLoading = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-full bg-muted rounded"></div>
      <div className="h-8 w-full bg-muted rounded"></div>
      <div className="h-8 w-full bg-muted rounded"></div>
      <div className="h-8 w-full bg-muted rounded"></div>
      <div className="h-8 w-full bg-muted rounded"></div>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">
      {error}
    </div>
  );

  // Filter items based on selected category
  const filteredItems = filter === "all" 
    ? archiveItems 
    : archiveItems.filter(item => item.category === filter);

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div className="container max-w-3xl mx-auto p-4 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-medium mb-2">Archives</h1>
          <p className="text-sm text-muted-foreground mb-6">
            An archive of my previous writings and notes from before June 2025.
          </p>

          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="text-xs font-mono"
            >
              <Filter className="mr-1 h-3 w-3" />
              All
            </Button>
            <Button
              size="sm"
              variant={filter === "writings" ? "default" : "outline"}
              onClick={() => setFilter("writings")}
              className="text-xs font-mono"
            >
              <FileText className="mr-1 h-3 w-3" />
              Writings
            </Button>
            <Button
              size="sm"
              variant={filter === "notes" ? "default" : "outline"}
              onClick={() => setFilter("notes")}
              className="text-xs font-mono"
            >
              <BookOpen className="mr-1 h-3 w-3" />
              Notes
            </Button>
          </div>
        </header>

        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No archived items found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm font-mono">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-16 border-r border-border">
                    S/N
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-24">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item.category}-${item.slug}`}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-muted-foreground text-xs border-r border-border">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      <Link 
                        href={`/garden/archives/${item.category}/${item.slug}`}
                        className="hover:underline hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                        item.category === 'writings' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {item.category === 'writings' ? (
                          <FileText className="mr-1 h-3 w-3" />
                        ) : (
                          <BookOpen className="mr-1 h-3 w-3" />
                        )}
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Footer />
      </div>
    </>
  );
}
