"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { ArrowLeft, ArrowRight, List, Shuffle } from "lucide-react"
import type { Poem } from "@/lib/garden/poems"
import { MarkdownSkeleton } from "@/components/markdown/markdown-renderer"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const MarkdownRenderer = dynamic(() => import("@/components/markdown"), {
  loading: () => <MarkdownSkeleton />,
})

const formatMonth = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date))

const TURN_BUTTON =
  "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-primary/20"

export default function PoemLayoutClient({ poems }: { poems: Poem[] }) {
  const [current, setCurrent] = useState(0)
  const [isContentsOpen, setIsContentsOpen] = useState(false)
  const pageTop = useRef<HTMLDivElement>(null)
  const poem = poems[current]

  // Poems can be shared as /garden/poems?poem=slug.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("poem")
    const linked = poems.findIndex((item) => item.slug === slug)
    if (linked > 0) setCurrent(linked)
  }, [poems])

  const openPoem = useCallback(
    (index: number) => {
      setCurrent(index)
      window.history.replaceState(null, "", `?poem=${encodeURIComponent(poems[index].slug)}`)
      pageTop.current?.scrollIntoView({ block: "start" })
    },
    [poems]
  )

  const turnPage = useCallback(
    (direction: 1 | -1) => openPoem((current + direction + poems.length) % poems.length),
    [current, openPoem, poems.length]
  )

  const openRandomPoem = () => {
    const other = Math.floor(Math.random() * (poems.length - 1))
    openPoem(other >= current ? other + 1 : other)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isContentsOpen) return
      if (event.key === "ArrowRight") turnPage(1)
      if (event.key === "ArrowLeft") turnPage(-1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [turnPage, isContentsOpen])

  if (!poem) return <p className="text-sm text-muted-foreground">The pages are still blank.</p>

  return (
    <>
      <div ref={pageTop} className="scroll-mt-20" />

      <article key={poem.slug} className="animate-fade-in">
        <div className="mb-3 flex items-baseline justify-between gap-4 font-mono text-xs text-muted-foreground">
          <span>{formatMonth(poem.createdAt)}</span>
          <button type="button" onClick={() => setIsContentsOpen(true)} className="flex items-center gap-1.5 hover:text-primary">
            <List size={12} aria-hidden="true" />
            Contents
          </button>
        </div>
        <h2 className="mb-8 font-poem text-4xl italic leading-tight [overflow-wrap:anywhere]">{poem.title}</h2>
        <div className="[overflow-wrap:anywhere] [&_*]:font-poem [&_li]:text-lg [&_li]:leading-8 [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-8">
          <MarkdownRenderer content={poem.content} />
        </div>
      </article>

      <nav aria-label="Turn the page" className="mt-12 flex items-center justify-between border-y border-primary/40 py-3">
        <button type="button" onClick={() => turnPage(-1)} className={TURN_BUTTON}>
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setIsContentsOpen(true)}
          aria-label={`Poem ${current + 1} of ${poems.length}. Open contents`}
          className="rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {current + 1} of {poems.length}
        </button>
        <button type="button" onClick={() => turnPage(1)} className={TURN_BUTTON}>
          <span>Next</span>
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </nav>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={openRandomPoem}
          className="inline-flex items-center gap-2 rounded-md border border-primary/60 bg-primary/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/50"
        >
          <Shuffle size={14} aria-hidden="true" />
          Read me another
        </button>
      </div>

      <Sheet open={isContentsOpen} onOpenChange={setIsContentsOpen}>
        <SheetContent className="w-[85%] overflow-y-auto sm:max-w-sm">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="font-poem text-2xl font-normal italic">Contents</SheetTitle>
            <SheetDescription className="font-mono text-xs">{poems.length} poems, newest first</SheetDescription>
          </SheetHeader>
          <ol>
            {poems.map((item, index) => (
              <li key={item.slug}>
                <a
                  href={`?poem=${encodeURIComponent(item.slug)}`}
                  aria-current={index === current ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    setIsContentsOpen(false)
                    openPoem(index)
                  }}
                  className={`flex items-baseline gap-2 py-1 font-poem text-base transition-colors hover:text-primary ${
                    index === current ? "text-primary" : ""
                  }`}
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">{item.title}</span>
                  <span className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted border-muted-foreground/50" aria-hidden="true" />
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatMonth(item.createdAt)}</span>
                </a>
              </li>
            ))}
          </ol>
        </SheetContent>
      </Sheet>
    </>
  )
}
