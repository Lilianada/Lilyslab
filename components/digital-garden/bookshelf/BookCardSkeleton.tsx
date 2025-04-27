export function BookCardSkeleton() {
  // Mimic the overall structure and styling of BookCardMain
  return (
    <div className="group flex h-full min-h-[280px] items-center opacity-50">
      <div
        className={`noteCardEffect ticket w-full hide-before`} // Basic styling, no random rotation
        style={{ transform: 'rotate(-1deg)' }} // Apply a minimal fixed rotation
      >
        <div className="scallop left1" />
        <div className="scallop left2" />
        <div className="scallop left3" />
        <div className="scallop right1" />
        <div className="scallop right2" />
        <div className="scallop right3" />
        <div className="relative p-2 bg-muted"> 
          <div className="flex flex-col justify-between h-full w-full px-6 py-4 font-mono border border-border rounded-md bg-card/50 paper-texture animate-pulse">
            <div>
              {/* Category Placeholder */}
              <div className="h-4 w-1/4 bg-muted-foreground/30 rounded-full mb-2"></div>
              {/* Title Placeholder */}
              <div className="h-6 w-3/4 bg-muted-foreground/30 rounded mb-1"></div>
            </div>
            {/* Dashed separator */}
            <div className="w-full border-t-2 border-dashed border-border/50 my-2"></div>
            {/* Description Placeholder */}
            <div className="space-y-2 my-2">
              <div className="h-4 w-full bg-muted-foreground/30 rounded"></div>
              <div className="h-4 w-5/6 bg-muted-foreground/30 rounded"></div>
              <div className="h-4 w-full bg-muted-foreground/30 rounded"></div>
            </div>
            {/* Dashed separator */}
            <div className="w-full border-t-2 border-dashed border-border/50 my-2"></div>
            {/* Date Placeholder */}
            <div className="h-4 w-1/3 bg-muted-foreground/30 rounded mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 