export function PinCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-muted border border-border shadow-sm mb-4 min-h-[320px]">
      <div className="h-48 bg-muted-foreground/20 rounded-t-xl" />
      <div className="p-4">
        <div className="h-5 w-3/4 bg-muted-foreground/30 rounded mb-2" />
        <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-2" />
        <div className="h-4 w-1/3 bg-muted-foreground/10 rounded" />
      </div>
    </div>
  );
}
