"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MarkdownRenderer } from "@/components/markdown";

// Microblog interface
interface Microblog {
  id: string;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  liked?: boolean;
}

export default function MicroblogPage() {
  const [microblogs, setMicroblogs] = useState<Microblog[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Local storage key for liked microblogs
  const LIKED_MICROBLOGS_KEY = 'liked_microblogs';

  // Initialize
  useEffect(() => {
    setMounted(true);
    
    // Load initial microblogs
    fetchMicroblogs();
    
    // Load liked microblogs from localStorage
    const likedMicroblogsFromStorage = getLikedMicroblogsFromStorage();
    
    // Function to load liked state into microblogs
    const setLikedState = (microblogs: Microblog[]) => {
      return microblogs.map(microblog => ({
        ...microblog,
        liked: likedMicroblogsFromStorage.includes(microblog.id)
      }));
    };
    
    // Update microblogs with liked state when they change
    setMicroblogs(prevMicroblogs => setLikedState(prevMicroblogs));
  }, []);

  // Get liked microblogs from localStorage
  const getLikedMicroblogsFromStorage = (): string[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(LIKED_MICROBLOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  // Save liked microblogs to localStorage
  const saveLikedMicroblogsToStorage = (likedMicroblogs: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LIKED_MICROBLOGS_KEY, JSON.stringify(likedMicroblogs));
  };

  // Fetch microblogs from API
  const fetchMicroblogs = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/micro-blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch microblogs');
      }
      
      const data: Microblog[] = await response.json();
      
      // Apply liked state from localStorage
      const likedMicroblogsFromStorage = getLikedMicroblogsFromStorage();
      const microblogsWithLikedState = data.map(microblog => ({
        ...microblog,
        liked: likedMicroblogsFromStorage.includes(microblog.id)
      }));
      
      setMicroblogs(microblogsWithLikedState);
      setHasMore(data.length >= 10); // If we have less than 10 microblogs, we've reached the end
    } catch (error) {
      console.error('Error fetching microblogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          loadMoreMicroblogs();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loading, hasMore]);

  // Load more microblogs (we don't have pagination yet in the API, this is a placeholder)
  const loadMoreMicroblogs = () => {
    // Currently the API doesn't support pagination, so we're not loading more microblogs
    // This is left as a placeholder for when pagination is added
    setPage(prevPage => prevPage + 1);
    setHasMore(false); // For now, we'll always set this to false since we load all microblogs at once
  };

  // Format date for display
  const formatMicroblogDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      // Handle cases where date might be in a different format
      return dateString;
    }
  };

  // Handle like/unlike with persistent storage
  const toggleLike = async (id: string) => {
    // Get current liked state from microblogs
    const microblog = microblogs.find(m => m.id === id);
    if (!microblog) return;
    
    const currentlyLiked = microblog.liked || false;
    const newLikedState = !currentlyLiked;
    
    // Update local state first (optimistic update)
    setMicroblogs(prevMicroblogs =>
      prevMicroblogs.map(microblog =>
        microblog.id === id
          ? {
              ...microblog,
              liked: newLikedState,
              likeCount: newLikedState ? microblog.likeCount + 1 : Math.max(0, microblog.likeCount - 1)
            }
          : microblog
      )
    );
    
    // Update localStorage
    const likedMicroblogs = getLikedMicroblogsFromStorage();
    let updatedLikedMicroblogs: string[];
    
    if (newLikedState) {
      updatedLikedMicroblogs = [...likedMicroblogs, id];
    } else {
      updatedLikedMicroblogs = likedMicroblogs.filter(microblogId => microblogId !== id);
    }
    
    saveLikedMicroblogsToStorage(updatedLikedMicroblogs);
    
    // Update the server
    try {
      const response = await fetch('/api/micro-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: newLikedState ? 'like' : 'unlike'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update like count');
      }
      
      // We could get the updated count from the server response if needed
    } catch (error) {
      console.error('Error updating like count:', error);
      // Revert optimistic update if server update fails
      setMicroblogs(prevMicroblogs =>
        prevMicroblogs.map(microblog =>
          microblog.id === id
            ? {
                ...microblog,
                liked: currentlyLiked,
                likeCount: currentlyLiked ? microblog.likeCount : microblog.likeCount - 1
              }
            : microblog
        )
      );
      
      // Also revert localStorage
      saveLikedMicroblogsToStorage(likedMicroblogs);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ScrollProgress
        color="bg-primary"
        height={3}
        glow={true}
        glowColor="rgba(var(--primary), 0.6)"
        glowIntensity="12px"
      />
      <div className="min-h-screen py-12 px-4 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Micro-blog</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-15</div>
            <div>Last updated: 2025-06-13</div>
            <div>Inspired by: <a href="https://fromemily.com/feedbackless-feed/" className="text-extra-paleYellow hover:underline">FromEmily</a></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Short-form thoughts and musings that don't warrant a full essay.
          </p>
          </header>

            {/* Microblogs Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border"
              style={{ transform: 'translateX(-50%)' }}
            ></div>

            {/* Microblogs */}
            <div className="space-y-12 relative">
              {microblogs.length === 0 && !loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No microblogs found. Check back soon!</p>
                </div>
              ) : null}
              {microblogs.map((microblog, index) => (
                <motion.div 
                  key={microblog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: Math.min(index * 0.1, 1) // Cap delay at 1 second
                  }}
                  className="relative"
                >
                  {/* Microblog connector dot */}
                  <div 
                    className={`absolute left-1/2 top-0 w-4 h-4 rounded-full border-2 z-10
                    ${microblog.liked 
                      ? "bg-primary border-primary" 
                      : "bg-background border-border hover:border-primary transition-colors duration-300"
                    }`}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  ></div>

                  {/* Microblog card */}
                  <div 
                    className={`relative w-full ${
                      index % 2 === 0 ? 'ml-auto pr-4 sm:pr-0' : 'mr-auto pl-4 sm:pl-0'
                    } pt-6`}
                  >
                    <div 
                      className="p-5 rounded-xl shadow-sm border border-dashed border-border bg-card hover:shadow-md transition-all duration-300 text-[14px] hover:border-primary/40 font-nitti"
                    >
                      <div className="text-sm text-muted-foreground mb-3">
                        {formatMicroblogDate(microblog.date)}
                      </div>
                      
                      <div className="mb-4 leading-relaxed">
                        <MarkdownRenderer 
                          content={microblog.content}
                          className="[&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:mb-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80 [&_strong]:font-medium"
                        />
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-end">
                        {/* Tags removed as requested */}
                        
                        <button 
                          onClick={() => toggleLike(microblog.id)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors
                          ${microblog.liked 
                            ? "text-red-500 dark:text-red-400" 
                            : "text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                          }`}
                          aria-label={microblog.liked ? "Unlike" : "Like"}
                        >
                          <Heart size={12} className={microblog.liked ? "fill-red-500 dark:fill-red-400" : ""} />
                          <span>{microblog.likeCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator / Load more reference */}
              <div 
                ref={loadMoreRef} 
                className="h-20 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin"></div>
                    <span className="ml-3 text-sm text-muted-foreground">Loading more microblogs...</span>
                  </div>
                ) : (
                  <div className="h-5 w-5 bg-border rounded-full mx-auto"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}