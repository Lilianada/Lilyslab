"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { ScrollProgress } from "@/components/ui/scroll-progress";

// Thread interface
interface Thread {
  id: string;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  liked?: boolean;
}

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Local storage key for liked threads
  const LIKED_THREADS_KEY = 'liked_threads';

  // Initialize
  useEffect(() => {
    setMounted(true);
    
    // Load initial threads
    fetchThreads();
    
    // Load liked threads from localStorage
    const likedThreadsFromStorage = getLikedThreadsFromStorage();
    
    // Function to load liked state into threads
    const setLikedState = (threads: Thread[]) => {
      return threads.map(thread => ({
        ...thread,
        liked: likedThreadsFromStorage.includes(thread.id)
      }));
    };
    
    // Update threads with liked state when they change
    setThreads(prevThreads => setLikedState(prevThreads));
  }, []);

  // Get liked threads from localStorage
  const getLikedThreadsFromStorage = (): string[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(LIKED_THREADS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  // Save liked threads to localStorage
  const saveLikedThreadsToStorage = (likedThreads: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LIKED_THREADS_KEY, JSON.stringify(likedThreads));
  };

  // Fetch threads from API
  const fetchThreads = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/micro-blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      
      const data: Thread[] = await response.json();
      
      // Apply liked state from localStorage
      const likedThreadsFromStorage = getLikedThreadsFromStorage();
      const threadsWithLikedState = data.map(thread => ({
        ...thread,
        liked: likedThreadsFromStorage.includes(thread.id)
      }));
      
      setThreads(threadsWithLikedState);
      setHasMore(data.length >= 10); // If we have less than 10 threads, we've reached the end
    } catch (error) {
      console.error('Error fetching threads:', error);
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
          loadMoreThreads();
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

  // Load more threads (we don't have pagination yet in the API, this is a placeholder)
  const loadMoreThreads = () => {
    // Currently the API doesn't support pagination, so we're not loading more threads
    // This is left as a placeholder for when pagination is added
    setPage(prevPage => prevPage + 1);
    setHasMore(false); // For now, we'll always set this to false since we load all threads at once
  };

  // Format date for display
  const formatThreadDate = (dateString: string) => {
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
    // Get current liked state from threads
    const thread = threads.find(t => t.id === id);
    if (!thread) return;
    
    const currentlyLiked = thread.liked || false;
    const newLikedState = !currentlyLiked;
    
    // Update local state first (optimistic update)
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === id
          ? {
              ...thread,
              liked: newLikedState,
              likeCount: newLikedState ? thread.likeCount + 1 : Math.max(0, thread.likeCount - 1)
            }
          : thread
      )
    );
    
    // Update localStorage
    const likedThreads = getLikedThreadsFromStorage();
    let updatedLikedThreads: string[];
    
    if (newLikedState) {
      updatedLikedThreads = [...likedThreads, id];
    } else {
      updatedLikedThreads = likedThreads.filter(threadId => threadId !== id);
    }
    
    saveLikedThreadsToStorage(updatedLikedThreads);
    
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
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === id
            ? {
                ...thread,
                liked: currentlyLiked,
                likeCount: currentlyLiked ? thread.likeCount : thread.likeCount - 1
              }
            : thread
        )
      );
      
      // Also revert localStorage
      saveLikedThreadsToStorage(likedThreads);
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
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Micro-blog</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-15</div>
            <div>Last updated: 2025-06-13</div>
            <div>Inspired by: Twitter/X threads</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Short-form thoughts and musings that don't warrant a full essay.
          </p>
        </header>

        <div className="min-h-screen py-12 px-4 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            {/* Threads Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div 
                className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border"
                style={{ transform: 'translateX(-50%)' }}
              ></div>

              {/* Threads */}
              <div className="space-y-12 relative">
                {threads.length === 0 && !loading ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No threads found. Check back soon!</p>
                  </div>
                ) : null}
                {threads.map((thread, index) => (
                  <motion.div 
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: Math.min(index * 0.1, 1) // Cap delay at 1 second
                    }}
                    className="relative"
                  >
                    {/* Thread connector dot */}
                    <div 
                      className={`absolute left-1/2 top-0 w-4 h-4 rounded-full border-2 z-10
                      ${thread.liked 
                        ? "bg-primary border-primary" 
                        : "bg-background border-border hover:border-primary transition-colors duration-300"
                      }`}
                      style={{ transform: 'translate(-50%, -50%)' }}
                    ></div>

                    {/* Thread card */}
                    <div 
                      className={`relative w-full sm:w-[85%] ${
                        index % 2 === 0 ? 'ml-auto pr-4 sm:pr-0' : 'mr-auto pl-4 sm:pl-0'
                      } pt-6`}
                    >
                      <div 
                        className="p-5 rounded-xl shadow-sm border border-dashed border-border bg-card hover:shadow-md transition-all duration-300 text-[14px] hover:border-primary/40 font-nitti"
                      >
                        <div className="text-sm text-muted-foreground mb-3">
                          {formatThreadDate(thread.date)}
                        </div>
                        
                        <p className="mb-4 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                        
                        <div className="flex flex-wrap items-center justify-end">
                          {/* Tags removed as requested */}
                          
                          <button 
                            onClick={() => toggleLike(thread.id)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors
                            ${thread.liked 
                              ? "text-red-500 dark:text-red-400" 
                              : "text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                            }`}
                            aria-label={thread.liked ? "Unlike" : "Like"}
                          >
                            <Heart size={12} className={thread.liked ? "fill-red-500 dark:fill-red-400" : ""} />
                            <span>{thread.likeCount}</span>
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
                      <span className="ml-3 text-sm text-muted-foreground">Loading more threads...</span>
                    </div>
                  ) : (
                    <div className="h-5 w-5 bg-border rounded-full mx-auto"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}