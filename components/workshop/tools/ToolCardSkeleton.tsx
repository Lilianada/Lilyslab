export function ToolCardSkeleton() {
  return (
    <div className="relative group block rounded-lg border bg-card p-4 transition-all duration-200">
      {/* Arrow icon placeholder */}
      <div className="absolute top-3 right-3 h-4 w-4 bg-muted rounded"></div>
      
      <div className="space-y-4 animate-pulse">
        {/* Logo + Name Placeholder - matches ToolCard structure */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-md bg-muted flex-shrink-0"></div>
            <div className="h-4 w-2/3 rounded bg-muted"></div>
          </div>
        </div>
        
        {/* Description Placeholder - matches line-clamp-2 height */}
        <div className="text-xs line-clamp-2 space-y-1">
          <div className="h-3 w-full rounded bg-muted"></div>
          <div className="h-3 w-4/5 rounded bg-muted"></div>
        </div>
        
        {/* Platforms Placeholder - matches pt-1 spacing */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-4 w-12 rounded-md bg-muted"></div>
          <div className="h-4 w-16 rounded-md bg-muted"></div>
          <div className="h-4 w-10 rounded-md bg-muted"></div>
        </div>
      </div>
    </div>
  );
} 