"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Globe,
  Link2,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function WebringsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants with proper typing for Vercel's build environment
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    },
  };

  // Define more strictly typed variants for framer-motion
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    },
  };

  // Type definitions for a webring
  type WebRing = {
    name: string;
    url: string;
    description: string;
    color: string; // color theme class
    previousUrl: string;
    randomUrl?: string;
    nextUrl: string;
  };

  // List of webrings
  const webrings: WebRing[] = [
    {
      name: "Meta Ring",
      url: "https://meta-ring.hedy.dev/",
      description: "Personal website tinkerers; those with meta pages or colophons.",
      color: "peach",
      previousUrl: "https://meta-ring.hedy.dev/previous",
      randomUrl: "https://meta-ring.hedy.dev/random",
      nextUrl: "https://meta-ring.hedy.dev/next"
    },
    {
      name: "IndieWeb",
      url: "https://indieweb.org/",
      description: "For folks adding IndieWeb building blocks to their personal websites.",
      color: "lavender",
      previousUrl: "https://xn--sr8hvo.ws/previous",
      randomUrl: undefined, // No random for IndieWeb
      nextUrl: "https://xn--sr8hvo.ws/next"
    },
    {
      name: "Bucketfish Webring",
      url: "https://webring.bucketfish.me",
      description: "A collection of personal websites and creative spaces from around the web.",
      color: "yellow",
      previousUrl: "https://webring.bucketfish.me/redirect.html?to=prev&name=Lily's Lab",
      randomUrl: "https://webring.bucketfish.me/redirect.html?to=random&name=Lily's Lab",
      nextUrl: "https://webring.bucketfish.me/redirect.html?to=next&name=Lily's Lab"
    },
    {
      name: "CSS JOY",
      url: "https://css-joy.com/",
      description: "A collection of websites celebrating the joy of CSS and creative web design.",
      color: "steelBlue",
      previousUrl: "https://css-joy.com/previous",
      randomUrl: "https://css-joy.com/random",
      nextUrl: "https://css-joy.com/next"
    },
    {
      name: "Webmaster Webring",
      url: "https://webmasterwebring.netlify.app",
      description: "A community of web developers, designers, and enthusiasts who create and maintain websites.",
      color: "green",
      previousUrl: "https://webmasterwebring.netlify.app?LilysGarden-previous",
      randomUrl: "https://webmasterwebring.netlify.app?LilysGarden-random",
      nextUrl: "https://webmasterwebring.netlify.app?LilysGarden-next"
    },
    {
      name: "GeekRing",
      url: "http://geekring.net/",
      description: "A community of geeky websites and blogs celebrating technology, coding, and all things nerdy.",
      color: "lilac",
      previousUrl: "http://geekring.net/site/NUMBER/previous",
      randomUrl: "http://geekring.net/site/NUMBER/random",
      nextUrl: "http://geekring.net/site/NUMBER/next"
    }
  ];

  // Function to get color classes based on theme color
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, hover: string, icon: string }> = {
      peach: { 
        bg: "bg-orange-50 dark:bg-orange-950/30", 
        border: "border-orange-200 dark:border-orange-800/50", 
        hover: "hover:bg-orange-100/50 dark:hover:bg-orange-900/30",
        icon: "text-orange-500 dark:text-orange-400"
      },
      lavender: { 
        bg: "bg-purple-50 dark:bg-purple-950/30", 
        border: "border-purple-200 dark:border-purple-800/50", 
        hover: "hover:bg-purple-100/50 dark:hover:bg-purple-900/30",
        icon: "text-purple-500 dark:text-purple-400" 
      },
      yellow: { 
        bg: "bg-amber-50 dark:bg-amber-950/30", 
        border: "border-amber-200 dark:border-amber-800/50", 
        hover: "hover:bg-amber-100/50 dark:hover:bg-amber-900/30",
        icon: "text-amber-500 dark:text-amber-400" 
      },
      steelBlue: { 
        bg: "bg-blue-50 dark:bg-blue-950/30", 
        border: "border-blue-200 dark:border-blue-800/50", 
        hover: "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
        icon: "text-blue-500 dark:text-blue-400" 
      },
      green: { 
        bg: "bg-emerald-50 dark:bg-emerald-950/30", 
        border: "border-emerald-200 dark:border-emerald-800/50", 
        hover: "hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30",
        icon: "text-emerald-500 dark:text-emerald-400" 
      },
      lilac: { 
        bg: "bg-violet-50 dark:bg-violet-950/30", 
        border: "border-violet-200 dark:border-violet-800/50", 
        hover: "hover:bg-violet-100/50 dark:hover:bg-violet-900/30",
        icon: "text-violet-500 dark:text-violet-400" 
      }
    };
    
    return colorMap[color] || colorMap.peach; // Default to peach if color not found
  };

  return (
    <>
      <ScrollProgress
        color="bg-lavender"
        height={3}
        glow={true}
        glowColor="rgba(var(--primary), 0.6)"
        glowIntensity="12px"
      />

      <div
        className={`container max-w-4xl mx-auto py-12 px-4 md:px-8 text-foreground ${
          isLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <header className="mb-12">
          <div className="flex flex-col mb-4">
            <h1 className="mb-1 text-xl font-medium">Webrings</h1>
            <p className="text-xs font-mono text-muted-foreground">
              Collections of like-minded websites connected in a virtual circle.
            </p>
          </div>
          <motion.div
            variants={itemVariants}
            className="mt-8"
          >
            <p className="text-sm">
              A{" "}
              <a
                href="https://en.wikipedia.org/wiki/Webring"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                webring
                <ArrowUpRight className="inline h-3 w-3 ml-1" />
              </a>{" "}
              is a collection of websites made by like-minded folks, usually
              centered around a topic, aesthetic, or common interest. Here are
              the webrings my personal website is part of. Click on the arrows
              to visit my neighbor sites on each ring. Some webrings also let
              you visit a random site part of the ring. Pick a ring and you'll
              be off!
            </p>
          </motion.div>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {webrings.map((ring, index) => {
            const colorClasses = getColorClasses(ring.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative ${colorClasses.bg} border ${colorClasses.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full bg-gradient-to-br from-transparent to-current" />
                
                <h2 className="text-xl font-medium mb-3 flex items-center relative">
                  <a
                    href={ring.url}
                    className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 group/link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ring.name}
                    <ArrowUpRight className={`h-4 w-4 opacity-70 ${colorClasses.icon} group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform`} />
                  </a>
                </h2>
                
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                  {ring.description}
                </p>
                
                <div className={`flex items-center justify-between mt-4 border-t ${colorClasses.border} pt-4`}>
                  <a
                    href={ring.previousUrl}
                    className={`text-gray-600 dark:text-gray-300 hover:${colorClasses.icon} transition-colors duration-200 p-2 rounded-full ${colorClasses.hover}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Previous site in ${ring.name}`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </a>
                  
                  {ring.randomUrl ? (
                    <a
                      href={ring.randomUrl}
                      className={`text-gray-600 dark:text-gray-300 hover:${colorClasses.icon} transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full ${colorClasses.hover}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CircleDot className="h-4 w-4 mr-1" />
                      <span className="text-sm">Random</span>
                    </a>
                  ) : (
                    <a
                      href={ring.url}
                      className={`text-gray-600 dark:text-gray-300 hover:${colorClasses.icon} transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full ${colorClasses.hover}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ring.name === "IndieWeb" ? (
                        <>
                          <Globe className="h-4 w-4 mr-1" />
                          <span className="text-sm">{ring.name} 🕸💍</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-1" />
                          <span className="text-sm">Visit</span>
                        </>
                      )}
                    </a>
                  )}
                  
                  <a
                    href={ring.nextUrl}
                    className={`text-gray-600 dark:text-gray-300 hover:${colorClasses.icon} transition-colors duration-200 p-2 rounded-full ${colorClasses.hover}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Next site in ${ring.name}`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <Footer />
      </div>
    </>
  );
}
