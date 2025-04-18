"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import type { ExtendedRecordMap } from "notion-types"
import { NotionRenderer as ReactNotionX } from "react-notion-x"
// Import our custom Notion styles

// Import required components from react-notion-x
import "react-notion-x/src/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"

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
  if (!recordMap) {
    return (
      <div className="notion-empty p-4 border rounded-md bg-muted/20">
        <p>No content available.</p>
        <p className="text-xs text-muted-foreground mt-2">
          This could be due to permission issues or the page might not be publicly accessible.
        </p>
      </div>
    )
  }

  return (
    <ReactNotionX
      recordMap={recordMap}
      fullPage={false}
      darkMode={false}
      previewImages={true}
      showCollectionViewDropdown={false}
      showTableOfContents={false}
      minTableOfContentsItems={3}
      defaultPageIcon={"📄"}
      defaultPageCover={""}
      defaultPageCoverPosition={0.5}
      mapPageUrl={(pageId, recordMap) => {
        // Find the block data
        const block = recordMap.block[pageId];
        // Get the slug from the block's properties if available
        const slug = block?.properties?.Slug?.[0]?.[0] || pageId;
        return `/writing/${slug}`;
      }}
      mapImageUrl={(url, block) => {
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
      propertyIconMap={{}}
      propertyTextMap={{}}
    />
  )
}

export default NotionRenderer
