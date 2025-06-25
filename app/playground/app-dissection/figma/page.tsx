"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"
import PlaceholderImage from "@/components/placeholder-image"
import {
  NotionHeading1,
  NotionHeading2,
  NotionHeading3,
  NotionParagraph,
  NotionList,
  NotionImage,
  NotionCallout,
  NotionDivider,
  NotionQuote,
  NotionToggle,
} from "@/components/notion-block"

export default function FigmaDissection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dateAdded = "2023-09-15"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <Link
        href="/playground/app-dissection"
        className="mb-6 flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to all dissections</span>
      </Link>

      {/* Header */}
      <header className="mb-8 flex items-center gap-6">
        <PlaceholderImage width={50} height={50} className="rounded-lg" alt="Figma logo" />
        <div>
          <h1 className="text-lg font-medium">Figma</h1>
          <p className="mt-2 text-xs text-muted-foreground">Added on {formatDate(dateAdded)}</p>
        </div>
      </header>

      {/* Body - Using Notion Components */}
      <div className="space-y-8 stagger-children">
        <NotionHeading1>Figma: Revolutionizing Design Collaboration</NotionHeading1>

        <NotionParagraph>
          Figma has transformed how designers work together, moving design from isolated desktop software to the
          collaborative cloud. This dissection explores how Figma's interface and features enable seamless collaboration
          while maintaining powerful design capabilities.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Figma interface overview"
          caption="Figma's interface combines simplicity with power"
        />

        <NotionHeading2>Key Interface Elements</NotionHeading2>

        <NotionParagraph>
          Figma's interface is carefully designed to balance power and accessibility. Let's examine the key elements
          that make it work so well.
        </NotionParagraph>

        <NotionHeading3>The Canvas</NotionHeading3>

        <NotionParagraph>
          At the heart of Figma is the infinite canvas. Unlike traditional design tools with fixed artboards, Figma's
          canvas allows for free-form exploration and organization.
        </NotionParagraph>

        <NotionCallout emoji="💡">
          The infinite canvas concept isn't new, but Figma's implementation makes it particularly effective for
          collaborative work. Multiple users can work in different areas simultaneously without disrupting each other.
        </NotionCallout>

        <NotionImage
          src="/placeholder.svg"
          alt="Figma canvas with multiple users"
          caption="Multiple cursors showing real-time collaboration on the canvas"
        />

        <NotionHeading3>The Layers Panel</NotionHeading3>

        <NotionParagraph>
          Figma's layers panel provides a hierarchical view of all elements on the canvas. Its organization mirrors the
          visual structure, making it intuitive to navigate complex designs.
        </NotionParagraph>

        <NotionList
          items={[
            "Auto-collapsing groups keep the panel manageable",
            "Color-coded layer types provide visual cues",
            "Drag-and-drop reordering feels natural and responsive",
            "Search functionality makes finding specific elements easy",
          ]}
        />

        <NotionDivider />

        <NotionHeading2>Collaboration Features</NotionHeading2>

        <NotionParagraph>
          Figma's real-time collaboration features set it apart from traditional design tools. Let's examine how they're
          implemented.
        </NotionParagraph>

        <div className="aspect-w-16 aspect-h-9 my-8 rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/Tx2uN6XDg-4"
            title="Figma Collaboration Features"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <NotionHeading3>Multiplayer Editing</NotionHeading3>

        <NotionParagraph>
          Figma's multiplayer editing is remarkably smooth, with minimal latency even with many simultaneous editors.
          This is achieved through a combination of operational transformation and careful UI design.
        </NotionParagraph>

        <NotionQuote>
          "We built Figma to feel like we're all in the same room together, even when we're distributed across different
          time zones."
        </NotionQuote>

        <NotionHeading3>Comments and Feedback</NotionHeading3>

        <NotionParagraph>
          The commenting system in Figma is contextual and non-intrusive. Comments can be attached to specific elements
          or areas of the design, making feedback precise and actionable.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Figma commenting interface"
          caption="Comments can be attached to specific elements for contextual feedback"
        />

        <NotionToggle summary="How Figma's commenting system works behind the scenes">
          <NotionParagraph>
            Figma's commenting system uses a combination of vector coordinates and object references to attach comments
            to specific elements. This allows comments to stay attached even as designs evolve and elements move around
            the canvas.
          </NotionParagraph>

          <NotionParagraph>
            Comments are stored as a separate data layer, which means they don't interfere with the design itself and
            can be toggled on/off for different viewing contexts.
          </NotionParagraph>
        </NotionToggle>

        <NotionDivider />

        <NotionHeading2>Component System</NotionHeading2>

        <NotionParagraph>
          Figma's component system is the foundation of its design system capabilities. It strikes a balance between
          flexibility and consistency.
        </NotionParagraph>

        <NotionHeading3>Main Components and Instances</NotionHeading3>

        <NotionParagraph>
          The relationship between main components and instances is clear and intuitive. Changes to main components
          propagate to instances, but instances can override properties for flexibility.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Figma component system"
          caption="Main components and their instances showing property overrides"
        />

        <NotionHeading3>Auto Layout</NotionHeading3>

        <NotionParagraph>
          Auto Layout brings responsive design principles directly into the design tool. It's implemented as a property
          of frames rather than a separate concept, making it feel like a natural extension of the design process.
        </NotionParagraph>

        <NotionList
          items={[
            "Horizontal and vertical distribution options",
            "Padding controls for consistent spacing",
            "Resizing behavior for responsive components",
            "Nesting for complex layouts",
          ]}
        />

        <NotionCallout emoji="⚠️">
          Auto Layout can be processor-intensive with complex nested structures. Figma handles this by optimizing
          rendering and calculations behind the scenes.
        </NotionCallout>

        <NotionDivider />

        <NotionHeading2>Performance Considerations</NotionHeading2>

        <NotionParagraph>
          Running a complex design tool in the browser presents unique challenges. Figma addresses these through careful
          optimization.
        </NotionParagraph>

        <NotionHeading3>WebGL Rendering</NotionHeading3>

        <NotionParagraph>
          Figma uses WebGL for rendering, bypassing the DOM for better performance with complex designs. This allows for
          smooth panning and zooming even with thousands of elements.
        </NotionParagraph>

        <NotionHeading3>Progressive Loading</NotionHeading3>

        <NotionParagraph>
          Large files are loaded progressively, with visible elements prioritized. This creates the impression of faster
          loading times and allows users to start working before the entire file is loaded.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Figma performance visualization"
          caption="Visualization of how Figma progressively loads complex designs"
        />

        <NotionDivider />

        <NotionHeading2>Conclusion</NotionHeading2>

        <NotionParagraph>
          Figma's success comes from its thoughtful combination of powerful design capabilities with seamless
          collaboration features. By reimagining the design tool as a collaborative platform rather than individual
          software, Figma has changed how design teams work together.
        </NotionParagraph>

        <NotionParagraph>
          The careful attention to interface design, performance optimization, and collaboration features creates an
          experience that feels both powerful and accessible—a balance that few design tools have achieved.
        </NotionParagraph>
      </div>
    </div>
  )
}
