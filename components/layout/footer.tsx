"use client"

import { Separator } from "@/components/ui/separator"
import { useEffect as useFooterEffect, useState as useFooterState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Flower,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Rss,
  Twitter,
} from "lucide-react";

interface FooterProps {
  // Page credit props (all optional)
  inspirationName?: string;
  inspirationUrl?: string;
  pageName?: string;
  color?: string;
  // Navigation props (all optional)
  prevPost?: { title: string; slug: string; };
  nextPost?: { title: string; slug: string; };
  contentType?: 'writing' | 'digital-garden/notes';
}

export function Footer({
  // Page credit props
  inspirationName,
  inspirationUrl,
  pageName,
  color = "text-extra-steelBlue",
  // Navigation props
  prevPost,
  nextPost,
  contentType
}: FooterProps = {}) {
   // Use empty initial values to prevent hydration mismatch
   const [dateTime, setDateTime] = useFooterState("");
   const [location, setLocation] = useFooterState("");
   const [lastEdited, setLastEdited] = useFooterState("");
   // Add a mounted state to prevent rendering content during SSR
   const [isMounted, setIsMounted] = useFooterState(false);
 
   useFooterEffect(() => {
     // Set mounted to true once component is mounted on client
     setIsMounted(true);
     
     // Function to update date/time
     const updateTime = () => {
       const now = new Date();
       setDateTime(now.toLocaleString());
     };
   
     // Initialize and set interval for updating time
     updateTime();
     const intervalId = setInterval(updateTime, 1000);
     
     // Set a static location instead of using geolocation
     // This completely avoids the permissions policy violation
     setLocation("Lily's Garden - Digital Garden & Workshop");
     
     // Fetch the last edited date from Git commit history
     const fetchLastEdited = async () => {
       try {
         // Try to fetch from the API first
         const response = await fetch('/api/last-updated');
         if (response.ok) {
           const data = await response.json();
           console.log('API Response:', data); // Debug log             // Check if we got a valid date
           if (data.lastUpdated) {
             const lastUpdatedDate = new Date(data.lastUpdated);
             if (!isNaN(lastUpdatedDate.getTime())) {
               const formattedDate = format(lastUpdatedDate, 'MMMM d, yyyy');
               const formattedTime = format(lastUpdatedDate, 'HH:mm');
               setLastEdited(`${formattedDate} at ${formattedTime}`);
               return;
             }
           }
         } else {
           console.error('API Error:', response.status, response.statusText);
         }
         
         // Fallback to build time if API fails
         if (process.env.NEXT_PUBLIC_BUILD_TIME) {
           const buildDate = new Date(process.env.NEXT_PUBLIC_BUILD_TIME);
           const formattedBuildDate = format(buildDate, 'MMMM d, yyyy');
           const formattedBuildTime = format(buildDate, 'HH:mm');
           setLastEdited(`${formattedBuildDate} at ${formattedBuildTime}`);
         } 
       } catch (error) {
         console.error('Error fetching last edited date:', error);
         // Don't show any error to the user, just don't display the date
       }
     };
     
     fetchLastEdited();
   
     // Cleanup function to clear interval
     return () => clearInterval(intervalId);
   }, []);
   
   // Only render the content on the client side
   if (!isMounted) {
     return <footer className="py-4 text-xs text-left text-secondary"></footer>;
   }
   
  return (
    <footer className="mt-auto w-full">
      {/* Previous/Next Post Navigation */}
      {(prevPost || nextPost) && (
        <div className="flex flex-row justify-between items-center gap-4 mb-8 w-full">
          {prevPost ? (
            <Link 
              href={`/${contentType}/${prevPost.slug}`}
              className="flex items-center text-sm hover:text-primary transition-colors p-2 w-auto justify-start"
            >
              <span className="mr-2">←</span>
              <span className="truncate">Prev</span>
            </Link>
          ) : <div className="w-full sm:w-auto"></div>}
          
          {nextPost && (
            <Link 
              href={`/${contentType}/${nextPost.slug}`}
              className="flex items-center text-sm hover:text-primary transition-colors p-2 w-auto justify-end"
            >
              <span className="truncate">Next</span>
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      )}

      {(prevPost || nextPost) && <Separator className="my-6" />}

      <div className="mt-12 bg-card rounded-lg text-gray-800 dark:text-gray-200 py-4 px-6">
        <div className="container mx-auto text-center">
          <Link href="/misc" className="text-xs hover:text-zinc-400 underline">
            Misc
          </Link>{" "}
          <span className="mx-2">|</span>
          <Link href="/guestbook" className="text-xs hover:text-zinc-400 underline">
            Guestbook
          </Link>{" "}
          <span className="mx-2">|</span>
          <Link href="/colophon" className="text-xs hover:text-zinc-400 underline">
            Colophon
          </Link>{" "}
          <span className="mx-2">|</span>
          <Link href="/sitemap" className="text-xs hover:text-zinc-400 underline">
            Sitemap
          </Link>{" "}
          <span className="mx-2">|</span>
          <Link href="/changelog" className="text-xs hover:text-zinc-400 underline">
            Changelog
          </Link>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="/feed.xml" className="hover:text-zinc-400">
              <Rss className="h-3 w-3 inline-block" />   
            </a>
            <a
              href="mailto:hello.lilysgarden@gmail.com"
              className="hover:text-zinc-400"
            >
              <Mail className="h-3 w-3 inline-block" />
            </a>
            <a
              href="https://github.com/lilianada"
              className="hover:text-zinc-400"
            >
              <Github className="h-3 w-3 inline-block" />
            </a>
            <a
              href="https://www.linkedin.com/in/lilianada/"
              className="hover:text-zinc-400"
            >
              <Linkedin className="h-3 w-3 inline-block" />
            </a>
            <a
              href="https://www.instagram.com/defitcreative/"
              className="hover:text-zinc-400"
            >
              <Instagram className="h-3 w-3 inline-block" />
            </a>
            <a
              href="https://twitter.com/lilian_ada_"
              className="hover:text-zinc-400">
              <Twitter className="h-3 w-3 inline-block" />
            </a>
          </div>
          <div className="mt-2 text-xs">
            {lastEdited && `Updated on ${lastEdited}`}
          </div>
          <span>
            <Flower className="inline-block h-3 w-3 text-primary" />
          </span>
        </div>
      </div>
    </footer>
  )
}
