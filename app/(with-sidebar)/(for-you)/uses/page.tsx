"use client"

import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, Variants } from "framer-motion"
import { ScrollProgress } from "@/components/ui/scroll-progress";

// Define types for clarity (should match API response structure)
interface UsesItem {
  name: string;
  description: string;
  url: string;
}

interface Category {
  name: string;
  items: UsesItem[];
}


export default function UsesPage() {
  const [isLoaded, setIsLoaded] = useState(false) 
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from the API route
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/uses");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch uses data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching uses data:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
        // Trigger fade-in animation after loading is complete (whether success or error)
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [])

  // Animation variants for loading items
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the animation of children
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // Use spring for bounce effect
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Helper function to render loading skeleton with animation
  const renderLoadingSkeleton = () => (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[1, 2, 3].map(i => ( // Simulate 3 categories loading
        <motion.section key={i} variants={itemVariants}>
          <div className="h-6 w-1/3 bg-muted rounded mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {/* Adjust height to better match actual item size */}
            <div className="h-20 bg-muted rounded animate-pulse"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
          </div>
        </motion.section>
      ))}
    </motion.div>
  );

  return (
    <>
     <ScrollProgress
            color="bg-extra-peach"
            height={3}
            glow={true}
            glowColor="rgba(var(--extra-peach), 0.6)"
            glowIntensity="12px"
          />
    <div className={`max-w-2xl w-full mx-auto sm:px-4 pt-16 pb-8 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Uses</h1>
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: 2025-04-05</div>
          <div>Last updated: 2025-06-13</div>
          <div>Inspired by: uses.tech</div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Tools, apps, and services I use daily.</p>
      </header>

      {/* Conditional Rendering based on state */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : error ? (
        <div className="text-center py-8 border border-destructive/50 bg-destructive/10 rounded-lg">
          <p className="text-red-500 mb-2">Error loading uses data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : categories.length === 0 ? (
         <div className="text-center py-8 border rounded-lg">
           <p className="text-muted-foreground text-sm">No items found.</p>
         </div>
      ) : (
        <motion.div // Wrap categories list for potential stagger animation
          className="space-y-12"
          variants={containerVariants} // Reuse container variants
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.section key={category.name} variants={itemVariants} // Apply item variants to each section
            >
              <h2 className="mb-4 text-base font-medium">{category.name}</h2>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border p-4 transition-colors duration-200 hover:border-extra-peach/50 hover:bg-card" // Adjusted hover bg/border
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium group-hover:text-extra-peach text-sm transition-colors duration-200">{item.name}</h3>
                      {/* Updated ExternalLink styling */}
                      <ExternalLink
                        size={16}
                        className="text-muted-foreground transition-colors duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-extra-peach"
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground group-hover:text-extra-peach">{item.description}</p>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      )}
    </div>
    </>
  )
}
