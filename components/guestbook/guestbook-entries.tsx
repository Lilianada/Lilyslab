"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { ExternalLink, Maximize2, Minimize2, X, Music, MapPin, Heart, Star, MessageSquare, Mail } from "lucide-react";

interface GuestbookEntry {
  id: string;
  name: string;
  url?: string;
  date: string;
  message: string;
  intro?: string;
  location?: string; 
  mood?: string; 
  song?: string;
  email?: string;
  favorite?: string; 
}

interface GuestbookEntriesProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
}

export default function GuestbookEntries({ entries, isLoading }: GuestbookEntriesProps) {
  const formatDate = (dateString: string) => {
    try {
      // Handle YYYY-MM-DD format properly
      if (dateString && dateString.length >= 10) {
        // This will work with both YYYY-MM-DD and ISO formats
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short", 
            day: "numeric",
          }).format(date);
        }
      }
      return "Unknown date";
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Unknown date";
    }
  };
  
  const generateColor = (name: string) => {
    const colorSets = [
      {
        gradient: "bg-gradient-to-r from-pink-200 to-purple-500",
        brGradient: "bg-gradient-to-br from-pink-200 to-purple-500"
      },
      {
        gradient: "bg-gradient-to-r from-blue-200 to-cyan-500",
        brGradient: "bg-gradient-to-br from-blue-200 to-cyan-500"
      },
      {
        gradient: "bg-gradient-to-r from-green-200 to-emerald-500",
        brGradient: "bg-gradient-to-br from-green-200 to-emerald-500"
      },
      {
        gradient: "bg-gradient-to-r from-yellow-200 to-orange-500",
        brGradient: "bg-gradient-to-br from-yellow-200 to-orange-500"
      },
      {
        gradient: "bg-gradient-to-r from-indigo-200 to-violet-500",
        brGradient: "bg-gradient-to-br from-indigo-200 to-violet-500"
      },
      {
        gradient: "bg-gradient-to-r from-rose-200 to-red-500",
        brGradient: "bg-gradient-to-br from-rose-200 to-red-500"
      }
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colorSets[Math.abs(hash) % colorSets.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-2 border-border rounded-md overflow-hidden shadow-md">
            {/* Browser Chrome Skeleton */}
            <div className="bg-gradient-to-r from-muted/70 to-muted/40 p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="flex space-x-1">
                  <div className="h-3 w-3 rounded-full bg-muted"></div>
                  <div className="h-3 w-3 rounded-full bg-muted"></div>
                  <div className="h-3 w-3 rounded-full bg-muted"></div>
                </div>
              </div>
              <div className="h-6 bg-muted/80 rounded-md w-full"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-2 border-border rounded-md overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-mono text-muted-foreground">guestbook.html</div>
            <div className="flex space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-siteYellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
            </div>
          </div>
          <div className="h-6 flex items-center px-2 bg-background/80 rounded-md text-xs text-muted-foreground font-mono">
            https://lilyslab.xyz/guestbook
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="mb-4">
            <span className="font-bold text-xl text-primary">⟡⟡⟡</span>
          </div>
          <p className="text-muted-foreground mb-1">
            No entries yet. Be the first to sign the guestbook!
          </p>
          <p className="text-xs font-mono text-muted-foreground/70">
            ~ waiting for your message ~
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {entries.map((entry, index) => {
        const personColor = generateColor(entry.name);
        // Calculate visitor number based on chronological order (newest first, so reverse the index)
        const visitorNumber = entries.length - index;
        
        return (
          <Card
            key={entry.id}
            className="border-2 border-border rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* ...existing code... */}
            <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-mono text-muted-foreground">{entry.name}.html</div>
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-siteYellow-400 hover:bg-siteYellow-500 transition-colors cursor-pointer" title="Minimize">
                    <Minimize2 className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="h-3 w-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" title="Maximize">
                    <Maximize2 className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" title="Close">
                    <X className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              
              {/* Browser Nav Bar - Tabs */}
              <div className="flex mb-1">
                <div className="bg-background/90 text-xs rounded-t-md px-2 py-1 font-mono border-t border-l border-r border-border/50 cursor-pointer">
                  Home
                </div>
                <div className="bg-gray-100/50 dark:bg-gray-800/30 text-xs rounded-t-md px-2 py-1 font-mono text-muted-foreground border-t border-l border-r border-border/30 mx-0.5 cursor-pointer">
                  About
                </div>
              </div>
              
              {/* Browser Address Bar */}
              <div className="h-6 flex items-center px-2 bg-background/80 rounded-md text-xs">
                <span className="text-muted-foreground font-mono mr-1">https://</span>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono hover:text-primary truncate transition-colors flex items-center"
                  >
                    {entry.url.replace(/^https?:\/\//, '')}
                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                  </a>
                ) : (
                  <span className="font-mono text-muted-foreground">lilysguest-{entry.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.xyz</span>
                )}
              </div>
            </div>
            
            {/* Website Content */}
            <div className="bg-gradient-to-b from-background to-muted/10">
              {/* Y2K Style Header/Banner - FIXED */}
              <div className={`${personColor.gradient} h-16 flex items-center justify-center p-3 overflow-hidden relative`}>
                {/* Decorative elements with higher opacity */}
                <div className="absolute inset-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute text-white text-opacity-60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 20 + 10}px`,
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    >
                      {['★', '♡', '☆', '♫', '♪'][Math.floor(Math.random() * 5)]}
                    </div>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-white drop-shadow-md z-10">
                  {entry.name}'s Page
                </h2>
              </div>
              
              <div className="p-4">
                {/* Counter & Date */}
                <div className="flex justify-between items-center mb-4">
                  <div className="px-2 py-1 bg-background/50 border border-border/50 rounded text-xs flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">visitor #{visitorNumber.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground/70 font-mono">
                    {formatDate(entry.date)}
                  </div>
                </div>

                {/* Main Layout - Simplified */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Left Column - Profile Avatar */}
                  <div className="md:col-span-1">
                    {/* Profile Box */}
                    <div className="border border-dashed border-muted-foreground/30 rounded-md p-4 bg-background/50">
                      {/* Profile Icon - Generated from name */}
                      <div className={`h-16 w-16 rounded-full ${personColor.brGradient} mx-auto flex items-center justify-center text-white font-semibold text-xl shadow-lg`}>
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="text-center mt-3">
                        <div className="text-lg font-semibold bg-gradient-to-r from-primary to-pink-500 dark:from-primary dark:to-purple-500 bg-clip-text text-transparent">
                          {entry.name}
                        </div>
                        
                        {entry.url && (
                          <div className="">
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline font-mono flex items-center justify-center gap-1"
                            >
                              visit site <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        
                       
                      </div>
                    </div>
                    
                    {/* Y2K Decoration */}
                    <div className="mt-3 text-center">
                      <div className="text-xs font-mono text-muted-foreground/60">
                        ★ ☆ ★ ☆ ★
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Message Content */}
                  <div className="md:col-span-3">
                    {/* Message Header */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <div className="text-base font-semibold">Message for Lily</div>
                        <div className="flex-grow h-px bg-gradient-to-r from-primary/40 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Message Content Box */}
                    <div className="bg-background/60 border border-dashed border-muted-foreground/30 rounded-lg p-4 relative overflow-hidden">
                      {/* Y2K Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="grid grid-cols-12 gap-1 h-full">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="bg-primary/20 rounded-sm"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Message Text */}
                      <div className="relative z-10">
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, href, children, ...props }) => {
                                const isExternal = href?.startsWith('http') || href?.startsWith('//');
                                return (
                                  <a
                                    href={href}
                                    target={isExternal ? '_blank' : undefined}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    className="text-primary hover:underline font-semibold"
                                    {...props}
                                  >
                                    {children}
                                  </a>
                                );
                              },
                              p: ({ children }) => <p className="mb-3 leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                            }}
                          >
                            {entry.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Y2K Footer */}
              <div className="mt-4 pt-2 text-center border-t border-dashed border-muted-foreground/30">
                <div className="text-xs font-mono text-muted-foreground/70 mb-2">
                  ♡ ⋆。 ˚ ☾ ˚ ⋆。 ♡
                </div>
                
                <div className="flex justify-center space-x-3 py-1">
                  <div className="text-[10px] px-2 py-1 bg-background/50 border border-border/50 rounded-md hover:bg-background/80 transition-colors cursor-pointer">home</div>
                  <div className="text-[10px] px-2 py-1 bg-background/50 border border-border/50 rounded-md hover:bg-background/80 transition-colors cursor-pointer">about</div>
                  <div className="text-[10px] px-2 py-1 bg-background/50 border border-border/50 rounded-md hover:bg-background/80 transition-colors cursor-pointer">contact</div>
                </div>
                
                <div className="text-[10px] my-2 text-muted-foreground/60">
                  © {new Date().getFullYear()} • made in Lily's Workshop™ and with lots of ♥
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}