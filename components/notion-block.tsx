import { cn } from "@/lib/utils"
import type React from "react"
import PlaceholderImage from "./placeholder-image"

interface NotionBlockProps {
  children: React.ReactNode
  className?: string
}

export function NotionBlock({ children, className }: NotionBlockProps) {
  return <div className={cn("my-2 transition-opacity duration-300 ease-in-out", className)}>{children}</div>
}

export function NotionHeading1({ children }: { children: React.ReactNode }) {
  return (
    <NotionBlock>
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    </NotionBlock>
  )
}

export function NotionHeading2({ children }: { children: React.ReactNode }) {
  return (
    <NotionBlock>
      <h2 className="text-2xl font-bold mb-3 mt-6">{children}</h2>
    </NotionBlock>
  )
}

export function NotionHeading3({ children }: { children: React.ReactNode }) {
  return (
    <NotionBlock>
      <h3 className="text-xl font-semibold mb-2 mt-5">{children}</h3>
    </NotionBlock>
  )
}

export function NotionParagraph({ children }: { children: React.ReactNode }) {
  return (
    <NotionBlock>
      <p className="text-sm leading-relaxed mb-2">{children}</p>
    </NotionBlock>
  )
}

export function NotionList({ items }: { items: string[] }) {
  return (
    <NotionBlock>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </NotionBlock>
  )
}

export function NotionNumberedList({ items }: { items: string[] }) {
  return (
    <NotionBlock>
      <ol className="list-decimal pl-6 mb-4 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed">
            {item}
          </li>
        ))}
      </ol>
    </NotionBlock>
  )
}

export function NotionCallout({ children, emoji }: { children: React.ReactNode; emoji?: string }) {
  return (
    <NotionBlock>
      <div className="flex p-4 rounded-md bg-accent mb-4">
        {emoji && <div className="mr-2">{emoji}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </NotionBlock>
  )
}

export function NotionImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <NotionBlock className="my-6">
      <div className="rounded-lg overflow-hidden">
        <PlaceholderImage src={src} width={800} height={400} alt={alt} className="w-full h-auto" />
        {caption && <p className="text-xs text-muted-foreground mt-2 text-center">{caption}</p>}
      </div>
    </NotionBlock>
  )
}

export function NotionDivider() {
  return (
    <NotionBlock>
      <hr className="my-6 border-t border-border" />
    </NotionBlock>
  )
}

export function NotionQuote({ children }: { children: React.ReactNode }) {
  return (
    <NotionBlock>
      <blockquote className="pl-4 border-l-4 border-primary italic my-4">
        <p className="text-sm">{children}</p>
      </blockquote>
    </NotionBlock>
  )
}

export function NotionTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <NotionBlock className="my-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent">
              {headers.map((header, index) => (
                <th key={index} className="border border-border p-2 text-sm font-medium text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-muted/30">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-border p-2 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NotionBlock>
  )
}

export function NotionToggle({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <NotionBlock>
      <details className="mb-4 border rounded-md">
        <summary className="p-3 cursor-pointer text-sm font-medium">{summary}</summary>
        <div className="p-3 pt-0 border-t">{children}</div>
      </details>
    </NotionBlock>
  )
}
