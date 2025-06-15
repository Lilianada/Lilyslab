'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import type { WebmentionEntry, WebmentionFeed } from '@/lib/types/webmention'

const WEBMENTION_TOKEN = 'VNTpGRWoCB8tvFmQtJ9wuQ'

export function WebmentionFooter() {
  const [mentions, setMentions] = useState<WebmentionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    async function fetchWebmentions() {
      try {
        // Get the current page URL
        const targetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
        
        // Fetch webmentions for this URL
        const response = await fetch(
          `https://webmention.io/api/mentions.jf2?token=${WEBMENTION_TOKEN}&target=${encodeURIComponent(targetUrl)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch webmentions')
        }

        const data: WebmentionFeed = await response.json()
        setMentions(data.children || [])
      } catch (error) {
        console.error('Error fetching webmentions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pathname) {
      fetchWebmentions()
    }
  }, [pathname])

  if (mentions.length === 0 && !loading) {
    return null
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="text-xs font-mono text-muted-foreground mb-4">
        {loading ? (
          <span className="animate-pulse">Loading mentions...</span>
        ) : (
          `${mentions.length} Webmention${mentions.length !== 1 ? 's' : ''}`
        )}
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mentions.map((mention) => (
          <div
            key={mention['wm-id']}
            className="flex items-start space-x-3 p-3 rounded-md border border-border 
                     bg-card hover:border-primary/40 transition-colors"
          >
            <Avatar className="h-8 w-8 rounded-full bg-muted">
              <img
                src={mention.author.photo}
                alt={mention.author.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={mention.author.url}
                  className="text-sm font-medium hover:text-primary truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mention.author.name}
                </a>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(mention.published), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {mention.content?.text && (
                <p className="text-sm text-muted-foreground font-nitti mt-1 line-clamp-3">
                  {mention.content.text}
                </p>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                via{' '}
                <a
                  href={mention.url}
                  className="hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(mention.url).hostname}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
