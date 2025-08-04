"use client"

import { Suspense, useState } from 'react'
import dynamic from "next/dynamic";
import { Poem } from '@/lib/garden/poems'
import { MarkdownSkeleton } from '@/components/markdown/markdown-renderer'

type PoemLayoutClientProps = {
  poems: Poem[]
}

// Lazy load the MarkdownRenderer component
const MarkdownRenderer = dynamic(() => import("@/components/markdown"), {
  loading: () => <MarkdownSkeleton />,
})

export default function PoemLayoutClient({ poems }: PoemLayoutClientProps) {
  // Set the most recent poem as default (first poem in the array, as they're already sorted by date)
  const mostRecentPoemSlug = poems.length > 0 ? poems[0].slug : null
  const [selectedPoemSlug, setSelectedPoemSlug] = useState<string | null>(mostRecentPoemSlug)
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
          <p className="text-sm font-semibold mb-3">Poems</p>
          
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 pb-8">
            {filteredPoems.length > 0 && (
              filteredPoems.map(poem => (
                <div 
                  key={poem.slug}
                  onClick={() => setSelectedPoemSlug(poem.slug)}
                  className={`cursor-pointer rounded-md transition-all ${
                    selectedPoemSlug === poem.slug
                      ? 'text-primary'
                      : 'hover:'
                  }`}
                >
                  <p className={`text-xs mb-1 ${selectedPoemSlug === poem.slug ? 'text-primary' : ''}`}>
                    {poem.title}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right column - Poem Content */}
      <div className="md:col-span-2">
        {selectedPoem && (
          <article className="animate-fade-in">
            <h1 className="text-3xl font-heart">{selectedPoem.title}</h1>
            
            <div className="prose prose-base max-w-none poem-content">
              <Suspense fallback={<MarkdownSkeleton />}>
                   <MarkdownRenderer content={selectedPoem.content} />
                 </Suspense>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
