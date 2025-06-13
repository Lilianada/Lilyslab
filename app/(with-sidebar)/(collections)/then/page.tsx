"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";

interface ThenEntry {
  slug: string;
  title: string;
  createdAt: string;
}

export default function ThenPage() {
  const [entries, setEntries] = useState<ThenEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadThenEntries() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/then");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        console.error("Failed to load Then entries:", err);
        const message = err instanceof Error ? err.message : "Failed to load entries.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadThenEntries();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      }
    }
  };

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium mb-2">Then</h1>
          <p className="text-sm text-muted-foreground">
            An archive of previous "Now" pages, capturing snapshots of what I was focused on at different points in time.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 rounded-md border border-border bg-muted/30">
                <div className="h-5 bg-muted-foreground/20 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">
            {error}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No previous entries available.
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {entries.map((entry) => (
              <motion.div key={entry.slug} variants={itemVariants}>
                <Link 
                  href={`/then/${entry.slug}`}
                  className="block p-4 rounded-md border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  <p className="font-medium mb-1">{entry.title || "Untitled Entry"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <Footer />
      </div>
    </>
  );
}
