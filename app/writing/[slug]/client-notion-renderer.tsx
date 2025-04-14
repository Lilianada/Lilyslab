"use client"

import dynamic from "next/dynamic"
import type { ExtendedRecordMap } from "notion-types"

// Use dynamic import for the NotionRenderer to avoid SSR issues
const NotionRenderer = dynamic(() => import("@/components/notion-renderer"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-96 bg-muted/20 rounded-md"></div>,
})

export default function ClientNotionRenderer({ recordMap }: { recordMap: ExtendedRecordMap }) {
  if (!recordMap || !Object.keys(recordMap.block || {}).length) {
    return (
      <div className="notion-empty p-4 border rounded-md bg-muted/20">
        <p>Failed to load article content.</p>
        <p className="text-xs text-muted-foreground mt-2">
          This could be due to permission issues or the page might not be publicly accessible.
        </p>
      </div>
    )
  }

  return <NotionRenderer recordMap={recordMap} />
}
