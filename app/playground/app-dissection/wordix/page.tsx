"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"
import PlaceholderImage from "@/components/placeholder-image"

// --- Reusable Simple Components ---
const SimpleList = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-1 text-foreground/90 my-4">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);

const SimpleNumberedList = ({ items }: { items: string[] }) => (
  <ol className="list-decimal list-inside space-y-1 text-foreground/90 my-4">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
);

const SimpleImage = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="my-6">
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

const SimpleTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full text-left border-collapse text-sm">
      <thead className="border-b border-border">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="p-2 font-semibold text-foreground">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-border/50">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="p-2 text-foreground/90">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SimpleCallout = ({ emoji, children }: { emoji: string; children: React.ReactNode }) => (
  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-r-md my-4 flex items-start">
    <span className="mr-3 text-xl">{emoji}</span>
    <div>{children}</div>
  </div>
);

const SimpleQuote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
    {children}
  </blockquote>
);
// --- End Reusable Simple Components ---

export default function WordixDissection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dateAdded = "2023-11-10"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto px-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <Link
        href="/playground/app-dissection"
        className="mb-6 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-200 group"
      >
        <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to all dissections</span>
      </Link>

      {/* Header */}
      <header className="mb-8 flex items-center gap-6">
        <PlaceholderImage width={80} height={80} className="rounded-lg" alt="Wordix logo" src="/placeholder.svg"/>
        <div>
          <h1 className="text-2xl font-medium text-foreground">Wordix</h1>
          <p className="text-xs text-muted-foreground">Created on {formatDate(dateAdded)}</p>
        </div>
      </header>

      {/* Body - Using standard HTML elements */} 
      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 stagger-children">
        <h1 className="text-3xl font-bold text-foreground">Wordix: Building a Word Guessing Game</h1>

        <p>
          Wordix is a browser-based word guessing game inspired by Wordle. This dissection explores the design
          decisions, technical implementation, and lessons learned while building this project.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Wordix game interface"
          caption="Wordix game interface showing a partially completed puzzle"
        />

        <h2 className="text-2xl font-semibold text-foreground">Project Overview</h2>

        <p>
          Wordix challenges players to guess a five-letter word in six attempts. After each guess, the game provides
          feedback by coloring letters to indicate if they are correct and in the right position (green), correct but in
          the wrong position (yellow), or not in the word at all (gray).
        </p>

        <SimpleCallout emoji="🎯">
          The goal was to create a clean, accessible implementation with smooth animations and a responsive design that
          works well on both desktop and mobile devices.
        </SimpleCallout>

        <h2 className="text-2xl font-semibold text-foreground">Design Decisions</h2>

        <h3 className="text-xl font-semibold text-foreground">Visual Design</h3>

        <p>
          I wanted Wordix to have a distinct visual identity while maintaining the familiar gameplay that makes word
          guessing games so addictive. The design uses a clean, minimalist aesthetic with a focus on typography and
          color.
        </p>

        <SimpleTable
          headers={["Element", "Design Decision", "Rationale"]}
          rows={[
            ["Typography", "Monospace font", "Ensures consistent letter spacing and alignment"],
            [
              "Color Scheme",
              "High contrast with semantic colors",
              "Improves accessibility and provides clear feedback",
            ],
            ["Layout", "Centered game board with responsive sizing", "Works well across device sizes"],
            ["Keyboard", "On-screen keyboard with color feedback", "Helps players track used letters"],
          ]}
        />

        <SimpleImage
          src="/placeholder.svg"
          alt="Wordix color scheme"
          caption="Color scheme showing correct, present, and absent letter states"
        />

        <h3 className="text-xl font-semibold text-foreground">Interaction Design</h3>

        <p>
          The interaction design focuses on immediate feedback and satisfying animations that enhance the gameplay
          without being distracting.
        </p>

        <SimpleNumberedList
          items={[
            "Letter inputs trigger subtle scale animations",
            "Row submissions animate each letter sequentially",
            "Game completion triggers a celebratory animation",
            "Error states (invalid words) provide clear visual feedback",
          ]}
        />

        <div className="aspect-w-16 aspect-h-9 my-8 rounded-lg overflow-hidden shadow-sm">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Wordix Animations Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Technical Implementation</h2>

        <h3 className="text-xl font-semibold text-foreground">Technology Stack</h3>

        <p>
          Wordix is built with modern web technologies to ensure performance and maintainability.
        </p>

        <SimpleList
          items={[
            "React for UI components and state management",
            "TypeScript for type safety and improved developer experience",
            "CSS Modules for component-scoped styling",
            "Framer Motion for animations",
            "Vercel for hosting and deployment",
          ]}
        />

        <h3 className="text-xl font-semibold text-foreground">State Management</h3>

        <p>
          The game state is managed using React's useState and useReducer hooks. The main state elements include:
        </p>

        <SimpleList
          items={[
            "Current guess (the word being typed)",
            "Past guesses (previously submitted words)",
            "Game status (in progress, won, or lost)",
            "Letter states (correct, present, or absent for each letter)",
          ]}
        />

        <SimpleImage
          src="/placeholder.svg"
          alt="Wordix state management diagram"
          caption="Diagram showing the flow of state in the Wordix application"
        />

        <h3 className="text-xl font-semibold text-foreground">Word List and Validation</h3>

        <p>
          One of the key challenges was creating a good word list that balances challenge and fairness.
        </p>

        <SimpleQuote>
          "A good word game needs two lists: a comprehensive list of valid guesses and a curated list of potential
          solutions that avoids obscure words."
        </SimpleQuote>

        <p>Wordix uses:</p>

        <SimpleList
          items={[
            "A solution list of ~2,500 common five-letter words",
            "A validation list of ~12,000 five-letter words for checking guesses",
            "Client-side validation to provide immediate feedback",
          ]}
        />

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Accessibility Considerations</h2>

        <p>Making Wordix accessible to all players was a priority from the beginning.</p>

        <SimpleList
          items={[
            "Keyboard navigation support for all game actions",
            "Screen reader announcements for game events and letter feedback",
            "Color contrast that meets WCAG AA standards",
            "Alternative indicators beyond color (subtle patterns) for color-blind users",
            "Responsive design that works on various devices and screen sizes",
          ]}
        />

        <SimpleCallout emoji="♿">
          Testing with actual assistive technology users provided valuable insights that automated accessibility checks
          couldn't capture.
        </SimpleCallout>

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Performance Optimization</h2>

        <p>
          Even for a relatively simple game, performance optimization ensures a smooth experience across devices.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Key Optimizations</h3>

        <SimpleList
          items={[
            "Memoization of expensive calculations with useMemo and useCallback",
            "Efficient rendering with React.memo for pure components",
            "Optimized animations that use the GPU when possible",
            "Lazy loading of non-critical resources",
            "Preloading of the word list to prevent gameplay interruptions",
          ]}
        />

        <SimpleImage
          src="/placeholder.svg"
          alt="Wordix performance metrics"
          caption="Lighthouse performance metrics for Wordix"
        />

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Lessons Learned</h2>

        <p>
          Building Wordix provided valuable insights that I'll carry forward to future projects.
        </p>

        <h3 className="text-xl font-semibold text-foreground">What Worked Well</h3>

        <SimpleList
          items={[
            "Starting with a clear, focused MVP before adding features",
            "Using TypeScript from the beginning to prevent type-related bugs",
            "Implementing accessibility features early rather than as an afterthought",
            "Getting feedback from actual users throughout development",
          ]}
        />

        <h3 className="text-xl font-semibold text-foreground">Challenges and Solutions</h3>

        <SimpleTable
          headers={["Challenge", "Solution"]}
          rows={[
            ["Creating a good word list", "Combined multiple sources and manually curated the final list"],
            ["Handling different keyboard layouts", "Implemented a virtual keyboard that works consistently"],
            ["Animating letter reveals sequentially", "Used staggered animations with Framer Motion"],
            ["Supporting both touch and keyboard input", "Abstracted input handling to support multiple methods"],
          ]}
        />

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Future Enhancements</h2>

        <p>
          While the current version of Wordix meets its core objectives, several enhancements could make it even better.
        </p>

        <SimpleList
          items={[
            "Statistics tracking to show player progress over time",
            "Daily challenges with shared leaderboards",
            "Difficulty levels with different word lists",
            "Theme customization options",
            "Multiplayer mode for competing with friends",
          ]}
        />

        <SimpleCallout emoji="💡">
          The modular architecture makes it relatively straightforward to add these features without major refactoring.
        </SimpleCallout>

        <hr className="my-8 border-border" />

        <h2 className="text-2xl font-semibold text-foreground">Conclusion</h2>

        <p>
          Building Wordix was both challenging and rewarding. The project demonstrates how thoughtful design and
          technical implementation can create an engaging user experience even with a relatively simple concept.
        </p>

        <p>
          The focus on accessibility, performance, and user feedback resulted in a game that's enjoyable for a wide
          audience. The lessons learned will inform future projects, particularly around state management, animation,
          and accessibility implementation.
        </p>

        <SimpleImage
          src="/placeholder.svg"
          alt="Wordix on multiple devices"
          caption="Wordix running on desktop, tablet, and mobile devices"
        />
      </article>
    </div>
  )
}
