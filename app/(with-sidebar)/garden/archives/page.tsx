"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, BookOpen, Filter } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Button } from "@/components/ui/button";

// Format date as YYYY-MM-DD
const formatArchiveDate = (dateString?: string) => {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return "—";
  }
};

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
    <div className="container max-w-3xl mx-auto py-8">
      <ScrollProgress />
      
      <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Archives</h1>
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: June 13, 2025</div>
          <div>Last updated: ✳︎✳︎✳︎</div>
          <div>Inspired by: ✳︎✳︎✳︎</div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          A collection of archived notes and writings from previous iterations of this site.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
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
      </div>

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
                <th className="px-3 py-2 text-left font-medium text-muted-foreground border-r border-border">
                  Title
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground w-28 border-r border-border">
                  Date
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
                  <td className="px-3 py-2.5 text-xs border-r border-border">
                    <Link 
                      href={`/garden/archives/${item.category}/${item.slug}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground border-r border-border">
                    {formatArchiveDate(item.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {item.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
