"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const pathname = usePathname()
  
  // Skip rendering breadcrumbs on the home page and welcome page
  if (pathname === "/" || pathname === "/welcome") {
    return null
  }
  
  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean)
  
  // Special case handling for dynamic routes
  const processedSegments = segments.map(segment => {
    // Check if this is a dynamic route segment [slug] or similar
    if (segment.startsWith("[") && segment.endsWith("]")) {
      // For dynamic routes, we'll just show the parameter name without brackets
      return segment.slice(1, -1)
    }
    return segment
  })
  
  // Create breadcrumb items with proper paths
  const breadcrumbItems = processedSegments.map((segment, index) => {
    // Build the path for this breadcrumb item
    // Use the original segments for the path, not the processed ones
    const path = `/${segments.slice(0, index + 1).join("/")}`
    
    // Format the segment for display (capitalize first letter, replace hyphens with spaces)
    const formattedSegment = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
    
    return {
      label: formattedSegment,
      path,
      isLast: index === processedSegments.length - 1
    }
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center space-x-1">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center rounded px-2 py-1 hover:bg-accent hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4" />
            <div 
              className={cn(
                "px-2 py-1 rounded",
                item.isLast 
                  ? "font-medium text-foreground" 
                  : "hover:bg-accent hover:text-foreground transition-colors"
              )}
            >
              {item.isLast ? (
                <span>{item.label}</span>
              ) : (
                <Link href={item.path}>
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
