export function ToolCardSkeleton() {
  return (
    <div className="block rounded-lg border bg-card p-4">
      <div className="space-y-4 animate-pulse">
        {/* Logo + Name Placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-muted"></div>
          <div className="h-4 w-1/2 rounded bg-muted"></div>
        </div>
        {/* Description Placeholder */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-muted"></div>
          <div className="h-3 w-5/6 rounded bg-muted"></div>
        </div>
        {/* Platforms Placeholder */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-4 w-10 rounded-md bg-muted"></div>
          <div className="h-4 w-12 rounded-md bg-muted"></div>
          <div className="h-4 w-8 rounded-md bg-muted"></div>
        </div>
      </div>
    </div>
  );
} 