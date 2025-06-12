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
    const colors = [
      "from-pink-200 to-purple-500",
      "from-blue-200 to-cyan-500", 
      "from-green-200 to-emerald-500",
      "from-yellow-200 to-orange-500",
      "from-indigo-200 to-violet-500",
      "from-rose-200 to-red-500",
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
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
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
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
      {entries.map((entry) => {
        const personColor = generateColor(entry.name);
        
        return (
          <Card
            key={entry.id}
            className="border-2 border-border rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* Browser Chrome Bar */}
            <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-mono text-muted-foreground">{entry.name}.html</div>
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" title="Minimize">
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
              <div className={`bg-gradient-to-r ${personColor} h-16 flex items-center justify-center p-3 overflow-hidden relative`}>
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
                    <span className="text-muted-foreground">visitor #{entry.id.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground/70 font-mono">
                    {formatDate(entry.date)}
                  </div>
                </div>

                {/* Main Layout - 2 Column */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column - Profile */}
                  <div className="md:col-span-1">
                    {/* Profile Box */}
                    <div className="border border-dashed border-muted-foreground/30 rounded-md p-3 bg-background/50">
                      {/* Profile Icon - Generated from name */}
                      <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${personColor} mx-auto flex items-center justify-center text-white font-bold text-xl`}>
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="text-center mt-2">
                        <div className="text-lg font-semibold bg-gradient-to-r from-primary to-pink-500 dark:from-primary dark:to-purple-500 bg-clip-text text-transparent">
                          {entry.name}
                        </div>
                        
                        {/* Intro displayed here in profile section */}
                        {entry.intro && (
                          <div className="mt-2 text-xs italic text-muted-foreground/80">
                            "{entry.intro}"
                          </div>
                        )}
                        
                        <div className="border-t border-dashed border-muted-foreground/30 my-3"></div>
                        
                        {/* Profile Stats - Optional Fields */}
                        <div className="space-y-2 text-xs text-left">
                          {entry.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-muted-foreground" /> 
                              <span>{entry.location}</span>
                            </div>
                          )}
                          
                          {entry.mood && (
                            <div className="flex items-center gap-1.5">
                              <Heart className="h-3 w-3 text-muted-foreground" /> 
                              <span>feeling: {entry.mood}</span>
                            </div>
                          )}
                          
                          {entry.song && (
                            <div className="flex items-center gap-1.5">
                              <Music className="h-3 w-3 text-muted-foreground" /> 
                              <span>listening to: {entry.song}</span>
                            </div>
                          )}
                          
                          {entry.favorite && (
                            <div className="flex items-center gap-1.5">
                              <Star className="h-3 w-3 text-muted-foreground" /> 
                              <span>fave: {entry.favorite}</span>
                            </div>
                          )}
                          
                          {entry.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-muted-foreground" /> 
                              <span className="truncate">{entry.email.replace(/@/g, ' [at] ')}</span>
                            </div>
                          )}
                          
                          {/* If none of these fields exist, show default info */}
                          {!entry.location && !entry.mood && !entry.song && !entry.favorite && !entry.email && !entry.intro && (
                            <div className="text-center text-muted-foreground/50 py-1">
                              <div className="mb-1">★ mysterious visitor ★</div>
                              <div className="text-[10px]">no details shared</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                   {/* Y2K Style Elements */}
                    <div className="mt-3 flex flex-col items-center">
                      {/* Pixel Divider */}
                      <div className="w-full h-[5px] my-2 bg-repeat-x" 
                          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='5' viewBox='0 0 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h5v5H0zM5 0h5v5H5z' fill='%23999999' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}>
                      </div>
                           {/* Online Now */}
                      <div className="text-xs text-center mt-1 font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                        online now
                      </div>
                     
                    </div>
                  </div>
                  
                  {/* Right Column - Content */}
                  <div className="md:col-span-2">
                    {/* Message Content */}
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="text-sm font-semibold">Message for Lily</div>
                        <div className="ml-2 h-[1px] flex-grow bg-gradient-to-r from-muted-foreground/40 to-transparent"></div>
                      </div>
                      
                      <div className="bg-background/50 border border-border/50 rounded-md p-3">
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
                                    className="text-primary hover:underline"
                                    {...props}
                                  >
                                    {children}
                                  </a>
                                );
                              },
                              p: ({ children }) => <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                            }}
                          >
                            {entry.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    
                    {/* Y2K Hit Counter and Stats */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="bg-background/60 border border-border/40 rounded px-2 py-1 text-[10px] font-mono flex items-center">
                        <span className="mr-1">hits:</span>
                        {/* Retro hit counter */}
                        <div className="flex">
                          {String(Math.floor(Math.random() * 10000) + 100).split('').map((digit, i) => (
                            <div key={i} className="w-3 bg-black/5 dark:bg-white/10 mx-px font-mono text-center">
                              {digit}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-muted-foreground/60 font-mono">
                        signed on {formatDate(entry.date)}
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