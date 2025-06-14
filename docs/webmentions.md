# Implementing Webmentions in Lily's Garden

This guide outlines how to add webmention support across content pages in Lily's Garden.

## Table of Contents
1. [Setup Steps](#setup-steps)
2. [Component Implementation](#component-implementation)
3. [Database Schema](#database-schema)
4. [API Integration](#api-integration)
5. [Page Integration](#page-integration)

## Setup Steps

1. **Register with webmention.io**
   - Visit [webmention.io](https://webmention.io)
   - Sign in with your domain
   - Get your API token

2. **Add Webmention Tags to Layout**
   ```tsx
   // app/layout.tsx
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           {/* Existing meta tags */}
           
           {/* Webmention verification */}
           <link 
             rel="webmention" 
             href="https://webmention.io/lilyslab.com/webmention" 
           />
           <link 
             rel="pingback" 
             href="https://webmention.io/lilyslab.com/xmlrpc" 
           />
         </head>
         <body>{children}</body>
       </html>
     )
   }
   ```

## Component Implementation

1. **Create Types**
   ```typescript
   // lib/types/webmention.ts
   export interface Webmention {
     id: string
     source: string
     target: string
     author: {
       name: string
       photo: string
       url: string
     }
     published: string
     content?: string
     type: 'mention' | 'reply' | 'like' | 'repost' | 'bookmark'
   }
   ```

2. **Create Webmention Component**
   ```typescript
   // components/webmentions/webmention-list.tsx
   import { useState, useEffect } from 'react'
   import { formatDistance } from 'date-fns'
   import { Avatar } from '../ui/avatar'
   import type { Webmention } from '@/lib/types/webmention'

   export function WebmentionList({ url }: { url: string }) {
     const [mentions, setMentions] = useState<Webmention[]>([])
     const [isLoading, setIsLoading] = useState(true)

     useEffect(() => {
       async function fetchMentions() {
         try {
           const response = await fetch(
             `/api/webmentions?target=${encodeURIComponent(url)}`
           )
           const data = await response.json()
           setMentions(data)
         } catch (error) {
           console.error('Error fetching webmentions:', error)
         } finally {
           setIsLoading(false)
         }
       }

       fetchMentions()
     }, [url])

     if (isLoading) {
       return <div className="animate-pulse">Loading mentions...</div>
     }

     if (mentions.length === 0) {
       return null
     }

     return (
       <div className="webmention-container">
         <h3 className="text-sm font-mono text-muted-foreground mb-4">
           {mentions.length} Mention{mentions.length !== 1 ? 's' : ''}
         </h3>
         
         <div className="space-y-4">
           {mentions.map(mention => (
             <div key={mention.id} className="webmention-item">
               <Avatar
                 src={mention.author.photo}
                 alt={mention.author.name}
                 className="h-8 w-8 rounded-full"
               />
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between gap-2">
                   <a 
                     href={mention.author.url}
                     className="webmention-author"
                     target="_blank"
                     rel="noopener noreferrer"
                   >
                     {mention.author.name}
                   </a>
                   <span className="text-xs text-muted-foreground whitespace-nowrap">
                     {formatDistance(new Date(mention.published), new Date(), { 
                       addSuffix: true 
                     })}
                   </span>
                 </div>
                 {mention.content && (
                   <p className="webmention-content mt-1">{mention.content}</p>
                 )}
               </div>
             </div>
           ))}
         </div>
       </div>
     )
   }
   ```

3. **Add Styling**
   ```css
   /* styles/webmentions.css */
   .webmention-container {
     @apply mt-8 pt-6 border-t border-border;
   }

   .webmention-item {
     @apply flex items-start gap-3 p-3 rounded-md 
            border border-border bg-card transition-all
            hover:border-primary/40;
   }

   .webmention-author {
     @apply text-sm font-medium hover:text-primary 
            transition-colors duration-200;
   }

   .webmention-content {
     @apply text-sm text-muted-foreground font-nitti
            leading-relaxed;
   }
   ```

## API Integration

1. **Create API Route**
   ```typescript
   // app/api/webmentions/route.ts
   import { NextResponse } from 'next/server'

   const WEBMENTION_IO_TOKEN = process.env.WEBMENTION_IO_TOKEN

   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const target = searchParams.get('target')

     if (!target) {
       return NextResponse.json({ error: 'Target URL is required' }, { status: 400 })
     }

     try {
       const response = await fetch(
         `https://webmention.io/api/mentions.jf2?target=${target}&token=${WEBMENTION_IO_TOKEN}`
       )
       
       if (!response.ok) {
         throw new Error('Failed to fetch webmentions')
       }

       const data = await response.json()
       return NextResponse.json(data.children)
     } catch (error) {
       console.error('Error fetching webmentions:', error)
       return NextResponse.json({ error: 'Failed to fetch webmentions' }, { status: 500 })
     }
   }
   ```

## Page Integration

1. **Update Content Pages**
   ```typescript
   // Example: app/(with-sidebar)/garden/writings/[slug]/page.tsx
   import { WebmentionList } from '@/components/webmentions/webmention-list'

   export default function WritingPage({ params }) {
     const canonicalUrl = `https://lilyslab.com/garden/writings/${params.slug}`
     
     return (
       <article className="prose dark:prose-invert max-w-none">
         {/* Existing content */}
         
         <WebmentionList url={canonicalUrl} />
       </article>
     )
   }
   ```

2. **Add to Other Content Types**
   - Add to `/now` page
   - Add to `/garden/notes/[slug]`
   - Add to `/garden/micro-blog` posts
   - Add to any other content that might receive webmentions

## Environment Setup

1. **Add Environment Variables**
   ```env
   # .env.local
   WEBMENTION_IO_TOKEN=your_token_here
   ```

2. **Update Types**
   ```typescript
   // types/env.d.ts
   declare global {
     namespace NodeJS {
       interface ProcessEnv {
         WEBMENTION_IO_TOKEN: string
       }
     }
   }
   ```

## Testing Webmentions

1. **Send a Test Webmention**
   - Use [webmention.app](https://webmention.app/) to send test mentions
   - Or use [telegraph](https://telegraph.p3k.io/) for manual testing

2. **Verify Reception**
   - Check webmention.io dashboard
   - Verify mentions appear on your pages

## Recommended Pages to Add Webmentions

Based on your site structure, add webmentions to:

1. **Primary Content**
   - `/garden/writings/[slug]`
   - `/garden/notes/[slug]`
   - `/garden/micro-blog` posts

2. **Status Pages**
   - `/now`
   - `/someday`

3. **Project Pages**
   - `/projects/[slug]`
   - `/logs/[slug]`

4. **Interactive Areas**
   - Consider adding to `/guestbook` as a secondary interaction method
   - Maybe add to `/ask-me-anything` for cross-site discussions

This distributed approach keeps mentions contextual while maintaining your site's clean design and user experience.
