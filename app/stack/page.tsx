"use client"

import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

// Mock data for tech stack
const categories = [
  {
    name: "Hardware",
    items: [
      {
        name: "MacBook Pro 13-inch",
        description: "M2, 8GB RAM, 245GB SSD",
        url: "https://apple.com/macbook-pro",
      },
      {
        name: "Dell S3221QS Curved Monitor ",
        description: "32-inch 4K display",
        url: "https://www.dell.com/en-us/shop/dell-32-curved-4k-uhd-monitor-s3221qs/apd/210-axkm/monitors-monitor-accessories",
      },
      {
        name: "Logitech Pebble Keys 2 K390",
        description: "Slim, multi-device Bluetooth keyboard",
        url: "https://www.logitech.com/en-my/products/combos/pebble-2-keyboard-mouse-combo.html",
      },
    ],
  },
  {
    name: "Development",
    items: [
      {
        name: "Visual Studio Code",
        description: "Primary code editor",
        url: "https://code.visualstudio.com/",
      },
      {
        name: "v0",
        description: "Innovative AI-powered tool",
        url: "https://www.cursor.com/",
      },
      {
        name: "Cursor",
        description: "AI Code Editor",
        url: "https://www.cursor.com/",
      },
      {
        name: "GitHub Copilot",
        description: "AI pair programming tool",
        url: "https://github.com/features/copilot",
      },
    ],
  },
  {
    name: "Design",
    items: [
      {
        name: "Figma",
        description: "UI design and prototyping",
        url: "https://figma.com",
      },
      {
        name: "Canva",
        description: "Online design and visual communication platform",
        url: "https://canva.com",
      },
      {
        name: "Framer",
        description: "Interactive prototyping",
        url: "https://framer.com",
      },
    ],
  },
  {
    name: "Productivity",
    items: [
      {
        name: "Notion",
        description: "Notes, docs, and project management",
        url: "https://notion.so",
      },
      {
        name: "Chrome Browser",
        description: "Primary web browser",
        url: "https://google.com",
      },
    ],
  },
]

export default function StackPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-xl mx-auto py-12 px-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">My Stack</h1>
        <p className="text-muted-foreground text-sm">Tools, apps, and services I use daily.</p>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.name}>
            <h2 className="mb-4 text-base font-medium">{category.name}</h2>
            <div className="space-y-4">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium group-hover:text-primary text-sm">{item.name}</h3>
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
