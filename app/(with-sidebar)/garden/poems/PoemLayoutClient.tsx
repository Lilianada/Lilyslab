"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Poem } from '@/lib/garden/poems'
import { Badge } from '@/components/ui/badge'
import { Tag, Search, X } from 'lucide-react'

type PoemLayoutClientProps = {
  poems: Poem[]
}

export default function PoemLayoutClient({ poems }: PoemLayoutClientProps) {
  const [selectedPoemSlug, setSelectedPoemSlug] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedPoem = poems.find(poem => poem.slug === selectedPoemSlug)
  
  // Filter poems based on search query
  const filteredPoems = searchQuery 
    ? poems.filter(poem => 
        poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poem.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : poems

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column - Poem List */}
      <div className="md:col-span-1 pr-4">
        <div className="sticky top-24">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search poems..."
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          </div>

          <p className="text-sm font-semibold mb-3">All Poems ({filteredPoems.length})</p>
          
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 pb-8">
            {filteredPoems.length > 0 ? (
              filteredPoems.map(poem => (
                <div 
                  key={poem.slug}
                  onClick={() => setSelectedPoemSlug(poem.slug)}
                  className={`cursor-pointer rounded-md transition-all ${
                    selectedPoemSlug === poem.slug
                      ? ''
                      : 'hover:'
                  }`}
                >
                  <p className={`text-sm italic mb-1 ${selectedPoemSlug === poem.slug ? 'text-primary' : ''}`}>
                    {poem.title}
                  </p>
                  {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(poem.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short', 
                    })}</span>
                    
                  </div> */}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No poems found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column - Poem Content */}
      <div className="md:col-span-2">
        {selectedPoem ? (
          <article className="animate-fade-in">
            <h1 className="text-3xl font-heart">{selectedPoem.title}</h1>
            
            
            <div className="prose prose-sm max-w-none poem-content">
              {selectedPoem.content
                .split('\n')
                .map((line, i) => {
                  // Process markdown but keep line breaks for poetic formatting
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
                })}
            </div>
          </article>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg">
            <div className="w-16 h-16 mb-4 text-muted-foreground opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-xl font-heart mb-3">Select a Poem</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Choose a poem from the list on the left to view its content here. Each poem carries emotions and stories waiting to be explored.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
