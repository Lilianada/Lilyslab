"use client"

import type React from "react"
import { Block } from "./block"
import type { BlockMap } from "./types"
import { useTheme } from "next-themes"

interface NotionRendererProps {
  blockMap: BlockMap
  fullPage?: boolean
  hideHeader?: boolean
  pageUrlPrefix?: string
  defaultImageUrl?: string
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  blockMap,
  fullPage = false,
  hideHeader = false,
  pageUrlPrefix = "/",
  defaultImageUrl = "/placeholder.svg",
}) => {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  // Safely check if blockMap is valid
  if (!blockMap || typeof blockMap !== "object" || Object.keys(blockMap).length === 0) {
    return (
      <div className="notion-empty">
        <p>No content available.</p>
      </div>
    )
  }

  try {
    // Find the root block ID (usually the first one)
    const rootBlockId =
      Object.keys(blockMap).find((id) => blockMap[id]?.value?.type === "page") || Object.keys(blockMap)[0]

    if (!rootBlockId || !blockMap[rootBlockId]?.value) {
      return (
        <div className="notion-empty">
          <p>No content available.</p>
        </div>
      )
    }

    // Get the root block
    const rootBlock = blockMap[rootBlockId]?.value

    // Get the content blocks (children of the root block)
    const contentBlockIds = rootBlock?.content || []

    // Create the mapping functions here in the client component
    const mapPageUrl = (pageId: string) => `${pageUrlPrefix}${pageId.replace(/-/g, "")}`
    const mapImageUrl = (url: string) => url || defaultImageUrl

    return (
      <div className="notion-renderer">
        {!hideHeader && rootBlock?.type === "page" && rootBlock?.properties?.title && (
          <div className="notion-page-header">
            <h1 className="notion-page-title">{rootBlock.properties?.title?.[0]?.[0] || "Untitled"}</h1>
          </div>
        )}

        <div className="notion-page-content">
          {contentBlockIds && contentBlockIds.length > 0 ? (
            contentBlockIds.map((blockId) => {
              if (!blockId || !blockMap[blockId]?.value) return null
              return (
                <Block
                  key={blockId}
                  block={blockMap[blockId]?.value}
                  blockMap={blockMap}
                  mapPageUrl={mapPageUrl}
                  mapImageUrl={mapImageUrl}
                  darkMode={isDarkMode}
                />
              )
            })
          ) : (
            <div className="notion-empty">
              <p>This page has no content.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering Notion content:", error)
    return (
      <div className="notion-error">
        <p>There was an error rendering this content.</p>
        <p className="notion-error-details">{error.message}</p>
      </div>
    )
  }
}
