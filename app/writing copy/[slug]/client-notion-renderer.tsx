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
    // Log details about the invalid recordMap to help with debugging
    console.error('Invalid recordMap passed to ClientNotionRenderer:', 
      recordMap ? 
        `Type: ${typeof recordMap}, Has block: ${!!recordMap.block}, Block keys: ${Object.keys(recordMap.block || {}).length}` : 
        'recordMap is null or undefined'
    );
    
    return (
      <div className="notion-empty p-4 border rounded-md bg-muted/20">
        <p>This section is still under construction.</p>
        <p className="text-xs text-muted-foreground mt-2">
          This could be due to permission issues or the page might not be publicly accessible.
        </p>
        <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
          <p className="font-mono">Debug info: Invalid recordMap received</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notion-container">
      <NotionRenderer recordMap={recordMap} />
    </div>
  )
}