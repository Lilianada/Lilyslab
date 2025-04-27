export function NoteCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-6 shadow-sm">
      <div className="animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full h-56 bg-muted"></div> 
        <div className="p-5">
          {/* Header Placeholder */}
          <div className="mb-3 pb-2 border-b border-border/50">
            <div className="h-5 w-3/4 rounded bg-muted mb-2"></div> {/* Title */}
            <div className="flex justify-between items-center">
              <div className="h-3 w-1/4 rounded bg-muted"></div> {/* Author */}
              <div className="h-3 w-1/4 rounded bg-muted"></div> {/* Date */}
            </div>
          </div>
          {/* Entry Placeholder */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-4/5 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 