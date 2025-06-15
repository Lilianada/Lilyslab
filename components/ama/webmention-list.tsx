'use client'

import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import type { WebmentionEntry, WebmentionFeed } from '@/lib/types/webmention'
import { Card } from '@/components/ui/card'
import { MessageCircle, Heart, Repeat, Bookmark } from 'lucide-react'

export function WebmentionList({ isLoading }: { isLoading: boolean }) {
  const [mentions, setMentions] = useState<WebmentionEntry[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    async function fetchWebmentions() {
      try {
        // Fetch all webmentions for the site
        const response = await fetch(
          `https://webmention.io/api/mentions.jf2?token=${process.env.NEXT_PUBLIC_WEBMENTION_TOKEN}&per-page=100`,
          { 
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          }
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

    fetchWebmentions()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-muted rounded-lg"></div>
        <div className="h-24 bg-muted rounded-lg"></div>
      </div>
    )
  }

  if (mentions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-sm text-muted-foreground">No mentions yet. Share this page to start a conversation!</p>
      </div>
    )
  }

  // Function to get interaction icon based on webmention type
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'in-reply-to':
        return <MessageCircle className="h-4 w-4 text-primary" />
      case 'like-of':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'repost-of':
        return <Repeat className="h-4 w-4 text-green-500" />
      case 'bookmark-of':
        return <Bookmark className="h-4 w-4 text-purple-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-primary" />
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium">Recent Mentions</h2>
      <div className="space-y-4">
        {mentions.map((mention) => (
          <Card
            key={mention['wm-id']}
            className="p-4 space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full bg-muted">
                  <img
                    src={mention.author.photo}
                    alt={mention.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Avatar>
                <div>
                  <a
                    href={mention.author.url}
                    className="text-xs font-mono hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mention.author.name}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(mention.published), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                {getInteractionIcon(mention['wm-property'])}
              </div>
            </div>

            {mention.content?.text && (
              <div className="p-3 bg-card rounded-lg">
                <p className="text-sm">{mention.content.text}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground font-mono pt-2">
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
          </Card>
        ))}
      </div>
    </section>
  )
}
