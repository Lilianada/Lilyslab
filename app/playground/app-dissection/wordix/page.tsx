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
  NotionTable,
  NotionNumberedList,
} from "@/components/notion-block"

export default function WordixDissection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dateAdded = "2023-11-10"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <Link
        href="/playground/app-dissection"
        className="mb-6 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to all dissections</span>
      </Link>

      {/* Header */}
      <header className="mb-8 flex items-center gap-6">
        <PlaceholderImage width={80} height={80} className="rounded-lg" alt="Wordix logo" />
        <div>
          <h1 className="text-2xl font-medium">Wordix</h1>
          <p className="text-xs text-muted-foreground">Created on {formatDate(dateAdded)}</p>
        </div>
      </header>

      {/* Body - Using Notion Components */}
      <div className="space-y-8 stagger-children">
        <NotionHeading1>Wordix: Building a Word Guessing Game</NotionHeading1>

        <NotionParagraph>
          Wordix is a browser-based word guessing game inspired by Wordle. This dissection explores the design
          decisions, technical implementation, and lessons learned while building this project.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Wordix game interface"
          caption="Wordix game interface showing a partially completed puzzle"
        />

        <NotionHeading2>Project Overview</NotionHeading2>

        <NotionParagraph>
          Wordix challenges players to guess a five-letter word in six attempts. After each guess, the game provides
          feedback by coloring letters to indicate if they are correct and in the right position (green), correct but in
          the wrong position (yellow), or not in the word at all (gray).
        </NotionParagraph>

        <NotionCallout emoji="🎯">
          The goal was to create a clean, accessible implementation with smooth animations and a responsive design that
          works well on both desktop and mobile devices.
        </NotionCallout>

        <NotionHeading2>Design Decisions</NotionHeading2>

        <NotionHeading3>Visual Design</NotionHeading3>

        <NotionParagraph>
          I wanted Wordix to have a distinct visual identity while maintaining the familiar gameplay that makes word
          guessing games so addictive. The design uses a clean, minimalist aesthetic with a focus on typography and
          color.
        </NotionParagraph>

        <NotionTable
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

        <NotionImage
          src="/placeholder.svg"
          alt="Wordix color scheme"
          caption="Color scheme showing correct, present, and absent letter states"
        />

        <NotionHeading3>Interaction Design</NotionHeading3>

        <NotionParagraph>
          The interaction design focuses on immediate feedback and satisfying animations that enhance the gameplay
          without being distracting.
        </NotionParagraph>

        <NotionNumberedList
          items={[
            "Letter inputs trigger subtle scale animations",
            "Row submissions animate each letter sequentially",
            "Game completion triggers a celebratory animation",
            "Error states (invalid words) provide clear visual feedback",
          ]}
        />

        <div className="aspect-w-16 aspect-h-9 my-8 rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Wordix Animations Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <NotionDivider />

        <NotionHeading2>Technical Implementation</NotionHeading2>

        <NotionHeading3>Technology Stack</NotionHeading3>

        <NotionParagraph>
          Wordix is built with modern web technologies to ensure performance and maintainability.
        </NotionParagraph>

        <NotionList
          items={[
            "React for UI components and state management",
            "TypeScript for type safety and improved developer experience",
            "CSS Modules for component-scoped styling",
            "Framer Motion for animations",
            "Vercel for hosting and deployment",
          ]}
        />

        <NotionHeading3>State Management</NotionHeading3>

        <NotionParagraph>
          The game state is managed using React's useState and useReducer hooks. The main state elements include:
        </NotionParagraph>

        <NotionList
          items={[
            "Current guess (the word being typed)",
            "Past guesses (previously submitted words)",
            "Game status (in progress, won, or lost)",
            "Letter states (correct, present, or absent for each letter)",
          ]}
        />

        <NotionImage
          src="/placeholder.svg"
          alt="Wordix state management diagram"
          caption="Diagram showing the flow of state in the Wordix application"
        />

        <NotionHeading3>Word List and Validation</NotionHeading3>

        <NotionParagraph>
          One of the key challenges was creating a good word list that balances challenge and fairness.
        </NotionParagraph>

        <NotionQuote>
          "A good word game needs two lists: a comprehensive list of valid guesses and a curated list of potential
          solutions that avoids obscure words."
        </NotionQuote>

        <NotionParagraph>Wordix uses:</NotionParagraph>

        <NotionList
          items={[
            "A solution list of ~2,500 common five-letter words",
            "A validation list of ~12,000 five-letter words for checking guesses",
            "Client-side validation to provide immediate feedback",
          ]}
        />

        <NotionDivider />

        <NotionHeading2>Accessibility Considerations</NotionHeading2>

        <NotionParagraph>Making Wordix accessible to all players was a priority from the beginning.</NotionParagraph>

        <NotionList
          items={[
            "Keyboard navigation support for all game actions",
            "Screen reader announcements for game events and letter feedback",
            "Color contrast that meets WCAG AA standards",
            "Alternative indicators beyond color (subtle patterns) for color-blind users",
            "Responsive design that works on various devices and screen sizes",
          ]}
        />

        <NotionCallout emoji="♿">
          Testing with actual assistive technology users provided valuable insights that automated accessibility checks
          couldn't capture.
        </NotionCallout>

        <NotionDivider />

        <NotionHeading2>Performance Optimization</NotionHeading2>

        <NotionParagraph>
          Even for a relatively simple game, performance optimization ensures a smooth experience across devices.
        </NotionParagraph>

        <NotionHeading3>Key Optimizations</NotionHeading3>

        <NotionList
          items={[
            "Memoization of expensive calculations with useMemo and useCallback",
            "Efficient rendering with React.memo for pure components",
            "Optimized animations that use the GPU when possible",
            "Lazy loading of non-critical resources",
            "Preloading of the word list to prevent gameplay interruptions",
          ]}
        />

        <NotionImage
          src="/placeholder.svg"
          alt="Wordix performance metrics"
          caption="Lighthouse performance metrics for Wordix"
        />

        <NotionDivider />

        <NotionHeading2>Lessons Learned</NotionHeading2>

        <NotionParagraph>
          Building Wordix provided valuable insights that I'll carry forward to future projects.
        </NotionParagraph>

        <NotionHeading3>What Worked Well</NotionHeading3>

        <NotionList
          items={[
            "Starting with a clear, focused MVP before adding features",
            "Using TypeScript from the beginning to prevent type-related bugs",
            "Implementing accessibility features early rather than as an afterthought",
            "Getting feedback from actual users throughout development",
          ]}
        />

        <NotionHeading3>Challenges and Solutions</NotionHeading3>

        <NotionTable
          headers={["Challenge", "Solution"]}
          rows={[
            ["Creating a good word list", "Combined multiple sources and manually curated the final list"],
            ["Handling different keyboard layouts", "Implemented a virtual keyboard that works consistently"],
            ["Animating letter reveals sequentially", "Used staggered animations with Framer Motion"],
            ["Supporting both touch and keyboard input", "Abstracted input handling to support multiple methods"],
          ]}
        />

        <NotionDivider />

        <NotionHeading2>Future Enhancements</NotionHeading2>

        <NotionParagraph>
          While the current version of Wordix meets its core objectives, several enhancements could make it even better.
        </NotionParagraph>

        <NotionList
          items={[
            "Statistics tracking to show player progress over time",
            "Daily challenges with shared leaderboards",
            "Difficulty levels with different word lists",
            "Theme customization options",
            "Multiplayer mode for competing with friends",
          ]}
        />

        <NotionCallout emoji="💡">
          The modular architecture makes it relatively straightforward to add these features without major refactoring.
        </NotionCallout>

        <NotionDivider />

        <NotionHeading2>Conclusion</NotionHeading2>

        <NotionParagraph>
          Building Wordix was both challenging and rewarding. The project demonstrates how thoughtful design and
          technical implementation can create an engaging user experience even with a relatively simple concept.
        </NotionParagraph>

        <NotionParagraph>
          The focus on accessibility, performance, and user feedback resulted in a game that's enjoyable for a wide
          audience. The lessons learned will inform future projects, particularly around state management, animation,
          and accessibility implementation.
        </NotionParagraph>

        <NotionImage
          src="/placeholder.svg"
          alt="Wordix on multiple devices"
          caption="Wordix running on desktop, tablet, and mobile devices"
        />
      </div>
    </div>
  )
}
