"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import type { ExtendedRecordMap } from "notion-types"
import { NotionRenderer as ReactNotionX } from "react-notion-x"
import { getPageTitle } from "notion-utils"

// Import necessary styles
import "react-notion-x/src/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"
// Import your custom styles if they exist
// import "@/styles/notion.css"

// Dynamically import components to reduce bundle size
const Code = dynamic(() => import("react-notion-x/build/third-party/code").then((m) => m.Code))
const Collection = dynamic(() => import("react-notion-x/build/third-party/collection").then((m) => m.Collection))
const Equation = dynamic(() => import("react-notion-x/build/third-party/equation").then((m) => m.Equation))
const Pdf = dynamic(() => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf), {
  ssr: false,
})
const Modal = dynamic(() => import("react-notion-x/build/third-party/modal").then((m) => m.Modal), {
  ssr: false,
})

const NotionRenderer = ({ recordMap }: { recordMap: ExtendedRecordMap }) => {
  // Defensive check for valid recordMap
  if (!recordMap || 
      typeof recordMap !== 'object' || 
      !recordMap.block || 
      typeof recordMap.block !== 'object' || 
      Object.keys(recordMap.block).length === 0) {
    console.error('Invalid recordMap passed to NotionRenderer:', recordMap);
    return (
      <div className="notion-empty p-4 border rounded-md bg-muted/20">
        <p>This section is still under construction.</p>
        <p className="text-xs text-muted-foreground mt-2">
          This could be due to permission issues or the page might not be publicly accessible.<br />
          <span className="text-xs text-red-500">Error: Invalid recordMap shape.</span>
        </p>
      </div>
    )
  }

  try {
    // Find the root page ID (needed to properly render page content)
    const pageIds = Object.keys(recordMap.block)
    
    // Try different approaches to find the root page ID
    let rootPageId = pageIds.find(id => {
      const block = recordMap.block[id]?.value
      return block?.type === 'page' && block?.parent_table === 'space'
    })

    // If no page with parent_table=space is found, try other heuristics
    if (!rootPageId) {
      rootPageId = pageIds.find(id => {
        const block = recordMap.block[id]?.value
        return block?.type === 'page' && !block?.parent_id
      })
    }

    // Last resort: just use the first page
    if (!rootPageId) {
      rootPageId = pageIds.find(id => {
        const block = recordMap.block[id]?.value
        return block?.type === 'page'
      })
    }

    // If all else fails, use the first block id
    if (!rootPageId && pageIds.length > 0) {
      rootPageId = pageIds[0]
      console.warn('Could not determine root page ID, using first block:', rootPageId)
    }

    if (!rootPageId) {
      throw new Error('Could not find any valid block in recordMap')
    }

    console.log('Using root page ID:', rootPageId)
    
    try {
      const pageTitle = getPageTitle(recordMap)
      console.log('Page title from notion-utils:', pageTitle)
    } catch (titleError) {
      console.warn('Could not extract page title:', titleError)
    }

    return (
      <ReactNotionX
        recordMap={recordMap}
        rootPageId={rootPageId}
        fullPage={false}
        darkMode={false}
        previewImages={true}
        showCollectionViewDropdown={false}
        showTableOfContents={false}
        minTableOfContentsItems={3}
        defaultPageIcon={"📄"}
        defaultPageCover={""}
        defaultPageCoverPosition={0.5}
        mapPageUrl={(pageId) => {
          // Find the block data
          const block = recordMap.block[pageId]?.value
          // Get the slug from the block's properties if available
          const slug = block?.properties?.Slug?.[0]?.[0] || pageId
          return `/writing/${slug}`
        }}
        mapImageUrl={(url) => {
          if (url.startsWith("data:")) return url
          if (url.startsWith("/images")) return url

          // If it's a relative URL, make it absolute
          if (url.startsWith("/")) {
            return `https://www.notion.so${url}`
          }

          // Return the URL as is for external images
          return url
        }}
        components={{
          nextImage: Image,
          nextLink: Link,
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
        }}
        // Hide collection page properties
        pageAside={null}
        pageFooter={null}
        pageHeader={null}
        pageTitle={null}
        pageAnchor={null}
        pageCover={null}
        hideBlockId={true}
      />
    )
  } catch (error) {
    console.error('Error rendering Notion page:', error);
    return (
      <div className="notion-error p-4 border rounded-md bg-red-50 border-red-200">
        <p className="font-medium">Error rendering Notion content</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error.message || "An unknown error occurred while rendering content"}
        </p>
      </div>
    )
  }
}

export default NotionRenderer