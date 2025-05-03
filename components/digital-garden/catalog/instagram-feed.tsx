'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

interface InstagramFeedProps {
  initialPosts: InstagramMedia[];
}

export function InstagramFeed({ initialPosts }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramMedia[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <Instagram className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No Instagram posts found</p>
        <p className="text-sm text-muted-foreground/60 mt-2">
          Connect your Instagram account in the settings to display your photos here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Instagram</h2>
        <Link 
          href="https://instagram.com/lilian_ada_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Instagram className="h-4 w-4" />
          <span>@lilian_ada_</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square relative rounded-md overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          ))
        ) : (
          // Instagram posts
          posts.map((post) => (
            <Link
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square relative rounded-md overflow-hidden group"
            >
              <Image
                src={post.media_url}
                alt={post.caption || 'Instagram post'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs line-clamp-3">
                  {post.caption || 'View on Instagram'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      
      <div className="text-center">
        <Link 
          href="https://instagram.com/lilian_ada_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm"
        >
          <Instagram className="h-4 w-4" />
          <span>View more on Instagram</span>
        </Link>
      </div>
    </div>
  );
}
