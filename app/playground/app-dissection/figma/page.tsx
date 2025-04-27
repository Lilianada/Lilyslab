"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"
import PlaceholderImage from "@/components/placeholder-image"

// Simple List Component
const SimpleList = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-1 text-foreground/90">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);

// Simple Image Component
const SimpleImage = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="my-4">
    <PlaceholderImage
      src={src}
      alt={alt}
      width={800}
      height={450}
      className="rounded-lg shadow-sm"
    />
    {caption && <figcaption className="mt-2 text-xs text-center text-muted-foreground">{caption}</figcaption>}
  </figure>
);

export default function FigmaDissection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dateAdded = "2023-09-15"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto px-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <Link
        href="/playground/app-dissection"
        className="mb-6 flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-200 group"
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to all dissections</span>
      </Link>

      {/* Header */}
      <header className="mb-8 flex items-center gap-6">
        <PlaceholderImage width={50} height={50} className="rounded-lg" alt="Figma logo" src="/placeholder.svg" />
        <div>
          <h1 className="text-lg font-medium text-foreground">Figma</h1>
          <p className="mt-2 text-xs text-muted-foreground">Added on {formatDate(dateAdded)}</p>
        </div>
      </header>

      {/* Body - Using standard HTML elements */}
      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 stagger-children">
        <h1 className="text-3xl font-bold text-foreground">Figma: Revolutionizing Design Collaboration</h1>

        <p>
          Figma has transformed how designers work together, moving design from isolated desktop software to the
          collaborative cloud. This dissection explores how Figma's interface and features enable seamless collaboration
          while maintaining powerful design capabilities.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Figma interface overview"
          caption="Figma's interface combines simplicity with power"
        />

        <h2 className="text-2xl font-semibold text-foreground">Key Interface Elements</h2>

        <p>
          Figma's interface is carefully designed to balance power and accessibility. Let's examine the key elements
          that make it work so well.
        </p>

        <h3 className="text-xl font-semibold text-foreground">The Canvas</h3>

        <p>
          At the heart of Figma is the infinite canvas. Unlike traditional design tools with fixed artboards, Figma's
          canvas allows for free-form exploration and organization.
        </p>

        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-r-md my-4">
          <span className="font-bold mr-2">💡</span>
          The infinite canvas concept isn't new, but Figma's implementation makes it particularly effective for
          collaborative work. Multiple users can work in different areas simultaneously without disrupting each other.
        </div>

        <SimpleImage
          src="/placeholder.svg"
          alt="Figma canvas with multiple users"
          caption="Multiple cursors showing real-time collaboration on the canvas"
        />

        <h3 className="text-xl font-semibold text-foreground">The Layers Panel</h3>

        <p>
          Figma's layers panel provides a hierarchical view of all elements on the canvas. Its organization mirrors the
          visual structure, making it intuitive to navigate complex designs.
        </p>

        <SimpleList
          items={[
            "Auto-collapsing groups keep the panel manageable",
            "Color-coded layer types provide visual cues",
            "Drag-and-drop reordering feels natural and responsive",
            "Search functionality makes finding specific elements easy",
          ]}
        />

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Collaboration Features</h2>

        <p>
          Figma's real-time collaboration features set it apart from traditional design tools. Let's examine how they're
          implemented.
        </p>

        <div className="aspect-w-16 aspect-h-9 my-8 rounded-lg overflow-hidden shadow-sm">
          <iframe
            src="https://www.youtube.com/embed/Tx2uN6XDg-4"
            title="Figma Collaboration Features"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <h3 className="text-xl font-semibold text-foreground">Multiplayer Editing</h3>

        <p>
          Figma's multiplayer editing is remarkably smooth, with minimal latency even with many simultaneous editors.
          This is achieved through a combination of operational transformation and careful UI design.
        </p>

        <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
          "We built Figma to feel like we're all in the same room together, even when we're distributed across different
          time zones."
        </blockquote>

        <h3 className="text-xl font-semibold text-foreground">Comments and Feedback</h3>

        <p>
          The commenting system in Figma is contextual and non-intrusive. Comments can be attached to specific elements
          or areas of the design, making feedback precise and actionable.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Figma commenting interface"
          caption="Comments can be attached to specific elements for contextual feedback"
        />

        <details className="my-4 p-4 bg-muted/50 rounded-lg border border-border">
          <summary className="cursor-pointer font-medium text-foreground">How Figma's commenting system works behind the scenes</summary>
          <div className="mt-2 space-y-3 text-foreground/90">
            <p>
              Figma's commenting system uses a combination of vector coordinates and object references to attach comments
              to specific elements. This allows comments to stay attached even as designs evolve and elements move around
              the canvas.
            </p>
            <p>
              Comments are stored as a separate data layer, which means they don't interfere with the design itself and
              can be toggled on/off for different viewing contexts.
            </p>
          </div>
        </details>

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Component System</h2>

        <p>
          Figma's component system is the foundation of its design system capabilities. It strikes a balance between
          flexibility and consistency.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Main Components and Instances</h3>

        <p>
          The relationship between main components and instances is clear and intuitive. Changes to main components
          propagate to instances, but instances can override properties for flexibility.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Figma component system"
          caption="Main components and their instances showing property overrides"
        />

        <h3 className="text-xl font-semibold text-foreground">Auto Layout</h3>

        <p>
          Auto Layout brings responsive design principles directly into the design tool. It's implemented as a property
          of frames rather than a separate concept, making it feel like a natural extension of the design process.
        </p>

        <SimpleList
          items={[
            "Horizontal and vertical distribution options",
            "Padding controls for consistent spacing",
            "Resizing behavior for responsive components",
            "Nesting for complex layouts",
          ]}
        />

        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-r-md my-4">
          <span className="font-bold mr-2">⚠️</span>
          Auto Layout can be processor-intensive with complex nested structures. Figma handles this by optimizing
          rendering and calculations behind the scenes.
        </div>

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Performance Considerations</h2>

        <p>
          Running a complex design tool in the browser presents unique challenges. Figma addresses these through careful
          optimization.
        </p>

        <h3 className="text-xl font-semibold text-foreground">WebGL Rendering</h3>

        <p>
          Figma uses WebGL for rendering, bypassing the DOM for better performance with complex designs. This allows for
          smooth panning and zooming even with thousands of elements.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Progressive Loading</h3>

        <p>
          Large files are loaded progressively, with visible elements prioritized. This creates the impression of faster
          loading times and allows users to start working before the entire file is loaded.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Figma performance visualization"
          caption="Visualization of how Figma progressively loads complex designs"
        />

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Conclusion</h2>

        <p>
          Figma's success comes from its thoughtful combination of powerful design capabilities with seamless
          collaboration features. By reimagining the design tool as a collaborative platform rather than individual
          software, Figma has changed how design teams work together.
        </p>

        <p>
          The careful attention to interface design, performance optimization, and collaboration features creates an
          experience that feels both powerful and accessible—a balance that few design tools have achieved.
        </p>
      </article>
    </div>
  )
}
