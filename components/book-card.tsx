import { BookOpen, CheckCircle2, Clock, ChevronRight, Share2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

type BookStatus = "reading" | "read" | "unread"

interface BookCardProps {
  title: string
  author: string
  coverImage: string
  status: BookStatus
  rating?: number
  className?: string
  summary?: string
  review?: string
}

const statusConfig = {
  reading: {
    icon: Clock,
    label: "Currently Reading",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
  read: {
    icon: CheckCircle2,
    label: "Read",
    className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  unread: {
    icon: BookOpen,
    label: "Yet to Read",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
}

export function BookCard({
  title,
  author,
  coverImage,
  status,
  rating,
  className,
  summary,
  review,
}: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const StatusIcon = statusConfig[status].icon

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out "${title}" by ${author}`,
          url: window.location.href,
        })
      } else {
        // Fallback to copying to clipboard
        const text = `${title} by ${author}\n${window.location.href}`
        await navigator.clipboard.writeText(text)
        // You might want to show a toast notification here
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="group perspective h-[400px]">
      <div
        className={cn(
          "relative h-full transition-transform duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front of Card */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden",
            "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg dark:border-gray-800",
            className
          )}
        >
          {/* Status Badge */}
          <div className="absolute -right-12 top-6 z-10 rotate-45">
            <div
              className={cn(
                "py-1 px-12 text-xs font-semibold shadow-sm",
                statusConfig[status].className
              )}
            >
              <span>{statusConfig[status].label}</span>
            </div>
          </div>

          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={`${title} cover`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center gap-2 text-white text-sm font-medium hover:underline"
              >
                View Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="flex-1">
              <h3 className="line-clamp-2 text-base font-semibold leading-tight">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{author}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="">

            {rating !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      i < rating
                        ? "fill-yellow-400 text-yellow-400 group-hover:scale-110"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-muted-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
              </div>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          
          </div>
        </div>

        {/* Back of Card */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden rotate-y-180",
            "flex flex-col rounded-lg border bg-card p-4 dark:border-gray-800"
          )}
        >
          <button
            onClick={() => setIsFlipped(false)}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{author}</p>

          {summary && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Summary</h4>
              <p className="text-sm text-muted-foreground line-clamp-4">{summary}</p>
            </div>
          )}

          {review && (
            <div>
              <h4 className="text-sm font-medium mb-1">Review</h4>
              <p className="text-sm text-muted-foreground line-clamp-4">{review}</p>
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => setIsFlipped(false)}
            >
              Back to cover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 