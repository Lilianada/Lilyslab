import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { BookOpen, Star } from "lucide-react";

export default function BookshelfLoading() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <div className="h-7 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="flex flex-col gap-1 text-xs font-mono">
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-28 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </header>

        {/* Currently Reading Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-base font-medium">Currently Reading</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <BookCardSkeleton key={`reading-${index}`} />
            ))}
          </div>
        </section>

        {/* Read Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            <h2 className="text-base font-medium">Read</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <BookCardSkeleton key={`read-${index}`} />
            ))}
          </div>
        </section>

        {/* Want to Read Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-medium">Want to Read</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <BookCardSkeleton key={`toread-${index}`} />
            ))}
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <Card className="flex flex-col border-border bg-card h-full overflow-hidden">
      {/* Book Cover Skeleton */}
      <div className="relative aspect-[4/5] w-full mb-2">
        <div className="absolute inset-0 bg-muted animate-pulse" />
      </div>
      
      {/* Book Details Skeleton */}
      <div className="p-2 flex-1 flex flex-col">
        <div className="h-3 w-4/5 bg-muted animate-pulse rounded mb-1" />
        <div className="h-2.5 w-2/3 bg-muted animate-pulse rounded mb-2" />
        
        <div className="mt-auto flex items-center justify-between">
          <div className="h-3 w-8 bg-muted animate-pulse rounded" />
          <div className="h-3 w-12 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}
