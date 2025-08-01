"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Poem } from '@/lib/garden/poems'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { Tag } from 'lucide-react'

type PoemTagFilterClientProps = {
  poems: Poem[]
}

export default function PoemTagFilterClient({ poems }: PoemTagFilterClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems)
  const [searchQuery, setSearchQuery] = useState('')

  // Extract all unique tags from poems
  const allTags = Array.from(new Set(poems.flatMap(poem => poem.tags || [])))
    .sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    let result = poems

    // Apply tag filter if selected
    if (selectedTag) {
      result = result.filter(poem => poem.tags?.includes(selectedTag))
    }

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(poem =>
        poem.title.toLowerCase().includes(query) ||
        poem.content.toLowerCase().includes(query) ||
        poem.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPoems(result)
  }, [selectedTag, searchQuery, poems])

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedTag(null)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
              selectedTag === null
                ? 'bg-primary/10 text-primary font-medium'
                : 'bg-muted hover:bg-primary/10 transition-colors text-muted-foreground'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                tag === selectedTag
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'bg-muted hover:bg-primary/10 transition-colors text-muted-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search poems..."
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {filteredPoems.length > 0 ? (
        <div className="space-y-6">
          {filteredPoems.map(poem => (
            <Link
              href={`/garden/poems/${poem.slug}`}
              key={poem.slug}
              className="block p-5 border border-border/50 rounded-lg hover:border-border hover:bg-muted/20 transition-all group"
            >
              <h2 className="font-heart text-xl mb-2 group-hover:text-primary transition-colors">
                {poem.title}
              </h2>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-3">
                <span>{poem.createdAt.split('T')[0]}</span>
              </div>

              <div className="prose-sm line-clamp-2 mb-4 text-muted-foreground">
                {poem.content.substring(0, 150).trim()}...
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {poem.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] py-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-xs">
                  Read poem <ChevronRight className="ml-1 h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h2 className="text-base font-medium mb-2">No poems found</h2>
          <p className="text-muted-foreground text-sm">
            {selectedTag 
              ? `No poems found with the tag "${selectedTag}".` 
              : searchQuery 
                ? `No poems match your search for "${searchQuery}".`
                : 'No poems available yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
