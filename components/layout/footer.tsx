"use client"

import { Separator } from "@/components/ui/separator"
import { useEffect as useFooterEffect, useState as useFooterState } from "react";
import { format } from "date-fns";
import Link from "next/link";

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
           console.log('API Response:', data); // Debug log
           
           // Check if we got a valid date
           if (data.lastUpdated) {
             const lastUpdatedDate = new Date(data.lastUpdated);
             if (!isNaN(lastUpdatedDate.getTime())) {
               const formattedDate = format(lastUpdatedDate, 'MMMM d, yyyy');
               setLastEdited(formattedDate);
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
           setLastEdited(formattedBuildDate);
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

      <Separator className="my-6" />
      
      {/* Page Credit (if provided) */}
      {inspirationName && inspirationUrl && (
        <p className="text-xs text-muted-foreground/60 ">
          Credit to <a href={inspirationUrl} className={`${color} hover:underline`} target="_blank" rel="noopener noreferrer">{inspirationName}</a> for the inspiration behind {pageName || 'this page'}. 
        </p>
      )}
      
      <p className="text-xs text-muted-foreground/60">
        Subscribe to my <a href='/feed' className="text-extra-steelBlue hover:underline" target="_blank" rel="noopener noreferrer">RSS Feed</a> for the latest updates. I have a <a href='/guestbook' className="text-extra-steelBlue hover:underline">/guestbook page</a> you should defintiely checkout. You can also <a href="https://www.buymeacoffee.com/lilian.ada" className="text-extra-steelBlue hover:underline" target="_blank" rel="noopener noreferrer">buy me a coffee</a> if you find my content interesting or helpful. 
      </p>
      <div className="mt-4">
        <span className="block text-xs text-muted-foreground/60">Currently: {dateTime}</span>
        {lastEdited && (
          <span className="block text-xs text-muted-foreground/60">Last updated: {lastEdited}</span>
        )}
        {/* <span className="block text-xs text-muted-foreground/60">Location: {location}</span> */}
      </div>
    </footer>
  )
}
