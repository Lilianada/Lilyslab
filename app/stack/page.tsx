"use client"

import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Define types for clarity (should match API response structure)
interface StackItem {
  name: string;
  description: string;
  url: string;
  // Add other fields if returned by the API
}

interface Category {
  name: string;
  items: StackItem[];
}

// Removed the hardcoded categories array

export default function StackPage() {
  const [isLoaded, setIsLoaded] = useState(false) // For initial fade-in animation
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from the API route
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/stack");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch stack data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching stack data:", error);
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the animation of children
      },
    },
  };

  const itemVariants = {
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
    <div className={`max-w-xl mx-auto py-12 px-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">My Stack</h1>
        <p className="text-muted-foreground text-sm">Tools, apps, and services I use daily.</p>
      </header>

      {/* Conditional Rendering based on state */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : error ? (
        <div className="text-center py-8 border border-destructive/50 bg-destructive/10 rounded-lg">
          <p className="text-red-500 mb-2">Error loading stack</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : categories.length === 0 ? (
         <div className="text-center py-8 border rounded-lg">
           <p className="text-muted-foreground text-sm">No stack items found.</p>
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
                    className="group block rounded-lg border p-4 transition-colors duration-200 hover:border-primary/50 hover:bg-card" // Adjusted hover bg/border
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium group-hover:text-primary text-sm transition-colors duration-200">{item.name}</h3>
                      {/* Updated ExternalLink styling */}
                      <ExternalLink
                        size={16}
                        className="text-muted-foreground transition-transform transition-colors duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      )}
    </div>
  )
}
