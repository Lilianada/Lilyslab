"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";

// Thread interface
interface Thread {
  id: string;
  content: string;
  date: string;
  likes: number;
  liked: boolean;
  tags?: string[];
}

// Mock data for threads
const mockThreads: Thread[] = [
  {
    id: "t1",
    content: "Just shipped a new feature for my digital garden: a threads page where I can post short thoughts and musings. It's like a micro-blog within my site!",
    date: "2025-06-10T09:15:00Z",
    likes: 12,
    liked: false,
    tags: ["webdev", "design"]
  },
  {
    id: "t2",
    content: "Been thinking about the balance between creating and consuming content. Trying to spend more time making things rather than endlessly scrolling. Been thinking about the balance between creating and consuming content. Trying to spend more time making things rather than endlessly scrolling. Been thinking about the balance between creating and consuming content. Trying to spend more time making things rather than endlessly scrolling.",
    date: "2025-06-08T14:22:00Z",
    likes: 8,
    liked: true,
    tags: ["reflection"]
  },
  {
    id: "t3",
    content: "CSS Grid and custom properties have completely transformed how I build layouts. I remember the days of float-based designs and it's amazing how far we've come.",
    date: "2025-06-05T19:34:00Z",
    likes: 15,
    liked: false,
    tags: ["css", "webdev"]
  },
  {
    id: "t4",
    content: "Reading 'Designing for the Digital Age' by Kim Goodwin. So many timeless UX principles that apply regardless of the technology stack.",
    date: "2025-06-03T08:12:00Z",
    likes: 6,
    liked: false
  },
  {
    id: "t5",
    content: "Personal websites are such an underrated form of expression. They're like digital homes we can design however we want, without algorithms or engagement metrics dictating our choices.",
    date: "2025-05-29T11:45:00Z",
    likes: 24,
    liked: true,
    tags: ["indieweb"]
  },
  {
    id: "t6",
    content: "Just discovered the 'prefers-reduced-motion' media query. Accessibility should never be an afterthought in our designs.",
    date: "2025-05-25T16:08:00Z",
    likes: 9,
    liked: false,
    tags: ["a11y", "css"]
  },
  {
    id: "t7",
    content: "There's something special about writing HTML by hand. It keeps me connected to the foundations of the web in a way that abstractions sometimes don't.",
    date: "2025-05-22T13:19:00Z",
    likes: 17,
    liked: false,
    tags: ["html", "webdev"]
  },
  {
    id: "t8",
    content: "Spent the weekend redesigning my digital garden. Focused on improving typography and reading experience. Small changes that make a big difference.",
    date: "2025-05-18T20:41:00Z",
    likes: 11,
    liked: true,
    tags: ["design", "typography"]
  },
  {
    id: "t9",
    content: "The best designs are often the ones that don't draw attention to themselves but quietly support the content and functionality.",
    date: "2025-05-15T10:27:00Z",
    likes: 19,
    liked: false,
    tags: ["design"]
  },
  {
    id: "t10",
    content: "Starting this threads section as an experiment in casual, chronological thought-sharing. Sometimes I have ideas that aren't quite blog posts but deserve more permanence than social media.",
    date: "2025-05-10T15:33:00Z",
    likes: 31,
    liked: true,
    tags: ["meta"]
  }
];

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Initialize
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
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
  }, [loading]);

  // Simulate loading more threads
  const loadMoreThreads = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create copies of existing threads with new IDs to simulate new content
      const newThreads = mockThreads.map((thread, index) => ({
        ...thread,
        id: `additional-${Date.now()}-${index}`,
        date: new Date(new Date(thread.date).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days earlier
        likes: Math.floor(Math.random() * 30),
        liked: Math.random() > 0.5
      }));
      
      setThreads(prevThreads => [...prevThreads, ...newThreads]);
      setLoading(false);
    }, 1500);
  };

  // Format date for display
  const formatThreadDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  // Handle like/unlike
  const toggleLike = (id: string) => {
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === id
          ? {
              ...thread,
              liked: !thread.liked,
              likes: thread.liked ? thread.likes - 1 : thread.likes + 1
            }
          : thread
      )
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Threads</h1>
          <p className="text-muted-foreground text-sm">
            A feedbackless feed, got the inspiration for this page <a href="https://fromemily.com/feedbackless-feed/" className="text-extra-paleYellow">From Emily's</a> own feedbackless feed page. These are random thoughts that I might or might not have also shared on Twitter.
          </p>
        </header>

        {/* Threads Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent"
            style={{ transform: 'translateX(-50%)' }}
          ></div>

          {/* Threads */}
          <div className="space-y-8 relative">
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
                  className={`absolute left-1/2 top-0 w-3 h-3 rounded-full border-2 
                  ${thread.liked 
                    ? "bg-accent border-accent" 
                    : "bg-background border-accent/60"
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
                    className="p-5 rounded-xl shadow-sm border border-dashed border-border bg-card hover:shadow-md transition-shadow duration-300 font-mono"
                  >
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatThreadDate(thread.date)}
                    </div>
                    
                    <p className="mb-4">{thread.content}</p>
                    
                    <div className="flex flex-wrap items-center justify-between">
                      {thread.tags && (
                        <div className="flex flex-wrap gap-2">
                          {thread.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex text-xs px-2 py-1 rounded-full bg-accent/10 text-accent/80"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
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
                        <span>{thread.likes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Connecting line to timeline */}
                  <div 
                    className={`absolute top-6 ${
                      index % 2 === 0 
                        ? 'left-0 right-auto border-t border-dashed border-accent/30 w-[calc(50%-6px)]' 
                        : 'right-0 left-auto border-t border-dashed border-accent/30 w-[calc(50%-6px)]'
                    }`}
                    style={{ top: '1.5rem' }}
                  ></div>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Loading more threads...</span>
                </div>
              ) : (
                <div className="h-5 w-5 bg-accent/20 rounded-full mx-auto"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}